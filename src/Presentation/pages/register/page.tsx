import React, { useState } from 'react';
import './register.css';
import InputWithIcon from '../../components/InputWithIcon';
import EmailIcon from '../../components/icons/EmailIcon';
import PasswordIcon from '../../components/icons/PasswordIcon';
import { useNavigate } from 'react-router-dom';
import { RegisterViewModel } from '../../../domain/models/RegisterViewModel';
import { useViewModel } from '../../hooks/useViewModel';
import { observer } from 'mobx-react-lite';


const Register = observer(() => {
  const navigate = useNavigate();
  const viewModel = useViewModel(RegisterViewModel);
  const { formData } = viewModel;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await viewModel.register();
    if (success) {
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' }
      });
    }
  };

  return (
    <div className="register-container-wrapper">
      <div className="register-container">
        <h1>Create Account</h1>
        <p className="register-subtitle">Sign up and simplify crypto bookkeeping and invoicing.</p>

        {formData.error && <div className="error-message">{formData.error}</div>}

        <div className="user-type-toggle">
          <button
            type="button"
            className={`type-btn ${formData.userType === 'manager' ? 'active' : ''}`}
            onClick={() => viewModel.setUserType('manager')}
          >
            <span className="icon">👤</span>
            Manager
          </button>
          <button
            type="button"
            className={`type-btn ${formData.userType === 'employee' ? 'active' : ''}`}
            onClick={() => viewModel.setUserType('employee')}
          >
            <span className="icon">👥</span>
            Employee
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <InputWithIcon
              icon={<EmailIcon />}
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e: { target: { value: string; }; }) => viewModel.setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <InputWithIcon
              icon={<EmailIcon />}
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e: { target: { value: string; }; }) => viewModel.setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <InputWithIcon
              icon={<PasswordIcon />}
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e: { target: { value: string; }; }) => viewModel.setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <InputWithIcon
              icon={<PasswordIcon />}
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e: { target: { value: string; }; }) => viewModel.setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => viewModel.setAgreeToTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms and Conditions</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </label>
          </div>

          <button 
            type="submit" 
            className="sign-up-btn"
            disabled={formData.isLoading}
          >
            {formData.isLoading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
});

export default Register;