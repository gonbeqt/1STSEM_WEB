// Cash Flow Statement Component - v1.0
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useEffect, useState } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useCashFlowListViewModel } from '../../../../hooks/useCashFlowViewModel';
import { CashFlowSummary } from '../../../../../domain/viewmodel/CashFlowListViewModel';
import { ReportChartSkeleton } from '../../../../components/TaxSummarySkeleton';

interface CashFlowItem {
  name: string;
  amount: number;
}

interface CashFlowStatementData {
  operating_cash_flow: number;
  investing_cash_flow: number;
  financing_cash_flow: number;
  beginning_cash: number;
  ending_cash: number;
  net_change_in_cash: number;
  operating_items?: CashFlowItem[];
  investing_items?: CashFlowItem[];
  financing_items?: CashFlowItem[];
}

const CashFlow: React.FC = observer(() => {
  const navigate = useNavigate();
  
  const cashFlowViewModel = useCashFlowListViewModel();

  const displayName = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
      })
      .join(' ');
  };

  const normalizeItems = (raw: any, fallbackLabel: string): CashFlowItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((r) => ({ name: r?.name ?? String(r?.label ?? 'Item'), amount: Number(r?.amount ?? r?.value ?? 0) }));
    }
    if (typeof raw === 'object') {
      // object shaped like { accountName: amount, ... }
      return Object.entries(raw)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => ({ name: displayName(k), amount: Number(v as any) ?? 0 }));
    }
    if (typeof raw === 'number' || !isNaN(Number(raw))) {
      return [{ name: fallbackLabel, amount: Number(raw) }];
    }
    return [];
  };
  // input values (what the user types) and applied values (what is actually used by the filter)
  const [periodStartInput, setPeriodStartInput] = React.useState<string>('');
  const [periodEndInput, setPeriodEndInput] = React.useState<string>('');
  const [appliedPeriodStart, setAppliedPeriodStart] = React.useState<string>('');
  const [appliedPeriodEnd, setAppliedPeriodEnd] = React.useState<string>('');

  const plainItems = React.useMemo(() => toJS(cashFlowViewModel.items ?? []), [cashFlowViewModel.items]);

  const normalizeDate = (v: any): string | null => {
    if (!v && v !== 0) return null;
    try {
      const d = new Date(String(v));
      if (isNaN(d.getTime())) return null;
      return d.toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  };

  const activeRaw = React.useMemo(() => {
    if (!plainItems || plainItems.length === 0) return null;
    // Only filter when an applied period is present (user clicked Apply)
    if (appliedPeriodStart && appliedPeriodEnd) {
      const targetStart = normalizeDate(appliedPeriodStart);
      const targetEnd = normalizeDate(appliedPeriodEnd);
      const found = plainItems.find((it: any) => {
        const s = normalizeDate(it.period_start ?? it.start_date ?? it.period?.split('-')?.[0]);
        const e = normalizeDate(it.period_end ?? it.end_date ?? it.period?.split('-')?.[1]);
        return s === targetStart && e === targetEnd;
      });
      if (found) return found;
    }
    // default to first (latest)
    return plainItems[0] ?? null;
  }, [plainItems, appliedPeriodStart, appliedPeriodEnd]);

  const cashFlowStatement: CashFlowStatementData | null = React.useMemo(() => {
    if (!activeRaw) return null;
    
    // Extract values based on report type
    let operating_cash_flow = 0;
    let investing_cash_flow = 0;
    let financing_cash_flow = 0;
    let beginning_cash = 0;
    let ending_cash = 0;
    let operating_items: CashFlowItem[] = [];
    let investing_items: CashFlowItem[] = [];
    let financing_items: CashFlowItem[] = [];
    
    if (activeRaw.report_type === 'PERIODIC') {
      // For PERIODIC reports, use net_cash_flow from each activity
      operating_cash_flow = activeRaw.operating_activities?.net_cash_flow ?? 0;
      investing_cash_flow = activeRaw.investing_activities?.net_cash_flow ?? 0;
      financing_cash_flow = activeRaw.financing_activities?.net_cash_flow ?? 0;
      beginning_cash = activeRaw.cash_summary?.beginning_cash ?? 0;
      ending_cash = activeRaw.cash_summary?.ending_cash ?? 0;
      
      // Extract detailed items from cash_receipts and cash_payments
      if (activeRaw.operating_activities) {
        const opReceipts = normalizeItems(activeRaw.operating_activities.cash_receipts, '');
        const opPayments = normalizeItems(activeRaw.operating_activities.cash_payments, '');
        operating_items = [...opReceipts, ...opPayments];
      }
      if (activeRaw.investing_activities) {
        const invReceipts = normalizeItems(activeRaw.investing_activities.cash_receipts, '');
        const invPayments = normalizeItems(activeRaw.investing_activities.cash_payments, '');
        investing_items = [...invReceipts, ...invPayments];
      }
      if (activeRaw.financing_activities) {
        const finReceipts = normalizeItems(activeRaw.financing_activities.cash_receipts, '');
        const finPayments = normalizeItems(activeRaw.financing_activities.cash_payments, '');
        financing_items = [...finReceipts, ...finPayments];
      }
    } else {
      // For TRANSACTION and CUMULATIVE reports, use cash_flows and cash_summary
      operating_cash_flow = activeRaw.cash_flows?.operating_activities?.net_cash_from_operations ?? activeRaw.cash_summary?.net_cash_from_operations ?? 0;
      investing_cash_flow = activeRaw.cash_flows?.investing_activities?.net_cash_from_investing ?? activeRaw.cash_summary?.net_cash_from_investing ?? 0;
      financing_cash_flow = activeRaw.cash_flows?.financing_activities?.net_cash_from_financing ?? activeRaw.cash_summary?.net_cash_from_financing ?? 0;
      beginning_cash = activeRaw.cash_summary?.cash_at_beginning ?? 0;
      ending_cash = activeRaw.cash_summary?.cash_at_end ?? 0;
      
      // Extract line items from cash_flows object (excluding the main net_cash_from_* fields as they're shown as subtotals)
      if (activeRaw.cash_flows?.operating_activities) {
        operating_items = [
          { name: 'previous_value', amount: activeRaw.cash_flows.operating_activities.previous_value ?? 0 },
          { name: 'transaction_impact', amount: activeRaw.cash_flows.operating_activities.transaction_impact ?? 0 }
        ].filter(item => item.amount !== 0);
      }
      if (activeRaw.cash_flows?.investing_activities) {
        investing_items = [
          { name: 'previous_value', amount: activeRaw.cash_flows.investing_activities.previous_value ?? 0 },
          { name: 'transaction_impact', amount: activeRaw.cash_flows.investing_activities.transaction_impact ?? 0 }
        ].filter(item => item.amount !== 0);
      }
      if (activeRaw.cash_flows?.financing_activities) {
        financing_items = [
          { name: 'previous_value', amount: activeRaw.cash_flows.financing_activities.previous_value ?? 0 },
          { name: 'transaction_impact', amount: activeRaw.cash_flows.financing_activities.transaction_impact ?? 0 }
        ].filter(item => item.amount !== 0);
      }
    }
    
    const net_change_in_cash = operating_cash_flow + investing_cash_flow + financing_cash_flow;
    
    return { 
      operating_cash_flow, 
      investing_cash_flow, 
      financing_cash_flow,
      beginning_cash,
      ending_cash: ending_cash || (beginning_cash + net_change_in_cash),
      net_change_in_cash,
      operating_items,
      investing_items,
      financing_items
    } as CashFlowStatementData;
  }, [activeRaw]);

  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');

  useEffect(() => {
    cashFlowViewModel.fetchAll();
  }, []);

  const exportToExcel = () => {
    const cashFlow = (() => {
      const latest = activeRaw;
      if (!latest) return null;
      // normalize to CashFlowStatementData shape
      const operating_items = normalizeItems(latest.operating_activities || latest.operating_cash_flow, 'Operating Activities');
      const investing_items = normalizeItems(latest.investing_activities || latest.investing_cash_flow, 'Investing Activities');
      const financing_items = normalizeItems(latest.financing_activities || latest.financing_cash_flow, 'Financing Activities');
      
      const operating_cash_flow = latest.operating_cash_flow ?? operating_items.reduce((s: number, r: CashFlowItem) => s + (Number(r.amount) || 0), 0);
      const investing_cash_flow = latest.investing_cash_flow ?? investing_items.reduce((s: number, r: CashFlowItem) => s + (Number(r.amount) || 0), 0);
      const financing_cash_flow = latest.financing_cash_flow ?? financing_items.reduce((s: number, r: CashFlowItem) => s + (Number(r.amount) || 0), 0);
      
      const beginning_cash = Number(latest.beginning_cash ?? 0);
      const net_change_in_cash = operating_cash_flow + investing_cash_flow + financing_cash_flow;
      const ending_cash = beginning_cash + net_change_in_cash;
      
      return { 
        operating_cash_flow, 
        investing_cash_flow, 
        financing_cash_flow,
        beginning_cash,
        ending_cash,
        net_change_in_cash,
        operating_items,
        investing_items,
        financing_items
      } as CashFlowStatementData;
    })();

    if (!cashFlow) {
      // nothing to export
      return;
    }

    try {
      // Prepare data for Excel export (include selected period info)
    const periodLabel = (activeRaw && (activeRaw.period_start || activeRaw.period_end || activeRaw.period))
      ? (activeRaw.period ? String(activeRaw.period) : `${activeRaw.period_start ?? '...'} - ${activeRaw.period_end ?? '...'}`)
      : (appliedPeriodStart || appliedPeriodEnd ? `${appliedPeriodStart || '...'} - ${appliedPeriodEnd || '...'}` : 'N/A');

      const excelData = [
        ['CASH FLOW STATEMENT'],
        ['Period', periodLabel],
        [`As of: ${new Date().toISOString().split('T')[0]}`],
        [''],
        ['OPERATING ACTIVITIES', ''],
        ...cashFlow.operating_items!
          .filter(item => !['previous_value', 'transaction_impact'].includes(item.name))
          .map(item => [displayName(item.name), item.amount]),
        ['Net Cash from Operating Activities', cashFlow.operating_cash_flow],
        [''],
        ['INVESTING ACTIVITIES', ''],
        ...cashFlow.investing_items!
          .filter(item => !['previous_value', 'transaction_impact'].includes(item.name))
          .map(item => [displayName(item.name), item.amount]),
        ['Net Cash from Investing Activities', cashFlow.investing_cash_flow],
        [''],
        ['FINANCING ACTIVITIES', ''],
        ...cashFlow.financing_items!
          .filter(item => !['previous_value', 'transaction_impact'].includes(item.name))
          .map(item => [displayName(item.name), item.amount]),
        ['Net Cash from Financing Activities', cashFlow.financing_cash_flow],
        [''],
        ['Beginning Cash', cashFlow.beginning_cash],
        ['Net Change in Cash', cashFlow.net_change_in_cash],
        ['Ending Cash', cashFlow.ending_cash]
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Format cells with currency
      const rows = excelData.length;
      for (let i = 0; i < rows; i++) {
        if (excelData[i][1] && typeof excelData[i][1] === 'number') {
          const cellRef = `B${i + 1}`;
          if (!ws[cellRef]) {
            ws[cellRef] = { t: 'n', v: excelData[i][1] };
          }
          ws[cellRef].z = '"$"#,##0.00;[Red]"$"#,##0.00';
        }
      }

      // Set column widths
      ws['!cols'] = [
        { wch: 35 }, // Account column
        { wch: 18 }  // Amount column
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Cash Flow Statement');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `CashFlowStatement_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      console.error('Excel export error:', err);
    }
  };

  const chartData = cashFlowStatement ? [
    { 
      name: 'Operating', 
      value: cashFlowStatement.operating_cash_flow,
      fill: '#10b981'
    },
    { 
      name: 'Investing', 
      value: cashFlowStatement.investing_cash_flow,
      fill: '#ef4444'
    },
    { 
      name: 'Financing', 
      value: cashFlowStatement.financing_cash_flow,
      fill: '#6366f1'
    }
  ] : [];

  const formatYAxisTick = (val: number) => {
    if (!isFinite(val)) return '';
    const k = Math.round(val / 1000);
    return `$${k}K`;
  };

  const formatCurrency = (amount: number): string => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatPercent = (numerator: number | null | undefined, denominator: number | null | undefined): string => {
    const n = Number(numerator ?? 0);
    const d = Number(denominator ?? 0);
    if (!isFinite(n) || !isFinite(d) || d === 0) return '0.0%';
    return `${((n / d) * 100).toFixed(1)}%`;
  };

  const clearError = () => {
    cashFlowViewModel.clearError();
  };

  const handleExportExcel = () => {
    try {
      exportToExcel();
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
  };

  const handleRefresh = async () => {
    await cashFlowViewModel.fetchAll();
  };

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Operating Cash Flow</p>
              <p className="text-2xl font-bold text-green-800 mt-2">{formatCurrency(cashFlowStatement?.operating_cash_flow || 0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Investing Cash Flow</p>
              <p className="text-2xl font-bold text-red-800 mt-2">{formatCurrency(cashFlowStatement?.investing_cash_flow || 0)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Net Change</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">{formatCurrency(cashFlowStatement?.net_change_in_cash || 0)}</p>
            </div>
            <div className="w-8 h-8 text-blue-600 opacity-20">📊</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Report</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { 
              name: 'Beginning Cash', 
              value: Math.abs(cashFlowStatement?.beginning_cash || 0),
              fill: '#3b82f6'
            },
            { 
              name: 'Operating Activities', 
              value: Math.abs(cashFlowStatement?.operating_cash_flow || 0),
              fill: '#10b981'
            },
            { 
              name: 'Investing Activities', 
              value: Math.abs(cashFlowStatement?.investing_cash_flow || 0),
              fill: '#ef4444'
            },
            { 
              name: 'Financing Activities', 
              value: Math.abs(cashFlowStatement?.financing_cash_flow || 0),
              fill: '#6366f1'
            },
            { 
              name: 'Ending Cash', 
              value: Math.abs(cashFlowStatement?.ending_cash || 0),
              fill: '#3b82f6'
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxisTick} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cash Summary */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Summary</h4>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-600">Beginning Cash</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(cashFlowStatement?.beginning_cash || 0)}</p>
          </div>
          <div>
            <p className="text-gray-600">Operating Activities</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(cashFlowStatement?.operating_cash_flow || 0)}</p>
          </div>
          <div>
            <p className="text-gray-600">Investing Activities</p>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(cashFlowStatement?.investing_cash_flow || 0)}</p>
          </div>
          <div>
            <p className="text-gray-600">Financing Activities</p>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(cashFlowStatement?.financing_cash_flow || 0)}</p>
          </div>
          <div>
            <p className="text-gray-600">Net Change in Cash</p>
            <p className="text-lg font-semibold text-indigo-600">{formatCurrency(cashFlowStatement?.net_change_in_cash || 0)}</p>
          </div>
          <div>
            <p className="text-gray-600">Ending Cash</p>
            <p className="text-lg font-semibold text-blue-800">{formatCurrency(cashFlowStatement?.ending_cash || 0)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>
            ← Close
          </button>
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 transition-all" onClick={handleExportExcel}>
            ↓ Download Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          onClick={handleExportExcel} 
          disabled={cashFlowViewModel.isLoading}
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

      {/* Cash Flow Statement Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Operating Activities Section */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">Operating Activities</td>
              <td className="px-6 py-4 text-right font-semibold text-green-700">{formatCurrency(cashFlowStatement?.operating_cash_flow || 0)}</td>
            </tr>
            
            {cashFlowStatement?.operating_items
              ?.filter(item => !['previous_value', 'transaction_impact'].includes(item.name))
              .map((item, index) => (
              <tr key={`op-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{displayName(item.name)}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}

            <tr className="bg-white font-semibold text-gray-900">
              <td className="px-6 py-3 pl-12">Net Cash from Operating Activities</td>
              <td className="px-6 py-3 text-right text-green-700">{formatCurrency(cashFlowStatement?.operating_cash_flow || 0)}</td>
            </tr>
            
            {/* Investing Activities Section */}
            <tr className="bg-red-50">
              <td className="px-6 py-4 font-semibold text-gray-900">Investing Activities</td>
              <td className="px-6 py-4 text-right font-semibold text-red-700">{formatCurrency(cashFlowStatement?.investing_cash_flow || 0)}</td>
            </tr>
            
            {cashFlowStatement?.investing_items
              ?.filter(item => !['previous_value', 'transaction_impact'].includes(item.name))
              .map((item, index) => (
              <tr key={`inv-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{displayName(item.name)}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}

            <tr className="bg-white font-semibold text-gray-900">
              <td className="px-6 py-3 pl-12">Net Cash from Investing Activities</td>
              <td className="px-6 py-3 text-right text-red-700">{formatCurrency(cashFlowStatement?.investing_cash_flow || 0)}</td>
            </tr>
            
            {/* Financing Activities Section */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">Financing Activities</td>
              <td className="px-6 py-4 text-right font-semibold text-blue-700">{formatCurrency(cashFlowStatement?.financing_cash_flow || 0)}</td>
            </tr>
            
            {cashFlowStatement?.financing_items
              ?.filter(item => !['previous_value', 'transaction_impact'].includes(item.name))
              .map((item, index) => (
              <tr key={`fin-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{displayName(item.name)}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}

            <tr className="bg-white font-semibold text-gray-900">
              <td className="px-6 py-3 pl-12">Net Cash from Financing Activities</td>
              <td className="px-6 py-3 text-right text-blue-700">{formatCurrency(cashFlowStatement?.financing_cash_flow || 0)}</td>
            </tr>

            {/* Summary Section */}
            <tr className="bg-gray-50">
              <td className="px-6 py-3 font-semibold text-gray-900">Beginning Cash</td>
              <td className="px-6 py-3 text-right font-semibold text-blue-600">{formatCurrency(cashFlowStatement?.beginning_cash || 0)}</td>
            </tr>

            <tr className="bg-white">
              <td className="px-6 py-3 font-semibold text-gray-900">Net Cash from Operating Activities</td>
              <td className="px-6 py-3 text-right text-gray-900">{formatCurrency(cashFlowStatement?.operating_cash_flow || 0)}</td>
            </tr>

            <tr className="bg-white">
              <td className="px-6 py-3 font-semibold text-gray-900">Net Cash from Investing Activities</td>
              <td className="px-6 py-3 text-right text-gray-900">{formatCurrency(cashFlowStatement?.investing_cash_flow || 0)}</td>
            </tr>

            <tr className="bg-white">
              <td className="px-6 py-3 font-semibold text-gray-900">Net Cash from Financing Activities</td>
              <td className="px-6 py-3 text-right text-gray-900">{formatCurrency(cashFlowStatement?.financing_cash_flow || 0)}</td>
            </tr>

            {/* Net Change and Ending Cash */}
            <tr className="bg-purple-50 border-t-2 border-purple-300">
              <td className="px-6 py-3 font-bold text-gray-900">Net Change in Cash</td>
              <td className="px-6 py-3 text-right font-bold text-purple-700">{formatCurrency(cashFlowStatement?.net_change_in_cash || 0)}</td>
            </tr>

            <tr className="bg-blue-50">
              <td className="px-6 py-3 font-bold text-gray-900">Ending Cash</td>
              <td className="px-6 py-3 text-right font-bold text-blue-700 text-lg">{formatCurrency(cashFlowStatement?.ending_cash || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Cash flow statement generated successfully</span>
        </div>
      </div>
    </div>
  );

  const renderBreakdown = () => (
    <div className="space-y-6">
      {/* Financial Breakdown Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Breakdown</h3>
        <div className="space-y-6">
          <div>
            <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-md mb-3">Operating Activities</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Total Operating Cash Flow</div>
              <div className="text-right font-semibold text-green-700">{formatCurrency(cashFlowStatement?.operating_cash_flow ?? 0)}</div>
              {cashFlowStatement?.operating_items
                ?.map((r, i) => (
                  <React.Fragment key={`op-${i}`}>
                    <div className="text-gray-600 pl-4">{displayName(r.name)}</div>
                    <div className="text-right">{formatCurrency(r.amount)}</div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div>
            <div className="inline-block bg-red-50 text-red-800 px-3 py-1 rounded-md mb-3">Investing Activities</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Total Investing Cash Flow</div>
              <div className="text-right font-semibold text-red-700">{formatCurrency(cashFlowStatement?.investing_cash_flow ?? 0)}</div>
              {cashFlowStatement?.investing_items
                ?.map((e, i) => (
                  <React.Fragment key={`inv-${i}`}>
                    <div className="text-gray-600 pl-4">{displayName(e.name)}</div>
                    <div className="text-right">{formatCurrency(e.amount)}</div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div>
            <div className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-md mb-3">Financing Activities</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Total Financing Cash Flow</div>
              <div className="text-right font-semibold text-blue-700">{formatCurrency(cashFlowStatement?.financing_cash_flow ?? 0)}</div>
              {cashFlowStatement?.financing_items
                ?.map((f, i) => (
                  <React.Fragment key={`fin-${i}`}>
                    <div className="text-gray-600 pl-4">{displayName(f.name)}</div>
                    <div className="text-right">{formatCurrency(f.amount)}</div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="inline-block bg-purple-50 text-purple-800 px-3 py-1 rounded-md mb-3">Summary</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Beginning Cash</div>
              <div className="text-right font-semibold">{formatCurrency(cashFlowStatement?.beginning_cash ?? 0)}</div>

              <div className="text-gray-600">Net Change in Cash</div>
              <div className="text-right font-semibold text-purple-700">{formatCurrency(cashFlowStatement?.net_change_in_cash ?? 0)}</div>

              <div className="text-gray-600 font-semibold">Ending Cash</div>
              <div className="text-right font-bold text-blue-700 text-base">{formatCurrency(cashFlowStatement?.ending_cash ?? 0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Information Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>Period</div>
          <div className="text-right">{(activeRaw?.period_start && activeRaw?.period_end) ? `${new Date(activeRaw.period_start).toLocaleDateString()} - ${new Date(activeRaw.period_end).toLocaleDateString()}` : (activeRaw?.period ?? '—')}</div>
          <div>Currency</div>
          <div className="text-right">{activeRaw?.currency ?? 'USD'}</div>
          <div>Generated</div>
          <div className="text-right">{activeRaw?.generated_at ? new Date(activeRaw.generated_at).toLocaleDateString() : (activeRaw?.generated ? activeRaw.generated : '—')}</div>
          <div>Transactions Processed</div>
          <div className="text-right">{activeRaw?.transactions_processed ?? activeRaw?.transactions_count ?? '0'}</div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-800" onClick={() => navigate(-1)}>Close</button>
          <button className="flex-1 py-2 rounded-lg bg-purple-600 text-white" onClick={handleExportExcel}>Download Report</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cash-flow-statement-container w-full min-h-screen bg-white">
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
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeView === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('table')}
            >
              📊 Table View
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeView === 'chart' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('chart')}
            >
              📈 Chart View
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cash Flow Statement</h1>
        <p className="text-gray-600 text-sm mb-4">Cash movements as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="flex items-center gap-3 text-gray-600">
          <label className="text-sm font-medium">Period</label>
          <input
            type="date"
            value={periodStartInput}
            onChange={(e) => setPeriodStartInput(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <span>-</span>
          <input
            type="date"
            value={periodEndInput}
            onChange={(e) => setPeriodEndInput(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={() => {
              // apply the input dates so activeRaw will pick them
              setAppliedPeriodStart(periodStartInput);
              setAppliedPeriodEnd(periodEndInput);
            }}
          >Apply</button>
          <button
            className="ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm"
            onClick={() => { setPeriodStartInput(''); setPeriodEndInput(''); setAppliedPeriodStart(''); setAppliedPeriodEnd(''); }}
          >Clear</button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {cashFlowViewModel.isLoading && (
          <ReportChartSkeleton title="Cash Flow Statement" />
        )}
        
        {cashFlowViewModel.lastError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {cashFlowViewModel.lastError}
            <button className="ml-4 text-red-800 underline" onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {!cashFlowViewModel.isLoading && !cashFlowViewModel.lastError && (activeView === 'chart' ? renderChartView() : renderTableView())}
      </div>
    </div>
  );
});

export default CashFlow;