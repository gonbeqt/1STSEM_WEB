import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewModel } from '../../../hooks/useViewModel';
import { LoginViewModel } from '../../../../domain/viewmodel/LoginViewModel';
import EmployeeNavbar from '../../../components/EmployeeNavbar';
import Skeleton, { SkeletonCircle, SkeletonText } from '../../../components/Skeleton';

interface MenuItem {
  icon: string;
  title: string;
  value?: string;
  path?: string;
  onClick?: () => void;
}

interface User {
  name: string;
  title: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

const EmployeeSettings: React.FC = () => {
  const navigate = useNavigate();
  const loginViewModel = useViewModel(LoginViewModel);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = loginViewModel.currentUser;
    if (currentUser) {
      const fullName = currentUser.first_name && currentUser.last_name 
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : currentUser.first_name || currentUser.username || 'User';
      
      setUser({
        name: fullName,
        title: currentUser.role || 'Employee',
        email: currentUser.email,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        role: currentUser.role
      });
    }
  }, [loginViewModel]);

  const menuItems: MenuItem[] = [
    { icon: "help", title: "Help & Support", path: "/help" }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.5); }
          100% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.3); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
        .animate-pulse-status { animation: pulse 2s infinite; }
        .sidebar::-webkit-scrollbar { width: 4px; }
        .sidebar::-webkit-scrollbar-track { background: transparent; }
        .sidebar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 2px; }
        .sidebar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
        .icon.session::before { content: "💻"; }
        .icon.help::before { content: "❓"; }
      `}</style>
      <div className="min-h-screen w-full bg-gray-50">
              <EmployeeNavbar />
        <div className="p-6">
        {user ? (
          <div 
            className="user-profile flex items-center mb-8 p-6 rounded-2xl relative bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg transition-all duration-300 hover:shadow-xl "
            tabIndex={0}
          >
            {/* Profile Avatar with First Letter */}
            <div className="w-16 h-16 rounded-full mr-4 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="user-info flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white tracking-tight truncate mb-1">{user.name}</h2>
              <span className="text-sm text-white/90 block font-medium truncate mb-1">{user.title}</span>
              {user.email && <span className="user-email text-xs text-white/80 block truncate">{user.email}</span>}
            </div>
            
            <div className="profile-status absolute top-4 right-4">
              <div className="status-indicator online w-3 h-3 rounded-full border-2 border-white bg-green-500 animate-pulse-status"></div>
            </div>
          </div>
        ) : (
          <div className="user-profile flex items-center mb-8 p-6 rounded-2xl relative bg-white border border-gray-200 shadow-sm">
            <SkeletonCircle className="h-16 w-16 mr-4" />
            <div className="user-info flex-1 min-w-0 space-y-2">
              <SkeletonText className="h-5 w-40" />
              <SkeletonText className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        )}

        <nav className="menu flex-1 flex flex-col" role="navigation">
          <div className="menu-section mb-6">
            <h3 className="menu-section-title text-xs font-bold uppercase tracking-wide text-gray-500 mb-4 px-2">MAIN</h3>
            {menuItems.slice(0, 1).map((item, index) => (
              <div 
                key={index} 
                className={`menu-item flex items-center p-4 mb-2 bg-white rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 focus:outline-none animate-slideInLeft ${item.path === window.location.pathname ? 'bg-purple-50 border-l-4 border-purple-500' : 'shadow-sm'}`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                onClick={() => handleMenuItemClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMenuItemClick(item);
                  }
                }}
              >
                <i className={`icon ${item.icon} w-5 h-5 mr-4 text-gray-600 flex items-center justify-center text-lg transition-all duration-200 flex-shrink-0`} aria-hidden="true"></i>
                <span className="item-title flex-1 text-sm font-medium text-gray-800 tracking-tight truncate">{item.title}</span>
                {item.value && (
                  <span className="item-value text-xs font-medium text-gray-500 bg-gray-100 py-1 px-2 rounded-md">{item.value}</span>
                )}
              </div>
            ))}
          </div>

          
        </nav>
        </div>
      </div>
    </>
  );
};

export default EmployeeSettings;