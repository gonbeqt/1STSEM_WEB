// src/Presentation/pages/employee/history/page.tsx
import React, { useState } from 'react';
import { SearchIcon, ArrowLeft, Calendar, TrendingUp, Clock, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import InputWithIcon from '../../../components/InputWithIcon';
import { usePayslips } from '../../../../presentation/hooks/usePayslips';
import { Payslip } from '../../../../domain/entities/PayslipEntities';
import EmployeePayslip from '../payslip/page';

interface SalaryTransactionsProps {
  onBack?: () => void;
}

const EmployeeHistory: React.FC<SalaryTransactionsProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Get current user ID from localStorage or context
  const currentUserId = localStorage.getItem('userId') || 'current-user';
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { payslips, loading, error, refreshPayslips } = usePayslips(currentUserId, refreshTrigger);

  // Function to refresh payslips
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredPayslips = payslips.filter(payslip => {
    // Handle both uppercase and lowercase status values
    const normalizedPayslipStatus = payslip.status.toLowerCase();
    const normalizedFilter = activeFilter.toLowerCase();
    const matchesFilter = activeFilter === 'all' || normalizedPayslipStatus === normalizedFilter;
    
    const matchesSearch = searchQuery === '' ||
      payslip.pay_period_start.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payslip.pay_period_end.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payslip.total_earnings.toString().includes(searchQuery.toLowerCase()) ||
      payslip.final_net_pay.toString().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'paid':
        return <CheckCircle size={16} />;
      case 'pending':
      case 'generated':
        return <Clock size={16} />;
      case 'failed':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getFilterCount = (filter: 'all' | 'paid' | 'pending' | 'failed') => {
    if (filter === 'all') return payslips.length;
    return payslips.filter(p => p.status.toLowerCase() === filter.toLowerCase()).length;
  };

  const handlePayslipClick = (payslip: Payslip) => {
    setSelectedPayslip(payslip); // Set the selected payslip
  };

  const handleBackToHistory = () => {
    setSelectedPayslip(null); // Clear selected payslip to go back to list
  };

  const getTotalEarnings = () => {
    const paidPayslips = payslips.filter(p => p.status.toLowerCase() === 'paid');
    const totalEth = paidPayslips.reduce((sum, p) => sum + p.final_net_pay, 0);
    
    // Assuming 1 ETH = 1900 USD for conversion
    const totalUsd = totalEth * 1900;

    return {
      eth: totalEth.toFixed(3),
      usd: totalUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    };
  };

  const totalEarnings = getTotalEarnings();

  if (selectedPayslip) {
    return <EmployeePayslip payslipData={selectedPayslip} onBack={handleBackToHistory} />;
  }

  if (loading) {
    return (
      <div className="w-full mx-auto h-full bg-gray-50 text-gray-800 font-sans p-6 box-border rounded-xl animate-[slideIn_0.3s_ease-out] relative overflow-y-auto">
        <div className="flex items-center justify-between mb-8 relative z-10">
          {onBack && (
            <button 
              className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
              onClick={onBack} 
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-center tracking-tight">Salary History</h1>
          <div className="w-12"></div>
        </div>
        <div className="text-gray-600">Loading payslips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto h-full bg-gray-50 text-gray-800 font-sans p-6 box-border rounded-xl animate-[slideIn_0.3s_ease-out] relative overflow-y-auto">
        <div className="flex items-center justify-between mb-8 relative z-10">
          {onBack && (
            <button 
              className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
              onClick={onBack} 
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-center tracking-tight">Salary History</h1>
          <button 
            className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
            onClick={handleRefresh}
            aria-label="Refresh payslips"
          >
            <RefreshCw size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
          <div className="text-6xl mb-5 opacity-60">⚠️</div>
          <div className="text-xl font-bold text-gray-600 mb-2">Failed to Load Payslips</div>
          <div className="text-base text-gray-500 bg-white border border-gray-200 rounded-2xl p-6 max-w-md leading-relaxed shadow-md mb-4">
            {error}
          </div>
          <button 
            className="bg-gradient-to-br from-purple-500 to-blue-500 text-white border-none px-6 py-3 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-blue-600 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline focus:outline-2 focus:outline-purple-500 focus:outline-offset-2"
            onClick={handleRefresh}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-full bg-gray-50 text-gray-800 font-sans p-6 box-border rounded-xl animate-[slideIn_0.3s_ease-out] relative overflow-y-auto before:content-[''] before:absolute before:top-0 before:right-0 before:w-50 before:h-50 before:bg-gradient-radial before:from-purple-500/3 before:to-transparent before:rounded-full before:translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-40 after:h-40 after:bg-gradient-radial after:from-blue-500/2 after:to-transparent after:rounded-full after:-translate-x-1/2 after:translate-y-1/2 after:pointer-events-none">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        {onBack && (
          <button 
            className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
            onClick={onBack} 
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-900 m-0 text-center tracking-tight">Salary History</h1>
        <button 
          className="bg-white border border-gray-200 text-gray-600 cursor-pointer p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
          onClick={handleRefresh}
          aria-label="Refresh payslips"
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 shadow-md transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:border-purple-500/30 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 font-medium mb-1">Total Net Earnings</div>
            <div className="text-2xl font-extrabold text-gray-900 mb-0.5 tracking-tight">{totalEarnings.eth} ETH</div>
            <div className="text-sm text-gray-500 font-medium">{totalEarnings.usd}</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 shadow-md transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:border-purple-500/30 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 font-medium mb-1">Total Payslips</div>
            <div className="text-3xl font-extrabold text-gray-900 mb-0.5 tracking-tight">{payslips.length}</div>
            <div className="text-sm text-gray-500 font-medium">
              {payslips.filter(p => p.status === 'paid').length} paid
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative z-10">
        <InputWithIcon
          icon={<SearchIcon />}
          placeholder="Search by period or amount..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'paid', label: 'Paid' },
          { key: 'pending', label: 'Pending' },
          { key: 'failed', label: 'Failed' }
        ].map((filter) => (
          <button
            key={filter.key}
            className={`border rounded-3xl px-5 py-3 text-sm font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              activeFilter === filter.key
                ? 'bg-gradient-to-br from-purple-500 to-blue-500 border-transparent text-white shadow-lg shadow-purple-500/30'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 hover:-translate-y-0.5'
            }`}
            onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
          >
            {filter.label} ({getFilterCount(filter.key as typeof activeFilter)})
          </button>
        ))}
      </div>

      {/* Payslips List */}
      <div className="flex flex-col gap-4 relative z-10">
        {filteredPayslips.map((payslip, index) => (
          <div 
            key={payslip.payslip_id} 
            className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-start transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden hover:bg-gray-50 hover:border-purple-500/30 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0 before:bg-gradient-to-br before:from-purple-500 before:to-blue-500 before:transition-all before:duration-300 hover:before:w-1"
            onClick={() => handlePayslipClick(payslip)}
            role="button"
            tabIndex={0}
            style={{
              animationDelay: `${(index + 1) * 0.05 + 0.1}s`
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handlePayslipClick(payslip);
              }
            }}
          >
            <div className="flex-1 relative z-20">
              <div className="flex items-center justify-between mb-3 gap-4">
                <div className="text-lg font-bold text-gray-900 tracking-tight">{payslip.pay_period_start} - {payslip.pay_period_end}</div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap ${
                  payslip.status.toLowerCase() === 'paid' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : payslip.status.toLowerCase() === 'generated'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  <span className="flex items-center">
                    {getStatusIcon(payslip.status)}
                  </span>
                  <span className="uppercase tracking-wider">
                    {payslip.status.toLowerCase().charAt(0).toUpperCase() + payslip.status.toLowerCase().slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 font-medium mb-1">
                Employee ID: {payslip.employee_id}
              </div>
              <div className="text-xs text-gray-400 font-mono font-medium">
                Created At: {payslip.created_at}
              </div>
            </div>
            <div className="text-right relative z-20 flex-shrink-0 ml-6">
              <div className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">{payslip.final_net_pay} ETH</div>
              <div className="text-sm text-gray-500 font-semibold">${(payslip.final_net_pay * 1900).toFixed(2)} USD</div>
            </div>
          </div>
        ))}
      </div>

      {filteredPayslips.length === 0 && (
        <div className="flex flex-col justify-center items-center py-20 px-5 text-center">
          <div className="text-6xl mb-5 opacity-60">📄</div>
          <div className="text-xl font-bold text-gray-600 mb-2">No Payslips Found</div>
          <div className="text-base text-gray-500 bg-white border border-gray-200 rounded-2xl p-6 max-w-md leading-relaxed shadow-md">
            {searchQuery 
              ? `No payslips match your search for "${searchQuery}"`
              : `No ${activeFilter === 'all' ? '' : activeFilter} payslips available`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHistory;