// src/Presentation/Components/SideNavbar.tsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';
import { container } from '../../di/container';
import { Home, Users, FileText, BarChart2, Settings, LogOut } from 'lucide-react';

const SideNavbar = () => {
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

  return (
    <div 
      className={`${isExpanded ? 'w-52' : 'w-16'} h-screen bg-white bg-opacity-10 text-white p-4 m-1 flex flex-col sticky top-2 rounded-xl border border-white border-opacity-30 backdrop-blur-lg transition-all duration-300 shadow-lg overflow-hidden`}
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
      
      <ul className="list-none p-0 flex-grow m-0">
        <li className="mb-4 p-0">
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `text-black no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-500 hover:bg-opacity-20 hover:translate-x-1 ${
                isActive ? 'bg-purple-600 bg-opacity-80 font-bold shadow-lg text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <Home className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 stroke-black`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Home</span>}
          </NavLink>
        </li>
        
        <li className="mb-4 p-0">
          <NavLink 
            to="/management" 
            className={({ isActive }) => 
              `text-black no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-500 hover:bg-opacity-20 hover:translate-x-1 ${
                isActive ? 'bg-purple-600 bg-opacity-80 font-bold shadow-lg text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <Users className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 stroke-black`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Management</span>}
          </NavLink>
        </li>
        
        <li className="mb-4 p-0">
          <NavLink 
            to="/invoice" 
            className={({ isActive }) => 
              `text-black no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-500 hover:bg-opacity-20 hover:translate-x-1 ${
                isActive ? 'bg-purple-600 bg-opacity-80 font-bold shadow-lg text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <FileText className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 stroke-black`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Invoice</span>}
          </NavLink>
        </li>
        
        <li className="mb-4 p-0">
          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `text-black no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-500 hover:bg-opacity-20 hover:translate-x-1 ${
                isActive ? 'bg-purple-600 bg-opacity-80 font-bold shadow-lg text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <BarChart2 className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 stroke-black`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Reports</span>}
          </NavLink>
        </li>
      
        <li className="mb-4 p-0">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `text-black no-underline text-base flex items-center p-2 rounded-lg transition-all duration-300 relative overflow-hidden whitespace-nowrap hover:bg-purple-500 hover:bg-opacity-20 hover:translate-x-1 ${
                isActive ? 'bg-purple-600 bg-opacity-80 font-bold shadow-lg text-white' : ''
              } ${!isExpanded ? 'justify-center' : ''}`
            }
            onClick={handleNavClick}
          >
            <Settings className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0 stroke-black`} />
            {isExpanded && <span className="opacity-100 transition-opacity duration-300">Settings</span>}
          </NavLink>
        </li>
      </ul>
      
      <div className="bg-white bg-opacity-10 mt-auto pt-2">
        <button 
          onClick={handleLogout} 
          className="bg-transparent border-none text-black text-base flex items-center p-3 cursor-pointer w-full rounded-xl transition-colors hover:bg-red-500 focus:outline-none"
        >
          <LogOut className={`w-6 h-6 ${isExpanded ? 'mr-3' : 'mr-0'} flex-shrink-0`} />
          {isExpanded && <span className="opacity-100 transition-opacity duration-300">Log out</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;