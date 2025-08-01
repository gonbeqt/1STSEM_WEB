import React from 'react';
import ReportIcon from '../../Components/icons/ReportIcon';
import PayrollSendIcon from '../../Components/icons/PayrollSendIcon';
import ContractIcon from '../../Components/icons/ContractIcon';
import Charts from '../../Components/Charts';
import { FaEthereum } from 'react-icons/fa';
import InvoiceCard from '../../Components/InvoiceCard';
import PayrollCard from '../../Components/PayrollCard';
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
            {/* @ts-ignore */}
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

      <section className="greeting">
        <h2>Tax Estimates</h2>
        <p>Estimated tax liability</p>
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

      <section className="greeting">
        <h2>Invoices</h2>
        <p>Auto-generated invoices from recent transactions</p>
      </section>
      {/* Invoices */}
      <section className="invoices">
        <div className="invoice-list">
          {[
            { company: "Kampico", date: "Created 25 June 2025", amount: "₱12,950", status: "Paid" },
            { company: "ZetaCorp", date: "Created 24 June 2025", amount: "₱11,500", status: "Paid" },
            { company: "BlueWave", date: "Created 23 June 2025", amount: "₱13,200", status: "Paid" },
            { company: "GreenTech", date: "Created 22 June 2025", amount: "₱10,800", status: "Paid" },
            { company: "RedLion", date: "Created 21 June 2025", amount: "₱14,300", status: "Paid" },
          ].map((invoice, index) => (
            <InvoiceCard key={index} {...invoice} />
          ))}
        </div>
      </section>

      <section className="greeting">
        <h2>Payroll</h2>
        <p>Latest processed payroll transactions</p>
      </section>
      {/* Payroll */}
      <section className="payroll">
        <div className="payroll-list">
          {[
            { amount: "$12,950", employees: "Sent to 3 Employees", totalLastMonth: "$123,908", nextPayroll: "20 July 2025" },
            { amount: "$15,200", employees: "Sent to 4 Employees", totalLastMonth: "$145,600", nextPayroll: "25 July 2025" },
            { amount: "$10,800", employees: "Sent to 2 Employees", totalLastMonth: "$98,500", nextPayroll: "30 July 2025" },
          ].map((payroll, index) => (
            <PayrollCard key={index} {...payroll} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
