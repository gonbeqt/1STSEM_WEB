import React from 'react';
import HistoryIcon from '../../../Components/icons/HistoryIcon';
import PayrollTabs from '../Tabs/Payroll/PayrollTabs';
import './payroll.css';

interface Employee {
  name: string;
  id: string;
  salary: number;
  paymentDate: string;
}

const Payroll: React.FC = () => {
  const employees: Employee[] = [
    { name: 'Yuno Cruz', id: 'du2u3.cru', salary: 123, paymentDate: 'Monthly' },
    { name: 'Yuno Cruz', id: 'du2u3.cru', salary: 123, paymentDate: 'Monthly' },
    { name: 'Yuno Cruz', id: 'du2u3.cru', salary: 123, paymentDate: '26 August 2025' },
    { name: 'Yuno Cruz', id: 'du2u3.cru', salary: 123, paymentDate: 'Monthly' },
  ];

  return (
    <div className="payroll-container">
      
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <span className="page-title">Payroll</span>
        </div>
        
      </header>
      <section className="history">
        <h2>Payroll</h2>
        <HistoryIcon />
      </section>
      <section className="payroll-summary">
        <div className="payroll-card">
          <div className="payroll-info">
            <span>Total Payroll</span>
            <h3>$12,230</h3>
          </div>
        </div>
        <div className="payroll-card">
          <div className="payroll-info">
            <span>Next Payroll Due</span>
            <h3>20 July 2025</h3>
          </div>
        </div>
      </section>
      <section className="employee-actions">
        <button className="add-employee-btn">+ Add Employee</button>
        <button className="send-payroll-btn">Send Payroll Now</button>
      </section>
      <div className="employees">
        <PayrollTabs />
      </div>
    </div>
  );
};

export default Payroll;
