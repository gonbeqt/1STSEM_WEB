
// src/Presentation/Components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center py-4 space-x-3 text-gray-900 hover:text-gray-700 transition-colors">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold">MyApp</span>
        </NavLink>
        <ul className="flex items-center space-x-8 ml-auto">
          <li>
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/register" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;