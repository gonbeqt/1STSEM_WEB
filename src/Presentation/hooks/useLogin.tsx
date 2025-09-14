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
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      if (user?.role === 'Manager') {
        navigate('/home');
      } else {
        navigate('/employee/home');
      }

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