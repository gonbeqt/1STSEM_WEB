// src/Presentation/Components/SideNavbar.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';
import { container } from '../../di/container';
import { Home, Users, FileText, BarChart2, Settings, LogOut } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import LogoutConfirmModal from './LogoutConfirmModal';

type SideNavbarProps = {
  onExpansionChange?: (isExpanded: boolean) => void;
};


const SideNavbarComponent: React.FC<SideNavbarProps> = ({ onExpansionChange }) => {
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
      { to: '/home', label: 'Home', Icon: Home },
      { to: '/management', label: 'Management', Icon: Users },
      { to: '/invoice', label: 'Invoice', Icon: FileText },
      { to: '/reports', label: 'Reports', Icon: BarChart2 },
      { to: '/settings', label: 'Settings', Icon: Settings },
    ],
    []
  );
    const widthClass = isExpanded ? 'lg:w-52' : 'lg:w-16';

  useEffect(() => {
    onExpansionChange?.(isExpanded || isPermanentlyExpanded);
  }, [isExpanded, isPermanentlyExpanded, onExpansionChange]);

  return (
    <div 
          className={`${widthClass} w-0 hidden lg:flex fixed left-0 top-0 h-screen bg-white text-gray-800 p-4 flex-col transition-all duration-300 shadow-sm overflow-hidden z-40`}

      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-center mb-10 relative h-10 flex items-center justify-center">
        {isExpanded && (
          <>
            <h2 className="m-0 text-lg text-gray-900 font-bold">LOGO</h2>
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
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors text-gray-800 hover:bg-gray-300">
            L
          </div>
        )}
      </div>
      
      <ul className="list-none p-0 flex-grow m-0">
        <li className="mb-4 p-0">
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `text-gray-700 no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-100 ${
                isActive ? 'bg-purple-600 font-bold shadow-sm text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <Home className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 ${({ isActive }: { isActive: boolean }) => isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Home</span>}
          </NavLink>
        </li>
        
        <li className="mb-4 p-0">
          <NavLink 
            to="/management" 
            className={({ isActive }) => 
              `text-gray-700 no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-100 ${
                isActive ? 'bg-purple-600 font-bold shadow-sm text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <Users className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 ${({ isActive }: { isActive: boolean }) => isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Management</span>}
          </NavLink>
        </li>
        
        <li className="mb-4 p-0">
          <NavLink 
            to="/invoice" 
            className={({ isActive }) => 
              `text-gray-700 no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-100 ${
                isActive ? 'bg-purple-600 font-bold shadow-sm text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <FileText className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 ${({ isActive }: { isActive: boolean }) => isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Invoice</span>}
          </NavLink>
        </li>
        
        <li className="mb-4 p-0">
          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `text-gray-700 no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-100 ${
                isActive ? 'bg-purple-600 font-bold shadow-sm text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <BarChart2 className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 ${({ isActive }: { isActive: boolean }) => isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Reports</span>}
          </NavLink>
        </li>
      
        <li className="mb-4 p-0">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `text-gray-700 no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-100 ${
                isActive ? 'bg-purple-600 font-bold shadow-sm text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <Settings className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 ${({ isActive }: { isActive: boolean }) => isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Settings</span>}
          </NavLink>
        </li>
      </ul>
      
      <div className="mb-4 p-0">
        <button 
          onClick={handleLogoutClick} 
          className="text-gray-700 no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-red-500 w-full "
        >
          <LogOut className={`w-6 h-6 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 ${({ isActive }: { isActive: boolean }) => isActive ? 'stroke-white' : 'stroke-gray-700'}`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Logout</span>}
        </button>
      </div>

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

export default observer(SideNavbarComponent);