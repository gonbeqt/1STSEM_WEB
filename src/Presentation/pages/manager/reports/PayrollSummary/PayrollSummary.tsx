import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    name: payslip.employee_name ? payslip.employee_name.split(' ')[0] : 'Unknown',
    salary: payslip.base_salary || 0,
    netPay: payslip.final_net_pay || 0,
    deductions: payslip.total_deductions || 0,
    fill: '#8884d8'
  })) : [];

  const getDepartmentSummary = () => {
    if (!payrollData) return [];
    
    const deptMap = new Map<string, { count: number; totalPay: number; employees: string[] }>();
    
    payrollData.payslips.forEach(payslip => {
      const dept = payslip.department || 'General';
      const existing = deptMap.get(dept) || { count: 0, totalPay: 0, employees: [] };
      
      existing.count += 1;
      existing.totalPay += payslip.final_net_pay || 0;
      if (payslip.employee_name && !existing.employees.includes(payslip.employee_name)) {
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

  const exportToExcel = () => {
    if (!payrollData) {
      setError('No payroll data to export');
      return;
    }

    try {
      // Prepare data for Excel export
      const excelData = [
        ['PAYROLL SUMMARY'],
        [`As of: ${new Date().toISOString().split('T')[0]}`],
        ['Total Employees', payrollData.totalEmployees],
        ['Total Payroll', payrollData.totalPayroll],
        ['Average Salary', payrollData.averageSalary],
        ['Total Deductions', calculateTotalDeductions()],
        [''],
        ['EMPLOYEE DETAILS', ''],
        ['Employee Name', 'Employee ID', 'Department', 'Base Salary', 'Net Pay', 'Deductions'],
        ...payrollData.payslips.map(payslip => [
          payslip.employee_name || 'Unknown',
          payslip.employee_id,
          payslip.department || 'General',
          payslip.base_salary,
          payslip.final_net_pay,
          payslip.total_deductions
        ])
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // Employee Name
        { wch: 15 }, // Employee ID
        { wch: 15 }, // Department
        { wch: 12 }, // Base Salary
        { wch: 12 }, // Net Pay
        { wch: 12 }  // Deductions
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Payroll Summary');

      // Generate Excel file and save
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fileName = `PayrollSummary_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (err: any) {
      setError(err.message || 'Failed to export to Excel');
      console.error('Excel export error:', err);
    }
  };

  const handleExportExcel = () => {
    try {
      exportToExcel();
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
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

  const renderChartView = () => (
    <div className="chart-view p-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payroll Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="netPay" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-semibold text-gray-900">{payrollData?.totalEmployees || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Payroll</span>
              <span className="font-semibold text-gray-900">{formatCurrency(payrollData?.totalPayroll || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Average Salary</span>
              <span className="font-semibold text-gray-900">{formatCurrency(payrollData?.averageSalary || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-700 font-medium">Total Deductions</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(calculateTotalDeductions())}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-summary bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary</h4>
        {payrollData ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your payroll shows a total cost of <strong>{formatCurrency(payrollData.totalPayroll)}</strong> 
              for <strong>{payrollData.totalEmployees}</strong> employees with an average salary of <strong>{formatCurrency(payrollData.averageSalary)}</strong>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Total deductions amount to <strong>{formatCurrency(calculateTotalDeductions())}</strong> 
              across all employees in the current period.
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
            Loading payroll data...
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
          disabled={loading}
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

      {/* Simple Payroll Summary Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Summary Metrics */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL EMPLOYEES</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{payrollData?.totalEmployees || 0}</td>
            </tr>
            
            <tr className="bg-green-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL PAYROLL</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(payrollData?.totalPayroll || 0)}</td>
            </tr>
            
            <tr className="bg-purple-50">
              <td className="px-6 py-4 font-semibold text-gray-900">AVERAGE SALARY</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(payrollData?.averageSalary || 0)}</td>
            </tr>
            
            <tr className="bg-yellow-50">
              <td className="px-6 py-4 font-semibold text-gray-900">TOTAL DEDUCTIONS</td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotalDeductions())}</td>
            </tr>
            
            {/* Employee Details */}
            {payrollData?.payslips.slice(0, 5).map((payslip, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">
                  {payslip.employee_name || 'Unknown Employee'} ({payslip.employee_id})
                  {payslip.department && <span className="text-xs text-gray-400 ml-2">- {payslip.department}</span>}
                </td>
                <td className="px-6 py-2 text-right text-sm text-gray-900">{formatCurrency(payslip.final_net_pay || 0)}</td>
              </tr>
            ))}
            
            {payrollData && payrollData.payslips.length > 5 && (
              <tr className="bg-gray-50">
                <td className="px-6 py-2 pl-12 text-sm text-gray-600">... and {payrollData.payslips.length - 5} more employees</td>
                <td className="px-6 py-2 text-right text-sm text-gray-900"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-800">
          <span className="text-lg">✓</span>
          <span className="font-medium">Payroll summary loaded successfully</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="payroll-summary-container w-full min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            ← Back to Reports
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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payroll Summary</h1>
        <p className="text-gray-600">
          Daily Report | {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payroll summary...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            Error: {error}
            <button className="ml-4 text-red-800 underline" onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {!loading && !error && (activeView === 'chart' ? renderChartView() : renderTableView())}
      </div>
    </div>
  );
};

export default PayrollSummary;
