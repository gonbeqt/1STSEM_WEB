import { ArrowLeft, Download, Eye, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useEmployeePayrollDetails } from '../../../../hooks/useEmployeePayrollDetails';
import { container } from '../../../../../di/container';

interface Employee {
  employee_id: string;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  department: string;
  position: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  // Optional fields for backward compatibility
  id?: string;
  fullName?: string;
  employeeId?: string;
  emailAddress?: string;
  phoneNumber?: string;
  baseSalary?: number;
  paymentSchedule?: string;
  employmentType?: string;
  startDate?: string;
  status?: 'Active' | 'Inactive';
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
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  
  // Fetch detailed payroll information for the employee
  const { 
    payrollDetails, 
    isLoading: payrollLoading, 
    error: payrollError, 
    fetchEmployeePayrollDetails,
    clearPayrollDetails
  } = useEmployeePayrollDetails(container.getEmployeePayrollDetailsUseCase);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fetch payroll details when modal opens
      fetchEmployeePayrollDetails(employee.user_id);
    } else {
      document.body.style.overflow = 'unset';
      // Clear payroll details when modal closes to prevent stale data
      clearPayrollDetails();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, employee.user_id, clearPayrollDetails]); // Use employee.user_id for payroll details

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


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showRemoveConfirmation) {
        setShowRemoveConfirmation(false);
      } else {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, showRemoveConfirmation]);

  const handleRemoveClick = () => {
    setShowRemoveConfirmation(true);
  };

  const handleConfirmRemove = () => {
    setShowRemoveConfirmation(false);
    onRemoveFromTeam();
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
  };

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
            <p className="text-gray-900 font-medium">{employee.email || employee.emailAddress || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
            <p className="text-gray-900 font-medium">{employee.phone || employee.phoneNumber || 'Not provided'}</p>
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
            <p className="text-gray-900 font-semibold text-lg">{formatCurrency(employee.baseSalary || 0)}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</label>
            <p className="text-gray-900 font-medium">{formatDate(employee.startDate || employee.created_at || new Date().toISOString())}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employment Type</label>
            <p className="text-gray-900 font-medium">{employee.position}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Frequency</label>
            <p className="text-gray-900 font-medium">Monthly</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</label>
            <p className="text-gray-900 font-medium">{employee.department}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Status</label>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ml-1 ${
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
    return (
      <div className="space-y-6">
        {/* Payroll API Loading State */}
        {payrollLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-blue-700 font-medium">Loading detailed payroll information...</p>
            </div>
          </div>
        )}

        {/* Payroll API Error State - Only show for actual API/network errors */}
        {payrollError && !payrollLoading && !payrollError.toLowerCase().includes('no data') && !payrollError.toLowerCase().includes('not found') && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <p className="text-red-700 font-medium">Failed to load payroll details</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{payrollError}</p>
          </div>
        )}

        {/* Payroll Details Content */}
        {payrollDetails ? (
          <>
            {/* Summary Cards */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Payroll Summary</h3>
                <span className="text-xs text-white/80 bg-white/20 px-3 py-1 rounded-full font-medium">
                  {payrollDetails.payroll_entries?.length || 0} payslip{(payrollDetails.payroll_entries?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Net Pay</p>
                  </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(payrollDetails.payroll_entries?.reduce((sum, entry) => sum + (entry.amount || 0), 0) || 0)}</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Gross</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(payrollDetails.total_earnings || 0)}</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Deductions</p>
                  </div>
                  <p className="text-2xl font-bold text-red-200">{formatCurrency(payrollDetails.total_deductions || 0)}</p>
                </div>
              </div>
            </div>

            {/* Payroll Entries */}
            {payrollDetails.payroll_entries && Array.isArray(payrollDetails.payroll_entries) && payrollDetails.payroll_entries.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payroll Entries ({payrollDetails.payroll_entries.length})</h3>
                <div className="space-y-3">
                  {payrollDetails.payroll_entries.map((entry, index) => (
                    <div key={entry.entry_id || index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 font-medium">Entry ID</p>
                          <p className="font-semibold text-gray-900 text-xs font-mono">{entry.entry_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Employee</p>
                          <p className="font-semibold text-gray-900">{entry.employee_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Amount</p>
                          <p className="font-semibold text-green-600 text-lg">{formatCurrency(entry.amount || 0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            entry.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                            entry.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            entry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-gray-500 font-medium">Salary Amount</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(entry.salary_amount || 0)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Currency</p>
                          <p className="font-semibold text-gray-900">{entry.salary_currency || 'USD'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Crypto Amount</p>
                          <p className="font-semibold text-purple-600">{entry.amount} {entry.cryptocurrency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Payment Date</p>
                          <p className="font-semibold text-gray-900">{formatDate(entry.payment_date)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-gray-500 font-medium">Start Date</p>
                          <p className="font-semibold text-gray-900">{formatDate(entry.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Created At</p>
                          <p className="font-semibold text-gray-900">{formatDate(entry.created_at)}</p>
                        </div>
                      </div>

                      {entry.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-500 font-medium text-sm">Notes</p>
                          <p className="text-gray-700 text-sm mt-1 bg-gray-100 p-2 rounded-lg">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Payslips Summary */}
            {payrollDetails.recent_payslips && payrollDetails.recent_payslips.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Payslips</h3>
                <div className="space-y-3">
                  {payrollDetails.recent_payslips.map((payslip, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Period</p>
                          <p className="font-semibold text-gray-900">{payslip.period}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(payslip.amount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-semibold text-gray-900">{formatDate(payslip.date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payslip.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            payslip.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payslip.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : !payrollLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No payroll data available</h4>
            <p className="text-gray-500">This employee doesn't have any payroll information yet.</p>
          </div>
        )}
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
              onClick={handleRemoveClick}
            >
              Remove from Team
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 mx-6 mt-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg bg-white/20 flex items-center justify-center text-xl font-bold">
                {employee.profileImage ? (
                  <img src={employee.profileImage} alt={employee.full_name || employee.fullName} className="w-full h-full object-cover" />
                ) : (
                  (employee.full_name || employee.fullName || '').split(' ').map(name => name.charAt(0)).join('').slice(0, 2)
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1 md:text-xl">{employee.full_name || employee.fullName}</h1>
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

      {/* Remove Confirmation Modal */}
      {showRemoveConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Remove Employee from Team</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-semibold text-gray-900">{employee.full_name || employee.fullName}</span> from your team? 
              They will become available for other managers to assign.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Remove from Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default EmployeeDetailModal;