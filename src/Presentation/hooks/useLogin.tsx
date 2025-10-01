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
      
      console.log('User data from localStorage:', user);
      console.log('User role:', user?.role);
      console.log('User first_name:', user?.first_name);
      console.log('User object keys:', user ? Object.keys(user) : 'No user data');

      // Navigate based on user role from database
      const isManagerUser = isManager(user);
      
      console.log('User role from database:', user?.role);
      console.log('Is Manager (using utility):', isManagerUser);
      console.log('Role comparison - user.role === "Manager":', user?.role === 'Manager');
      console.log('Role type:', typeof user?.role);
      console.log('Role value (quoted):', `"${user?.role}"`);
      
      if (isManagerUser) {
        console.log('Redirecting to manager home');
        navigate('/home');
      } else {
        console.log('Redirecting to employee home');
        navigate('/employee/home');
      }

      return true;
    } else {
      console.log('Login failed - no result returned from viewModel.login()');
    }

    return false;
  };

  return {
    login: handleLogin,
    isLoading: viewModel.formData.isLoading,
    error: viewModel.formData.error
  };
};