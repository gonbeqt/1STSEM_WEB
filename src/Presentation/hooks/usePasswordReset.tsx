import { useMemo } from 'react';
import { container } from '../../di/container';

export const usePasswordReset = () => {
  const viewModel = useMemo(() => container.passwordResetViewModel(), []);
  
  return {
    formData: viewModel.formData,
    setEmail: viewModel.setEmail,
    setToken: viewModel.setToken,
    setNewPassword: viewModel.setNewPassword,
    setConfirmPassword: viewModel.setConfirmPassword,
    clearError: viewModel.clearError,
    clearSuccess: viewModel.clearSuccess,
    requestPasswordReset: viewModel.requestPasswordReset,
    resetPassword: viewModel.resetPassword
  };
};
