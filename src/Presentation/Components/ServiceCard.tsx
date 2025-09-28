// src/Presentation/Components/ServiceCard.tsx
import React from 'react';

interface ServiceCardProps {
  id: string;
  name: string;
  icon: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, icon, onClick }) => {
  const getIconBg = (id: string) => {
    const iconBgs: Record<string, string> = {
      'electricity': 'bg-blue-100',
      'water': 'bg-sky-100',
      'internet': 'bg-indigo-100',
      'office-rent': 'bg-amber-100',
      'cleaning': 'bg-pink-100',
      'security': 'bg-red-100',
    };
    return iconBgs[id] || 'bg-gray-100';
  };

  return (
    <button 
      className="flex items-center gap-4 bg-gray-800 border-none rounded-xl p-4 w-full text-white text-base text-left cursor-pointer transition-colors hover:bg-gray-700"
      onClick={onClick}
    >
      <span className={`flex items-center justify-center w-10 h-10 rounded-lg text-xl ${getIconBg(id)}`}>
        {icon}
      </span>
      <span className="font-medium">{name}</span>
    </button>
  );
};

export default ServiceCard;
