import { useMemo } from 'react';
import { container } from '../../di/container';

export const useEmailVerification = () => {
  const viewModel = useMemo(() => container.emailVerificationViewModel(), []);
  
  return {
    formData: viewModel.formData,
    setEmail: viewModel.setEmail,
    setCode: viewModel.setCode,
    clearError: viewModel.clearError,
    clearSuccess: viewModel.clearSuccess,
    verifyEmail: viewModel.verifyEmail,
    resendVerificationEmail: viewModel.resendVerificationEmail
  };
};

