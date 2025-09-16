// src/middleware/utils.tsx
import React from 'react';

// Loading component for middleware
export const MiddlewareLoading: React.FC<{ message?: string }> = ({ 
  message = "Verifying authentication..." 
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ 
        color: '#6b7280', 
        fontSize: '16px',
        margin: 0,
        textAlign: 'center'
      }}>
        {message}
      </p>
    </div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// Error boundary for middleware
export class MiddlewareErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Middleware Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8f9fa',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{ 
              color: '#dc2626', 
              fontSize: '20px',
              margin: 0
            }}>
              Authentication Error
            </h2>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              margin: 0,
              lineHeight: 1.5
            }}>
              There was an error checking your authentication status. Please try refreshing the page or logging in again.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Auth context for sharing auth state across components
export interface AuthContextType {
  isAuthenticated: boolean;
  isApproved: boolean;
  userRole: string | null;
  user: any;
  refresh: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions
export const getStoredUser = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch (error) {
    console.error('Error getting stored user:', error);
    return { token: null, user: null };
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('walletAddress');
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('privateKey');
};

export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // Basic token validation - you might want to add more sophisticated checks
    return token.length > 10; // Adjust based on your token format
  } catch {
    return false;
  }
};