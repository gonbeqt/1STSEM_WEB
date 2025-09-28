import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CashFlowActivity {
  name: string;
  amount: number;
}

interface CashFlowSection {
  cash_receipts: Record<string, number> & { total: number };
  cash_payments: Record<string, number> & { total: number };
  net_cash_flow: number;
}

interface CashFlowData {
  operating_activities: CashFlowSection;
  investing_activities: CashFlowSection;
  financing_activities: CashFlowSection;
  cash_summary: {
    beginning_cash: number;
    ending_cash: number;
    net_change_in_cash: number;
  };
}

const CashFlow: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSections, setExpandedSections] = useState<{
    operating: boolean;
    investing: boolean;
    financing: boolean;
    assets: boolean;
    liabilities: boolean;
    equity: boolean;
  }>({
    operating: true,
    investing: false,
    financing: false,
    assets: false,
    liabilities: false,
    equity: false,
  });
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateCashFlowStatement();
  }, []);

  const generateCashFlowStatement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cash-flow/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cash flow statement');
      }

      if (data.success) {
        setCashFlowData(data.cash_flow_statement);
      } else {
        throw new Error(data.error || 'Failed to generate cash flow statement');
      }
    } catch (err: any) {
      console.error('Cash flow generation error:', err);
      setError(err.message || 'Failed to load cash flow statement');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cash-flow/export-excel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok && data.success && data.excel_data) {
        const byteCharacters = atob(data.excel_data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: data.content_type });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export to Excel:', data.error);
      }
    } catch (error) {
      console.error('Excel export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = cashFlowData ? [
    { 
      name: 'Operating', 
      value: cashFlowData.operating_activities.net_cash_flow
    },
    { 
      name: 'Investing', 
      value: cashFlowData.investing_activities.net_cash_flow
    },
    { 
      name: 'Financing', 
      value: cashFlowData.financing_activities.net_cash_flow
    }
  ] : [];

  const toggleSection = (section: 'operating' | 'investing' | 'financing' | 'assets' | 'liabilities' | 'equity') => {
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

  const renderChartView = () => {
    if (loading) {
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading cash flow data...</div>;
    }

    if (error) {
      return <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">Error: {error}</div>;
    }

    if (!cashFlowData || chartData.length === 0) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No cash flow data available for chart view</div>;
    }

    return (
      <div className="chart-view p-6 h-full overflow-y-auto">
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
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-summary bg-white rounded-xl p-6 mt-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Summary</h4>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">Your cash flow analysis shows operating, investing, and financing activities for the current period.</p>
          <div className="btn-container flex gap-3 flex-wrap md:flex-col">
            <button className="close-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>Close</button>
            <button className="download-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all" onClick={exportToExcel}>Download Report</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (loading) {
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading cash flow statement...</div>;
    }

    if (error) {
      return <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">Error: {error}</div>;
    }

    if (!cashFlowData) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No cash flow data available</div>;
    }

    return (
      <div className="table-view flex flex-col h-full bg-white">
        <div className="export-actions p-4 border-b border-gray-200 bg-white flex justify-end">
          <button className="export-excel py-2.5 px-4 bg-emerald-500 text-white border-none rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors" onClick={exportToExcel}>📊 Export To Excel</button>
        </div>

        <div className="cash-flow-sections flex-1 overflow-y-auto bg-gray-50">
          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('operating')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.operating ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Cash Flows from Operating Activities</span>
              <span className="section-amount text-lg text-gray-900 font-bold">
                {cashFlowData.operating_activities.net_cash_flow >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.operating_activities.net_cash_flow).slice(1)}
              </span>
            </div>
            
            {expandedSections.operating && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="subsection bg-white mb-[1px]">
                  <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                    <span className="subsection-title">Cash Receipts</span>
                    <span className="subsection-total text-gray-900 font-bold">${formatCurrency(cashFlowData.operating_activities.cash_receipts.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.operating_activities.cash_receipts)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                      <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <span className="item-name flex-1 text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="item-amount font-semibold text-gray-900">${formatCurrency(value as number).slice(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="subsection bg-white">
                  <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                    <span className="subsection-title">Cash Payments</span>
                    <span className="subsection-total text-gray-900 font-bold">-${formatCurrency(cashFlowData.operating_activities.cash_payments.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.operating_activities.cash_payments)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                      <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <span className="item-name flex-1 text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="item-amount font-semibold text-gray-900">-${formatCurrency(value as number).slice(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Net Cash from Operating Activities</span>
                  <span>
                    {cashFlowData.operating_activities.net_cash_flow >= 0 ? '' : '-'}
                    ${formatCurrency(cashFlowData.operating_activities.net_cash_flow).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('investing')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.investing ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Cash Flows from Investing Activities</span>
              <span className="section-amount text-lg text-gray-900 font-bold">
                {cashFlowData.investing_activities.net_cash_flow >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.investing_activities.net_cash_flow).slice(1)}
              </span>
            </div>
            
            {expandedSections.investing && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="subsection bg-white mb-[1px]">
                  <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                    <span className="subsection-title">Cash Receipts</span>
                    <span className="subsection-total text-gray-900 font-bold">${formatCurrency(cashFlowData.investing_activities.cash_receipts.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.investing_activities.cash_receipts)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                      <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <span className="item-name flex-1 text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="item-amount font-semibold text-gray-900">${formatCurrency(value as number).slice(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="subsection bg-white">
                  <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                    <span className="subsection-title">Cash Payments</span>
                    <span className="subsection-total text-gray-900 font-bold">-${formatCurrency(cashFlowData.investing_activities.cash_payments.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.investing_activities.cash_payments)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                      <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <span className="item-name flex-1 text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="item-amount font-semibold text-gray-900">-${formatCurrency(value as number).slice(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Net Cash from Investing Activities</span>
                  <span>
                    {cashFlowData.investing_activities.net_cash_flow >= 0 ? '' : '-'}
                    ${formatCurrency(cashFlowData.investing_activities.net_cash_flow).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('financing')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.financing ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Cash Flows from Financing Activities</span>
              <span className="section-amount text-lg text-gray-900 font-bold">
                {cashFlowData.financing_activities.net_cash_flow >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.financing_activities.net_cash_flow).slice(1)}
              </span>
            </div>
            
            {expandedSections.financing && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="subsection bg-white mb-[1px]">
                  <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                    <span className="subsection-title">Cash Receipts</span>
                    <span className="subsection-total text-gray-900 font-bold">${formatCurrency(cashFlowData.financing_activities.cash_receipts.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.financing_activities.cash_receipts)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                      <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <span className="item-name flex-1 text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="item-amount font-semibold text-gray-900">${formatCurrency(value as number).slice(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="subsection bg-white">
                  <div className="subsection-header flex justify-between items-center p-4 bg-gray-50 text-gray-700 font-semibold text-base border-b border-gray-200">
                    <span className="subsection-title">Cash Payments</span>
                    <span className="subsection-total text-gray-900 font-bold">-${formatCurrency(cashFlowData.financing_activities.cash_payments.total).slice(1)}</span>
                  </div>
                  {Object.entries(cashFlowData.financing_activities.cash_payments)
                    .filter(([key]) => key !== 'total')
                    .map(([key, value], index) => (
                      <div key={index} className="line-item flex justify-between items-center py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <span className="item-name flex-1 text-gray-700">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span className="item-amount font-semibold text-gray-900">-${formatCurrency(value as number).slice(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Net Cash from Financing Activities</span>
                  <span>
                    {cashFlowData.financing_activities.net_cash_flow >= 0 ? '' : '-'}
                    ${formatCurrency(cashFlowData.financing_activities.net_cash_flow).slice(1)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="totals-section bg-white p-6 border-t-4 border-gray-200 mt-2">
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Beginning Cash</span>
              <span>${formatCurrency(cashFlowData.cash_summary.beginning_cash).slice(1)}</span>
            </div>
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Net Change in Cash</span>
              <span>
                {cashFlowData.cash_summary.net_change_in_cash >= 0 ? '' : '-'}
                ${formatCurrency(cashFlowData.cash_summary.net_change_in_cash).slice(1)}
              </span>
            </div>
            <div className="total-line balance-check flex justify-between items-center py-4 mt-4 text-lg font-bold text-gray-900 border-t-2 border-gray-300 border-b-4 border-double border-gray-700">
              <span>Ending Cash</span>
              <span>${formatCurrency(cashFlowData.cash_summary.ending_cash).slice(1)}</span>
            </div>
            <div className="balance-status text-center text-emerald-600 text-base font-semibold mt-5 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
              ✓ Cash flow statement generated successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cash-flow-container flex flex-col w-full h-screen bg-white font-sans rounded-none border border-gray-200 shadow-md md:rounded-none">
      <div className="cash-flow-header bg-white p-6 border-b border-gray-200">
        <div className="header-top mb-4">
          <button className="back-btn bg-transparent border-none text-gray-500 text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => navigate(-1)}>← Cash Flow</button>
        </div>
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight md:text-xl">Cash Flow</h1>
          <p className="text-base text-gray-500 mb-5 leading-snug">View your company's cash flows from operating, investing, and financing activities</p>
        </div>
        
        <div className="view-tabs flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit md:w-full">
          <button 
            className={`tab-btn py-2.5 px-5 bg-transparent text-gray-500 text-sm font-medium rounded-md hover:text-gray-700 transition-all ${activeView === 'chart' ? 'bg-white text-gray-900 shadow-sm' : ''} md:flex-1 md:text-center`}
            onClick={() => setActiveView('chart')}
          >
            Chart View
          </button>
          <button 
            className={`tab-btn py-2.5 px-5 bg-transparent text-gray-500 text-sm font-medium rounded-md hover:text-gray-700 transition-all ${activeView === 'table' ? 'bg-white text-gray-900 shadow-sm' : ''} md:flex-1 md:text-center`}
            onClick={() => setActiveView('table')}
          >
            Table View
          </button>
        </div>
        
        <div className="report-period flex justify-between items-center text-sm text-gray-700">
          <span>Daily Report</span>
          <button className="filter-btn bg-transparent border border-gray-300 text-purple-600 text-sm flex items-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-gray-50 hover:border-purple-600 transition-all">🔽 Filter</button>
        </div>
      </div>

      <div className="cash-flow-content flex-1 overflow-y-auto bg-gray-50">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default CashFlow;