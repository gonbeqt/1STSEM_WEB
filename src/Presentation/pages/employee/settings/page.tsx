import React from 'react';
import './settings.css';
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

  // User data - could come from props or context
  const user: User = {
    name: "John Doe",
    title: "Financial Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Placeholder image
    email: "john.doe@company.com"
  };

  const menuItems: MenuItem[] = [
    { 
      icon: "wallet", 
      title: "Wallet",
      path: "/wallet"
    },
    { 
      icon: "document", 
      title: "Compliance",
      path: "/compliance"
    },
    { 
      icon: "currency", 
      title: "Currency", 
      value: "ETH/USD",
      path: "/currency"
    },
    { 
      icon: "shield", 
      title: "Security",
      path: "/security"
    },
    { 
      icon: "session", 
      title: "Session Management", 
      path: "/manager/sessions"
    },
    { 
      icon: "help", 
      title: "Help & Support",
      path: "/help"
    }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

 
  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="user-profile" tabIndex={0}>
        <img 
          src={user.image} 
          alt={`${user.name}'s profile`} 
          className="profile-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/64x64/667eea/ffffff?text=JD';
          }}
        />
        <div className="user-info">
          <h2>{user.name}</h2>
          <span>{user.title}</span>
          {user.email && <span className="user-email">{user.email}</span>}
        </div>
        <div className="profile-status">
          <div className="status-indicator online"></div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="menu" role="navigation">
        <div className="menu-section">
          <h3 className="menu-section-title">Main</h3>
          {menuItems.slice(0, 4).map((item, index) => (
            <div 
              key={index} 
              className={`menu-item ${item.path === window.location.pathname ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMenuItemClick(item);
                }
              }}
            >
              <i className={`icon ${item.icon}`} aria-hidden="true"></i>
              <span className="item-title">{item.title}</span>
              {item.value && <span className="item-value">{item.value}</span>}
            </div>
          ))}
        </div>

        <div className="menu-section">
          <h3 className="menu-section-title">Support</h3>
          {menuItems.slice(4).map((item, index) => (
            <div 
              key={index + 4} 
              className={`menu-item ${item.path === window.location.pathname ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMenuItemClick(item);
                }
              }}
            >
              <i className={`icon ${item.icon}`} aria-hidden="true"></i>
              <span className="item-title">{item.title}</span>
              {item.value && <span className="item-value">{item.value}</span>}
            </div>
          ))}
        </div>
      </nav>

    </div>
  );
};

export default EmployeeSettings;