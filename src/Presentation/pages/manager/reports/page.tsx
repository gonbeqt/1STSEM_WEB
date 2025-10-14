import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from '../../../components/ManagerNavbar';

const PERIOD_LABELS = ['Daily', 'Weekly', 'Monthly', 'Quarterly'] as const;
type PeriodLabel = typeof PERIOD_LABELS[number];

const ReportsComponent: React.FC = () => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<PeriodLabel>('Daily');

  const handleCategoryChange = (categoryName: string) => {
    // Not used anymore but keeping for compatibility
  };

  const getLastUpdatedText = (periodLabel: string) => {
    switch (periodLabel) {
      case 'Daily':
        return 'Last updated: Today';
      case 'Weekly':
        return 'Last updated: This Week';
      case 'Monthly':
        return 'Last updated: This Month';
      case 'Quarterly':
        return 'Last updated: This Quarter';
      default:
        return 'Last updated';
    }
  };

  const getReportIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'balance': '📄',
      'income': '📊',
      'cashflow': '📈',
      'investment': '📈',
      'payroll': '📄',
      'tax': '📋'
    };
    return icons[type] || '📄';
  };

  const handleReportTypeClick = (path: string) => {
    navigate(path);
  };

  const handlePeriodChange = (label: PeriodLabel) => {
    setActivePeriod(label);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <ManagerNavbar />
      <div className="w-full  mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
          
          {/* Period Selector */}
          <div className="flex gap-3 mb-8">
            {PERIOD_LABELS.map((label) => (
              <button
                key={label}
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  activePeriod === label
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePeriodChange(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Reports Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Reports</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleReportTypeClick('/balance_sheet')}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-purple-500">
                {getReportIcon('balance')}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Balance Sheet</div>
                <div className="text-sm text-gray-500">{getLastUpdatedText(activePeriod)}</div>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleReportTypeClick('/income')}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-purple-500">
                {getReportIcon('income')}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Income Statement</div>
                <div className="text-sm text-gray-500">{getLastUpdatedText(activePeriod)}</div>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleReportTypeClick('/cash_flow')}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-purple-500">
                {getReportIcon('cashflow')}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Cash Flow</div>
                <div className="text-sm text-gray-500">{getLastUpdatedText(activePeriod)}</div>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleReportTypeClick('/investment')}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-purple-500">
                {getReportIcon('investment')}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Investment Performance</div>
                <div className="text-sm text-gray-500">{getLastUpdatedText(activePeriod)}</div>
              </div>
            </div>
          </div>

          {/* Payroll Reports */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payroll Reports</h2>
          <div className="mb-8">
            <div
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleReportTypeClick('/payroll_summary')}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-purple-500">
                {getReportIcon('payroll')}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Payroll Summary</div>
                <div className="text-sm text-gray-500">{getLastUpdatedText(activePeriod)}</div>
              </div>
            </div>
          </div>

          {/* Tax Reports */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Reports</h2>
          <div>
            <div
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleReportTypeClick('/vat_report')}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-purple-500">
                {getReportIcon('tax')}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">VAT Report</div>
                <div className="text-sm text-gray-500">{getLastUpdatedText(activePeriod)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ReportsComponent);