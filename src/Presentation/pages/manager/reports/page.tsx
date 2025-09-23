// Reports.tsx
import React, { useState, useEffect } from 'react';
import './reports.css';
import { useNavigate } from 'react-router-dom';

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
    <div className="reports-container">
      <h1 className="sidebar-title">Reports</h1>
      
      {/* Report Categories */}
      <div className="report-categories">
        {reportCategories.map((category) => (
          <div
            key={category.name}
            className={`category ${activeCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.name)}
          >
            <span className="category-label">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Periods */}
      <div className="periods">
        {periods.map((period) => (
          <button
            key={period.id}
            className={`period-btn ${activePeriod === period.name ? 'active' : ''}`}
            onClick={() => handlePeriodChange(period.name)}
          >
            {period.name}
          </button>
        ))}
      </div>

      {/* Report Types */}
      <div className="report-types">
        {reportCategories
          .find(cat => cat.name === activeCategory)?.types
          .map(type => (
            <div 
              className="report-type" 
              key={type.name} 
              onClick={() => handleReportTypeClick(type.path)}
            >
              <div className={`icon ${type.icon}`}>
                {getIconContent(type.icon)}
              </div>
              <div className="report-info">
                <span className="report-name">{type.name}</span>
                <span className="last-updated">{getLastUpdatedText(activePeriod)}</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Risk Assessment Section */}
      <div>
        <h1 className="sidebar-title">Risk Assessment - {activePeriod}</h1>
      </div>
      
      <div className="alerts-section">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert ${alert.severity}`}>
              <div className="alert-header">
                <span className={`alert-icon ${alert.severity}-icon`}>
                  {getSeverityIcon(alert.severity)}
                </span>
                <span className="alert-title">{alert.title}</span>
                <span className={`severity ${alert.severity}`}>{alert.severity}</span>
              </div>
              <p className="alert-description">{alert.description}</p>
              <div className="recommendation">
                <strong>Recommendation:</strong> {alert.recommendation}
              </div>
            </div>
          ))
        ) : (
          <div className="alert low">
            <div className="alert-header">
              <span className="alert-icon low-icon">✓</span>
              <span className="alert-title">No Major Issues</span>
              <span className="severity low">Good</span>
            </div>
            <p className="alert-description">
              No significant risks detected for the {activePeriod.toLowerCase()} period.
            </p>
            <div className="recommendation">
              <strong>Recommendation:</strong> Continue monitoring key financial metrics and maintain current operational practices.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;