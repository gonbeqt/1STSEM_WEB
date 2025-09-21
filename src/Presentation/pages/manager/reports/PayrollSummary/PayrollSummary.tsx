// PayrollSummary.tsx - Backend Connected
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import './PayrollSummary.css';
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
  
  // State for payroll data and UI
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

  // Load payroll data on component mount
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
      
      // Check if response is HTML (error page) or JSON
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        throw new Error('Server returned an error page instead of JSON data');
      }

      const data = JSON.parse(responseText);
      
      if (response.ok && data.success && data.payslips) {
        const payslips = data.payslips as PayslipData[];
        
        // Calculate summary data
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

  // Chart data from real payroll data
  const chartData = payrollData ? payrollData.payslips.slice(0, 6).map((payslip, index) => ({
    name: payslip.employee_name.split(' ')[0], // First name only
    salary: payslip.base_salary || 0,
    netPay: payslip.final_net_pay || 0,
    deductions: payslip.total_deductions || 0
  })) : [];

  // Group payslips by department for analysis
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
      return <div className="loading">Loading payroll data...</div>;
    }

    if (error) {
      return (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={clearError}>Retry</button>
        </div>
      );
    }

    if (!payrollData || chartData.length === 0) {
      return <div className="no-data">No payroll data available for chart view</div>;
    }

    return (
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
            <Line type="monotone" dataKey="salary" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="netPay" stroke="#82ca9d" />
            <Line type="monotone" dataKey="deductions" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-summary">
          <div className="summary-box">
            <h4>Payroll Summary</h4>
            <p>Your payroll summary shows employee salary distribution, net pay, and deductions analysis for the current period.</p>
            <div className="btn-container"> 
              <button className="close-btn1" onClick={()=> navigate(-1)}>Close</button>
              <button className="download-btn1">Download Report</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (loading) {
      return <div className="loading">Loading payroll summary...</div>;
    }

    if (error) {
      return (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={clearError}>Retry</button>
        </div>
      );
    }

    if (!payrollData) {
      return <div className="no-data">No payroll data available. Please check if there are any payslips generated.</div>;
    }

    const departmentSummary = getDepartmentSummary();

    return (
      <div className="table-view">
        <div className="export-actions">
          <button className="export-excel">📊 Export To Excel</button>
          <button className="refresh-btn" onClick={handleRefresh}>🔄 Refresh</button>
        </div>

        <div className="payroll-sections">
          {/* Summary Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('summary')}
            >
              <span className={`expand-arrow ${expandedSections.summary ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Payroll Summary</span>
              <span className="section-amount">${formatCurrency(calculateTotalPayroll()).slice(1)}</span>
            </div>
            
            {expandedSections.summary && (
              <div className="section-content">
                <div className="line-item">
                  <span className="item-name">Total Employees</span>
                  <span className="item-amount">{calculateTotalEmployees()}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Average Salary</span>
                  <span className="item-amount">${formatCurrency(calculateAverageSalary()).slice(1)}</span>
                </div>
                <div className="line-item">
                  <span className="item-name">Total Deductions</span>
                  <span className="item-amount">${formatCurrency(calculateTotalDeductions()).slice(1)}</span>
                </div>
                <div className="subsection-total-line">
                  <span>Total Payroll Cost</span>
                  <span>${formatCurrency(calculateTotalPayroll()).slice(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Employees Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('employees')}
            >
              <span className={`expand-arrow ${expandedSections.employees ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Employee Details</span>
              <span className="section-amount">{payrollData.payslips.length} Records</span>
            </div>
            
            {expandedSections.employees && (
              <div className="section-content">
                {payrollData.payslips.slice(0, 10).map((payslip, index) => (
                  <div key={index} className="line-item">
                    <span className="item-name">
                      {payslip.employee_name} ({payslip.employee_id})
                      {payslip.department && <small> - {payslip.department}</small>}
                    </span>
                    <span className="item-amount">${formatCurrency(payslip.final_net_pay || 0).slice(1)}</span>
                  </div>
                ))}
                {payrollData.payslips.length > 10 && (
                  <div className="line-item">
                    <span className="item-name">... and {payrollData.payslips.length - 10} more employees</span>
                    <span className="item-amount"></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Departments Section */}
          <div className="section-group">
            <div 
              className="section-header"
              onClick={() => toggleSection('departments')}
            >
              <span className={`expand-arrow ${expandedSections.departments ? 'expanded' : ''}`}>▼</span>
              <span className="section-title">Department Analysis</span>
              <span className="section-amount">{departmentSummary.length} Departments</span>
            </div>
            
            {expandedSections.departments && (
              <div className="section-content">
                {departmentSummary.map((dept, index) => (
                  <div key={index} className="line-item">
                    <span className="item-name">
                      {dept.name} ({dept.employeeCount} employees)
                      <small> - Avg: ${formatCurrency(dept.avgPay).slice(1)}</small>
                    </span>
                    <span className="item-amount">${formatCurrency(dept.totalPay).slice(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payroll Totals */}
          <div className="totals-section">
            <div className="total-line">
              <span>Total Employees</span>
              <span>{calculateTotalEmployees()} people</span>
            </div>
            <div className="total-line">
              <span>Average Salary</span>
              <span>${formatCurrency(calculateAverageSalary()).slice(1)}</span>
            </div>
            <div className="total-line">
              <span>Total Deductions</span>
              <span>${formatCurrency(calculateTotalDeductions()).slice(1)}</span>
            </div>
            <div className="total-line balance-check">
              <span>Total Payroll Cost</span>
              <span>${formatCurrency(calculateTotalPayroll()).slice(1)}</span>
            </div>
            <div className="balance-status">
              ✓ Payroll summary loaded successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="payroll-summary-container">
      <div className="payroll-summary-header">
        <div className="header-top">
          <button className="back-btn" onClick={()=> navigate(-1)}>← Payroll Summary</button>
        </div>
        <div className="header-content">
          <h1>Payroll Summary</h1>
          <p>View your company's payroll data, employee details, and department analysis</p>
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

      <div className="payroll-summary-content">
        {activeView === 'chart' ? renderChartView() : renderTableView()}
      </div>
    </div>
  );
};

export default PayrollSummary;