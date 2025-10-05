import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { usePasswordReset } from '../../hooks/usePasswordReset';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = observer(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    formData, 
    setToken, 
    setNewPassword, 
    setConfirmPassword, 
    clearError, 
    clearSuccess, 
    resetPassword 
  } = usePasswordReset();
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get token from URL parameters
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
    } else {
      // If no token in URL, redirect to forgot password
      navigate('/forgot-password');
    }
  }, [searchParams, setToken, navigate]);

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handlePasswordChange = (value: string) => {
    // Clear validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.newPassword;
      delete newErrors.confirmPassword;
      return newErrors;
    });

    setNewPassword(value);
    
    // Re-validate confirm password if it exists
    if (formData.confirmPassword) {
      const confirmError = validateConfirmPassword(value, formData.confirmPassword);
      if (confirmError) {
        setValidationErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    // Clear validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.confirmPassword;
      return newErrors;
    });

    setConfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordError = validatePassword(formData.newPassword);
    const confirmPasswordError = validateConfirmPassword(formData.newPassword, formData.confirmPassword);
    
    const errors: Record<string, string> = {};
    if (passwordError) errors.newPassword = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const success = await resetPassword();
    if (success) {
      // Redirect to login with success message
      navigate('/login', {
        state: { 
          message: 'Password reset successfully! You can now log in with your new password.'
        }
      });
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
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-green-800">
            Reset Password
          </h1>
          <p className="text-center text-gray-600 text-base">
            Enter your new password below
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

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* New Password Input */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                disabled={formData.isLoading}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.newPassword && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.newPassword}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                disabled={formData.isLoading}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full p-4 bg-gradient-to-r from-green-600 to-green-700 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={formData.isLoading}
          >
            {formData.isLoading ? 'Resetting...' : 'Reset Password'}
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
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Password Requirements:</strong> At least 8 characters with uppercase, lowercase, and numbers.
          </p>
        </div>
      </div>
    </div>
  );
});

export default ResetPassword;
