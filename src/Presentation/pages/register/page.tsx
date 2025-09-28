import React from 'react';
import InputWithIcon from '../../components/InputWithIcon';
import EmailIcon from '../../components/icons/EmailIcon';
import PasswordIcon from '../../components/icons/PasswordIcon';
import { useNavigate } from 'react-router-dom';
import { RegisterViewModel } from '../../../domain/viewmodel/RegisterViewModel';
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
    <div className="flex justify-center items-center min-h-screen p-5 box-border bg-gray-50">
      <div className="w-full max-w-md mx-auto p-10 text-gray-900 bg-white rounded-2xl shadow-lg shadow-black/8 animate-[slideIn_0.4s_ease-out]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-center text-gray-500 text-base">
            Sign up and simplify crypto bookkeeping and invoicing.
          </p>
        </div>

        {/* Error Message */}
        {formData.error && (
          <div className="mb-6 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {formData.error}
          </div>
        )}

        {/* User Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className={`flex-1 p-3 border rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
              formData.userType === 'manager'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => viewModel.setUserType('manager')}
          >
            <span className="text-xl">👤</span>
            Manager
          </button>
          <button
            type="button"
            className={`flex-1 p-3 border rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
              formData.userType === 'employee'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => viewModel.setUserType('employee')}
          >
            <span className="text-xl">👥</span>
            Employee
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field */}
          <div>
            <InputWithIcon
              icon={<EmailIcon />}
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e: { target: { value: string; }; }) => viewModel.setUsername(e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div>
            <InputWithIcon
              icon={<EmailIcon />}
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e: { target: { value: string; }; }) => viewModel.setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <InputWithIcon
              icon={<PasswordIcon />}
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e: { target: { value: string; }; }) => viewModel.setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <InputWithIcon
              icon={<PasswordIcon />}
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e: { target: { value: string; }; }) => viewModel.setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2 my-6 text-xs text-gray-500">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.agreeToTerms}
              onChange={(e) => viewModel.setAgreeToTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm leading-relaxed">
              I agree to the{' '}
              <a 
                href="/terms" 
                className="text-indigo-600 no-underline hover:underline"
              >
                Terms and Conditions
              </a>
              {' '}and{' '}
              <a 
                href="/privacy" 
                className="text-indigo-600 no-underline hover:underline"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit" 
            className="w-full p-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer mb-6 transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={formData.isLoading}
          >
            {formData.isLoading ? 'Signing up...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-indigo-600 no-underline font-medium hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
});

export default Register