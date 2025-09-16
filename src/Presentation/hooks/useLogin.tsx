// src/Presentation/hooks/useLogin.tsx
import { useViewModel } from './useViewModel';
import { LoginViewModel } from '../../domain/models/LoginViewModel';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const viewModel = useViewModel(LoginViewModel);
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      return false;
    }

    viewModel.setUsername(username);
    viewModel.setPassword(password);

    const success = await viewModel.login();

    if (success) {
      // Don't handle redirects here - let the middleware handle them
      // This ensures consistent behavior across the app
      
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      console.log('Login successful, user data:', user);
      console.log('Approval status from login:', user?.approved);
      
      // The middleware will automatically redirect based on:
      // 1. If user.approved === false -> /waiting-approval
      // 2. If user is approved -> appropriate home page
      
      // Force a page refresh to trigger middleware checks
      window.location.reload();
      
      return true;
    }

    return false;
  };

  return {
    login: handleLogin,
    isLoading: viewModel.formData.isLoading,
    error: viewModel.formData.error
  };
};