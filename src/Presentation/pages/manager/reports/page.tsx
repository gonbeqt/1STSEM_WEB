import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerNavbar from '../../../components/ManagerNavbar';

interface Period {
  id: string;
  name: string;
  active: boolean;
}

interface AlertData {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  period?: string;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Financial Statements');
  const [activePeriod, setActivePeriod] = useState('Daily');

  // Period state management
  const [periods] = useState<Period[]>([
    { id: 'daily', name: 'Daily', active: true },
    { id: 'weekly', name: 'Weekly', active: false },
    { id: 'monthly', name: 'Monthly', active: false },
    { id: 'quarterly', name: 'Quarterly', active: false }
  ]);

  // Sample alerts data that changes based on period
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  // Alert data for different periods
  const alertsData: Record<string, AlertData[]> = {
    Daily: [
      {
        id: '1',
        title: 'Daily Cash Flow Fluctuation',
        description: 'Cash flow decreased by 8% compared to yesterday',
        severity: 'medium',
        recommendation: 'Monitor daily transactions and ensure timely invoicing to maintain healthy cash flow.'
      },
      {
        id: '2',
        title: 'High Daily Expenses',
        description: 'Today\'s operational expenses are 15% above average',
        severity: 'low',
        recommendation: 'Review today\'s expense entries and categorize any unusual spending.'
      }
    ],
    Weekly: [
      {
        id: '1',
        title: 'Weekly Revenue Decline',
        description: 'Revenue decreased by 12% compared to last week',
        severity: 'high',
        recommendation: 'Analyze sales patterns and customer acquisition metrics. Consider promotional activities.'
      },
      {
        id: '2',
        title: 'Inventory Turnover Slow',
        description: 'Weekly inventory turnover is below target by 18%',
        severity: 'medium',
        recommendation: 'Review inventory levels and consider adjusting procurement schedules.'
      }
    ],
    Monthly: [
      {
        id: '1',
        title: 'Declining Cash Flow',
        description: 'Decreased by 22% compared to last month',
        severity: 'high',
        recommendation: 'Review accounts receivable processes and consider implementing stricter credit collection policies.'
      },
      {
        id: '2',
        title: 'Increasing Operational Expenses',
        description: 'Monthly expenses have increased by 15%',
        severity: 'medium',
        recommendation: 'Conduct cost audit and identify areas for potential cost reduction.'
      },
      {
        id: '3',
        title: 'Debt-to-Equity Ratio Rising',
        description: 'Monthly debt-to-equity ratio is approaching 0.75',
        severity: 'low',
        recommendation: 'Consider equity financing instead of taking on additional debt.'
      }
    ],
    Quarterly: [
      {
        id: '1',
        title: 'Quarterly Profit Margin Decline',
        description: 'Profit margins decreased by 18% this quarter',
        severity: 'high',
        recommendation: 'Comprehensive review of pricing strategy and cost structure needed. Consider market repositioning.'
      },
      {
        id: '2',
        title: 'Customer Acquisition Cost Rising',
        description: 'CAC increased by 25% compared to previous quarter',
        severity: 'medium',
        recommendation: 'Optimize marketing spend and improve conversion funnel efficiency.'
      },
      {
        id: '3',
        title: 'Working Capital Optimization',
        description: 'Working capital efficiency can be improved by 12%',
        severity: 'low',
        recommendation: 'Implement better inventory management and optimize payment terms with suppliers.'
      }
    ]
  };

  // Update alerts when period changes
  useEffect(() => {
    setAlerts(alertsData[activePeriod] || []);
  }, [activePeriod]);

  const reportCategories = [
    {
      name: 'Financial Statements',
      types: [
        { name: 'Balance Sheet', icon: 'balance-icon', path: '/balance_sheet' },
        { name: 'Income Statement', icon: 'income-icon', path: '/income' },
        { name: 'Cash Flow', icon: 'cashflow-icon', path: '/cash_flow' },
        { name: 'Investment', icon: 'investment-icon', path: '/invest' },
      ],
    },
    {
      name: 'Payroll Reports',
      types: [
        { name: 'Payroll Summary', icon: 'payroll-icon', path: '/payroll_summary' },
      ],
    },
    {
      name: 'Tax Reports',
      types: [
        { name: 'Tax Summary', icon: 'tax-icon', path: '/tax_summary' },
      ],
    },
  ];

  const handleReportTypeClick = (path: string) => {
    navigate(path);
  };

