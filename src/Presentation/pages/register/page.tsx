import React, { useMemo, useState } from 'react';
import InputWithIcon from '../../components/InputWithIcon';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { container } from '../../../di/container';
import { User, Lock, Mail, UserCheck, AlertCircle } from 'lucide-react';
import TermsAndConditonsModal from '../../components/TermsAndConditonsModal';

const Register = observer(() => {
  const navigate = useNavigate();
  const viewModel = useMemo(() => container.registerViewModel(), []);
  const { formData } = viewModel;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleOpenTermsModal = () => {
    setTermsModalOpen(true);
  };

  const handleTermsAccept = () => {
    viewModel.setAgreeToTerms(true);
    setTermsModalOpen(false);
  };

  const handleTermsClose = () => {
    setTermsModalOpen(false);
  };

  // Validation helper functions
  const validateField = (name: string, value: string): string => {
    const trimmedValue = value.trim();
    
    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!trimmedValue) return `${name.replace('_', ' ')} is required`;
        if (trimmedValue.length < 2) return `${name.replace('_', ' ')} must be at least 2 characters`;
        if (trimmedValue.length > 50) return `${name.replace('_', ' ')} must be at most 50 characters`;
        // Allow only letters (basic latin) plus spaces and hyphens between parts.
        // Split on spaces to validate each part (allow hyphenated parts too).
        const nameParts = trimmedValue.split(/\s+/);
        for (const part of nameParts) {
          // Allow hyphenated segments like "Anne-Marie"
          const segments = part.split('-');
          for (const seg of segments) {
            if (!/^[A-Za-z]+$/.test(seg)) return `${name.replace('_', ' ')} can only contain letters`;
          }
        }
        return '';
      
      case 'username':
        if (!trimmedValue) return 'Username is required';
        if (trimmedValue.length < 5) return 'Username must be at least 5 characters';
        if (trimmedValue.length > 50) return 'Username must be at most 50 characters';
        // Allow only letters and numbers (no underscores per new requirement)
        if (!/^[a-zA-Z0-9]+$/.test(trimmedValue)) return 'Username can only contain letters and numbers';
        return '';
      
      case 'email':
        if (!trimmedValue) return 'Email is required';
        // Stronger client-side email validation regex (reasonable balance between strictness and practicality)
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
        if (!emailRegex.test(trimmedValue)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.includes(' ')) return 'Password cannot contain spaces';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        return '';
      
      case 'password_confirm':
        if (!value) return 'Please confirm your password';
        if (value.includes(' ')) return 'Password cannot contain spaces';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      case 'security_answer':
        if (!trimmedValue) return 'Security answer is required';
        if (trimmedValue.length < 5) return 'Security answer must be at least 5 characters';
        return '';
      
      default:
        return '';
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });

    // Apply field-specific logic
    switch (fieldName) {
      case 'first_name':
        // Remove any character that's not a letter, space, or hyphen while typing.
        // Then collapse multiple spaces to a single space and trim to max 50 chars.
        {
          const sanitized = value
            // Replace any character that's not a letter (A-Z, a-z), space or hyphen
            .replace(/[^A-Za-z\-\s]/g, '')
            // Replace multiple spaces with a single space
            .replace(/\s{2,}/g, ' ')
            .slice(0, 50);
          viewModel.setFirstName(sanitized);
        }
        break;
      case 'last_name':
        {
          const sanitized = value
            .replace(/[^A-Za-z\-\s]/g, '')
            .replace(/\s{2,}/g, ' ')
            .slice(0, 50);
          viewModel.setLastName(sanitized);
        }
        break;
      case 'username':
        {
          // Allow only letters and numbers while typing (no underscores or special chars)
          const sanitizedUsername = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50);
          viewModel.setUsername(sanitizedUsername);
        }
        break;
      case 'email':
        viewModel.setEmail(value);
        break;
      case 'password':  
        // Remove spaces from password input
        const cleanPassword = value.replace(/\s/g, '');
        viewModel.setPassword(cleanPassword);
        // Re-validate password confirm if it exists
        if (formData.password_confirm) {
          const confirmError = validateField('password_confirm', formData.password_confirm);
          if (confirmError) {
            setValidationErrors(prev => ({ ...prev, password_confirm: confirmError }));
          }
        }
        break;
      case 'password_confirm':
        // Remove spaces from password confirm input
        const cleanPasswordConfirm = value.replace(/\s/g, '');
        viewModel.setPasswordConfirm(cleanPasswordConfirm);
        break;
      case 'security_answer':
        viewModel.setSecurityQuestionAnswer(value);
        break;
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate all fields
    const fields = [
      'first_name', 'last_name', 'username', 'email', 
      'password', 'password_confirm', 'security_answer'
    ];
    
    fields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string;
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    setSubmitError('');
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await viewModel.register();
      if (success) {
        // FORCE EMAIL VERIFICATION REDIRECT - ALWAYS GO TO EMAIL VERIFICATION
        navigate('/email-verification', { 
          state: { 
            email: formData.email,
            message: 'Registration successful! Please verify your email to continue.'
          }
        });
      } else if (!formData.error) {
        // Fallback message if viewModel didn't set an error
        setSubmitError('We could not complete your registration. Please review the form and try again.');
      }
    } catch (err) {
      // Defensive catch in case register throws unexpectedly
      setSubmitError('Something went wrong while registering. Please try again.');
      // console.error(err);
    }
  };
