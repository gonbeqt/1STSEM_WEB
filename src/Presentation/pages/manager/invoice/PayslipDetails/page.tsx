import React, { useState, useEffect } from 'react';
import { X, Download, Printer, Eye, DollarSign, Calendar, User, Building, FileText } from 'lucide-react';
import { Payslip } from '../../../../../domain/entities/PayslipEntities';

interface PayslipDetailsPageProps {
  payslipId: string;
  onClose: () => void;
}

const PayslipDetailsPage: React.FC<PayslipDetailsPageProps> = ({ payslipId, onClose }) => {
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayslipDetails = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch the specific payslip by ID
        // For now, we'll simulate this with a mock or API call
        console.log('Fetching payslip details for ID:', payslipId);
        
        // This would be replaced with actual API call
        // const response = await fetchPayslipById(payslipId);
        // setPayslip(response);
        
        // Mock data for now
        setPayslip({
          payslip_id: payslipId,
          payslip_number: 'PS-2024-001',
          user_id: 'user123',
          employee_id: 'emp123',
          employee_name: 'John Doe',
          employee_email: 'john.doe@company.com',
          employee_wallet: '0x1234567890abcdef',
          department: 'Engineering',
          position: 'Software Developer',
          pay_period_start: '2024-01-01',
          pay_period_end: '2024-01-31',
          pay_date: '2024-02-01',
          base_salary: 5000,
          salary_currency: 'USD',
          overtime_pay: 500,
          bonus: 1000,
          allowances: 200,
          total_earnings: 6700,
          tax_deduction: 1340,
          insurance_deduction: 200,
          retirement_deduction: 300,
          other_deductions: 100,
          total_deductions: 1940,
          final_net_pay: 4760,
          cryptocurrency: 'ETH',
          crypto_amount: 2.5,
          usd_equivalent: 4760,
          status: 'paid',
          notes: 'Monthly salary payment',
          created_at: '2024-01-31T10:00:00Z',
          issued_at: '2024-02-01T09:00:00Z',
          payment_processed: true,
          pdf_generated: true
        });
      } catch (err) {
        setError('Failed to load payslip details');
        console.error('Error fetching payslip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslipDetails();
  }, [payslipId]);

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'generated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-2 text-gray-600">Loading payslip details...</span>
      </div>
    );
  }

  if (error || !payslip) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <FileText size={48} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Payslip</h3>
        <p className="text-gray-600 mb-4">{error || 'Payslip not found'}</p>
        <button
          onClick={onClose}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payslip Details</h2>
          <p className="text-gray-600">Payslip #{payslip.payslip_number}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payslip.status)}`}>
            {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Employee Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Employee Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Employee Name</label>
            <p className="text-gray-900 font-semibold">{payslip.employee_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Employee ID</label>
            <p className="text-gray-900 font-semibold">{payslip.employee_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{payslip.employee_email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Department</label>
            <p className="text-gray-900">{payslip.department}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Position</label>
            <p className="text-gray-900">{payslip.position}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Wallet Address</label>
            <p className="text-gray-900 font-mono text-sm">{payslip.employee_wallet}</p>
          </div>
        </div>
      </div>

      {/* Pay Period Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Pay Period Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Pay Period Start</label>
            <p className="text-gray-900 font-semibold">{formatDate(payslip.pay_period_start)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Pay Period End</label>
            <p className="text-gray-900 font-semibold">{formatDate(payslip.pay_period_end)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Pay Date</label>
            <p className="text-gray-900 font-semibold">{formatDate(payslip.pay_date)}</p>
          </div>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Earnings
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Base Salary</span>
            <span className="font-semibold">{formatCurrency(payslip.base_salary, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Overtime Pay</span>
            <span className="font-semibold">{formatCurrency(payslip.overtime_pay, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Bonus</span>
            <span className="font-semibold">{formatCurrency(payslip.bonus, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Allowances</span>
            <span className="font-semibold">{formatCurrency(payslip.allowances, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
            <span className="text-lg font-semibold text-gray-900">Total Earnings</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(payslip.total_earnings, payslip.salary_currency)}</span>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Tax Deduction</span>
            <span className="font-semibold text-red-600">-{formatCurrency(payslip.tax_deduction, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Insurance Deduction</span>
            <span className="font-semibold text-red-600">-{formatCurrency(payslip.insurance_deduction, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Retirement Deduction</span>
            <span className="font-semibold text-red-600">-{formatCurrency(payslip.retirement_deduction, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Other Deductions</span>
            <span className="font-semibold text-red-600">-{formatCurrency(payslip.other_deductions, payslip.salary_currency)}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-red-50 rounded-lg px-4">
            <span className="text-lg font-semibold text-gray-900">Total Deductions</span>
            <span className="text-lg font-bold text-red-600">-{formatCurrency(payslip.total_deductions, payslip.salary_currency)}</span>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Net Pay</h3>
            <p className="text-sm text-gray-600">Amount to be paid to employee</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-700">{formatCurrency(payslip.final_net_pay, payslip.salary_currency)}</div>
            <div className="text-sm text-gray-600">{payslip.crypto_amount} {payslip.cryptocurrency}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PayslipDetailsPage;
