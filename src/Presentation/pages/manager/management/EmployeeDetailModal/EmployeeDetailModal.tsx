import { ArrowLeft, Download, Eye, Calendar, DollarSign } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usePayslips } from '../../../../hooks/usePayslips';

interface Employee {
  id: string;
  fullName: string;
  position: string;
  employeeId: string;
  emailAddress: string;
  phoneNumber: string;
  department: string;
  baseSalary: number;
  paymentSchedule: string;
  employmentType: string;
  startDate: string;
  status: 'Active' | 'Inactive';
  profileImage?: string;
}

interface PayrollData {
  currentPeriod: {
    gross: number;
    netPay: number;
    yearToDate: number;
    deductions: {
      federal: number;
      stateTax: number;
      medicare: number;
      socialSecurity: number;
      dental: number;
    };
  };
  paymentHistory: Array<{
    date: string;
    amount: number; 
    period: string;
    payDate: string;
  }>;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employee: Employee;
  payrollData: PayrollData;
  documents: Document[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRemoveFromTeam: () => void;
}

type TabType = 'details' | 'payroll';

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  employee,
  payrollData,
  documents,
  onClose,
  onEdit,
  onDelete,
  onRemoveFromTeam,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  
  // Fetch payslips for the employee
  const { payslips, loading: payslipsLoading, error: payslipsError } = usePayslips(employee.id);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'Invalid Date') {
      return 'Not provided';
    }
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Not provided';
    }
  };

  const formatPayPeriod = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleViewPayslip = (payslipId: string) => {
    console.log('Viewing payslip:', payslipId);
    // TODO: Implement payslip viewing functionality
  };

  const handleDownloadPayslip = (payslipId: string) => {
    console.log('Downloading payslip:', payslipId);
    // TODO: Implement payslip download functionality
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

 const renderDetailsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">Contact Details</span>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
            <p className="text-gray-900 font-medium">{employee.emailAddress || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
            <p className="text-gray-900 font-medium">{employee.phoneNumber || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">Work Details</span>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Salary</label>
            <p className="text-gray-900 font-semibold text-lg">{formatCurrency(employee.baseSalary)}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</label>
            <p className="text-gray-900 font-medium">{formatDate(employee.startDate)}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employment Type</label>
            <p className="text-gray-900 font-medium">{employee.employmentType}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Schedule</label>
            <p className="text-gray-900 font-medium">{employee.paymentSchedule}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</label>
            <p className="text-gray-900 font-medium">{employee.department}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Status</label>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              employee.status === 'Active' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${employee.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Benefits & Perks</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">Coverage</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏥</div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Health Insurance</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Enrolled</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💼</div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Retirement Plan</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Enrolled</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🦷</div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Dental Coverage</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Enrolled</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏖️</div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Paid Time Off</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayrollTab = () => {
    // Calculate summary data from payslips
    const totalGross = payslips.reduce((sum, payslip) => sum + payslip.gross_salary, 0);
    const totalNet = payslips.reduce((sum, payslip) => sum + payslip.net_salary, 0);
    const totalDeductions = payslips.reduce((sum, payslip) => sum + payslip.deductions, 0);
    const latestPayslip = payslips.length > 0 ? payslips[0] : null;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Payroll Summary</h3>
            <span className="text-xs text-white/80 bg-white/20 px-3 py-1 rounded-full font-medium">
              {payslips.length} payslip{payslips.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-white/80" />
                <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Net Pay</p>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalNet)}</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-white/80" />
                <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Gross</p>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalGross)}</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-white/80" />
                <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Deductions</p>
              </div>
              <p className="text-2xl font-bold text-red-200">{formatCurrency(totalDeductions)}</p>
            </div>
          </div>

          {latestPayslip && (
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-white/80" />
                <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Latest Pay Period</p>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatPayPeriod(latestPayslip.pay_period_start, latestPayslip.pay_period_end)}
              </p>
            </div>
          )}
        </div>

        {/* Payslips List */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payslips</h3>
            {payslipsLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {payslipsError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">Error loading payslips</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{payslipsError}</p>
            </div>
          )}

          {payslipsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : payslips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No payslips found</h4>
              <p className="text-gray-500">This employee doesn't have any payslips yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payslips.map((payslip) => (
                <div key={payslip.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center md:flex-col md:items-start md:gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {formatPayPeriod(payslip.pay_period_start, payslip.pay_period_end)}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payslip.status)}`}>
                          {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Gross Salary</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(payslip.gross_salary)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Net Salary</p>
                          <p className="font-semibold text-green-600">{formatCurrency(payslip.net_salary)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Deductions</p>
                          <p className="font-semibold text-red-600">{formatCurrency(payslip.deductions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created</p>
                          <p className="font-semibold text-gray-900">{formatDate(payslip.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewPayslip(payslip.id)}
                        className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button 
                        onClick={() => handleDownloadPayslip(payslip.id)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 md:items-start md:pt-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <button 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200" 
            onClick={onClose}
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button 
              className="px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200 rounded-lg transition-all duration-200 text-sm font-medium" 
              onClick={onRemoveFromTeam}
            >
              Remove from Team
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200" 
              onClick={onDelete}
            >
              <span className="text-xl">🗑️</span>
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 mx-6 mt-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg bg-white/20 flex items-center justify-center text-xl font-bold">
                {employee.profileImage ? (
                  <img src={employee.profileImage} alt={employee.fullName} className="w-full h-full object-cover" />
                ) : (
                  employee.fullName.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1 md:text-xl">{employee.fullName}</h1>
                <p className="text-white/80 font-medium">{employee.position}</p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold">{employee.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mx-6 mt-6">
          {[
            { key: 'details', label: 'Details', icon: '👤' },
            { key: 'payroll', label: 'Payroll', icon: '💰' },
          
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'text-indigo-600 border-indigo-500 bg-indigo-50/50' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              <span className="md:hidden">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'payroll' && renderPayrollTab()}
        </div>
      </div>
    </div>
  );

};

export default EmployeeDetailModal;