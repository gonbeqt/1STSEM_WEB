
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SideNavbar.css';
import { Home, Receipt, History, Settings, LogOut } from 'lucide-react';
import { container } from '../../di/container';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';

const SideNavbarEmployee = () => {
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
          <NavLink to="/employee/home" className={({ isActive }) => isActive ? "active" : "" } onClick={handleNavClick}>
          <Home /> {isExpanded && <span className="nav-text">Home</span>}</NavLink></li>
        <li><NavLink to="/employee/payslip" className={({ isActive }) => isActive ? "active" : ""} onClick={handleNavClick}>
        <Receipt /> {isExpanded && <span className="nav-text">Payslip</span>}</NavLink></li>
        <li><NavLink to="/employee/history" className={({ isActive }) => isActive ? "active" : ""} onClick={handleNavClick}><History /> {isExpanded && <span className="nav-text">History</span>}</NavLink></li>
        <li><NavLink to="/employee/settings" className={({ isActive }) => isActive ? "active" : ""} onClick={handleNavClick}><Settings /> {isExpanded && <span className="nav-text">Settings</span>}</NavLink></li>
      </ul>
      <button onClick={handleLogout} className="logout-btn">
          <LogOut />
          {isExpanded && <span className="nav-text">Log out</span>}
        </button>
    </div>
  );
};

export default SideNavbarEmployee;