// ...existing code...

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-5 box-border bg-gray-50">
        <div className="w-full max-w-md mx-auto p-8 text-gray-900 bg-white rounded-2xl shadow-xl animate-[slideIn_0.4s_ease-out]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="mb-3 text-3xl font-bold text-purple-800">
              Create Account
            </h1>
            <p className="text-center text-gray-600 text-base">
              Sign up and simplify crypto bookkeeping and invoicing.
            </p>
          </div>

          {/* Error Message */}
          {(formData.error || submitError) && (
            <div className="mb-6 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {submitError || formData.error}
            </div>
          )}

          {/* User Type Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              className={`flex-1 p-4 border-2 rounded-xl cursor-pointer flex items-center justify-center gap-3 text-sm font-medium transition-all duration-200 ${
                formData.userType === 'manager'
                  ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => viewModel.setUserType('manager')}
            >
              <User className="w-5 h-5" />
              Manager
            </button>
            <button
              type="button"
              className={`flex-1 p-4 border-2 rounded-xl cursor-pointer flex items-center justify-center gap-3 text-sm font-medium transition-all duration-200 ${
                formData.userType === 'employee'
                  ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => viewModel.setUserType('employee')}
            >
              <UserCheck className="w-5 h-5" />
              Employee
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* First Name Field */}
            <div>
              <InputWithIcon
                icon={<User className="w-5 h-5 text-gray-400" />}
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('first_name', e.target.value)}
              />
              {validationErrors.first_name && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.first_name}</span>
                </div>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <InputWithIcon
                icon={<User className="w-5 h-5 text-gray-400" />}
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('last_name', e.target.value)}
              />
              {validationErrors.last_name && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.last_name}</span>
                </div>
              )}
            </div>

            {/* Username Field */}
            <div>
              <InputWithIcon
                icon={<User className="w-5 h-5 text-gray-400" />}
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('username', e.target.value)}
              />
              {validationErrors.username && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.username}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <InputWithIcon
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('email', e.target.value)}
              />
              {validationErrors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <InputWithIcon
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('password', e.target.value)}
              />
              {validationErrors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <InputWithIcon
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                type="password"
                placeholder="Confirm Password"
                value={formData.password_confirm}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('password_confirm', e.target.value)}
              />
              {validationErrors.password_confirm && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.password_confirm}</span>
                </div>
              )}
            </div>

            {/* Security Answer Field */}
            <div>
              <InputWithIcon
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                type="text"
                placeholder="Security Answer (e.g., My favorite pet is Max)"
                value={formData.security_answer}
                onChange={(e: { target: { value: string; }; }) => handleFieldChange('security_answer', e.target.value)}
              />
              {validationErrors.security_answer && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.security_answer}</span>
                </div>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3 my-6">
              <input
                type="checkbox"
                id="terms"
                readOnly
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenTermsModal();
                }}
                className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                checked={formData.agreeToTerms}
              />
              <p className="text-sm text-gray-600 leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={handleOpenTermsModal}
                  className="text-purple-600 font-medium hover:underline"
                >
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={handleOpenTermsModal}
                  className="text-purple-600 font-medium hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>

            {/* Sign Up Button */}
            <button 
              type="submit" 
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 border-none rounded-xl text-white text-base font-semibold cursor-pointer mb-6 transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={formData.isLoading}
            >
              {formData.isLoading ? 'Signing up...' : 'Sign Up'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-purple-600 no-underline font-medium hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>

      <TermsAndConditonsModal
        isOpen={isTermsModalOpen}
        onClose={handleTermsClose}
        onAccept={handleTermsAccept}
      />
    </>
  );
});

export default Register;