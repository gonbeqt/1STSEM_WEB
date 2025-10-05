import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { usePasswordReset } from '../../hooks/usePasswordReset';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = observer(() => {
  const navigate = useNavigate();
  const { formData, setEmail, clearError, clearSuccess, requestPasswordReset } = usePasswordReset();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleEmailChange = (value: string) => {
    // Clear validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });

    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setValidationErrors({ email: emailError });
      return;
    }

    const success = await requestPasswordReset();
    if (success) {
      // Clear any existing errors
      clearError();
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 box-border bg-gray-50">
      <div className="w-full max-w-md mx-auto p-8 text-gray-900 bg-white rounded-2xl shadow-xl animate-[slideIn_0.4s_ease-out]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-blue-800">
            Forgot Password?
          </h1>
          <p className="text-center text-gray-600 text-base">
            No worries! Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {/* Success Message */}
        {formData.success && formData.message && (
          <div className="mb-6 text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formData.message}</span>
          </div>
        )}

        {/* Error Message */}
        {formData.error && (
          <div className="mb-6 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formData.error}</span>
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                disabled={formData.isLoading}
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {validationErrors.email && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.email}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={formData.isLoading}
          >
            {formData.isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="inline-flex items-center gap-2 text-gray-600 text-sm hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Check your email inbox and spam folder for the password reset link. 
            The link will expire in 1 hour for security reasons.
          </p>
        </div>
      </div>
    </div>
  );
});

export default ForgotPassword;
