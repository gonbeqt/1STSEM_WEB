
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailIcon from '../../Components/icons/EmailIcon';
import PasswordIcon from '../../Components/icons/PasswordIcon';
import InputWithIcon from '../../Components/InputWithIcon';
import './register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-sidebar">
        <h1>Create Your Account</h1>
        <p>Join us to manage your crypto finances smarter and faster.</p>
      </div>
      <div className="register-form-container">
        <div className="register-form">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <InputWithIcon
                icon={<EmailIcon />}
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                type="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <InputWithIcon
                icon={<PasswordIcon />}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                type="password"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <InputWithIcon
                icon={<PasswordIcon />}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                type="password"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="white-link">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
