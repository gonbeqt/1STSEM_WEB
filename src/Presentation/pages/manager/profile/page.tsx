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

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const user: User = {
    name: "John Doe",
    title: "Financial Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    email: "john.doe@company.com"
  };

  const menuItems: MenuItem[] = [
    { icon: "document", title: "Compliance", path: "/compliance" },
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
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
          100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
        .animate-pulse-status { animation: pulse 2s infinite; }
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
        .sidebar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }
        .sidebar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
        .icon.wallet::before { content: "💳"; }
        .icon.document::before { content: "📄"; }
        .icon.currency::before { content: "💱"; }
        .icon.shield::before { content: "🛡️"; }
        .icon.session::before { content: "💻"; }
        .icon.help::before { content: "❓"; }
        .icon.dashboard::before { content: "📊"; }
        .icon.settings::before { content: "⚙️"; }
        .icon.logout::before { content: "🚪"; }
      `}</style>
      <div className="sidebar flex flex-col w-full min-h-screen bg-gray-100 font-sans p-6 gap-6 xl:p-5 md:p-4  sm:w-full sm:min-h-fit sm:max-h-screen">
        <div 
          className="user-profile flex items-center mb-8 p-5 rounded-[20px] relative backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus:outline focus:outline-2 focus:outline-white/50 focus:outline-offset-2"
          tabIndex={0}
        >
          <img 
            src={user.image} 
            alt={`${user.name}'s profile`} 
            className="profile-image w-16 h-16 rounded-full mr-4 border-4 border-white/40 object-cover transition-all duration-300 shadow-md hover:border-white/80 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/64x64/667eea/ffffff?text=JD';
            }}
          />
          <div className="user-info flex-1 min-w-full">
            <h2 className="text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis mb-1">{user.name}</h2>
            <span className="text-sm opacity-85 block font-normal whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{user.title}</span>
            {user.email && <span className="user-email text-xs opacity-70 italic block whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</span>}
          </div>
          <div className="profile-status absolute top-5 right-5">
            <div className="status-indicator online w-[15px] h-[15px] rounded-full border-2 border-white bg-emerald-500 animate-pulse-status shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>

        <nav className="menu flex-1 flex flex-col" role="navigation">
          <div className="menu-section mb-6">
            <h3 className="menu-section-title text-xs font-bold uppercase tracking-wide opacity-70 mb-3 px-5">Main</h3>
            {menuItems.slice(0, 2).map((item, index) => (
              <div 
                key={index} 
                className={`menu-item flex items-center p-4 mb-1 bg-white border border-gray-200 rounded-[16px] cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:translate-x-1 hover:shadow-md focus:outline focus:outline-2 focus:outline-white/50 focus:outline-offset-2 animate-slideInLeft ${item.path === window.location.pathname ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : ''}`}
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
                <i className={`icon ${item.icon} w-6 h-6 mr-4 opacity-90 flex items-center justify-center text-lg transition-all duration-300 flex-shrink-0 hover:opacity-100 hover:scale-110`} aria-hidden="true"></i>
                <span className="item-title flex-1 text-base font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                {item.value && (
                  <span className="item-value text-xs font-semibold opacity-80 bg-white/20 py-1.5 px-2.5 rounded-[12px] min-w-max backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/30 hover:opacity-100 hover:scale-105">{item.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="menu-section mb-6">
            <h3 className="menu-section-title text-xs font-bold uppercase tracking-wide opacity-70 mb-3 px-5">Support</h3>
           {menuItems.slice(2).map((item, index) => (
              <div 
                key={index + 2} 
                className={`menu-item flex items-center p-4 mb-1 bg-white border border-gray-200 rounded-[16px] cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:translate-x-1 hover:shadow-md focus:outline focus:outline-2 focus:outline-white/50 focus:outline-offset-2 animate-slideInLeft ${item.path === window.location.pathname ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : ''}`}
                style={{ animationDelay: `${0.1 * (index + 5)}s` }}
                onClick={() => handleMenuItemClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMenuItemClick(item);
                  }
                }}
              >
                <i className={`icon ${item.icon} w-6 h-6 mr-4 opacity-90 flex items-center justify-center text-lg transition-all duration-300 flex-shrink-0 hover:opacity-100 hover:scale-110`} aria-hidden="true"></i>
                <span className="item-title flex-1 text-base font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                {item.value && (
                  <span className="item-value text-xs font-semibold opacity-80 bg-white/20 py-1.5 px-2.5 rounded-[12px] min-w-max backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/30 hover:opacity-100 hover:scale-105">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Profile; 