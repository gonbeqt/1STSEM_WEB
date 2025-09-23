import React, { useState } from 'react';
import { SearchIcon, ArrowLeft, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import './history.css';
import InputWithIcon from '../../../components/InputWithIcon';
import { usePayslips } from '../../../../presentation/hooks/usePayslips';
import { Payslip } from '../../../../domain/entities/PayslipEntities';
import EmployeePayslip from '../payslip/page'; // Import the payslip detail page

interface SalaryTransactionsProps {
  onBack?: () => void;
}

const EmployeeHistory: React.FC<SalaryTransactionsProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null); // New state for selected payslip

  const { payslips, loading, error } = usePayslips();

  const filteredPayslips = payslips.filter(payslip => {
    const matchesFilter = activeFilter === 'all' || payslip.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      payslip.pay_period_start.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payslip.pay_period_end.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payslip.gross_salary.toString().includes(searchQuery.toLowerCase()) ||
      payslip.net_salary.toString().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'failed':
        return <Clock size={16} />; 
      default:
        return <Clock size={16} />;
    }
  };

  const getFilterCount = (filter: 'all' | 'paid' | 'pending' | 'failed') => {
    if (filter === 'all') return payslips.length;
    return payslips.filter(p => p.status === filter).length;
  };

  const handlePayslipClick = (payslip: Payslip) => {
    setSelectedPayslip(payslip); // Set the selected payslip
  };

  const handleBackToHistory = () => {
    setSelectedPayslip(null); // Clear selected payslip to go back to list
  };

  const getTotalEarnings = () => {
    const paidPayslips = payslips.filter(p => p.status === 'paid');
    const totalEth = paidPayslips.reduce((sum, p) => sum + p.net_salary, 0);
    
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
      <div className="salary-transactions-container">
        <div className="transactions-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Salary History</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="loading-message">Loading payslips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="salary-transactions-container">
        <div className="transactions-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="page-title">Salary History</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="salary-transactions-container">
      {/* Header */}
      <div className="transactions-header">
        {onBack && (
          <button className="back-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="page-title">Salary History</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <TrendingUp size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Net Earnings</div>
            <div className="summary-amount">{totalEarnings.eth} ETH</div>
            <div className="summary-usd">{totalEarnings.usd}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Calendar size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Payslips</div>
            <div className="summary-count">{payslips.length}</div>
            <div className="summary-detail">
              {payslips.filter(p => p.status === 'paid').length} paid
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <InputWithIcon
          icon={<SearchIcon />}
          placeholder="Search by period or amount..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({getFilterCount('all')})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveFilter('paid')}
        >
          Paid ({getFilterCount('paid')})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({getFilterCount('pending')})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'failed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('failed')}
        >
          Failed ({getFilterCount('failed')})
        </button>
      </div>

      {/* Payslips List */}
      <div className="transactions-list">
        {filteredPayslips.map((payslip) => (
          <div 
            key={payslip.id} 
            className="transaction-item"
            onClick={() => handlePayslipClick(payslip)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handlePayslipClick(payslip);
              }
            }}
          >
            <div className="transaction-left">
              <div className="transaction-header">
                <div className="transaction-date">{payslip.pay_period_start} - {payslip.pay_period_end}</div>
                <div className={`transaction-status ${payslip.status}`}>
                  <span className="status-icon">
                    {getStatusIcon(payslip.status)}
                  </span>
                  <span className="status-text">
                    {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="payment-period">
                Employee ID: {payslip.employee_id}
              </div>
              <div className="transaction-hash">
                Created At: {payslip.created_at}
              </div>
            </div>
            <div className="transaction-right">
              <div className="transaction-amount4">{payslip.net_salary} ETH</div>
              <div className="transaction-usd">${(payslip.net_salary * 1900).toFixed(2)} USD</div>
            </div>
          </div>
        ))}
      </div>

      {filteredPayslips.length === 0 && (
        <div className="no-transactions">
          <div className="no-transactions-icon">📄</div>
          <div className="no-transactions-title">No Payslips Found</div>
          <div className="no-transactions-text">
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