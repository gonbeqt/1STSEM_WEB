
// src/Presentation/pages/manager/home/Modal/Payroll/PayrollModal.tsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  amount: number;
  status: string;
  selected: boolean;
}

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (data: any) => void;
}

const PayrollModal: React.FC<PayrollModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [payrollType, setPayrollType] = useState<string>('Regular Payroll');
  const [payPeriodStart, setPayPeriodStart] = useState<string>('2025-08-07');
  const [payPeriodEnd, setPayPeriodEnd] = useState<string>('2025-08-07');
  const [payDate, setPayDate] = useState<string>('2025-08-07');
  
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      amount: 3350.00,
      status: 'Ready (AutoPay ON 7/29)',
      selected: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      amount: 2800.00,
      status: 'Calculated (PY12345, 8-30)',
      selected: true
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      amount: 2450.00,
      status: 'Payroll Submitted',
      selected: true
    },
    {
      id: '4',
      name: 'David Kim',
      amount: 2250.00,
      status: 'Tax Calculated',
      selected: false
    }
  ]);

  const toggleEmployee = (id: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, selected: !emp.selected } : emp
      )
    );
  };

  const getTotalAmount = (): number => {
    return employees
      .filter(emp => emp.selected)
      .reduce((sum, emp) => sum + emp.amount, 0);
  };

  const handleProcess = () => {
    const selectedEmployees = employees.filter(emp => emp.selected);
    onProcess({
      payrollType,
      payPeriodStart,
      payPeriodEnd,
      payDate,
      employees: selectedEmployees,
      total: getTotalAmount()
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-5 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 m-0">Process Payroll</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4 leading-normal">
            Process automated batch payments for your employees with calculated deductions and taxes.
          </p>

          {/* Payroll Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payroll Type
            </label>
            <select
              value={payrollType}
              onChange={(e) => setPayrollType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
            >
              <option>Regular Payroll</option>
              <option>Bonus Payroll</option>
              <option>Special Payroll</option>
            </select>
          </div>

          {/* Pay Period */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Period Start
              </label>
              <input
                type="date"
                value={payPeriodStart}
                onChange={(e) => setPayPeriodStart(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Period End
              </label>
              <input
                type="date"
                value={payPeriodEnd}
                onChange={(e) => setPayPeriodEnd(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
              />
            </div>
          </div>

          {/* Pay Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Date
            </label>
            <input
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm transition-all focus:outline-none focus:border-blue-600 focus:shadow-sm"
            />
          </div>

          {/* Employees */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Employees to be paid
              </label>
              <span className="text-xs text-gray-600">
                {employees.filter(emp => emp.selected).length} selected
              </span>
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-1">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-md mb-3 last:mb-0 transition-colors hover:border-gray-300">
                  <input
                    type="checkbox"
                    checked={employee.selected}
                    onChange={() => toggleEmployee(employee.id)}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900 m-0 mb-1">{employee.name}</p>
                        <p className="text-xs text-gray-600 m-0">{employee.status}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-4">
                        ₱{employee.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ₱{getTotalAmount().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Notices */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-2 p-3 bg-blue-50 rounded-md">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-900 m-0 mb-1">Payroll Payment Notice</p>
                <p className="text-xs text-blue-900 m-0 leading-normal">
                  This will initiate payment processing for selected employees. Ensure addresses,
                  bank information, and tax data are up-to-date before processing.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 p-3 bg-yellow-50 rounded-md">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-yellow-900 m-0 mb-1">Important Notice</p>
                <p className="text-xs text-yellow-900 m-0 leading-normal">
                  Review employee information, communication preferences, and
                  personal data before final submission. Errors or corrections should be resolved before
                  submitting to Payroll Service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 p-2 rounded-md text-sm font-medium cursor-pointer transition-all border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={employees.filter(emp => emp.selected).length === 0}
            className="flex-1 p-2 rounded-md text-sm font-medium cursor-pointer transition-all text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
          >
            Process Payroll
          </button>
        </div>

      </div>
    </div>
  );
};

export default PayrollModal;