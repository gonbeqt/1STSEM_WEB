
import React from 'react';
import './home.css';

const EmployeeHome = () => {
  return (
    <div className="home-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <span className="page-title">Employee Home</span>
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
        <h2>Hi, Employee</h2>
        <p>How are you today?</p>
      </section>
    </div>
  );
};

export default EmployeeHome;
