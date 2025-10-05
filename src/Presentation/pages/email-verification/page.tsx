import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEmailVerification } from '../../hooks/useEmailVerification';
import { Mail, Shield, AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const EmailVerification = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, setEmail, setCode, clearError, verifyEmail, resendVerificationEmail } = useEmailVerification();
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get email from location state or registration
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    }
  }, [location.state, setEmail]);

  const validateCode = (code: string): string => {
    if (!code) return 'Verification code is required';
    if (code.length !== 6) return 'Verification code must be 6 digits';
    if (!/^\d{6}$/.test(code)) return 'Verification code must contain only numbers';
    return '';
  };

  const handleCodeChange = (value: string) => {
    // Clear validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.code;
      return newErrors;
    });

    setCode(value);
  };

  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate code
    const codeError = validateCode(formData.code);
    if (codeError) {
      setValidationErrors({ code: codeError });
      return;
    }

    const success = await verifyEmail();
    if (success) {
      // Redirect to login with success message
      navigate('/login', {
        state: { 
          message: 'Email verified successfully! You can now log in.',
          email: formData.email
        }
      });
    }
  };

  const handleResendCode = async () => {
    const success = await resendVerificationEmail();
    if (success) {
      // Clear any existing errors
      clearError();
    }
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 box-border bg-gray-50">
      <div className="w-full max-w-md mx-auto p-8 text-gray-900 bg-white rounded-2xl shadow-xl animate-[slideIn_0.4s_ease-out]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-purple-800">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-600 text-base">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-center text-purple-600 font-medium text-base mt-1">
            {formData.email || 'your email address'}
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

        {/* Verification Form */}
        <form onSubmit={handleVerifyEmail} className="space-y-6">
          
          {/* Verification Code Input */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={formData.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full p-4 text-center text-2xl font-mono tracking-widest border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                disabled={formData.isLoading}
              />
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {validationErrors.code && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.code}</span>
              </div>
            )}
          </div>

          {/* Verify Button */}
          <button 
            type="submit" 
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={formData.isLoading || formData.code.length !== 6}
          >
            {formData.isLoading ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Resend Code Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={formData.isResending || formData.resendCooldown > 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 text-sm font-medium hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {formData.isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : formData.resendCooldown > 0 ? (
                `Resend in ${formData.resendCooldown}s`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Code
                </>
              )}
            </button>
          </div>

          {/* Back to Register */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBackToRegister}
              className="inline-flex items-center gap-2 text-gray-600 text-sm hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registration
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Check your spam folder if you don't see the email. 
            The verification code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
});

export default EmailVerification;

