import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
          <span>MyApp</span>
        </NavLink>
        <ul className="navbar-links">
          <li className="navbar-item">
            <NavLink to="/login" className="navbar-link">Login</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/register" className="navbar-link">Register</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


