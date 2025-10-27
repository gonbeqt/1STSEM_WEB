import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from '../../../components/ManagerNavbar';
import { FileText, BarChart3, TrendingUp, ClipboardList, ScrollText } from 'lucide-react';

const ReportsComponent: React.FC = () => {
  const navigate = useNavigate();

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
      title: 'Tax Report',
      path: '/tax_summary',
      Icon: ScrollText,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const handleReportTypeClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <ManagerNavbar />
      <div className="w-full mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
          
          
        </div>

        {/* Financial Reports Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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