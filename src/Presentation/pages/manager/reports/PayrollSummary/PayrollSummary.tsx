import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PayslipData {
  payslip_id: string;
  payslip_number: string;
  employee_name: string;
  employee_id: string;
  department?: string;
  position?: string;
  base_salary: number;
  total_earnings: number;
  total_deductions: number;
  final_net_pay: number;
  salary_currency: string;
  cryptocurrency?: string;
  status: string;
  created_at: string;
  pay_period_start: string;
  pay_period_end: string;
}

interface PayrollSummaryData {
  totalPayroll: number;
  totalEmployees: number;
  averageSalary: number;
  payslips: PayslipData[];
}

const PayrollSummary: React.FC = () => {
  const navigate = useNavigate();
  
  const [payrollData, setPayrollData] = useState<PayrollSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'chart' | 'table'>('table');
  const [expandedSections, setExpandedSections] = useState<{
    summary: boolean;
    employees: boolean;
    departments: boolean;
  }>({
    summary: true,
    employees: false,
    departments: false,
  });

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/payslips/list/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const responseText = await response.text();
      
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        throw new Error('Server returned an error page instead of JSON data');
      }

      const data = JSON.parse(responseText);
      
      if (response.ok && data.success && data.payslips) {
        const payslips = data.payslips as PayslipData[];
        
        const totalPayroll = payslips.reduce((sum, payslip) => sum + (payslip.final_net_pay || 0), 0);
        const totalEmployees = new Set(payslips.map(p => p.employee_id)).size;
        const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
        
        setPayrollData({
          totalPayroll,
          totalEmployees,
          averageSalary,
          payslips
        });
      } else {
        setError(data.error || 'Failed to load payroll data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payroll data');
      console.error('Payroll data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleRefresh = async () => {
    await loadPayrollData();
  };

  const chartData = payrollData ? payrollData.payslips.slice(0, 6).map((payslip, index) => ({
    name: payslip.employee_name.split(' ')[0],
    salary: payslip.base_salary || 0,
    netPay: payslip.final_net_pay || 0,
    deductions: payslip.total_deductions || 0
  })) : [];

  const getDepartmentSummary = () => {
    if (!payrollData) return [];
    
    const deptMap = new Map<string, { count: number; totalPay: number; employees: string[] }>();
    
    payrollData.payslips.forEach(payslip => {
      const dept = payslip.department || 'General';
      const existing = deptMap.get(dept) || { count: 0, totalPay: 0, employees: [] };
      
      existing.count += 1;
      existing.totalPay += payslip.final_net_pay || 0;
      if (!existing.employees.includes(payslip.employee_name)) {
        existing.employees.push(payslip.employee_name);
      }
      
      deptMap.set(dept, existing);
    });
    
    return Array.from(deptMap.entries()).map(([dept, data]) => ({
      name: dept,
      employeeCount: data.employees.length,
      totalPay: data.totalPay,
      avgPay: data.totalPay / data.employees.length
    }));
  };

  const toggleSection = (section: 'summary' | 'employees' | 'departments') => {
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

  const calculateTotalPayroll = (): number => {
    return payrollData?.totalPayroll || 0;
  };

  const calculateTotalEmployees = (): number => {
    return payrollData?.totalEmployees || 0;
  };

  const calculateAverageSalary = (): number => {
    return payrollData?.averageSalary || 0;
  };

  const calculateTotalDeductions = (): number => {
    return payrollData?.payslips.reduce((total, payslip) => total + (payslip.total_deductions || 0), 0) || 0;
  };

  const renderChartView = () => {
    if (loading) {
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading payroll data...</div>;
    }

    if (error) {
      return (
        <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">
          <p>Error: {error}</p>
          <button className="bg-red-600 text-white border-none py-2 px-4 rounded-md mt-3 cursor-pointer hover:bg-red-700 transition-colors" onClick={clearError}>Retry</button>
        </div>
      );
    }

    if (!payrollData || chartData.length === 0) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No payroll data available for chart view</div>;
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
            <Line type="monotone" dataKey="salary" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="netPay" stroke="#82ca9d" />
            <Line type="monotone" dataKey="deductions" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-summary bg-white rounded-xl p-6 mt-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary</h4>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">Your payroll summary shows employee salary distribution, net pay, and deductions analysis for the current period.</p>
          <div className="btn-container flex gap-3 flex-wrap md:flex-col">
            <button className="close-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all" onClick={() => navigate(-1)}>Close</button>
            <button className="download-btn1 flex-1 min-w-[120px] py-2.5 px-5 rounded-lg text-sm font-medium border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 transition-all">Download Report</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (loading) {
      return <div className="loading text-center py-10 text-gray-600 text-base">Loading payroll summary...</div>;
    }

    if (error) {
      return (
        <div className="error bg-red-50 text-red-600 py-5 px-6 border-l-4 border-red-600 text-center rounded-md mx-6 my-5">
          <p>Error: {error}</p>
          <button className="bg-red-600 text-white border-none py-2 px-4 rounded-md mt-3 cursor-pointer hover:bg-red-700 transition-colors" onClick={clearError}>Retry</button>
        </div>
      );
    }

    if (!payrollData) {
      return <div className="no-data text-center py-10 text-gray-600 text-base">No payroll data available. Please check if there are any payslips generated.</div>;
    }

    const departmentSummary = getDepartmentSummary();

    return (
      <div className="table-view flex flex-col h-full bg-white">
        <div className="export-actions p-4 border-b border-gray-200 bg-white flex justify-end gap-3 md:flex-col">
          <button className="export-excel py-2.5 px-4 bg-emerald-500 text-white border-none rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-600 transition-colors md:w-full md:justify-center">📊 Export To Excel</button>
          <button className="refresh-btn py-2.5 px-4 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-200 hover:border-gray-400 transition-all md:w-full md:justify-center" onClick={handleRefresh}>🔄 Refresh</button>
        </div>

        <div className="payroll-sections flex-1 overflow-y-auto bg-gray-50">
          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('summary')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.summary ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Payroll Summary</span>
              <span className="section-amount text-lg text-gray-900 font-bold">${formatCurrency(calculateTotalPayroll()).slice(1)}</span>
            </div>
            
            {expandedSections.summary && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                <div className="line-item flex justify-between items-start py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Total Employees</span>
                  <span className="item-amount font-semibold text-gray-900 text-right">{calculateTotalEmployees()}</span>
                </div>
                <div className="line-item flex justify-between items-start py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Average Salary</span>
                  <span className="item-amount font-semibold text-gray-900 text-right">${formatCurrency(calculateAverageSalary()).slice(1)}</span>
                </div>
                <div className="line-item flex justify-between items-start py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                  <span className="item-name flex flex-col gap-1 text-gray-700">Total Deductions</span>
                  <span className="item-amount font-semibold text-gray-900 text-right">${formatCurrency(calculateTotalDeductions()).slice(1)}</span>
                </div>
                <div className="subsection-total-line flex justify-between items-center p-4 text-[15px] font-bold text-gray-700 bg-gray-100 border-t border-gray-200">
                  <span>Total Payroll Cost</span>
                  <span>${formatCurrency(calculateTotalPayroll()).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('employees')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections. employees ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Employee Details</span>
              <span className="section-amount text-lg text-gray-900 font-bold">{payrollData.payslips.length} Records</span>
            </div>
            
            {expandedSections.employees && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                {payrollData.payslips.slice(0, 10).map((payslip, index) => (
                  <div key={index} className="line-item flex justify-between items-start py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <span className="item-name flex flex-col gap-1 text-gray-700">
                      {payslip.employee_name} ({payslip.employee_id})
                      {payslip.department && <small className="text-xs text-gray-400 font-normal"> - {payslip.department}</small>}
                    </span>
                    <span className="item-amount font-semibold text-gray-900 text-right">${formatCurrency(payslip.final_net_pay || 0).slice(1)}</span>
                  </div>
                ))}
                {payrollData.payslips.length > 10 && (
                  <div className="line-item flex justify-between items-start py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <span className="item-name flex flex-col gap-1 text-gray-700">... and {payrollData.payslips.length - 10} more employees</span>
                    <span className="item-amount"></span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="section-group bg-white mb-[2px]">
            <div 
              className="section-header flex items-center p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors font-semibold border-b border-gray-100"
              onClick={() => toggleSection('departments')}
            >
              <span className={`expand-arrow mr-4 text-xs text-gray-500 transition-transform w-3 text-center ${expandedSections.departments ? 'rotate-0' : '-rotate-90'}`}>▼</span>
              <span className="section-title flex-1 text-lg text-gray-900">Department Analysis</span>
              <span className="section-amount text-lg text-gray-900 font-bold">{departmentSummary.length} Departments</span>
            </div>
            
            {expandedSections.departments && (
              <div className="section-content bg-gray-50 border-t border-gray-200">
                {departmentSummary.map((dept, index) => (
                  <div key={index} className="line-item flex justify-between items-start py-3 px-6 pl-14 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <span className="item-name flex flex-col gap-1 text-gray-700">
                      {dept.name} ({dept.employeeCount} employees)
                      <small className="text-xs text-gray-400 font-normal"> - Avg: ${formatCurrency(dept.avgPay).slice(1)}</small>
                    </span>
                    <span className="item-amount font-semibold text-gray-900 text-right">${formatCurrency(dept.totalPay).slice(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="totals-section bg-white p-6 border-t-4 border-gray-200 mt-2">
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Total Employees</span>
              <span>{calculateTotalEmployees()} people</span>
            </div>
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Average Salary</span>
              <span>${formatCurrency(calculateAverageSalary()).slice(1)}</span>
            </div>
            <div className="total-line flex justify-between items-center py-3 text-base font-semibold text-gray-900 border-b border-gray-100 last:border-b-0">
              <span>Total Deductions</span>
              <span>${formatCurrency(calculateTotalDeductions()).slice(1)}</span>
            </div>
            <div className="total-line balance-check flex justify-between items-center py-4 mt-4 text-lg font-bold text-gray-900 border-t-2 border-gray-300 border-b-4 border-double border-gray-700">
              <span>Total Payroll Cost</span>
              <span>${formatCurrency(calculateTotalPayroll()).slice(1)}</span>
            </div>
            <div className="balance-status text-center text-emerald-600 text-base font-semibold mt-5 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
              ✓ Payroll summary loaded successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="payroll-summary-container flex flex-col w-full h-screen bg-white font-sans rounded-none border border-gray-200 shadow-md md:rounded-none">
      <div className="payroll-summary-header bg-white p-6 border-b border-gray-200">
        <div className="header-top mb-4">
          <button className="back-btn bg-transparent border-none text-gray-500 text-sm flex items-center gap-2 py-2 px-3 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => navigate(-1)}>← Payroll Summary</button>
        </div>
        <div className="header-content">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight md:text-xl">Payroll Summary</h1>
          <p className="text-base text-gray-500 mb-5 leading-snug">View your company's payroll data, employee details, and department analysis</p>
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

      <div className="payroll-summary-content flex-1 overflow-y-auto bg-gray-50">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default PayrollSummary;
