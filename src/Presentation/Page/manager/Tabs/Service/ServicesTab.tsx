import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../../../../Components/ServiceCard';
import './ServicesTab.css';
import { services } from '../../../../Data/serviceData';

interface Service {
  id: string;
  name: string;
  icon: string;
  category: 'utilities' | 'office';
  defaultAmount: string;
  walletId: string;
  provider: string;
  accountNumber?: string;
}

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
              .filter((service: Service) => service.category === 'utilities')
              .map((service: Service) => (
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
              .filter((service: Service) => service.category === 'office')
              .map((service: Service) => (
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