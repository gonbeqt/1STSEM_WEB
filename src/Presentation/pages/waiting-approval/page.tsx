import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './waiting-approval.css';
import { container } from '../../../di/container';

const WaitingApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const sessionId = (location.state as { sessionId: string })?.sessionId;

  const handleSignOut = async () => {
    try {
      await container.loginViewModel().logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Optionally, show an error message to the user
      navigate('/login'); // Still navigate to login even if logout fails on client side
    }
  };

  useEffect(() => {
    if (!sessionId) {
      console.error('Session ID not found in location state.');
      navigate('/login'); // Redirect to login if no session ID
      return;
    }

    const checkApproval = async () => {
      try {
        const status = await container.getSessionApprovalStatusUseCase.execute(sessionId);
        setApprovalStatus(status);
      } catch (error) {
        console.error('Failed to check session approval status:', error);
        // Do not set status to rejected here; continue polling as it might be a transient error.
      }
    };

    // Initial check
    checkApproval();

    const intervalId = setInterval(checkApproval, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [sessionId, navigate]);

  useEffect(() => {
    if (approvalStatus === 'approved') {
      navigate('/home'); // Assuming '/home' is your main application route
    } 
    // Removed automatic redirect to /login when rejected
  }, [approvalStatus, navigate]);

  return (
    <div className="waiting-approval-container">
      <div className="waiting-approval-card">
        {approvalStatus === 'pending' && (
          <>
            <h2>Awaiting Session Approval</h2>
            <p>Your login session is awaiting approval from your main device.</p>
            <p>Please keep this page open. You will be redirected automatically once approved.</p>
            <div className="spinner"></div>
          </>
        )}
        {approvalStatus === 'rejected' && (
          <>
            <h2>Session Approval Rejected</h2>
            <p>Your login session was rejected or could not be approved.</p>
            <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
          </>
        )}
        {/* You can add more UI elements here, like a cancel button or status updates */}
              <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>

      </div>

    </div>
  );
};

export default WaitingApprovalPage;
