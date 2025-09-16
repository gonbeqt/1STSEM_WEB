// src/Presentation/pages/waiting-approval/page.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useViewModel } from '../../hooks/useViewModel';
import { SessionViewModel } from '../../../domain/models/SessionViewModel';
import { Loader2, Clock, Shield, CheckCircle, XCircle } from 'lucide-react';
import './waiting-approval.css';

const WaitingForApproval = observer(() => {
  const navigate = useNavigate();
  const sessionViewModel = useViewModel(SessionViewModel);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [timeWaiting, setTimeWaiting] = useState(0);

  // Get current user data
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();

  // Check approval status
  const checkApprovalStatus = async () => {
    try {
      await sessionViewModel.fetchSessions();
      const currentSession = sessionViewModel.sessions.find(session => session.is_current);
      
      if (currentSession?.approved) {
        // Session is approved, redirect based on role
        if (user?.role === 'Manager') {
          navigate('/home');
        } else {
          navigate('/employee/home');
        }
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
    }
  };

  // Start polling for approval
  useEffect(() => {
    // Initial check
    checkApprovalStatus();

    // Set up polling every 5 seconds
    const interval = setInterval(checkApprovalStatus, 5000);
    setPollingInterval(interval);

    // Timer for showing how long user has been waiting
    const timer = setInterval(() => {
      setTimeWaiting(prev => prev + 1);
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
      if (timer) clearInterval(timer);
    };
  }, [navigate, user?.role]);

  // Format waiting time
  const formatWaitingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Get current session info
  const currentSession = sessionViewModel.sessions.find(session => session.is_current);
  const mainDevice = sessionViewModel.sessions.find(session => session.is_main_device);

  return (
    <div className="waiting-approval-container">
      <div className="waiting-approval-card">
        {/* Header */}
        <div className="approval-header">
          <div className="approval-icon-wrapper">
            <Clock className="approval-icon" />
          </div>
          <h1 className="approval-title">Waiting for Approval</h1>
          <p className="approval-subtitle">
            Your login requires approval from your main device
          </p>
        </div>

        {/* Status Section */}
        <div className="approval-status">
          <div className="status-item">
            <div className="status-icon-wrapper pending">
              <Loader2 className="status-icon spinning" />
            </div>
            <div className="status-content">
              <h3 className="status-title">Approval Pending</h3>
              <p className="status-description">
                Waiting for approval from your main device
              </p>
            </div>
          </div>

          {mainDevice && (
            <div className="status-item">
              <div className="status-icon-wrapper info">
                <Shield className="status-icon" />
              </div>
              <div className="status-content">
                <h3 className="status-title">Main Device</h3>
                <p className="status-description">
                  {mainDevice.device_name} • {mainDevice.ip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current Session Info */}
        {currentSession && (
          <div className="session-info">
            <h3 className="session-info-title">Current Session</h3>
            <div className="session-details">
              <div className="session-detail">
                <span className="detail-label">Device:</span>
                <span className="detail-value">{currentSession.device_name}</span>
              </div>
              <div className="session-detail">
                <span className="detail-label">IP Address:</span>
                <span className="detail-value">{currentSession.ip}</span>
              </div>
              <div className="session-detail">
                <span className="detail-label">Login Time:</span>
                <span className="detail-value">
                  {new Date(currentSession.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Waiting Timer */}
        <div className="waiting-timer">
          <div className="timer-content">
            <Clock className="timer-icon" />
            <span className="timer-text">
              Waiting for {formatWaitingTime(timeWaiting)}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="approval-instructions">
          <h3 className="instructions-title">What to do next:</h3>
          <ol className="instructions-list">
            <li>Open your main device where you're already logged in</li>
            <li>Go to Security Settings or Active Sessions</li>
            <li>Find this new login request and approve it</li>
            <li>You'll be automatically redirected once approved</li>
          </ol>
        </div>

        {/* Error Display */}
        {sessionViewModel.error && (
          <div className="approval-error">
            <XCircle className="error-icon" />
            <span className="error-text">{sessionViewModel.error}</span>
          </div>
        )}

        {/* Loading State */}
        {sessionViewModel.isLoading && (
          <div className="approval-loading">
            <Loader2 className="loading-icon spinning" />
            <span className="loading-text">Checking approval status...</span>
          </div>
        )}

        {/* Actions */}
        <div className="approval-actions">
          <button 
            className="btn-secondary"
            onClick={handleLogout}
          >
            Cancel & Logout
          </button>
          <button 
            className="btn-primary"
            onClick={checkApprovalStatus}
            disabled={sessionViewModel.isLoading}
          >
            {sessionViewModel.isLoading ? (
              <>
                <Loader2 className="btn-icon spinning" />
                Checking...
              </>
            ) : (
              'Check Status'
            )}
          </button>
        </div>
      </div>

      {/* Background Animation */}
      <div className="approval-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
});

export default WaitingForApproval;