
import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNavbar.css';
import HomeIcon from './icons/HomeIcon';
import InvoiceIcon from './icons/InvoiceIcon';
import LogoutIcon from './icons/LogoutIcon';
import PayrollIcon from './icons/PayrollIcon';
import SettingsIcon from './icons/SettingsIcon';

const SideNavbarEmployee = () => {
  return (
    <div className="side-navbar">
      <div className="logo-container">
        {/* Add logo here */}
        <h2>LOGO</h2>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/employee/home" className={({ isActive }) => isActive ? "active" : ""}><HomeIcon />Home</NavLink></li>
        <li><NavLink to="/employee/payslip" className={({ isActive }) => isActive ? "active" : ""}><PayrollIcon />Payslip</NavLink></li>
        <li><NavLink to="/employee/invoice" className={({ isActive }) => isActive ? "active" : ""}><InvoiceIcon />Invoice</NavLink></li>
        <li><NavLink to="/employee/settings" className={({ isActive }) => isActive ? "active" : ""}><SettingsIcon />Settings</NavLink></li>
      </ul>
      <div className="logout-container">
        <NavLink to="/login"><LogoutIcon/>Log out</NavLink>
      </div>
    </div>
  );
};

export default SideNavbarEmployee;
