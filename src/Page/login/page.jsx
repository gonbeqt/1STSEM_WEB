
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailIcon from '../../Components/icons/EmailIcon';
import PasswordIcon from '../../Components/icons/PasswordIcon';
import InputWithIcon from '../../Components/InputWithIcon';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <h1>Welcome Back</h1>
        <p>Log in to manage your crypto finances smarter and faster.</p>
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <h2>Login</h2>
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
            <button type="submit" className="btn btn-primary">
              Log In
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account? <Link to="/register" className="text-purple-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
