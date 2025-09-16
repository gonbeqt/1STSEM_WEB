// src/middleware/AuthMiddleware.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useViewModel } from '../presentation/hooks/useViewModel';
import { SessionViewModel } from '../domain/models/SessionViewModel';
import { LoginViewModel } from '../domain/models/LoginViewModel';
import { Loader2, Shield, CheckCircle, User, Home } from 'lucide-react';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireApproval?: boolean;
  allowedRoles?: ('Manager' | 'Employee')[];
}

interface VerificationStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'checking' | 'success' | 'error';
}

export const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({
  children,
  requireAuth = true,
  requireApproval = true,
  allowedRoles = ['Manager', 'Employee']
}) => {
  const location = useLocation();
  const sessionViewModel = useViewModel(SessionViewModel);
  const loginViewModel = useViewModel(LoginViewModel);
  const [isChecking, setIsChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    isApproved: boolean;
    userRole: string | null;
    currentSession: any;
  }>({
    isAuthenticated: false,
    isApproved: false,
    userRole: null,
    currentSession: null
  });

  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 'auth',
      label: 'Checking authentication',
      icon: <User className="step-icon-svg" />,
      status: 'pending'
    },
    {
      id: 'approval',
      label: 'Verifying session approval',
      icon: <Shield className="step-icon-svg" />,
      status: 'pending'
    },
    {
      id: 'permissions',
      label: 'Validating permissions',
      icon: <Shield className="step-icon-svg" />,
      status: 'pending'
    },
    {
      id: 'redirect',
      label: 'Loading Home',
      icon: <Home className="step-icon-svg" />,
      status: 'pending'
    }
  ]);

  // Helper function to update step status
  const updateStepStatus = (stepId: string, status: VerificationStep['status']) => {
    setVerificationSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  };

  // Animated delay function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Check authentication and approval status
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsChecking(true);
      
      try {
        // Step 1: Check Authentication
        updateStepStatus('auth', 'checking');
        await delay(800); // Give time for animation
        
        const { token, user } = getCurrentUser();
        
        if (!token || !user) {
          updateStepStatus('auth', 'error');
          await delay(500);
          setAuthStatus({
            isAuthenticated: false,
            isApproved: false,
            userRole: null,
            currentSession: null
          });
          setIsChecking(false);
          return;
        }

        updateStepStatus('auth', 'success');
        await delay(600);

        // Step 2: Check Approval (if required)
        if (requireApproval) {
          updateStepStatus('approval', 'checking');
          await delay(5000);

          let isApproved = true;
          let currentSession = null;

          try {
            await sessionViewModel.fetchSessions();
            currentSession = sessionViewModel.sessions.find(session => session.is_current);
            
            if (currentSession) {
              isApproved = currentSession.approved;
            } else {
              isApproved = user.approved !== false;
            }

            if (isApproved) {
              updateStepStatus('approval', 'success');
            } else {
              updateStepStatus('approval', 'error');
            }
            
            await delay(600);

          } catch (error) {
            console.error('Error fetching sessions in middleware:', error);
            updateStepStatus('approval', 'error');
            await delay(600);
            isApproved = user.approved !== false;
          }

          // Step 3: Check Permissions
          updateStepStatus('permissions', 'checking');
          await delay(1500);

          // Check role-based access
          let hasValidRole = true;
          if (allowedRoles.length > 0 && user.role) {
            hasValidRole = allowedRoles.includes(user.role as 'Manager' | 'Employee');
          }

          if (hasValidRole) {
            updateStepStatus('permissions', 'success');
          } else {
            updateStepStatus('permissions', 'error');
          }
        await delay(1500);

          // Step 4: Prepare Redirect
          updateStepStatus('redirect', 'checking');
          await delay(1000);

          
          let targetPath = null;
          
          if (!isApproved && location.pathname !== '/waiting-approval') {
            targetPath = '/waiting-approval';
          } else if (isApproved && location.pathname === '/waiting-approval') {
            targetPath = user.role === 'Manager' ? '/home' : '/employee/home';
          } else if (!hasValidRole) {
            targetPath = user.role === 'Manager' ? '/home' : '/employee/home';
          }

          setAuthStatus({
            isAuthenticated: true,
            isApproved,
            userRole: user.role,
            currentSession
          });

          updateStepStatus('redirect', 'success');

          if (targetPath) {
            setRedirectPath(targetPath);
          }
          
        } else {
          // Skip approval steps if not required
          updateStepStatus('approval', 'success');
          updateStepStatus('permissions', 'success');
          updateStepStatus('redirect', 'success');
          await delay(1000);

          setAuthStatus({
            isAuthenticated: true,
            isApproved: true,
            userRole: user.role,
            currentSession: null
          });
        }

      } catch (error) {
        console.error('Error in auth middleware:', error);
        updateStepStatus('auth', 'error');
        updateStepStatus('approval', 'error');
        updateStepStatus('permissions', 'error');
        updateStepStatus('redirect', 'error');
        
        setAuthStatus({
          isAuthenticated: false,
          isApproved: false,
          userRole: null,
          currentSession: null
        });
      }

      // Final delay before completing
      await delay(500);
      setIsChecking(false);
    };

    checkAuthStatus();
  }, [location.pathname, sessionViewModel, requireApproval, requireAuth, allowedRoles]);

  // Handle redirects after animations complete
  useEffect(() => {
    if (!isChecking && redirectPath) {
      const redirectTimer = setTimeout(() => {
        // Using window.location for force refresh to ensure clean state
        window.location.href = redirectPath;
      }, 300);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isChecking, redirectPath]);

  // Show animated loading screen while checking
  if (isChecking) {
    return (
      <div className="waiting-approval-container">
        <div className="waiting-approval-card">
          <div className="verification-screen">
            <div className="verification-icon-wrapper">
              <Shield className="verification-icon" />
            </div>
            <h1 className="verification-title">Verifying Access</h1>
            <p className="verification-subtitle">
              Please wait while we verify your authentication and permissions...
            </p>
            <div className="verification-steps">
              {verificationSteps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`verification-step ${step.status === 'checking' || step.status === 'success' ? 'active' : ''} ${step.status}`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animation: step.status === 'success' ? 'successPulse 0.6s ease-out' : undefined
                  }}
                >
                  <div className="step-icon">
                    {step.status === 'checking' && (
                      <Loader2 className="step-loader spinning" />
                    )}
                    {step.status === 'success' && (
                      <CheckCircle className="step-check success-icon" />
                    )}
                    {step.status === 'error' && (
                      <div className="step-error">❌</div>
                    )}
                    {step.status === 'pending' && step.icon}
                  </div>
                  <span className="step-text">{step.label}</span>

                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{
                    width: `${(verificationSteps.filter(step => step.status === 'success').length / verificationSteps.length) * 100}%`
                  }}
                ></div>
              </div>
              <div className="progress-text">
                {verificationSteps.filter(step => step.status === 'success').length} of {verificationSteps.length} checks completed
              </div>
            </div>
          </div>
        </div>
        
        <div className="approval-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        
        <style>
          {`
            .waiting-approval-container {
            color:black;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes successPulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            
            @keyframes checkmarkSlide {
              0% { transform: translateX(20px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
            
            .spinning {
              animation: spin 1s linear infinite;
            }
            
            .success-icon {
              color: #16a34a !important;
              animation: successPulse 0.6s ease-out;
            }
            
            .step-checkmark {
              animation: checkmarkSlide 0.4s ease-out;
            }
            
            .checkmark-icon {
              width: 20px;
              height: 20px;
              color: #16a34a;
            }
            
            .verification-step.success {
              background: #dcfce7 !important;
              border: 1px solid #bbf7d0 !important;
            }
            
            .verification-step.error {
              background: #fee2e2 !important;
              border: 1px solid #fecaca !important;
            }
            
            .step-error {
              font-size: 16px;
            }
            
            .progress-container {
              margin-top: 30px;
              width: 90%;
              
            }
            
            .progress-bar {
              width: 100%;
              height: 8px;
              background: #e5e7eb;
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 8px;
            }
            
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #16a34a, #22c55e);
              border-radius: 4px;
              transition: width 0.8s ease-out;
            }
            
            .progress-text {
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            
            .step-icon-svg {
              width: 20px;
              height: 20px;
            }
          `}
        </style>
      </div>
    );
  }

  // Handle authentication redirects
  if (requireAuth && !authStatus.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle approval redirects
  if (authStatus.isAuthenticated && requireApproval && !authStatus.isApproved) {
    if (location.pathname !== '/waiting-approval') {
      return <Navigate to="/waiting-approval" replace />;
    }
  }

  // Handle approved users on waiting page
  if (authStatus.isAuthenticated && authStatus.isApproved && location.pathname === '/waiting-approval') {
    const redirectPath = authStatus.userRole === 'Manager' ? '/home' : '/employee/home';
    return <Navigate to={redirectPath} replace />;
  }

  // Check role-based access
  if (authStatus.isAuthenticated && allowedRoles.length > 0 && authStatus.userRole) {
    if (!allowedRoles.includes(authStatus.userRole as 'Manager' | 'Employee')) {
      const redirectPath = authStatus.userRole === 'Manager' ? '/home' : '/employee/home';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Specific middleware components for common use cases
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthMiddleware requireAuth={true} requireApproval={false}>
    {children}
  </AuthMiddleware>
);

export const RequireApproval: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthMiddleware requireAuth={true} requireApproval={true}>
    {children}
  </AuthMiddleware>
);

export const RequireManager: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthMiddleware requireAuth={true} requireApproval={true} allowedRoles={['Manager']}>
    {children}
  </AuthMiddleware>
);

export const RequireEmployee: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthMiddleware requireAuth={true} requireApproval={true} allowedRoles={['Employee']}>
    {children}
  </AuthMiddleware>
);

export const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = (() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  })();

  // If user is already authenticated, redirect to appropriate home
  if (token && user) {
    const redirectPath = user.role === 'Manager' ? '/home' : '/employee/home';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};