  const handlePeriodChange = (periodName: string) => {
    setActivePeriod(periodName);
  };

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const getLastUpdatedText = (periodName: string) => {
    switch (periodName) {
      case 'Daily':
        return 'Last updated Today';
      case 'Weekly':
        return 'Last updated This Week';
      case 'Monthly':
        return 'Last updated This Month';
      case 'Quarterly':
        return 'Last updated This Quarter';
      default:
        return 'Last updated Today';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '!';
      case 'medium':
        return '⚠';
      case 'low':
        return 'i';
      default:
        return '•';
    }
  };

  const getIconContent = (iconClass: string) => {
    switch (iconClass) {
      case 'balance-icon':
        return '⚖';
      case 'income-icon':
        return '💰';
      case 'cashflow-icon':
        return '💧';
      case 'investment-icon':
        return '📈';
      case 'payroll-icon':
        return '👥';
      case 'tax-icon':
        return '📊';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
            <ManagerNavbar />
      <div className="max-w-6xl mx-auto p-6">

      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-sm text-gray-500">Manage and track all your reports in one place.</p>
        </div>

      {/* Report Categories */}
      <div className="flex flex-wrap gap-3 mb-6 md:flex-row">
        {reportCategories.map((category) => (
          <div
            key={category.name}
            className={`px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 ${activeCategory === category.name ? 'bg-purple-600 border-purple-600 text-white' : ''
              } md:text-center`}
            onClick={() => handleCategoryChange(category.name)}
          >
            <span>{category.name}</span>
          </div>
        ))}
      </div>

      {/* Periods */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg w-fit ">
        {periods.map((period) => (
          <button
            key={period.id}
            className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${activePeriod === period.name
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => handlePeriodChange(period.name)}
          >
            {period.name}
          </button>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-1">
        {reportCategories
          .find(cat => cat.name === activeCategory)?.types
          .map(type => (
            <div
              className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md min-h-[120px] justify-center text-center md:p-5 md:min-h-[100px]"
              key={type.name}
              onClick={() => handleReportTypeClick(type.path)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-base md:w-8 md:h-8 md:text-sm ${type.icon === 'balance-icon' ? 'bg-gradient-to-br from-indigo-400 to-purple-600' :
                  type.icon === 'income-icon' ? 'bg-gradient-to-br from-pink-400 to-red-400' :
                    type.icon === 'cashflow-icon' ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
                      type.icon === 'investment-icon' ? 'bg-gradient-to-br from-green-400 to-teal-400' :
                        type.icon === 'payroll-icon' ? 'bg-gradient-to-br from-rose-400 to-yellow-400' :
                          'bg-gradient-to-br from-teal-200 to-pink-200'
                }`}>
                {getIconContent(type.icon)}
              </div>
              <div className="flex flex-col gap-1 items-center mt-3">
                <span className="text-base font-semibold text-gray-900 md:text-sm">{type.name}</span>
                <span className="text-xs text-gray-500">{getLastUpdatedText(activePeriod)}</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Risk Assessment Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight md:text-2xl sm:text-xl">
          Risk Assessment - {activePeriod}
        </h1>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl bg-white border border-gray-200 shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${alert.severity === 'high' ? 'border-l-red-500 bg-gradient-to-br from-white to-red-50' :
                  alert.severity === 'medium' ? 'border-l-amber-500 bg-gradient-to-br from-white to-amber-50' :
                    'border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs ${alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-amber-500' :
                      'bg-emerald-500'
                  }`}>
                  {getSeverityIcon(alert.severity)}
                </span>
                <span className="text-lg font-semibold text-gray-900 flex-1">{alert.title}</span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${alert.severity === 'high' ? 'bg-red-100 text-red-600 border-red-200' :
                    alert.severity === 'medium' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                      'bg-emerald-100 text-emerald-600 border-emerald-200'
                  }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{alert.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                <strong className="text-gray-900 font-semibold">Recommendation:</strong> {alert.recommendation}
              </div>
            </div>
          ))
        ) : (
          <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs bg-emerald-500">✓</span>
              <span className="text-lg font-semibold text-gray-900 flex-1">No Major Issues</span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-600 border border-emerald-200">Good</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              No significant risks detected for the {activePeriod.toLowerCase()} period.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
              <strong className="text-gray-900 font-semibold">Recommendation:</strong> Continue monitoring key financial metrics and maintain current operational practices.
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Reports;