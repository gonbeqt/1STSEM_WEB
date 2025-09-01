import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../../../../Components/ServiceCard';
import './ServicesTab.css';
import { services } from './services';

const ServicesTab = () => {
  return (
    <div className="services-container">
      <div className="services-header">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

      <div className="services-content">
        <section className="services-section">
          <h3 className="section-title">Utilities</h3>
          <div className="services-list">
            {services
              .filter(service => service.category === 'utilities')
              .map(service => (
                <Link to={`/manager/service/${service.id}`} key={service.id}>
                  <ServiceCard {...service} />
                </Link>
              ))}
          </div>
        </section>

        <section className="services-section">
          <h3 className="section-title">Office Services</h3>
          <div className="services-list">
            {services
              .filter(service => service.category === 'office')
              .map(service => (
                <Link to={`/manager/service/${service.id}`} key={service.id}>
                  <ServiceCard {...service} />
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesTab;