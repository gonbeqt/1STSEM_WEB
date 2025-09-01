import React, { useState } from 'react';
import PayrollTab from '../Tabs/Payroll/PayrollTabs';
import ServicesTab from '../Tabs/Service/ServicesTab';

import './expenses.css';
type TabType = 'payroll' | 'services' | 'investment';

const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('payroll');
  const renderContent = () => {
    switch (activeTab) {
      case 'payroll':
        return <PayrollTab />;
      case 'services':
        return <ServicesTab/>;
      case 'investment':
        return <div className="empty-state">Investment expenses coming soon</div>;
    }
  };
  return (
    <div className="expenses-container">
      <header className="expenses-header">
        <div className="header-left">
          <button className="back-button">Automate Expenses</button>
        </div>
      </header>

      <div className="expenses-tabs">
      
        <button 
          className={`tab-button ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          Payroll
        </button>
        <button 
          className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button 
          className={`tab-button ${activeTab === 'investment' ? 'active' : ''}`}
          onClick={() => setActiveTab('investment')}
        >
          Investment
        </button>
      </div>

      <div className="expenses-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ExpensesPage;