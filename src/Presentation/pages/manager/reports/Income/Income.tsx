import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useEffect, useState } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ArrowLeft } from 'lucide-react';
import { useIncomeViewModel } from '../../../../hooks/useBalanceSheetViewModel';
import { ReportChartSkeleton } from '../../../../components/TaxSummarySkeleton';

interface IncomeItem {
  name: string;
  amount: number;
}

interface IncomeStatementData {
  revenue: IncomeItem[];
  expenses: IncomeItem[];
  net_income: number;
  total_revenue: number;
  total_expenses: number;
}

const Income: React.FC = observer(() => {
  const navigate = useNavigate();
  
  const incomeViewModel = useIncomeViewModel();

  const normalizeItems = (raw: any, fallbackLabel: string): IncomeItem[] => {
    if (!raw) return [{ name: fallbackLabel, amount: 0 }];
    if (Array.isArray(raw)) {
      return raw.map((r) => ({ name: r?.name ?? String(r?.label ?? 'Item'), amount: Number(r?.amount ?? r?.value ?? 0) }));
    }
    if (typeof raw === 'object') {
      return Object.entries(raw).map(([k, v]) => ({ name: k, amount: Number((v as any) ?? 0) }));
    }
    if (typeof raw === 'number' || !isNaN(Number(raw))) {
      return [{ name: fallbackLabel, amount: Number(raw) }];
    }
    return [{ name: fallbackLabel, amount: 0 }];
  };
  const [periodStartInput, setPeriodStartInput] = React.useState<string>('');
  const [periodEndInput, setPeriodEndInput] = React.useState<string>('');
  const [appliedPeriodStart, setAppliedPeriodStart] = React.useState<string>('');
  const [appliedPeriodEnd, setAppliedPeriodEnd] = React.useState<string>('');

  const plainItems = React.useMemo(() => toJS(incomeViewModel.items ?? []), [incomeViewModel.items]);

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
    return plainItems[0] ?? null;
  }, [plainItems, appliedPeriodStart, appliedPeriodEnd]);

  const incomeStatement: IncomeStatementData | null = React.useMemo(() => {
    if (!activeRaw) return null;
    const revenue = normalizeItems(activeRaw.revenue, 'No revenue data available');
    const expenses = normalizeItems(activeRaw.expenses, 'No expense data available');
    const total_revenue = activeRaw.total_revenue ?? revenue.reduce((s: number, r: IncomeItem) => s + (Number(r.amount) || 0), 0);
    const total_expenses = activeRaw.total_expenses ?? expenses.reduce((s: number, e: IncomeItem) => s + (Number(e.amount) || 0), 0);
    const net_income = activeRaw.net_income ?? (total_revenue - total_expenses);
    return { revenue, expenses, total_revenue, total_expenses, net_income } as IncomeStatementData;
  }, [activeRaw]);

  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');

  useEffect(() => {
    void incomeViewModel.fetchAll();
  }, [incomeViewModel]);

  const exportToExcel = () => {
    const incomeStatement = (() => {
      const latest = activeRaw;
      if (!latest) return null;
      const revenue = normalizeItems(latest.revenue, 'No revenue data available');
      const expenses = normalizeItems(latest.expenses, 'No expense data available');
      const total_revenue = latest.total_revenue ?? revenue.reduce((s: number, r: IncomeItem) => s + (Number(r.amount) || 0), 0);
      const total_expenses = latest.total_expenses ?? expenses.reduce((s: number, e: IncomeItem) => s + (Number(e.amount) || 0), 0);
      const net_income = latest.net_income ?? (total_revenue - total_expenses);
      return { revenue, expenses, total_revenue, total_expenses, net_income } as IncomeStatementData;
    })();

    if (!incomeStatement) {
      return;
    }

    try {
    const periodLabel = (activeRaw && (activeRaw.period_start || activeRaw.period_end || activeRaw.period))
      ? (activeRaw.period ? String(activeRaw.period) : `${activeRaw.period_start ?? '...'} - ${activeRaw.period_end ?? '...'}`)
      : (appliedPeriodStart || appliedPeriodEnd ? `${appliedPeriodStart || '...'} - ${appliedPeriodEnd || '...'}` : 'N/A');

      const filteredRevenue = incomeStatement.revenue.filter((r) => {
        const n = (r?.name ?? '').toString().toLowerCase().replace(/\s+/g, '_');
        return !['payroll_income', 'by_cryptocurrency', 'by_crypto', 'by_month'].includes(n);
      });
      const filteredExpenses = incomeStatement.expenses.filter((e) => {
        const n = (e?.name ?? '').toString().toLowerCase().replace(/\s+/g, '_');
        return !['trading_losses', 'trading_loss', 'by_cryptocurrency', 'by_crypto', 'by_month'].includes(n);
      });

      const excelData = [
        ['INCOME STATEMENT'],
        ['Period', periodLabel],
        [`As of: ${new Date().toISOString().split('T')[0]}`],
        [''],
        ['REVENUE', ''],
        ...filteredRevenue.map(item => [displayName(item.name), item.amount]),
        ['Total Revenue', incomeStatement.total_revenue],
        [''],
        ['EXPENSES', ''],
        ...filteredExpenses.map(item => [displayName(item.name), item.amount]),
        ['Total Expenses', incomeStatement.total_expenses],
        [''],
        ['Gross Profit', (incomeStatement.total_revenue - incomeStatement.total_expenses)],
        ['Gross Profit Margin', formatPercent((incomeStatement.total_revenue - incomeStatement.total_expenses), incomeStatement.total_revenue)],
        ['Net Profit Margin', formatPercent(incomeStatement.net_income, incomeStatement.total_revenue)],
        [''],
        ['NET INCOME', incomeStatement.net_income]
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      ws['!cols'] = [
        { wch: 30 }, // Account column
        { wch: 15 }  // Amount column
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Income Statement');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `IncomeStatement_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {    }
  };

  const chartData = incomeStatement ? [
    { 
      name: 'Revenue', 
      value: incomeStatement.total_revenue,
      fill: '#8884d8'
    },
    { 
      name: 'Expenses', 
      value: incomeStatement.total_expenses,
      fill: '#82ca9d'
    },
    { 
      name: 'Net Income', 
      value: incomeStatement?.net_income ?? 0,
      fill: '#ffc658'
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

  const displayName = (raw?: any): string => {
    if (!raw && raw !== 0) return '';
    let s = String(raw);
    s = s.replace(/[_-]+/g, ' ');
    s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    s = s.replace(/\s+/g, ' ').trim();
    return s.split(' ').map(w => w.length ? (w[0].toUpperCase() + w.slice(1)) : '').join(' ');
  };

  const clearError = () => {
    incomeViewModel.clearError();
  };

  const handleExportExcel = () => {
    try {
      exportToExcel();
    } catch (error) {    }
  };

  const handleRefresh = async () => {
    await incomeViewModel.fetchAll();
  };

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxisTick} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#8884d8" barSize={64} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_revenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_expenses || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Net Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(incomeStatement?.net_income || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Profit Margin</span>
              <span className="font-bold text-lg text-gray-900">
                {incomeStatement ? formatPercent(incomeStatement.net_income, incomeStatement.total_revenue) : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Income Statement Summary</h4>
        {incomeStatement ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your income statement shows total revenue of <strong>{formatCurrency(incomeStatement?.total_revenue ?? 0)}</strong> 
              with a net income of <strong>{formatCurrency(incomeStatement?.net_income ?? 0)}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The company has <strong>{formatCurrency(incomeStatement?.total_expenses ?? 0)}</strong> in total expenses 
              and a profit margin of <strong>{incomeStatement ? formatPercent(incomeStatement.net_income, incomeStatement.total_revenue) : '0%'}
              </strong>.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <button className="py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all" onClick={handleExportExcel}>
                📄 Download Report
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Loading income statement data...
          </p>
        )}
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
          disabled={incomeViewModel.isLoading}
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

      {/* Simple Income Statement Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Revenue Section */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">REVENUE</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_revenue || 0)}</td>
            </tr>
            
            {incomeStatement?.revenue.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Expenses Section */}
            <tr className="bg-red-50">
              <td className="px-6 py-4 font-semibold text-gray-900">EXPENSES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(incomeStatement?.total_expenses || 0)}</td>
            </tr>
            
            {incomeStatement?.expenses.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">{item.name}</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            
            {/* Net Income */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">NET INCOME</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(incomeStatement?.net_income || 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Income statement generated successfully</span>
        </div>
      </div>
    </div>
  );

  const renderBreakdown = () => (
    <div className="space-y-6">
      {/* Financial Breakdown Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
  <div className="space-y-6">
          <div>
            <div className="inline-block bg-green-50 text-green-800 px-3 py-1 rounded-md mb-3">Revenue</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Total Revenue</div>
              <div className="text-right font-semibold">{formatCurrency(incomeStatement?.total_revenue ?? 0)}</div>
              {incomeStatement?.revenue
                ?.filter((r) => {
                  const n = (r?.name ?? '').toString().toLowerCase().replace(/\s+/g, '_');
                  return !['payroll_income', 'by_cryptocurrency', 'by_crypto', 'by_month'].includes(n);
                })
                .map((r, i) => (
                  <React.Fragment key={`rev-${i}`}>
                    <div className="text-gray-600 pl-4">{displayName(r.name)}</div>
                    <div className="text-right">{formatCurrency(r.amount)}</div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div>
            <div className="inline-block bg-red-50 text-red-800 px-3 py-1 rounded-md mb-3">Expenses</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Total Expenses</div>
              <div className="text-right font-semibold">{formatCurrency(incomeStatement?.total_expenses ?? 0)}</div>
              {incomeStatement?.expenses
                ?.filter((e) => {
                  const n = (e?.name ?? '').toString().toLowerCase().replace(/\s+/g, '_');
                  return !['trading_losses', 'trading_loss','by_cryptocurrency', 'by_crypto', 'by_month'].includes(n);
                })
                .map((e, i) => (
                  <React.Fragment key={`exp-${i}`}>
                    <div className="text-gray-600 pl-4">{displayName(e.name)}</div>
                    <div className="text-right">{formatCurrency(e.amount)}</div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div>
            <div className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-md mb-3">Profitability</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Gross Profit</div>
              <div className="text-right font-semibold">{formatCurrency(((incomeStatement?.total_revenue ?? 0) - (incomeStatement?.total_expenses ?? 0)))}</div>
              <div className="text-gray-600">Gross Profit Margin</div>
              <div className="text-right">{formatPercent(((incomeStatement?.total_revenue ?? 0) - (incomeStatement?.total_expenses ?? 0)), incomeStatement?.total_revenue)}</div>

              <div className="text-gray-600">Net Income</div>
              <div className="text-right font-semibold">{formatCurrency(incomeStatement?.net_income ?? 0)}</div>
              <div className="text-gray-600">Net Profit Margin</div>
              <div className="text-right">{formatPercent(incomeStatement?.net_income ?? 0, incomeStatement?.total_revenue)}</div>
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
          <div>Payroll Entries</div>
          <div className="text-right">{activeRaw?.payroll_entries ?? 0}</div>
          <div>Period Length</div>
          <div className="text-right">{activeRaw?.period_length ?? '1 Day'}</div>
          <div>Primary Revenue Source</div>
          <div className="text-right">{activeRaw?.primary_revenue_source ?? 'ETH'}</div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-800" onClick={() => navigate(-1)}>Close</button>
          <button className="flex-1 py-2 rounded-lg bg-purple-600 text-white" onClick={handleExportExcel}>Download Report</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="income-statement-container w-full min-h-screen bg-white">
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
              Table View
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeView === 'chart' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveView('chart')}
            >
              Chart View
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Income Statement</h1>
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
        {incomeViewModel.isLoading && (
          <ReportChartSkeleton title="Income Statement" />
        )}
        
        {incomeViewModel.lastError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {incomeViewModel.lastError}
            <button className="ml-4 text-red-800 underline" onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {!incomeViewModel.isLoading && !incomeViewModel.lastError && (activeView === 'chart' ? renderChartView() : renderBreakdown())}
      </div>
    </div>
  );
});

export default Income;