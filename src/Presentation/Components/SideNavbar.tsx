
import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNavbar.css';
import HomeIcon from './icons/HomeIcon';
import InvoiceIcon from './icons/InvoiceIcon';
import LogoutIcon from './icons/LogoutIcon';
import PayrollIcon from './icons/PayrollIcon';
import ReportsIcon from './icons/ReportsIcon';
import SettingsIcon from './icons/SettingsIcon';
import SupportIcon from './icons/SupportIcon';

const SideNavbar = () => {
  return (
    <div className="side-navbar">
      <div className="logo-container">
        {/* Add logo here */}
        <h2>LOGO</h2>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}><HomeIcon />Home</NavLink></li>
        <li><NavLink to="/payroll" className={({ isActive }) => isActive ? "active" : ""}><PayrollIcon />Payroll</NavLink></li>
        <li><NavLink to="/invoice" className={({ isActive }) => isActive ? "active" : ""}><InvoiceIcon />Invoice</NavLink></li>
        <li><NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}><ReportsIcon />Reports</NavLink></li>
        <li><NavLink to="/support" className={({ isActive }) => isActive ? "active" : ""}><SupportIcon />Support</NavLink></li>
        <li><NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}><SettingsIcon />Settings</NavLink></li>
      </ul>
      <div className="logout-container">
        <NavLink to="/login"><LogoutIcon/>Log out</NavLink>
      </div>
    </div>
  );
};

export default SideNavbar;
