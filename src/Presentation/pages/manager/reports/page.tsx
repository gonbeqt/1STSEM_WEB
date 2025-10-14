import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from '../../../components/ManagerNavbar';
import { FileText, BarChart3, TrendingUp, LineChart, ClipboardList, ScrollText } from 'lucide-react';

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

  const financialReports = [
    {
      title: 'Balance Sheet',
      path: '/balance_sheet',
      Icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Income Statement',
      path: '/income',
      Icon: BarChart3,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Cash Flow',
      path: '/cash_flow',
      Icon: TrendingUp,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Investment Performance',
      path: '/investment',
      Icon: LineChart,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const payrollReports = [
    {
      title: 'Payroll Summary',
      path: '/payroll_summary',
      Icon: ClipboardList,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ];

  const taxReports = [
    {
      title: 'VAT Report',
      path: '/vat_report',
      Icon: ScrollText,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const handleReportTypeClick = (path: string) => {
    navigate(path);
  };

  const handlePeriodChange = (label: PeriodLabel) => {
    setActivePeriod(label);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <ManagerNavbar />
      <div className="w-full mx-auto p-6">
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
            {financialReports.map(({ title, path, Icon, iconBg, iconColor }) => (
              <button
                key={title}
                onClick={() => handleReportTypeClick(path)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-left"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </span>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500">{getLastUpdatedText(activePeriod)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Payroll Reports */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payroll Reports</h2>
          <div className="mb-8">
            {payrollReports.map(({ title, path, Icon, iconBg, iconColor }) => (
              <button
                key={title}
                onClick={() => handleReportTypeClick(path)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-left"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </span>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500">{getLastUpdatedText(activePeriod)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tax Reports */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Reports</h2>
          <div>
            {taxReports.map(({ title, path, Icon, iconBg, iconColor }) => (
              <button
                key={title}
                onClick={() => handleReportTypeClick(path)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-left"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </span>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500">{getLastUpdatedText(activePeriod)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ReportsComponent);