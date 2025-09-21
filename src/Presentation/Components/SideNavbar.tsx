import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SideNavbar.css';
import HomeIcon from './icons/HomeIcon';
import InvoiceIcon from './icons/InvoiceIcon';
import LogoutIcon from './icons/LogoutIcon';
import PayrollIcon from './icons/PayrollIcon';
import ReportsIcon from './icons/ReportsIcon';
import SettingsIcon from './icons/SettingsIcon';
import HistoryIcon from './icons/HistoryIcon';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';
import { container } from '../../di/container';

const SideNavbar = () => {
    const navigate = useNavigate();
  const [loginViewModel] = useState<LoginViewModel>(() => container.loginViewModel());
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed (icons only)
  const [isPermanentlyExpanded, setIsPermanentlyExpanded] = useState(false); // Track if user clicked a nav item


 useEffect(() => {
    if (!loginViewModel.isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [loginViewModel.isLoggedIn, navigate]);


   const handleLogout = async () => {
    const success = await loginViewModel.logout();
    if (success) {
      navigate('/login');
    }
  };
  const handleMouseEnter = () => {
    setIsExpanded(true);//expand when mouse enters
  };

  const handleMouseLeave = () => {
    if (!isPermanentlyExpanded) {
      setIsExpanded(false);// only collapsed when not locked
    }
  };

  const handleCloseClick = () => {
    setIsExpanded(false);
    setIsPermanentlyExpanded(false);
  };

  const handleNavClick = () => {
    console.log('Nav clicked - setting permanently expanded'); // Debug log
    setIsExpanded(true);//expanded when hover
    setIsPermanentlyExpanded(true);//stayes expanded when nav is chosen
  };

  return (
    <div 
      className={`side-navbar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="logo-container">
        {isExpanded && (
          <>
            <h2>LOGO</h2>
            {isPermanentlyExpanded && (
              <button 
                className="close-btn" 
                onClick={handleCloseClick}
                aria-label="Collapse sidebar"
              >
                ×
              </button>
            )}
          </>
        )}
        {!isExpanded && (
          <div className="logo-icon">
            L
          </div>
        )}
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink 
            to="/home" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            <HomeIcon />
            {isExpanded && <span className="nav-text">Home</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/management" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            <PayrollIcon />
            {isExpanded && <span className="nav-text">Management</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/invoice" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            <InvoiceIcon />
            {isExpanded && <span className="nav-text">Invoice</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/reports" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            <ReportsIcon />
            {isExpanded && <span className="nav-text">Reports</span>}
          </NavLink>
        </li>
      
        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => isActive ? "active" : ""}
            onClick={handleNavClick}
          >
            <SettingsIcon />
            {isExpanded && <span className="nav-text">Settings</span>}
          </NavLink>
        </li>
      </ul>
      
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">
          <LogoutIcon />
          {isExpanded && <span className="nav-text">Log out</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;