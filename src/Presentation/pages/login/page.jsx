import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLogin } from '../../hooks/useLogin';
import InputWithIcon from '../../components/InputWithIcon';
import EmailIcon from '../../components/icons/EmailIcon';
import PasswordIcon from '../../components/icons/PasswordIcon';
import './login.css';

const Login = observer(() => {
  const { login, isLoading, error } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h2>Welcome Back!</h2>
          <p className="form-subtitle">Select your role and sign in to continue.</p>
        
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <InputWithIcon
                id="username"
                icon={<EmailIcon />}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <InputWithIcon
                id="password"
                icon={<PasswordIcon />}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center">
            Don't have an account? <a href="/register" className="white-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Login;
