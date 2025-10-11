// src/Presentation/Components/SideNavbarEmployee.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, History, Settings, LogOut } from 'lucide-react';
import { container } from '../../di/container';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';

type SideNavbarEmployeeProps = {
  onExpansionChange?: (isExpanded: boolean) => void;
};

const SideNavbarEmployee: React.FC<SideNavbarEmployeeProps> = ({ onExpansionChange }) => {
  const navigate = useNavigate();
  const [loginViewModel] = useState<LoginViewModel>(() => container.loginViewModel());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPermanentlyExpanded, setIsPermanentlyExpanded] = useState(false);

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
            <h2 className="m-0 text-lg text-black font-bold">LOGO</h2>
            {isPermanentlyExpanded && (
              <button
                className="absolute -top-2 -right-2 bg-black bg-opacity-20 border-none text-black w-6 h-6 rounded-full cursor-pointer text-base flex items-center justify-center transition-colors hover:bg-black hover:bg-opacity-30"
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
        onClick={handleLogout} 
        className={`bg-transparent border-none text-black text-base flex items-center ${isExpanded ? 'gap-3 justify-start' : 'justify-center'} p-3 cursor-pointer w-full rounded-xl transition-colors hover:bg-red-500 focus:outline-none`}
      >
        <LogOut className="w-6 h-6 flex-shrink-0 stroke-gray-700" />
        {isExpanded && <span className="opacity-100 transition-opacity duration-300">Log out</span>}
      </button>
    </div>
  );
};

export default SideNavbarEmployee;