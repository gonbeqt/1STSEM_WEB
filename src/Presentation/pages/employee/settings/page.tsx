// src/Presentation/pages/employee/settings/page.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  image: string;
  email?: string;
}

const EmployeeSettings: React.FC = () => {
  const navigate = useNavigate();

  const user: User = {
    name: "John Doe",
    title: "Financial Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    email: "john.doe@company.com"
  };

  const menuItems: MenuItem[] = [
    { icon: "wallet", title: "Wallet", path: "/wallet" },
    { icon: "document", title: "Compliance", path: "/compliance" },
    { icon: "currency", title: "Currency", value: "ETH/USD", path: "/currency" },
    { icon: "shield", title: "Security", path: "/security" },
    { icon: "session", title: "Session Management", path: "/manager/sessions" },
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
    <div className="flex flex-col w-full min-h-screen bg-gray-50 font-sans p-6 shadow-md box-border gap-6">
      
      {/* User Profile Section */}
      <div className="flex items-center mb-8 p-5 cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl relative backdrop-blur-sm border border-white/10 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" tabIndex={0}>
        <img 
          src={user.image} 
          alt={`${user.name}'s profile`} 
          className="w-16 h-16 rounded-full mr-4 border-3 border-white/40 object-cover transition-all duration-300 shadow-lg shadow-black/20 hover:border-white/80 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/64x64/667eea/ffffff?text=JD';
          }}
        />
        <div className="flex-1 min-w-0 text-white">
          <h2 className="m-0 mb-1 text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{user.name}</h2>
          <span className="text-sm opacity-85 block font-normal whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{user.title}</span>
          {user.email && <span className="text-xs opacity-70 italic block">{user.email}</span>}
        </div>
        <div className="absolute top-5 right-5">
          <div className="w-3 h-3 rounded-full border-2 border-white bg-green-500 shadow-sm shadow-green-500/50 animate-pulse"></div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col" role="navigation">
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-3 px-5 text-black">Main</h3>
          {menuItems.slice(0, 4).map((item, index) => (
            <div 
              key={index} 
              className={`flex items-center p-4 px-5 mb-1 cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl transition-all duration-300 relative overflow-hidden border border-white/10 backdrop-blur-sm hover:from-indigo-500 hover:to-purple-500 hover:translate-x-1 hover:shadow-md hover:shadow-black/10 active:translate-x-0.5 active:bg-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-all before:duration-300 hover:before:w-full ${
                item.path === window.location.pathname ? 'bg-white/20 border-white/30 shadow-lg shadow-black/15 before:w-full before:bg-gradient-to-r before:from-white/10 before:to-transparent' : ''
              }`}
              onClick={() => handleMenuItemClick(item)}
              role="button"
              tabIndex={0}
              style={{
                animationDelay: `${(index + 1) * 0.1}s`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMenuItemClick(item);
                }
              }}
            >
              <i className={`w-6 h-6 mr-4 opacity-90 flex items-center justify-center text-lg transition-all duration-300 flex-shrink-0 text-white hover:opacity-100 hover:scale-110 ${getIconClass(item.icon)}`} aria-hidden="true"></i>
              <span className="flex-1 text-base font-medium tracking-tight min-w-0 whitespace-nowrap overflow-hidden text-ellipsis text-white">{item.title}</span>
              {item.value && (
                <span className="text-xs font-semibold opacity-80 bg-white/20 px-2.5 py-1.5 rounded-xl min-w-max backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/30 hover:opacity-100 hover:scale-105 text-white">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-3 px-5 text-black">Support</h3>
          {menuItems.slice(4).map((item, index) => (
            <div 
              key={index + 4} 
              className={`flex items-center p-4 px-5 mb-1 cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl transition-all duration-300 relative overflow-hidden border border-white/10 backdrop-blur-sm hover:from-indigo-500 hover:to-purple-500 hover:translate-x-1 hover:shadow-md hover:shadow-black/10 active:translate-x-0.5 active:bg-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-all before:duration-300 hover:before:w-full ${
                item.path === window.location.pathname ? 'bg-white/20 border-white/30 shadow-lg shadow-black/15 before:w-full before:bg-gradient-to-r before:from-white/10 before:to-transparent' : ''
              }`}
              onClick={() => handleMenuItemClick(item)}
              role="button"
              tabIndex={0}
              style={{
                animationDelay: `${(index + 5) * 0.1}s`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMenuItemClick(item);
                }
              }}
            >
              <i className={`w-6 h-6 mr-4 opacity-90 flex items-center justify-center text-lg transition-all duration-300 flex-shrink-0 text-white hover:opacity-100 hover:scale-110 ${getIconClass(item.icon)}`} aria-hidden="true"></i>
              <span className="flex-1 text-base font-medium tracking-tight min-w-0 whitespace-nowrap overflow-hidden text-ellipsis text-white">{item.title}</span>
              {item.value && (
                <span className="text-xs font-semibold opacity-80 bg-white/20 px-2.5 py-1.5 rounded-xl min-w-max backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/30 hover:opacity-100 hover:scale-105 text-white">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

// Helper function for icon classes
const getIconClass = (iconType: string) => {
  const iconMap = {
    wallet: "before:content-['💳']",
    document: "before:content-['📄']",
    currency: "before:content-['💱']",
    shield: "before:content-['🛡️']",
    session: "before:content-['💻']",
    help: "before:content-['❓']",
    dashboard: "before:content-['📊']",
    settings: "before:content-['⚙️']",
    logout: "before:content-['🚪']"
  };
  return iconMap[iconType as keyof typeof iconMap] || '';
};

export default EmployeeSettings;