import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useBalanceSheetViewModel } from '../../../../hooks/useBalanceSheetViewModel';
import { useBalanceSheetListViewModel } from '../../../../hooks/useBalanceSheetViewModel';
import { BalanceSheetData } from '../../../../../domain/entities/ReportEntities';

type BalanceSheetViewData = BalanceSheetData & Record<string, any>;

const downloadBase64File = (base64: string, contentType: string, filename: string): void => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let index = 0; index < byteCharacters.length; index += 1) {
    byteNumbers[index] = byteCharacters.charCodeAt(index);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const BalanceSheet: React.FC = observer(() => {
  const navigate = useNavigate();
  const balanceSheetViewModel = useBalanceSheetViewModel();
  const balanceSheetListViewModel = useBalanceSheetListViewModel();

  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSheetId, setExpandedSheetId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch list of balance sheets via list endpoint (no generation, just fetch existing)
    void balanceSheetListViewModel.fetchAll({ limit: 10 });
  }, [balanceSheetListViewModel]);

  useEffect(() => {
    if (balanceSheetViewModel.error) {
      console.error('Balance Sheet Error:', balanceSheetViewModel.error);
    }
  }, [balanceSheetViewModel.error]);

  const handleRefresh = useCallback(async () => {
    // Refresh by fetching latest balance sheets from list endpoint
    await balanceSheetListViewModel.fetchAll({ limit: 10 });
  }, [balanceSheetListViewModel]);

  const handleExportPdf = useCallback(async () => {
    const currentSheet = balanceSheetViewModel.balanceSheet;
    if (!currentSheet) {
      balanceSheetViewModel.clearError();
      return;
    }

    const response = await balanceSheetViewModel.exportToPdf(currentSheet.balance_sheet_id);
    if (response?.pdf_data) {
      downloadBase64File(response.pdf_data, response.content_type, response.filename);
    }
  }, [balanceSheetViewModel]);

  const clearError = useCallback(() => {
    balanceSheetViewModel.clearError();
  }, [balanceSheetViewModel]);

  const clearListError = useCallback(() => {
    balanceSheetListViewModel.clearError();
  }, [balanceSheetListViewModel]);

  const balanceSheet = (balanceSheetListViewModel.items?.[0] ?? balanceSheetViewModel.balanceSheet) as BalanceSheetViewData | null;
  const totals = {
    currentAssets: Number(balanceSheet?.assets?.current_assets?.total ?? 0),
    totalAssets: Number(balanceSheet?.totals?.total_assets ?? 0),
    totalLiabilities: Number(balanceSheet?.totals?.total_liabilities ?? 0),
    totalEquity: Number(balanceSheet?.totals?.total_equity ?? 0)
  };

  const nonCurrentAssetsTotal = Number(
    balanceSheet?.assets?.non_current_assets?.total ?? totals.totalAssets - totals.currentAssets
  );

  const balanceSheetData = useMemo(() => {
    if (!balanceSheet) {
      return {
        assets: {
          current: [] as Array<{ name: string; amount: number; category?: string }>,
          nonCurrent: [] as Array<{ name: string; amount: number }>
        },
        liabilities: [] as Array<{ name: string; amount: number }>,
        equity: [] as Array<{ name: string; amount: number }>
      };
    }

    const bs: any = balanceSheet;
    const currentAssetRows = [
      ...(bs.assets?.current_assets?.crypto_holdings
        ? Object.entries(bs.assets.current_assets.crypto_holdings).map(([symbol, holding]: [string, any]) => ({
            name: `${symbol} Holdings`,
            amount: Number(holding?.current_value) || 0,
            category: 'crypto'
          }))
        : []),
      { name: 'Cash and Equivalents', amount: Number(bs.assets?.current_assets?.cash_and_equivalents) || 0 },
      { name: 'Accounts Receivable', amount: Number(bs.assets?.current_assets?.accounts_receivable) || 0 },
      { name: 'Inventory', amount: Number(bs.assets?.current_assets?.inventory) || 0 }
    ];

    const nonCurrentAssetRows = [
      { name: 'Property, Plant & Equipment', amount: Number(bs.assets?.non_current_assets?.property_plant_equipment) || 0 },
      { name: 'Intangible Assets', amount: Number(bs.assets?.non_current_assets?.intangible_assets) || 0 },
      { name: 'Long-term Investments', amount: Number(bs.assets?.non_current_assets?.long_term_investments) || 0 }
    ];

    const liabilityRows = [
      { name: 'Accounts Payable', amount: Number(bs.liabilities?.current_liabilities?.accounts_payable) || 0 },
      { name: 'Short-term Debt', amount: Number(bs.liabilities?.current_liabilities?.short_term_debt) || 0 },
      { name: 'Accrued Expenses', amount: Number(bs.liabilities?.current_liabilities?.accrued_expenses) || 0 },
      { name: 'Long-term Debt', amount: Number(bs.liabilities?.long_term_liabilities?.long_term_debt) || 0 },
      { name: 'Deferred Tax Liabilities', amount: Number(bs.liabilities?.long_term_liabilities?.deferred_tax_liabilities) || 0 }
    ];

    const equityRows = [
      { name: 'Retained Earnings', amount: Number(bs.equity?.retained_earnings) || 0 },
      { name: 'Common Stock', amount: Number(bs.equity?.common_stock) || 0 },
      { name: 'Additional Paid-in Capital', amount: Number(bs.equity?.additional_paid_in_capital) || 0 }
    ];

    return {
      assets: {
        current: currentAssetRows,
        nonCurrent: nonCurrentAssetRows
      },
      liabilities: liabilityRows,
      equity: equityRows
    };
  }, [balanceSheet]);

  const formatCurrency = useCallback((amount: number): string => {
    if (Number.isNaN(amount) || amount === null || amount === undefined) {
      return '$0.00';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  }, []);

  const calculateTotalLiabilitiesPlusEquity = useCallback(() => {
    return totals.totalLiabilities + totals.totalEquity;
  }, [totals.totalLiabilities, totals.totalEquity]);

  const renderDetailedBreakdown = (sheet: any) => (
    <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-6">
      {/* Assets Section */}
      <div>
        <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setExpandedSheetId(expandedSheetId === `${sheet.balance_sheet_id}-assets` ? null : `${sheet.balance_sheet_id}-assets`)}>
          <h5 className="text-lg font-bold text-gray-900">Assets</h5>
          <span className="text-xl font-semibold text-gray-900">{formatCurrency(sheet.totals?.total_assets ?? 0)}</span>
          <span className="text-gray-600">{expandedSheetId === `${sheet.balance_sheet_id}-assets` ? '▼' : '▶'}</span>
        </div>
        
        {expandedSheetId === `${sheet.balance_sheet_id}-assets` && (
          <div className="pl-4 space-y-4">
            {/* Current Assets */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Current Assets <span className="text-xs text-gray-500">(Short-term, highly liquid)</span></span>
                <span className="font-semibold">{formatCurrency(sheet.assets?.current_assets?.total ?? 0)}</span>
              </div>
              
              {/* Crypto Holdings */}
              {sheet.assets?.current_assets?.crypto_holdings && Object.keys(sheet.assets.current_assets.crypto_holdings).length > 0 && (
                <div className="ml-4 border border-gray-200 rounded p-3 bg-white mb-2">
                  <div className="font-medium text-gray-800 mb-2">Crypto Holdings</div>
                  {Object.entries(sheet.assets.current_assets.crypto_holdings).map(([symbol, holding]: any) => (
                    <div key={symbol} className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">{symbol}</span>
                        <span className="font-semibold">{formatCurrency(holding.current_value ?? 0)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 ml-4">
                        <div><span className="text-gray-600">Balance:</span> <span className="font-mono">{holding.balance ?? 0} {symbol}</span></div>
                        <div><span className="text-gray-600">Price:</span> <span className="font-mono">{formatCurrency(holding.price ?? 0)}</span></div>
                        <div><span className="text-gray-600">Cost Basis:</span> <span className="font-mono">{formatCurrency(holding.cost_basis ?? 0)}</span></div>
                        <div><span className="text-gray-600">Avg Cost:</span> <span className="font-mono">{formatCurrency(holding.avg_cost ?? 0)}</span></div>
                        <div className="col-span-2"><span className="text-gray-600">Unrealized P&L:</span> <span className={`font-mono ${(holding.unrealized_pl ?? 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(holding.unrealized_pl ?? 0)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Cash and Equivalents</span><span>{formatCurrency(sheet.assets?.current_assets?.cash_and_equivalents ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Accounts Receivable</span><span>{formatCurrency(sheet.assets?.current_assets?.accounts_receivable ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Inventory</span><span>{formatCurrency(sheet.assets?.current_assets?.inventory ?? 0)}</span></div>
              </div>
              
              <div className="ml-4 mt-2 pt-2 border-t border-gray-200 flex justify-between font-semibold">
                <span>Total Current Assets</span>
                <span>{formatCurrency(sheet.assets?.current_assets?.total ?? 0)}</span>
              </div>
            </div>
            
            {/* Non-Current Assets */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Non-Current Assets <span className="text-xs text-gray-500">(Long-term investments)</span></span>
                <span className="font-semibold">{formatCurrency(sheet.assets?.non_current_assets?.total ?? 0)}</span>
              </div>
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Long-term Investments</span><span>{formatCurrency(sheet.assets?.non_current_assets?.long_term_investments ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Equipment</span><span>{formatCurrency(sheet.assets?.non_current_assets?.property_plant_equipment ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Other</span><span>{formatCurrency(sheet.assets?.non_current_assets?.other_non_current_assets ?? 0)}</span></div>
              </div>
              <div className="ml-4 mt-2 pt-2 border-t border-gray-200 flex justify-between font-semibold">
                <span>Total Non-Current Assets</span>
                <span>{formatCurrency(sheet.assets?.non_current_assets?.total ?? 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liabilities Section */}
      <div>
        <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setExpandedSheetId(expandedSheetId === `${sheet.balance_sheet_id}-liabilities` ? null : `${sheet.balance_sheet_id}-liabilities`)}>
          <h5 className="text-lg font-bold text-gray-900">Liabilities</h5>
          <span className="text-xl font-semibold text-gray-900">{formatCurrency(sheet.totals?.total_liabilities ?? 0)}</span>
          <span className="text-gray-600">{expandedSheetId === `${sheet.balance_sheet_id}-liabilities` ? '▼' : '▶'}</span>
        </div>
        
        {expandedSheetId === `${sheet.balance_sheet_id}-liabilities` && (
          <div className="pl-4 space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Current Liabilities <span className="text-xs text-gray-500">(Due within one year)</span></span>
              </div>
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Accounts Payable</span><span>{formatCurrency(sheet.liabilities?.current_liabilities?.accounts_payable ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Short-term Debt</span><span>{formatCurrency(sheet.liabilities?.current_liabilities?.short_term_debt ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax Liabilities</span><span>{formatCurrency(sheet.liabilities?.current_liabilities?.accrued_expenses ?? 0)}</span></div>
              </div>
              <div className="ml-4 mt-2 pt-2 border-t border-gray-200 flex justify-between font-semibold">
                <span>Total Current Liabilities</span>
                <span>{formatCurrency(sheet.liabilities?.current_liabilities ? (Object.values(sheet.liabilities.current_liabilities) as any[]).reduce((a: any, b: any) => Number(a ?? 0) + Number(b ?? 0), 0) : 0)}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Long-term Liabilities <span className="text-xs text-gray-500">(Due after one year)</span></span>
              </div>
              <div className="ml-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Long-term Debt</span><span>{formatCurrency(sheet.liabilities?.long_term_liabilities?.long_term_debt ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Deferred Tax</span><span>{formatCurrency(sheet.liabilities?.long_term_liabilities?.deferred_tax_liabilities ?? 0)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Other</span><span>{formatCurrency(sheet.liabilities?.long_term_liabilities?.other_long_term_liabilities ?? 0)}</span></div>
              </div>
              <div className="ml-4 mt-2 pt-2 border-t border-gray-200 flex justify-between font-semibold">
                <span>Total Long-term Liabilities</span>
                <span>{formatCurrency(sheet.liabilities?.long_term_liabilities ? (Object.values(sheet.liabilities.long_term_liabilities) as any[]).reduce((a: any, b: any) => Number(a ?? 0) + Number(b ?? 0), 0) : 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Equity Section */}
      <div>
        <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setExpandedSheetId(expandedSheetId === `${sheet.balance_sheet_id}-equity` ? null : `${sheet.balance_sheet_id}-equity`)}>
          <h5 className="text-lg font-bold text-gray-900">Equity</h5>
          <span className="text-xl font-semibold text-gray-900">{formatCurrency(sheet.totals?.total_equity ?? 0)}</span>
          <span className="text-gray-600">{expandedSheetId === `${sheet.balance_sheet_id}-equity` ? '▼' : '▶'}</span>
        </div>
        
        {expandedSheetId === `${sheet.balance_sheet_id}-equity` && (
          <div className="pl-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">Equity <span className="text-xs text-gray-500">(Owner's equity)</span></span>
            </div>
            <div className="ml-4 space-y-1 text-sm mb-2">
              <div className="flex justify-between"><span className="text-gray-600">Retained Earnings</span><span>{formatCurrency(sheet.equity?.retained_earnings ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Unrealized Gains/Losses</span><span>{formatCurrency(sheet.equity?.unrealized_gains_losses ?? 0)}</span></div>
            </div>
            <div className="ml-4 pt-2 border-t border-gray-200 flex justify-between font-semibold">
              <span>Total Equity</span>
              <span>{formatCurrency(sheet.totals?.total_equity ?? 0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Totals */}
      <div className="border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between"><span>Total Assets</span><span className="font-semibold">{formatCurrency(sheet.totals?.total_assets ?? 0)}</span></div>
        <div className="flex justify-between"><span>Total Liabilities</span><span className="font-semibold">{formatCurrency(sheet.totals?.total_liabilities ?? 0)}</span></div>
        <div className="flex justify-between"><span>Total Equity</span><span className="font-semibold">{formatCurrency(sheet.totals?.total_equity ?? 0)}</span></div>
        <div className="flex justify-between font-bold text-lg"><span>Liabilities + Equity</span><span>{formatCurrency((sheet.totals?.total_liabilities ?? 0) + (sheet.totals?.total_equity ?? 0))}</span></div>
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-900">Recent Balance Sheets</h4>
        <button
          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => void balanceSheetListViewModel.fetchAll({ limit: 10 })}
          disabled={balanceSheetListViewModel.isLoading}
        >
          Refresh History
        </button>
      </div>

      {balanceSheetListViewModel.lastError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md mb-4">
          <span>Error loading history: {balanceSheetListViewModel.lastError}</span>
          <button className="ml-3 text-red-800 underline" onClick={clearListError}>
            Dismiss
          </button>
        </div>
      )}

      {balanceSheetListViewModel.isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading balance sheets...</p>
        </div>
      ) : balanceSheetListViewModel.items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">As Of Date</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Assets</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Liabilities</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {balanceSheetListViewModel.items.map((item: any) => (
                <React.Fragment key={item.balance_sheet_id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedSheetId(expandedSheetId === item.balance_sheet_id ? null : item.balance_sheet_id)}>
                    <td className="px-4 py-2 text-gray-700">{item.balance_sheet_id}</td>
                    <td className="px-4 py-2 text-gray-600">{new Date(item.as_of_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-right text-gray-900">{formatCurrency(Number(item.totals?.total_assets ?? 0))}</td>
                    <td className="px-4 py-2 text-right text-gray-900">{formatCurrency(Number(item.totals?.total_liabilities ?? 0))}</td>
                    <td className="px-4 py-2 text-right text-gray-900">{formatCurrency(Number(item.totals?.total_equity ?? 0))}</td>
                  </tr>
                  {expandedSheetId === item.balance_sheet_id && (
                    <tr>
                      <td colSpan={5} className="px-0 py-0">
                        {renderDetailedBreakdown(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-600">No balance sheets available.</p>
      )}
    </div>
  );

  const calculateCurrentAssets = useCallback(() => {
    return balanceSheetData.assets.current.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [balanceSheetData.assets.current]);

  const calculateNonCurrentAssets = useCallback(() => {
    return balanceSheetData.assets.nonCurrent.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [balanceSheetData.assets.nonCurrent]);

  const calculateTotalAssets = useCallback(() => {
    const currentSum = balanceSheetData.assets.current.reduce((sum, item) => sum + (item.amount || 0), 0);
    const nonCurrentSum = balanceSheetData.assets.nonCurrent.reduce((sum, item) => sum + (item.amount || 0), 0);
    return currentSum + nonCurrentSum;
  }, [balanceSheetData.assets.current, balanceSheetData.assets.nonCurrent]);

  const calculateTotalLiabilities = useCallback(() => {
    return balanceSheetData.liabilities.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [balanceSheetData.liabilities]);

  const calculateTotalEquity = useCallback(() => {
    return balanceSheetData.equity.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [balanceSheetData.equity]);

  const calculateNonCurrentAssetsValue = () => calculateNonCurrentAssets();

  const chartData = useMemo(() => {
    const assetsValue = Math.abs(calculateTotalAssets());
    const liabilitiesValue = Math.abs(calculateTotalLiabilities());
    const equityValue = Math.abs(calculateTotalEquity());
    
    return [
      {
        name: 'Assets',
        value: assetsValue,
        fill: '#8884d8'
      },
      {
        name: 'Liabilities',
        value: liabilitiesValue,
        fill: '#82ca9d'
      },
      {
        name: 'Equity',
        value: equityValue,
        fill: '#ffc658'
      }
    ];
  }, [calculateTotalAssets, calculateTotalLiabilities, calculateTotalEquity]);

  const handleExportExcel = useCallback(async () => {
    const currentSheet = balanceSheet;
    if (!currentSheet) {
      balanceSheetViewModel.clearError();
      return;
    }

    try {
      const excelData = [
        ['BALANCE SHEET'],
        [`As of: ${currentSheet.as_of_date ? new Date(currentSheet.as_of_date).toLocaleDateString() : new Date().toLocaleDateString()}`],
        [`ID: ${currentSheet.balance_sheet_id}`],
        [''],
        ['ASSETS', 'Amount'],
        ['Current Assets', calculateCurrentAssets()],
        ...balanceSheetData.assets.current.map(item => [`  ${item.name}`, item.amount]),
        ['Non-Current Assets', calculateNonCurrentAssets()],
        ...balanceSheetData.assets.nonCurrent.map(item => [`  ${item.name}`, item.amount]),
        ['TOTAL ASSETS', calculateTotalAssets()],
        [''],
        ['LIABILITIES', 'Amount'],
        ...balanceSheetData.liabilities.map(item => [item.name, item.amount]),
        ['TOTAL LIABILITIES', calculateTotalLiabilities()],
        [''],
        ['EQUITY', 'Amount'],
        ...balanceSheetData.equity.map(item => [item.name, item.amount]),
        ['TOTAL EQUITY', calculateTotalEquity()],
        [''],
        ['TOTAL LIABILITIES + EQUITY', calculateTotalLiabilities() + calculateTotalEquity()]
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 35 }, // Account column
        { wch: 18 }  // Amount column
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `BalanceSheet_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
    } catch (err: any) {
      console.error('Excel export error:', err);
    }
  }, [balanceSheet, balanceSheetData, calculateCurrentAssets, calculateNonCurrentAssets, calculateTotalAssets, calculateTotalLiabilities, calculateTotalEquity]);

  const renderChartView = () => {
    if (!balanceSheet) {
      return <div className="text-center py-8"><p className="text-gray-600">No balance sheet data available</p></div>;
    }

    return (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Assets</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateTotalAssets())}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Liabilities</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateTotalLiabilities())}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Equity</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateTotalEquity())}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Net Worth</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(calculateTotalEquity())}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet Summary</h4>
        {balanceSheet ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your balance sheet shows total assets of <strong>{formatCurrency(calculateTotalAssets())}</strong> 
              with a net worth of <strong>{formatCurrency(calculateTotalEquity())}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The company has <strong>{formatCurrency(calculateCurrentAssets())}</strong> in current assets 
              and <strong>{formatCurrency(calculateNonCurrentAssets())}</strong> in non-current assets.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                className="py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all disabled:opacity-60"
                onClick={handleExportPdf}
                disabled={balanceSheetViewModel.isExportingPdf || balanceSheetViewModel.isGenerating}
              >
                {balanceSheetViewModel.isExportingPdf ? 'Downloading...' : '📄 Download Report'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Loading balance sheet data...
          </p>
        )}
      </div>
    </div>
    );
  };

  const renderTableView = () => (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          onClick={handleExportExcel} 
          disabled={balanceSheetViewModel.isGenerating || !balanceSheet}
        >
          Export to Excel
        </button>
        <button 
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      {/* Simple Balance Sheet Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Assets Section */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">ASSETS</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalAssets())}</td>
            </tr>
            
            {/* Current Assets */}
            <tr>
              <td className="px-6 py-3 pl-12 text-sm text-gray-600">Current Assets</td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(calculateCurrentAssets())}</td>
            </tr>
            
            {balanceSheetData.assets.current.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-16 text-sm text-gray-600">
                  {(item as any).category === 'crypto' && <span className="mr-2">₿</span>}
                  {item.name}
                </td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Non-Current Assets */}
            <tr>
              <td className="px-6 py-3 pl-12 text-sm text-gray-600">Non-Current Assets</td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(calculateNonCurrentAssetsValue())}</td>
            </tr>
            
            {balanceSheetData.assets.nonCurrent.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-16 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Liabilities Section */}
            <tr className="bg-red-50">
              <td className="px-6 py-4 font-semibold text-gray-900">LIABILITIES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalLiabilities())}</td>
            </tr>
            
            {balanceSheetData.liabilities.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Equity Section */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">EQUITY</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalEquity())}</td>
            </tr>
            
            {balanceSheetData.equity.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Totals */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-6 py-4 font-bold text-gray-900">TOTAL LIABILITIES + EQUITY</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(calculateTotalLiabilitiesPlusEquity())}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Balance Check */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Balance Sheet is balanced</span>
        </div>
      </div>

      {renderHistorySection()}
    </div>
  );

  return (
    <div className="balance-sheet-container w-full min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          
          <button 
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports</span>
          </button>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === 'table' 
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('table')}
            >
              Table View
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === 'chart' 
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('chart')}
            >
              Chart View
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Balance Sheet</h1>
        {balanceSheet && (
          <p className="text-gray-600">
            As of: {new Date(balanceSheet.as_of_date).toLocaleDateString()} | 
            ID: {balanceSheet.balance_sheet_id}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {balanceSheetViewModel.isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading balance sheet...</p>
          </div>
        )}
        
        {balanceSheetViewModel.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {balanceSheetViewModel.error}
            <button className="ml-4 text-red-800 underline" onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {!balanceSheetViewModel.isGenerating && !balanceSheetViewModel.error && balanceSheet && (activeView === 'chart' ? renderChartView() : renderTableView())}
        
        {!balanceSheetViewModel.isGenerating && !balanceSheetViewModel.error && !balanceSheet && (
          <div className="text-center py-8">
            <p className="text-gray-600">No balance sheet data available. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default BalanceSheet;