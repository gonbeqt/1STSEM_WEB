// src/hooks/useRouteGuard.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useViewModel } from '../../presentation/hooks/useViewModel';
import { SessionViewModel } from '../../domain/models/SessionViewModel';

interface RouteGuardOptions {
  requireAuth?: boolean;
  requireApproval?: boolean;
  allowedRoles?: ('Manager' | 'Employee')[];
  redirectOnSuccess?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isApproved: boolean;
  userRole: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useRouteGuard = (options: RouteGuardOptions = {}) => {
  const {
    requireAuth = true,
    requireApproval = true,
    allowedRoles = [],
    redirectOnSuccess
  } = options;

  const navigate = useNavigate();
  const location = useLocation();
  const sessionViewModel = useViewModel(SessionViewModel);
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isApproved: false,
    userRole: null,
    isLoading: true,
    error: null
  });

  // Get current user data
  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch (error) {
      return { token: null, user: null };
    }
  };

  const checkAuthStatus = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { token, user } = getCurrentUser();

      // Check authentication
      if (!token || !user) {
        setAuthState({
          isAuthenticated: false,
          isApproved: false,
          userRole: null,
          isLoading: false,
          error: null
        });

        if (requireAuth) {
          navigate('/login', { state: { from: location } });
        }
        return;
      }

      // User is authenticated
      let isApproved = true;
      let errorMessage = null;

      // Check approval status if required
      if (requireApproval) {
        try {
          await sessionViewModel.fetchSessions();
          const currentSession = sessionViewModel.sessions.find(session => session.is_current);
          
          if (currentSession) {
            isApproved = currentSession.approved;
          } else {
            // Fallback to user data
            isApproved = user.approved !== false;
          }

          // If not approved and not on waiting page, redirect
          if (!isApproved && location.pathname !== '/waiting-approval') {
            navigate('/waiting-approval');
            return;
          }

          // If approved but on waiting page, redirect to home
          if (isApproved && location.pathname === '/waiting-approval') {
            const redirectPath = redirectOnSuccess || (user.role === 'Manager' ? '/home' : '/employee/home');
            navigate(redirectPath);
            return;
          }

        } catch (error) {
          console.error('Error checking approval status:', error);
          errorMessage = 'Failed to verify session status';
          // Don't redirect on error, but set approval based on user data
          isApproved = user.approved !== false;
        }
      }

      // Check role-based access
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        const redirectPath = user.role === 'Manager' ? '/home' : '/employee/home';
        navigate(redirectPath);
        return;
      }

      setAuthState({
        isAuthenticated: true,
        isApproved,
        userRole: user.role,
        isLoading: false,
        error: errorMessage
      });

    } catch (error) {
      console.error('Error in route guard:', error);
      setAuthState({
        isAuthenticated: false,
        isApproved: false,
        userRole: null,
        isLoading: false,
        error: 'Authentication check failed'
      });

      if (requireAuth) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const refresh = () => {
    checkAuthStatus();
  };

  return {
    ...authState,
    refresh
  };
};