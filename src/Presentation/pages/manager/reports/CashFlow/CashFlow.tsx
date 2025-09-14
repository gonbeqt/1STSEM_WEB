// CashFlow.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState } from 'react';
import './CashFlow.css';
import { useNavigate } from 'react-router-dom';

interface CashFlowItem {
  name: string;
  amount: number;
  subItems?: CashFlowItem[];
}

interface CashFlowData {
  assets: {
    current: CashFlowItem[];
    nonCurrent: CashFlowItem[];
  };
  liabilities: CashFlowItem[];
  equity: CashFlowItem[];
}

const CashFlow: React.FC = () => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSections, setExpandedSections] = useState<{
    assets: boolean;
    liabilities: boolean;
    equity: boolean;
  }>({
    assets: true,
    liabilities: false,
    equity: false,
  });

  const chartData = [
    { name: 'Jan', assets: 100000, liabilities: 50000, equity: 50000 },
    { name: 'Feb', assets: 110000, liabilities: 55000, equity: 55000 },
    { name: 'Mar', assets: 120000, liabilities: 60000, equity: 60000 },
    { name: 'Apr', assets: 115000, liabilities: 58000, equity: 57000 },
    { name: 'May', assets: 125000, liabilities: 62000, equity: 63000 },
    { name: 'Jun', assets: 130000, liabilities: 65000, equity: 65000 },
  ];

  const cashflowData: CashFlowData = {
    assets: {
      current: [
        { name: 'Cash', amount: 125000 },
        { name: 'Accounts Receivable', amount: 85000 },
        { name: 'Inventory', amount: 95000 },
        { name: 'Prepaid Expenses', amount: 12000 },
      ],
      nonCurrent: [
        { name: 'Land', amount: 250000 },
        { name: 'Buildings', amount: 450000 },
        { name: 'Equipment', amount: 180000 },
        { name: 'Accumulated Depreciation', amount: -120000 },
      ]
    },
    liabilities: [
      { name: 'Accounts Payable', amount: 45000 },
      { name: 'Short-term Loans', amount: 25000 },
      { name: 'Accrued Expenses', amount: 15000 },
      { name: 'Long-term Debt', amount: 320000 },
    ],
    equity: [
      { name: 'Common Stock', amount: 200000 },
      { name: 'Retained Earnings', amount: 467000 },
    ]
  };

  const toggleSection = (section: 'assets' | 'liabilities' | 'equity') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const calculateCurrentAssets = (): number => {
    return cashflowData.assets.current.reduce((total, item) => total + item.amount, 0);
  };

  const calculateNonCurrentAssets = (): number => {
    return cashflowData.assets.nonCurrent.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalAssets = (): number => {
    return calculateCurrentAssets() + calculateNonCurrentAssets();
  };

  const calculateTotalLiabilities = (): number => {
    return cashflowData.liabilities.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalEquity = (): number => {
    return cashflowData.equity.reduce((total, item) => total + item.amount, 0);
  };

  const renderChartView = () => (
    <div className="chart-view">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="assets" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="liabilities" stroke="#82ca9d" />
          <Line type="monotone" dataKey="equity" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-summary">
        <div className="summary-box">
          <h4>Summary</h4>
          <p>Your financial performance shows a 15% increase in revenue compared to the previous period, with expenses growing by 8% overall.</p>
          <div className="btn-container"> 
        <button className="close-btn1" onClick={()=> navigate(-1)}>Close</button>
          <button className="download-btn1">Download Report</button>
          </div>
         
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="table-view">
      <div className="export-actions">
        <button className="export-excel">📊 Export To Excel</button>
      </div>

      <div className="balance-sections">
        {/* Assets Section */}
        <div className="section-group">
          <div 
            className="section-header"
            onClick={() => toggleSection('assets')}
          >
            <span className={`expand-arrow ${expandedSections.assets ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Assets</span>
            <span className="section-amount">${formatCurrency(calculateTotalAssets()).slice(1)}</span>
          </div>
          
          {expandedSections.assets && (
            <div className="section-content">
              <div className="subsection">
                <div className="subsection-header">
                  <span className="subsection-title">Current Assets</span>
                  <span className="subsection-total">${formatCurrency(calculateCurrentAssets()).slice(1)}</span>
                </div>
                {cashflowData.assets.current.map((item, index) => (
                  <div key={index} className="line-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Current Assets</span>
                  <span>${formatCurrency(calculateCurrentAssets()).slice(1)}</span>
                </div>
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <span className="subsection-title">Non-Current Assets</span>
                  <span className="subsection-total">${formatCurrency(calculateNonCurrentAssets()).slice(1)}</span>
                </div>
                {cashflowData.assets.nonCurrent.map((item, index) => (
                  <div key={index} className="line-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">
                      {item.amount < 0 ? '-' : ''}${formatCurrency(item.amount).slice(1)}
                    </span>
                  </div>
                ))}
                <div className="subsection-total-line">
                  <span>Total Non-Current Assets</span>
                  <span>${formatCurrency(calculateNonCurrentAssets()).slice(1)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liabilities Section */}
        <div className="section-group">
          <div 
            className="section-header"
            onClick={() => toggleSection('liabilities')}
          >
            <span className={`expand-arrow ${expandedSections.liabilities ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Liabilities</span>
            <span className="section-amount">${formatCurrency(calculateTotalLiabilities()).slice(1)}</span>
          </div>
          
          {expandedSections.liabilities && (
            <div className="section-content">
              {cashflowData.liabilities.map((item, index) => (
                <div key={index} className="line-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equity Section */}
        <div className="section-group">
          <div 
            className="section-header"
            onClick={() => toggleSection('equity')}
          >
            <span className={`expand-arrow ${expandedSections.equity ? 'expanded' : ''}`}>▼</span>
            <span className="section-title">Equity</span>
            <span className="section-amount">${formatCurrency(calculateTotalEquity()).slice(1)}</span>
          </div>
          
          {expandedSections.equity && (
            <div className="section-content">
              {cashflowData.equity.map((item, index) => (
                <div key={index} className="line-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-amount">${formatCurrency(item.amount).slice(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="totals-section">
          <div className="total-line">
            <span>Total Assets</span>
            <span>${formatCurrency(calculateTotalAssets()).slice(1)}</span>
          </div>
          <div className="total-line">
            <span>Total Liabilities</span>
            <span>${formatCurrency(calculateTotalLiabilities()).slice(1)}</span>
          </div>
          <div className="total-line">
            <span>Total Equity</span>
            <span>${formatCurrency(calculateTotalEquity()).slice(1)}</span>
          </div>
          <div className="total-line balance-check">
            <span>Liabilities + Equity</span>
            <span>${formatCurrency(calculateTotalLiabilities() + calculateTotalEquity()).slice(1)}</span>
          </div>
          <div className="balance-status">
            ✓ Cash Flow is balanced
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cash-flow-container">
      <div className="cash-flow-header">
        <div className="header-top">
          <button className="back-btn" onClick={()=> navigate(-1)}>← Cash Flow</button>
        </div>
        <div className="header-content">
          <h1>Cash Flow</h1>
          <p>View your company's assets, liabilities, and equity</p>
        </div>
        
        <div className="view-tabs">
          <button 
            className={`tab-btn ${activeView === 'chart' ? 'active' : ''}`}
            onClick={() => setActiveView('chart')}
          >
            Chart View
          </button>
          <button 
            className={`tab-btn ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setActiveView('table')}
          >
            Table View
          </button>
        </div>
        
        <div className="report-period">
          <span>Daily Report</span>
          <button className="filter-btn">🔽 Filter</button>
        </div>
      </div>

      <div className="cash-flow-content">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default CashFlow;