import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLogin } from '../../hooks/useLogin';
import InputWithIcon from '../../components/InputWithIcon';
import EmailIcon from '../../components/icons/EmailIcon';
import PasswordIcon from '../../components/icons/PasswordIcon';
import { Link } from 'react-router-dom';

const Login = observer(() => {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-5 box-border bg-gray-50">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-lg shadow-black/8 animate-[slideIn_0.4s_ease-out] text-gray-900">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-center text-gray-900">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-500 text-base">
            Select your role and sign in to continue.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <InputWithIcon
              id="email"
              icon={<EmailIcon />}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <InputWithIcon
              id="password"
              icon={<PasswordIcon />}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold rounded-xl py-3.5 px-4 mt-6 border-none cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-500">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-indigo-600 font-medium no-underline hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
});

export default Login;