import { useViewModel } from './useViewModel';
import { LoginViewModel } from '../../domain/viewmodel/LoginViewModel';
import { useNavigate } from 'react-router-dom';
import { isManager } from '../../utils/userRoleUtils';

export const useLogin = () => {
  const viewModel = useViewModel(LoginViewModel);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      return false;
    }

    viewModel.setEmail(email);
    viewModel.setPassword(password);

    const loginResult = await viewModel.login();

    if (loginResult) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      // Navigate based on user role from database
      const isManagerUser = isManager(user);
      
      if (isManagerUser) {
        navigate('/home');
      } else {
        navigate('/employee/home');
      }

      return true;
    } else {
    }

    return false;
  };

  return {
    login: handleLogin,
    isLoading: viewModel.formData.isLoading,
    error: viewModel.formData.error
  };
};