
import React from 'react';
import './settings.css';

const EmployeeSettings = () => {
  return (
    <div className="settings-content">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="menu-icon">☰</span>
          <span className="page-title">Settings</span>
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
        <h2>Your Settings</h2>
        <p>Here are your settings.</p>
      </section>
    </div>
  );
};

export default EmployeeSettings;
