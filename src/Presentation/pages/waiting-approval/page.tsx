import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-[90%]">
        
        {/* Pending State */}
        {approvalStatus === 'pending' && (
          <>
            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
              Awaiting Session Approval
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your login session is awaiting approval from your main device.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Please keep this page open. You will be redirected automatically once approved.
            </p>
            
            {/* Loading Spinner */}
            <div className="border-4 border-gray-200 border-l-blue-500 rounded-full w-8 h-8 animate-spin mx-auto my-5"></div>
          </>
        )}
        
        {/* Rejected State */}
        {approvalStatus === 'rejected' && (
          <>
            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
              Session Approval Rejected
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your login session was rejected or could not be approved.
            </p>
          </>
        )}
        
        {/* Sign Out Button */}
        <button 
          onClick={handleSignOut} 
          className="bg-red-600 text-white border-none py-2.5 px-5 rounded cursor-pointer text-base mt-5 transition-colors duration-300 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default WaitingApprovalPage;