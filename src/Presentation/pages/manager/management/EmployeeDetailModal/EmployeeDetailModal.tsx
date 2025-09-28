import React, { useState, useEffect } from 'react';

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
}

type TabType = 'details' | 'payroll' | 'documents';

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  employee,
  payrollData,
  documents,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');

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
    <div className="pt-6">
      <div className="mb-9 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="mb-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Personal Information</h3>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 md:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Email</label>
            <span className="text-[15px] font-medium text-gray-800">{employee.emailAddress || 'Not provided'}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Phone</label>
            <span className="text-[15px] font-medium text-gray-800">{employee.phoneNumber || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="mb-9 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="mb-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Employment Information</h3>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 md:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Basic Salary</label>
            <span className="text-[15px] font-medium text-gray-800">{formatCurrency(employee.baseSalary)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Start Date</label>
            <span className="text-[15px] font-medium text-gray-800">{formatDate(employee.startDate)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Employment Type</label>
            <span className="text-[15px] font-medium text-gray-800">{employee.employmentType}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Payment Schedule</label>
            <span className="text-[15px] font-medium text-gray-800">{employee.paymentSchedule}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Department</label>
            <span className="text-[15px] font-medium text-gray-800">{employee.department}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Employee Status</label>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${employee.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-9 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="mb-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Benefits & Perks</h3>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:grid-cols-1">
          <div className="flex items-center gap-3.5 p-5 bg-white rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="text-2xl">🏥</div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-gray-700">Health Insurance</label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-[10px] bg-green-100 text-green-600">Enrolled</span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-5 bg-white rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="text-2xl">💼</div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-gray-700">Retirement Plan</label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-[10px] bg-green-100 text-green-600">Enrolled</span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-5 bg-white rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="text-2xl">🦷</div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-gray-700">Dental Coverage</label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-[10px] bg-green-100 text-green-600">Enrolled</span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-5 bg-white rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="text-2xl">🏖️</div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-gray-700">Paid Time Off</label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-[10px] bg-blue-100 text-blue-600">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayrollTab = () => (
    <div className="pt-6">
      <div className="mb-9">
        <div className="mb-5 flex justify-between items-center md:flex-col md:items-start md:gap-3">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Current Pay Period</h3>
          <span className="text-[13px] text-gray-500 bg-white px-3 py-1 rounded-xl border border-gray-200">September 2025</span>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white relative overflow-hidden mb-6 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:pointer-events-none">
          <div className="relative z-10">
            <div className="mb-5 pb-5 border-b border-white/20">
              <label className="text-[13px] font-medium text-white/80 uppercase tracking-[0.5px]">Net Pay</label>
              <span className="text-3xl font-bold text-white drop-shadow-md md:text-2xl">{formatCurrency(payrollData.currentPeriod.netPay)}</span>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-white/80 uppercase tracking-[0.5px]">Gross Pay</label>
                <span className="text-base font-bold text-white">{formatCurrency(payrollData.currentPeriod.gross)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-white/80 uppercase tracking-[0.5px]">Total Deductions</label>
                <span className="text-base font-bold text-red-300">{formatCurrency(
                  Object.values(payrollData.currentPeriod.deductions).reduce((a, b) => a + b, 0)
                )}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <label className="text-[13px] font-medium text-white/80 uppercase tracking-[0.5px]">Year to Date</label>
              <span className="text-base font-bold text-white">{formatCurrency(payrollData.currentPeriod.yearToDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-9">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Deduction Breakdown</h3>
        <div className="bg-white rounded-xl p-5 border border-gray-200 mb-6">
          <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <span className="flex items-center gap-2.5 text-[15px] text-gray-700 font-medium"><span className="text-base">🏛️</span>Federal Tax</span>
            <span className="text-[15px] font-semibold text-gray-800">{formatCurrency(payrollData.currentPeriod.deductions.federal)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <span className="flex items-center gap-2.5 text-[15px] text-gray-700 font-medium"><span className="text-base">🏛️</span>State Tax</span>
            <span className="text-[15px] font-semibold text-gray-800">{formatCurrency(payrollData.currentPeriod.deductions.stateTax)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <span className="flex items-center gap-2.5 text-[15px] text-gray-700 font-medium"><span className="text-base">🏥</span>Medicare</span>
            <span className="text-[15px] font-semibold text-gray-800">{formatCurrency(payrollData.currentPeriod.deductions.medicare)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <span className="flex items-center gap-2.5 text-[15px] text-gray-700 font-medium"><span className="text-base">🛡️</span>Social Security</span>
            <span className="text-[15px] font-semibold text-gray-800">{formatCurrency(payrollData.currentPeriod.deductions.socialSecurity)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
            <span className="flex items-center gap-2.5 text-[15px] text-gray-700 font-medium"><span className="text-base">🦷</span>Dental Insurance</span>
            <span className="text-[15px] font-semibold text-gray-800">{formatCurrency(payrollData.currentPeriod.deductions.dental)}</span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap md:flex-col">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-5 py-3 rounded-lg text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
            <span className="text-sm">📥</span>Download Payroll
          </button>
          <button className="bg-white text-indigo-500 border-2 border-indigo-500 px-4.5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center gap-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
            <span className="text-sm">📧</span>Send Payroll
          </button>
        </div>
      </div>

      <div className="mb-9">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Payment History</h3>
        <div className="flex flex-col gap-3">
          {payrollData.paymentHistory.length > 0 ? (
            payrollData.paymentHistory.map((payment, index) => (
              <div key={index} className="flex justify-between items-center p-5 bg-white rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all md:flex-col md:items-start md:gap-4">
                <div className="flex-1">
                  <div className="mb-1">
                    <strong className="block text-[15px] text-gray-800 font-semibold">{formatDate(payment.date)}</strong>
                    <span className="text-[13px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg inline-block">{payment.period}</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="text-xs text-gray-400">Paid: {payment.payDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:self-stretch md:justify-between">
                  <span className="text-base font-bold text-gray-800">{formatCurrency(payment.amount)}</span>
                  <button className="bg-white text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:-translate-y-0.5 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-gray-500">
              <span className="block text-5xl mb-4 opacity-50">📄</span>
              <p className="text-base font-medium text-gray-700 mb-2">No payment history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="pt-6">
      <div className="mb-9">
        <div className="mb-5 flex justify-between items-center md:flex-col md:items-start md:gap-3">
          <h3 className="text-lg font-semibold text-gray-800 m-0">Employee Documents</h3>
          <button className="bg-white text-indigo-500 border-2 border-dashed border-indigo-500 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-50 hover:border-solid hover:-translate-y-0.5 transition-all flex items-center gap-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
            <span className="text-base font-bold">+</span>Upload Document
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all md:flex-col md:items-start md:gap-3">
                <div className="text-2xl flex-shrink-0">
                  {doc.type === 'pdf' ? '📄' : doc.type === 'image' ? '🖼️' : '📎'}
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-semibold text-gray-800 m-0 mb-1.5">{doc.name}</h4>
                  <div className="flex gap-3 items-center">
                    <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-semibold">{doc.type.toUpperCase()}</span>
                    <span className="text-xs text-gray-400">Uploaded: {formatDate(doc.uploadedDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:self-stretch md:justify-between">
                  <span className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.5px] ${doc.status === 'Active' ? 'bg-green-100 text-green-600' : doc.status === 'Expired' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {doc.status}
                  </span>
                  <button className="bg-white text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:-translate-y-0.5 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">View</button>
                  <button className="bg-white text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:-translate-y-0.5 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">Download</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-gray-500">
              <span className="block text-5xl mb-4 opacity-50">📁</span>
              <p className="text-base font-medium text-gray-700 mb-2">No documents uploaded yet</p>
              <span className="text-sm text-gray-400">Upload important employee documents here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-5 animate-modalBackdropFadeIn md:items-start md:pt-5 sm:p-1" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden shadow-2xl animate-modalSlideIn flex flex-col md:max-h-[95vh] sm:rounded-xl">
        <div className="flex flex-row justify-between items-center p-7 pb-0 md:p-5 md:pb-0">
          <button className="bg-transparent border-none text-gray-500 text-[15px] font-medium cursor-pointer py-2.5 px-0 flex items-center gap-2 rounded-lg hover:text-gray-700 hover:bg-gray-50 hover:px-3 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={onClose} aria-label="Close modal">
            <span className="text-lg hover:-translate-x-0.5 transition-transform">←</span>Back
          </button>
          <div className="flex gap-2">
            <button className="bg-transparent border-none p-2.5 rounded-lg text-base cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all hover:-translate-y-0.5 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={onDelete} aria-label="Delete employee">
              <span className="text-base">🗑️</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-7 mx-7 mt-5 rounded-2xl text-white flex items-center gap-6 relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:pointer-events-none md:flex-col md:text-center md:gap-5 md:mx-5 md:p-6 md:mt-4">
          <div className="w-22 h-22 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20 shadow-2xl">
            {employee.profileImage ? (
              <img src={employee.profileImage} alt={`${employee.fullName}'s profile`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-white/25 to-white/15 flex items-center justify-center text-3xl font-bold text-white tracking-wide">
                {employee.fullName.split(' ').map(name => name.charAt(0)).join('').slice(0, 2)}
              </div>
            )}
          </div>
          <div className="flex-1 z-10">
            <h1 className="text-2xl font-bold m-0 mb-1.5 drop-shadow-sm md:text-xl">{employee.fullName}</h1>
            <p className="m-0 mb-3 text-[15px] opacity-90 font-medium">{employee.position} • ID: {employee.employeeId}</p>
            <div className="flex flex-wrap gap-5 mb-4 md:flex-col md:gap-2 md:items-center">
              <span className="text-sm flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-2xl backdrop-blur-sm"><span className="text-base">📧</span>{employee.emailAddress}</span>
              <span className="text-sm flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-2xl backdrop-blur-sm"><span className="text-base">📞</span>{employee.phoneNumber}</span>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-[25px] text-[13px] font-semibold border-2 ${employee.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'} backdrop-blur-sm`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>{employee.status}
            </span>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mx-7 mt-6 gap-1 md:mx-5 md:justify-around">
          <button
            className={`bg-transparent border-none py-3.5 px-4.5 text-[15px] font-medium text-gray-500 border-b-4 border-transparent rounded-t-lg flex items-center gap-2 hover:text-gray-700 hover:bg-gray-50 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 ${activeTab === 'details' ? 'text-indigo-500 border-b-indigo-500 bg-indigo-50/50' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <span className="text-base md:hidden">👤</span>Details
          </button>
          <button
            className={`bg-transparent border-none py-3.5 px-4.5 text-[15px] font-medium text-gray-500 border-b-4 border-transparent rounded-t-lg flex items-center gap-2 hover:text-gray-700 hover:bg-gray-50 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 ${activeTab === 'payroll' ? 'text-indigo-500 border-b-indigo-500 bg-indigo-50/50' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <span className="text-base md:hidden">💰</span>Payroll
          </button>
          <button
            className={`bg-transparent border-none py-3.5 px-4.5 text-[15px] font-medium text-gray-500 border-b-4 border-transparent rounded-t-lg flex items-center gap-2 hover:text-gray-700 hover:bg-gray-50 transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 ${activeTab === 'documents' ? 'text-indigo-500 border-b-indigo-500 bg-indigo-50/50' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span className="text-base md:hidden">📄</span>Documents
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-7 md:px-5 md:pb-5 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'payroll' && renderPayrollTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;