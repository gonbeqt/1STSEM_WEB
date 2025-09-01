import React from 'react';
import './ServiceCard.css';

interface ServiceCardProps {
  id: string;
  name: string;
  icon: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, icon, onClick }) => {
  return (
    <button className="service-item" onClick={onClick}>
      <span className={`service-icon ${id}`}>{icon}</span>
      <span className="service-name">{name}</span>
    </button>
  );
};

export default ServiceCard;