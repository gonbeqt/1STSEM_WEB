import React from 'react';
import { useParams } from 'react-router-dom';
import { services } from './services';

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const service = services.find(s => s.id === id);

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div>
      <h2>{service.name}</h2>
      <p>Category: {service.category}</p>
      <p>Icon: {service.icon}</p>
    </div>
  );
};

export default ServiceDetails;