import React, { useState } from 'react';
import './register.css';

const Register = () => {
  const [userType, setUserType] = useState<'manager' | 'employee'>('manager');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
  };

  return (
    <div className="register-container">
      <h1>Create Account</h1>
      <p className="register-subtitle">Sign up and simplify crypto bookkeeping and invoicing.</p>

      <div className="user-type-toggle">
        <button
          className={`type-btn ${userType === 'manager' ? 'active' : ''}`}
          onClick={() => setUserType('manager')}
        >
          <span className="icon">👤</span>
          Manager
        </button>
        <button
          className={`type-btn ${userType === 'employee' ? 'active' : ''}`}
          onClick={() => setUserType('employee')}
        >
          <span className="icon">👥</span>
          Employee
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
          />
          <label htmlFor="terms">
            I agree to the <a href="/terms">Terms and Conditions</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </label>
        </div>

        <button type="submit" className="sign-up-btn">
          Sign Up
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Register;