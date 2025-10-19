// src/Presentation/Components/SideNavbarEmployee.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, History, User, LogOut, X } from 'lucide-react';
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
      { to: '/employee/settings',  label: 'User Profile', Icon: User },
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
    <div
        className={`mb-10 relative h-10 flex items-center ${
          isExpanded ? 'justify-start' : 'justify-center'
        }`}
      >
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
                onClick={handleCloseClick}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-300"
              >
                <X className="w-4 h-4" aria-hidden />
                <span className="sr-only">Collapse sidebar</span>
              </button>
            )}
          </>
        )}
        {!isExpanded && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-300">
            <img
              src={CryphoriaLogo}
              alt="Cryphoria logo"
              className="h-8 w-8 object-contain"
            />
          </div>
        )}
      </div>

      <ul className="list-none p-0 flex-grow m-0">
             {navItems.map(({ to, label, Icon }) => (
               <li key={to} className="mb-4 p-0">
                 <NavLink
                   to={to}
                   className={({ isActive }) =>
                     `no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-50 ${
                       isExpanded ? 'justify-start' : 'justify-center'
                     } ${
                       isActive
                         ? 'bg-purple-600/10 text-purple-600 font-semibold border border-purple-200'
                         : 'text-gray-700'
                     }`
                   }
                   onClick={handleNavClick}
                 >
                   <Icon className={`w-5 h-5 ${isExpanded ? 'mr-3' : ''}`} />
                   {isExpanded && <span className="opacity-100 transition-opacity duration-300">{label}</span>}
                 </NavLink>
               </li>
             ))}
           </ul>

      <button 
        onClick={handleLogoutClick} 
        className={`bg-transparent border-none text-black text-base flex items-center ${isExpanded ? 'gap-3 justify-start' : 'justify-center'} p-3 cursor-pointer w-full rounded-xl transition-colors hover:bg-red-500/10 focus:outline-none`}
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