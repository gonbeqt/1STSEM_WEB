import React from 'react';
import { Send, DollarSign, ClipboardList, FileText, TrendingUp } from 'lucide-react';

interface Props {
  onSendPayment: () => void;
  onSendPayroll: () => void;
  onAuditContract: () => void;
  onGenerateReport: () => void;
  onInvestment: () => void;
}

const QuickActions: React.FC<Props> = ({
  onSendPayment,
  onSendPayroll,
  onAuditContract,
  onGenerateReport,
  onInvestment,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <button onClick={onSendPayment} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
            <Send className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 text-center">Send Payment</span>
        </button>

        <button onClick={onSendPayroll} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 text-center">Send Payroll</span>
        </button>

        <button onClick={onAuditContract} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
            <ClipboardList className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 text-center">Audit Contract</span>
        </button>

        <button onClick={onGenerateReport} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 text-center">Generate Report</span>
        </button>

        <button onClick={onInvestment} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 transition-colors duration-200 group hover:border-purple-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 text-center">Invest Smart</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
