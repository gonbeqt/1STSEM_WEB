// src/Presentation/pages/employee/payslip/page.tsx
import React, { useState } from 'react';
import { Download, Copy, Check, ArrowLeft } from 'lucide-react';
import { usePayslips } from '../../../hooks/usePayslips';
import { Payslip } from '../../../../domain/entities/PayslipEntities';

interface PayslipProps {
  onBack?: () => void;
  payslipData?: Payslip;
}

const EmployeePayslip: React.FC<PayslipProps> = ({ onBack, payslipData }) => {
  const { payslips, loading, error } = usePayslips(payslipData ? payslipData.employee_id : undefined);
  const [copied, setCopied] = useState(false);

  const currentPayslip: Payslip | undefined = payslipData || payslips[0]; 
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadPDF = () => {
    // Implement PDF download logic here
    console.log('Downloading PDF...');
    // You would typically generate and download the PDF here
  };



  // If payslipData is provided, we don't need to show loading/error from hook
  if (!payslipData && loading) {
    return (
      <div className="payslip-container">
        <div className="payslip-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Payslip</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="loading-message">Loading payslips...</div>
      </div>
    );
  }

  if (!payslipData && error) {
    return (
      <div className="payslip-container">
        <div className="payslip-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Payslip</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }
 if (!currentPayslip) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-50 text-black font-sans p-6 box-border relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-1 relative z-10 text-black">
          {onBack && (
            <button 
              className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
              onClick={onBack} 
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-3xl font-bold text-black m-0 text-center tracking-tight">Payslip</h1>
          <div className="w-12"></div>
        </div>

        {/* No Payslip Message */}
        <div className="flex justify-center items-center min-h-[60vh] py-10">
          <div className="bg-white border border-gray-200 rounded-3xl p-12 px-8 text-center max-w-md w-full shadow-lg relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500">
            <div className="text-7xl mb-6 opacity-70 drop-shadow-lg">📄</div>
            <h2 className="text-3xl font-bold text-gray-900 m-0 mb-4 tracking-tight">No Payslip Available</h2>
            <p className="text-base text-gray-500 leading-relaxed m-0 mb-6">
              There is currently no payslip available.
            </p>
            <div className="flex items-center gap-3 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-xl p-4 leading-relaxed">
              <div className="text-lg flex-shrink-0">ℹ️</div>
              <span>Your next payslip will be available according to your payment schedule.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 text-black font-sans p-6 box-border relative before:content-[''] before:absolute before:top-0 before:right-0 before:w-75 before:h-75 before:bg-gradient-radial before:from-purple-500/3 before:to-transparent before:rounded-full before:translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-50 after:h-50 after:bg-gradient-radial after:from-blue-500/2 after:to-transparent after:rounded-full after:-translate-x-1/2 after:translate-y-1/2 after:pointer-events-none">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-1 relative z-10 text-black">
        {onBack && (
          <button 
            className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
            onClick={onBack} 
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-3xl font-bold text-black m-0 text-center tracking-tight">Payslip</h1>
        <div className="w-12"></div>
      </div>

      {/* Payslip Content */}
      <div className="flex flex-col gap-6 relative z-10">
        
        {/* Period Card */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-lg shadow-purple-500/30 [animation:slideIn_0.6s_ease-out_0.1s_both]">
          <div className="absolute -top-1/2 -right-1/5 w-50 h-50 bg-gradient-radial from-white/10 to-transparent rounded-full pointer-events-none"></div>
          
          <div className="text-black mb-6 relative z-10">
            <div className="flex justify-between items-center mb-3 gap-4">
              <div className="text-lg font-bold opacity-95 tracking-tight">Employer Name (Placeholder)</div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-2 text-xs font-semibold whitespace-nowrap">
                <div className={`w-2 h-2 rounded-full border border-white/30 ${currentPayslip.status === 'paid' ? 'bg-green-500 shadow-sm shadow-green-500/50 animate-pulse' : 'bg-yellow-500 animate-pulse'}`}></div>
                {currentPayslip.status === 'paid' ? 'Complete' : 'Pending'}
              </div>
            </div>
            <div className="text-sm mb-2 opacity-90 font-medium">Payment Period - {currentPayslip.pay_period_start} - {currentPayslip.pay_period_end}</div>
            <div className="flex flex-col gap-1 text-xs opacity-80 font-mono">
              <span className="font-medium opacity-70">Employee ID:</span>
              <span className="font-semibold">{currentPayslip.employee_id}</span>
            </div>
          </div>
        </div>

        {/* Gross Salary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:-translate-y-0.5 [animation:slideIn_0.6s_ease-out_0.2s_both]">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-xl drop-shadow-sm">💰</div>
            <div className="text-lg font-bold text-gray-900 tracking-tight">Gross Salary</div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{currentPayslip.total_earnings} ETH</div>
            <div className="text-base text-gray-500 font-semibold">${(currentPayslip.total_earnings * 1900).toFixed(2)} USD</div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:-translate-y-0.5 [animation:slideIn_0.6s_ease-out_0.3s_both]">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-xl drop-shadow-sm">📋</div>
            <div className="text-lg font-bold text-gray-900 tracking-tight">Deductions</div>
          </div>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:border-purple-500/20">
              <div className="flex-1">
                <div className="text-sm text-gray-600 font-semibold">Total Deductions</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-red-500 font-bold mb-1">-{currentPayslip.total_deductions} ETH</div>
                <div className="text-xs text-red-500/70 font-medium">-${(currentPayslip.total_deductions * 1900).toFixed(2)} USD</div>
              </div>
            </div>
          </div>
          
          {/* Total Deductions */}
          <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-xl mt-3">
            <div className="text-base text-gray-600 font-bold">Total Deductions</div>
            <div className="text-right">
              <div className="text-base text-red-500 font-extrabold mb-1">-{currentPayslip.total_deductions} ETH</div>
              <div className="text-sm text-red-500/80 font-semibold">-${(currentPayslip.total_deductions * 1900).toFixed(2)} USD</div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="border border-green-500/30 bg-green-50 rounded-2xl p-6 relative overflow-hidden shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:-translate-y-0.5 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-green-500 before:to-green-600 [animation:slideIn_0.6s_ease-out_0.4s_both]">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-xl drop-shadow-sm">💸</div>
            <div className="text-lg font-bold text-gray-900 tracking-tight">Net Salary</div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-extrabold text-green-700 mb-2 tracking-tight">{currentPayslip.final_net_pay} ETH</div>
            <div className="text-base text-gray-500 font-semibold">${(currentPayslip.final_net_pay * 1900).toFixed(2)} USD</div>
          </div>
          <div className="text-sm text-green-800 font-medium mt-3 p-3 bg-green-500/10 rounded-lg">
            This is the amount you will receive after all deductions.
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:-translate-y-0.5 [animation:slideIn_0.6s_ease-out_0.5s_both]">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-xl drop-shadow-sm">🔗</div>
            <div className="text-base text-gray-600 font-bold tracking-tight">Transaction Hash</div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 my-4 gap-3">
            <span className="font-mono text-sm text-gray-600 break-all flex-1 font-medium">N/A</span>
            <button 
              className={`border rounded-lg p-2 cursor-pointer transition-all duration-300 flex items-center justify-center min-w-[40px] h-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                copied 
                  ? 'bg-green-500/10 border-green-500/30 text-green-600' 
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-600 hover:bg-purple-500/20 hover:scale-105'
              }`}
              onClick={() => handleCopy('N/A')}
              aria-label="Copy transaction hash"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="text-xs text-gray-500 italic">
            Click to view transaction details on blockchain explorer
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2 [animation:slideIn_0.6s_ease-out_0.6s_both]">
          <button 
            className="bg-gradient-to-br from-blue-500 to-blue-700 border-none rounded-2xl px-6 py-4 text-white cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 text-base font-bold w-full shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleDownloadPDF}
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayslip;