// src/Presentation/Components/SideNavbarEmployee.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, History, Settings, LogOut } from 'lucide-react';
import { container } from '../../di/container';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';
import { observer } from 'mobx-react-lite';
import LogoutConfirmModal from './LogoutConfirmModal';
const CryphoriaLogo = '/assets/cryphoria-logo.png';

type SideNavbarEmployeeProps = {
  onExpansionChange?: (isExpanded: boolean) => void;
};

const SideNavbarEmployeeComponent: React.FC<SideNavbarEmployeeProps> = ({ onExpansionChange }) => {
  const navigate = useNavigate();
  const [loginViewModel] = useState<LoginViewModel>(() => container.loginViewModel());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPermanentlyExpanded, setIsPermanentlyExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!loginViewModel.isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [loginViewModel.isLoggedIn, navigate]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    if (!loginViewModel.isLoggingOut) {
      setShowLogoutModal(false);
    }
  };

  const handleConfirmLogout = async () => {
    const success = await loginViewModel.logout();
    if (success) {
      setShowLogoutModal(false);
      navigate('/login');
    }
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isPermanentlyExpanded) {
      setIsExpanded(false);
    }
  };

  const handleCloseClick = () => {
    setIsExpanded(false);
    setIsPermanentlyExpanded(false);
  };

  const handleNavClick = () => {
    setIsExpanded(true);
    setIsPermanentlyExpanded(true);
  };

  const navItems = useMemo(
    () => [
      { to: '/employee/home', label: 'Home', Icon: Home },
      { to: '/employee/history', label: 'History', Icon: History },
      { to: '/employee/settings', label: 'Settings', Icon: Settings },
    ],
    []
  );

  useEffect(() => {
    onExpansionChange?.(isExpanded || isPermanentlyExpanded);
  }, [isExpanded, isPermanentlyExpanded, onExpansionChange]);

  const widthClass = isExpanded ? 'lg:w-52' : 'lg:w-16';

  return (
    <div
      className={`${widthClass} w-0 hidden lg:flex fixed left-0 top-0 h-screen bg-white text-gray-800 p-4 flex-col transition-all duration-300 shadow-sm overflow-hidden z-40`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-center mb-10 relative h-10 flex items-center justify-center">
        {isExpanded && (
          <>
            <div className="flex items-center gap-2">
              <img
                src={CryphoriaLogo}
                alt="Cryphoria logo"
                className="h-9 w-9 object-contain"
              />
              <span className="text-lg font-bold text-purple-600">Cryphoria</span>
            </div>
            {isPermanentlyExpanded && (
              <button
                className="absolute -top-2 -right-2 bg-gray-200 border-none text-gray-700 w-6 h-6 rounded-full cursor-pointer text-base flex items-center justify-center transition-colors hover:bg-gray-300"
                onClick={handleCloseClick}
                aria-label="Collapse sidebar"
              >
                ×
              </button>
            )}
          </>
        )}
        {!isExpanded && (
          <div className="w-8 h-8 bg-black bg-opacity-20 rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors text-black hover:bg-black hover:bg-opacity-30">
            L
          </div>
        )}
      </div>

      <ul className="list-none p-0 flex-grow m-0 space-y-3">
        {navItems.map(({ to, label, Icon }) => (
          <li key={to} className="p-0">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `text-black no-underline text-base flex items-center ${isExpanded ? 'justify-start gap-3' : 'justify-center'} p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-500 hover:bg-opacity-20 ${
                  isActive ? 'bg-purple-600 bg-opacity-80 font-bold shadow-lg text-white' : ''
                }`
              }
              onClick={handleNavClick}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
                  {isExpanded && <span className="opacity-100 transition-opacity duration-300">{label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleLogoutClick} 
        className={`bg-transparent border-none text-black text-base flex items-center ${isExpanded ? 'gap-3 justify-start' : 'justify-center'} p-3 cursor-pointer w-full rounded-xl transition-colors hover:bg-red-500 focus:outline-none`}
      >
        <LogOut className="w-6 h-6 flex-shrink-0 stroke-gray-700" />
        {isExpanded && <span className="opacity-100 transition-opacity duration-300">Log out</span>}
      </button>

      <LogoutConfirmModal
        open={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isProcessing={loginViewModel.isLoggingOut}
        errorMessage={loginViewModel.logoutError}
      />
    </div>
  );
};

export default observer(SideNavbarEmployeeComponent);