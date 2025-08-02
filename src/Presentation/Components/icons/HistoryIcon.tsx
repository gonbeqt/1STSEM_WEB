import React from 'react';

const HistoryIcon: React.FC = () => {
  return (
    <div className="history-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="white"/>
        <rect x="4" y="4" width="16" height="16" rx="8" fill="#1E1E1E"/>
        <rect x="20" y="0" width="4" height="24" fill="#0078D4"/>
      </svg>
    </div>
  );
};

export default HistoryIcon;