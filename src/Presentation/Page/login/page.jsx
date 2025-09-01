
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '../../Components/icons/EmailIcon';
import PasswordIcon from '../../Components/icons/PasswordIcon';
import InputWithIcon from '../../Components/InputWithIcon';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (role === 'manager') {
      navigate('/home');
    } else {
      navigate('/employee/home');
    }
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
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <InputWithIcon
                icon={<EmailIcon />}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`btn role-button ${role === 'employee' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setRole('employee')}
                >
                  Employee
                </button>
                <button
                  type="button"
                  className={`btn role-button ${role === 'manager' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setRole('manager')}
                >
                  Manager
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Log In
            </button>
          </form>
          <p className="text-center mt-4">
Don't have an account? <Link to="/register" className="white-link">Sign Up</Link>          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
