import React from 'react';
import ReportIcon from '../../Components/icons/ReportIcon';
import PayrollSendIcon from '../../Components/icons/PayrollSendIcon';
import ContractIcon from '../../Components/icons/ContractIcon';
import Charts from '../../Components/Charts';
import { FaEthereum } from 'react-icons/fa'; 
import './home.css';

const Home = () => {
  return (
    <div className="home-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <span className="page-title">Home</span>
        </div>
        <div className="header-center">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
        <div className="header-right">
          <span className="notification-icon">🔔</span>
          <img src="https://i.pravatar.cc/40?img=3" alt="Profile" className="profile-pic" />
        </div>
      </header>

      <section className="greeting">
        <h2>Hi, Anna</h2>
        <p>How are you today?</p>
      </section>

     
      <section className="wallet-summary">
       <div className="wallet-card">
          <div className="wallet-info">
            <span>Current Wallet</span>
            <h1> <FaEthereum /> 0 ETH</h1>
            <span>Converted to</span>
            <h2>₱12,230</h2>
          </div>
          <div className="wallet-actions">
            <select>
              <option>PHP</option>
              <option>USD</option>
            </select>
            <button className="connect-wallet-btn">Connect Wallet</button>
          </div>
        </div>
        <div className="wallet-buttons">
          <button>
            <ReportIcon />
            <span>Generate Report</span>
          </button>
          <button>
            <PayrollSendIcon />
            <span>Send Payroll</span>
          </button>
          <button>
            <ContractIcon />
            <span>View Contract</span>
          </button>
        </div>
      </section>

         <section className="greeting">
            <h2>Transactions Summary</h2>
            <p>Real-time financial overview</p>
        </section>

      {/* Transactions Summary */}
      <section className="transactions-summary">
        <div className="summary-card">
          <span>  Total Transactions</span>
          <h3>₱12,230</h3>
          <Charts />
          <a href="#!">View full report</a>
          
        </div>
        <div className="summary-card">
            <span> Crypto Inflow</span>
          <h3>₱12,230</h3>
          <Charts />
          <a href="#!">View full report</a>
        </div>
        <div className="summary-card">
      <span> Crypto Outflow</span>
          <h3>₱12,230</h3>
          <Charts />
          <a href="#!">View full report</a>
        </div>
      </section>

      {/* Tax Estimates */}
      <section className="tax-estimates">
        <div className="tax-card">
          <span>Estimated Tax Owed</span>
          <h3>₱12,230 (1%)</h3>
          <span className="tax-month">June 2025</span>
          <div className="tax-details">
            <div className="tax-row">
              <span>Income Tax</span>
              <span>₱12,230</span>
            </div>
            <div className="tax-row">
              <span>Tax Deduction</span>
              <span className="deduction">-₱1,230</span>
            </div>
            <div className="tax-row">
              <span>Net Tax Payable</span>
              <span>₱11,000</span>
            </div>
          </div>
          <a href="#!">View full report</a>
        </div>
      
      </section>

      {/* Invoices */}
      <section className="invoices">
        <h3>Invoices</h3>
        <div className="invoice-list">
          {[1,2,3,4,5].map((i) => (
            <div className="invoice-card" key={i}>
              <span className="invoice-title">Kampico</span>
              <span className="invoice-date">Created 25 June 2025</span>
              <span className="invoice-amount">₱12,950</span>
              <button className="paid-btn">Paid</button>
            </div>
          ))}
        </div>
      </section>
      
      <section className="payroll">
        <h3>Payroll</h3>
        <div className="payroll-list">
          <div className="payroll-card">
            <div className="payroll-left">
              <div className="payroll-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Payroll" />
              </div>
              <div>
                <span className="payroll-amount">₱12,950</span>
                <span className="payroll-employees">Sent to 3 Employees</span>
                <div className="payroll-total">Total Last Month: ₱123,908</div>
              </div>
            </div>
            <div className="payroll-right">
              <span className="payroll-next">Next Payroll on <b>20 July 2025</b></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
