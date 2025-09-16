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

    const loginResult = await viewModel.login();

    if (loginResult) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      if (loginResult.data && !loginResult.data.approved) {
        // If the session is not approved, redirect to the waiting approval page
        navigate('/waiting-approval', { state: { sessionId: loginResult.data.session_id } });
      } else if (user?.role === 'Manager') {
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