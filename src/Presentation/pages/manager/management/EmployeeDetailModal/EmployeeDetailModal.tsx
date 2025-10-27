import { ArrowLeft, DollarSign, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usePayslips } from '../../../../hooks/usePayslips';
import Skeleton, { SkeletonText } from '../../../../components/Skeleton';

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

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employee: Employee;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRemoveFromTeam: () => void;
}

type TabType = 'details' | 'payslips';

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  employee,
  onClose,
  onRemoveFromTeam,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  const isActive = Boolean(
    employee?.is_active
    || (employee?.status && String(employee.status).toLowerCase() === 'active')
  );
  const statusLabel = isActive ? 'Active' : (employee?.status ?? 'Inactive');

  const employeePayslipId = employee?.employee_id || employee?.employeeId || '';
  const shouldFetchPayslips = isOpen && Boolean(employeePayslipId);
  const {
    payslips,
    loading: payslipsLoading,
    error: payslipsError
  } = usePayslips(
    { employeeId: employeePayslipId, isManager: true },
    { enabled: shouldFetchPayslips }
  );

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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">Contact Details</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">Work Details</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              isActive
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Benefits & Perks</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">Coverage</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Health Insurance</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Enrolled</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Retirement Plan</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Enrolled</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Dental Coverage</h4>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Enrolled</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2">
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

  const renderPayslipsTab = () => {
    if (!employeePayslipId) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800">
          <h3 className="text-lg font-semibold mb-2">Employee ID required</h3>
          <p className="text-sm">
            Payslips can only be retrieved when an <span className="font-semibold">employee_id</span> is available. Please ensure this employee record includes the correct identifier.
          </p>
        </div>
      );
    }

    const resolveNetPay = (payslip: typeof payslips[number]) => {
      const netValue = payslip.final_net_pay ?? payslip.net_amount ?? payslip.usd_equivalent ?? 0;
      return Number.isFinite(netValue) ? netValue : 0;
    };

    const resolveGross = (payslip: typeof payslips[number]) => {
      const grossValue = payslip.total_earnings ?? payslip.gross_amount ?? payslip.base_salary ?? 0;
      return Number.isFinite(grossValue) ? grossValue : 0;
    };

    const resolveDeductions = (payslip: typeof payslips[number]) => {
      const deductionValue = payslip.total_deductions ?? payslip.total_tax_deducted ?? 0;
      return Number.isFinite(deductionValue) ? deductionValue : 0;
    };

    const totalNetPay = payslips.reduce((sum, payslip) => sum + resolveNetPay(payslip), 0);
    const totalGrossPay = payslips.reduce((sum, payslip) => sum + resolveGross(payslip), 0);
    const totalDeductions = payslips.reduce((sum, payslip) => sum + resolveDeductions(payslip), 0);

    return (
      <div className="space-y-6">
        {payslipsLoading && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonText className="h-5 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <SkeletonText className="h-3 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(2)].map((_, rowIdx) => (
                <div key={rowIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((__, colIdx) => (
                      <div key={colIdx} className="space-y-2">
                        <SkeletonText className="h-3 w-24" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {payslipsError && !payslipsLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <p className="text-red-700 font-medium">Failed to load payslips</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{payslipsError}</p>
          </div>
        )}

        {payslips.length > 0 ? (
          <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold text-white">Payslip Summary</h3>
                <span className="text-xs text-white/80 bg-white/20 px-3 py-1 rounded-full font-medium">
                  {payslips.length} payslip{payslips.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Net Pay</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalNetPay)}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Gross</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalGrossPay)}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-xs uppercase tracking-wider font-medium">Total Deductions</p>
                  </div>
                  <p className="text-2xl font-bold text-red-200">{formatCurrency(totalDeductions)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Payslip History ({payslips.length})</h3>
              <div className="space-y-3">
                {payslips.map((payslip) => (
                  <div
                    key={payslip.payslip_id}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">Payslip #</p>
                        <p className="font-semibold text-gray-900 text-xs font-mono">{payslip.payslip_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Period</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(payslip.pay_period_start)} - {formatDate(payslip.pay_period_end)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Net Pay</p>
                        <p className="font-semibold text-green-600 text-lg">{formatCurrency(resolveNetPay(payslip))}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payslip.status === 'PAID'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : payslip.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {payslip.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-gray-500 font-medium">Gross Pay</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(resolveGross(payslip))}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Deductions</p>
                        <p className="font-semibold text-red-500">{formatCurrency(resolveDeductions(payslip))}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Pay Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(payslip.pay_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Created</p>
                        <p className="font-semibold text-gray-900">{formatDate(payslip.created_at)}</p>
                      </div>
                    </div>

                    {(payslip.cryptocurrency || payslip.crypto_amount) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 font-medium">Crypto Currency</p>
                          <p className="font-semibold text-gray-900">{payslip.cryptocurrency ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Crypto Amount</p>
                          <p className="font-semibold text-gray-900">{payslip.crypto_amount ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">USD Equivalent</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(payslip.usd_equivalent ?? 0)}</p>
                        </div>
                      </div>
                    )}

                    {(payslip.tax_breakdown || payslip.tax_deductions) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-500 font-medium text-sm mb-2">Tax Breakdown</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                          {Object.entries(payslip.tax_breakdown ?? payslip.tax_deductions ?? {}).map(([label, value]) => (
                            <div key={label} className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                              <p className="text-gray-500 uppercase tracking-wide">{label.replace(/_/g, ' ')}</p>
                              <p className="font-semibold text-gray-900">{formatCurrency(Number(value) || 0)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(payslip.notes || payslip.tax_config_source || payslip.pdf_generated_at || payslip.sent_at) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                        {payslip.notes && (
                          <div>
                            <p className="text-gray-500 font-medium">Notes</p>
                            <p className="text-gray-700 bg-gray-100 p-2 rounded-lg mt-1">{payslip.notes}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      
                          {payslip.pdf_generated_at && (
                            <div>
                              <p className="text-gray-500 font-medium">PDF Generated At</p>
                              <p className="font-semibold text-gray-900">{formatDate(payslip.pdf_generated_at)}</p>
                            </div>
                          )}
                          {payslip.sent_at && (
                            <div>
                              <p className="text-gray-500 font-medium">Sent At</p>
                              <p className="font-semibold text-gray-900">{formatDate(payslip.sent_at)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          !payslipsLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No payslips available</h4>
              <p className="text-gray-500">This employee doesn't have any payslip history yet.</p>
            </div>
          )
        )}
      </div>
    );
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 md:items-start md:pt-6" onClick={handleBackdropClick}>
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-6 border-b border-gray-100">
          <button 
            className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200" 
            onClick={onClose}
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button 
              className="px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200 rounded-lg transition-all duration-200 text-sm font-medium w-full sm:w-auto text-center" 
              onClick={handleRemoveClick}
            >
              Remove from Team
            </button>
          </div>
        </div>

        {/* Profile Header (UI revised) */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 mx-4 sm:mx-6 mt-4 rounded-xl sm:rounded-2xl text-white shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
            {/* left: avatar + name + position */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100/10 flex items-center justify-center text-lg sm:text-xl font-bold overflow-hidden">
                {employee.profileImage ? (
                  <img
                    src={employee.profileImage}
                    alt={employee.full_name || employee.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  (employee.full_name || employee.fullName || '')
                    .split(' ')
                    .map(name => name.charAt(0))
                    .join('')
                    .slice(0, 2)
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-1">{employee.full_name || employee.fullName}</h1>
                <p className="text-sm sm:text-base text-white/80 font-medium">{employee.position}</p>
              </div>
            </div>

            {/* right: status pushed to the end of the header */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`${isActive ? 'text-green-600' : 'text-red-600'} text-sm font-semibold`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-200 mx-6 mt-6 gap-2">
          {[
            { key: 'details', label: 'Details', icon: '👤' },
            { key: 'payslips', label: 'Payslips', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium border-b-2 transition-all duration-200 ${
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
  <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'payslips' && renderPayslipsTab()}
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
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleCancelRemove}
                className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 text-sm font-medium text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-all duration-200 text-sm font-medium text-center"
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