import React from 'react';

import { useSessions } from '../../../../hooks/useSessions';
import { Session } from '../../../../../domain/entities/SessionEntities'; // Corrected import
import { format } from 'date-fns';
import '../../../../components/SideNavbar.css';
import './sessions.css';
import { useViewModel } from '../../../../hooks/useViewModel';
import { SessionViewModel } from '../../../../../domain/viewmodel/SessionViewModel';
import { RefreshCcw, RotateCcw } from 'lucide-react'; // Import RefreshCcw icon

export const ManagerSessionsPage: React.FC = () => {
    const { sessions, loading, error, revokeSession, transferMainDevice, refreshSessions } = useSessions(); // Destructure refreshSessions
    const sessionViewModel = useViewModel(SessionViewModel);

    const currentSession = sessions.find(session => session.is_current);
    const isCurrentSessionMainDevice = currentSession?.is_main_device || false;

    const handleRevoke = async (sessionId: string) => {
        await revokeSession(sessionId);
        window.location.reload();
    };

    const handleApproveSession = async (sessionId: string) => {
        try {
            await sessionViewModel.approveSession(sessionId);
            alert('Session approved successfully!');
           window.location.reload();
        } catch (err: any) {
            alert(`Error approving session: ${err.message}`);
        }
    };

    const handleTransferMainDevice = async (sessionId: string) => {
        try {
            await transferMainDevice(sessionId);
            alert('Main device privileges transferred successfully!');
            window.location.reload();
        } catch (err: any) {
            alert(`Error transferring main device: ${err.message}`);
        }
    };

    const handleRevokeOtherSessions = async () => {
        try {
            await sessionViewModel.revokeOtherSessions();
            alert('Other sessions revoked successfully!');
            window.location.reload();
        } catch (err: any) {
            alert(`Error revoking other sessions: ${err.message}`);
        }
    };

    const formatDeviceName = (deviceName: string) => {
        // Extract browser and OS info for cleaner display
        const parts = deviceName.split(' ');
        if (parts.length > 1) {
            return parts.slice(0, 3).join(' ');
        }
        return deviceName;
    };

    const formatUserAgent = (userAgent: string) => {
        // Extract key browser info
        const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
        if (match) {
            return match[0];
        }
        return userAgent.length > 30 ? userAgent.substring(0, 30) + '...' : userAgent;
    };

    if (loading) {
        return (
            <div className="sessions-loading-container">
                <p>Loading sessions...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="sessions-page">
            <div className="content">
                <div className="sessions-header">
                    <h1>Manage Sessions</h1>
                    <button onClick={refreshSessions} className="refresh-button" title="Refresh Sessions">
                          <RotateCcw size={20} />
                    </button>
                </div>
                {isCurrentSessionMainDevice && (
                    <button onClick={handleRevokeOtherSessions} className="revoke-others-button">
                        Revoke Other Sessions
                    </button>
                )}
                <div className="sessions-list">
                    {sessions.length === 0 ? (
                        <p>No sessions found.</p>
                    ) : (
                        sessions.map((session: Session) => (
                            <div 
                                key={session.sid} 
                                className={`session-card ${session.is_current ? 'current-session' : ''}`}
                            >
                                <div className="session-header">
                                    <div className="session-field session-id">
                                        <div className="label">Session ID:</div>
                                        <div className="value">{session.sid.substring(0, 8)}...</div>
                                    </div>
                                    
                                    <div className="session-field device-name">
                                        <div className="label">Device Name:</div>
                                        <div className="value">{formatDeviceName(session.device_name)}</div>
                                    </div>
                                    
                                    <div className="session-field">
                                        <div className="label">IP Address:</div>
                                        <div className="value">{session.ip}</div>
                                    </div>
                                    
                                    <div className="session-field user-agent">
                                        <div className="label">User Agent:</div>
                                        <div className="value">{formatUserAgent(session.user_agent)}</div>
                                    </div>
                                    
                                    <div className="session-field">
                                        <div className="label">Created At:</div>
                                        <div className="value">
                                            {format(new Date(session.created_at), 'MMM dd, yyyy')}<br/>
                                            <small>{format(new Date(session.created_at), 'h:mm a')}</small>
                                        </div>
                                    </div>
                                    
                                    <div className="session-field">
                                        <div className="label">Last Seen:</div>
                                        <div className="value">
                                            {session.last_seen ? (
                                                <>
                                                    {format(new Date(session.last_seen), 'MMM dd, yyyy')}<br/>
                                                    <small>{format(new Date(session.last_seen), 'h:mm a')}</small>
                                                </>
                                            ) : 'N/A'}
                                        </div>
                                    </div>
                                    
                                    <div className="session-field">
                                        <div className="label">Approved:</div>
                                        <div className="value">
                                            <span className={`status-badge ${session.approved ? 'approved' : 'not-approved'}`}>
                                                {session.approved ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="session-field">
                                        <div className="label">Current Session:</div>
                                        <div className="value">
                                            {session.is_current && (
                                                <span className="status-badge current">Yes</span>
                                            )}
                                            {!session.is_current && 'No'}
                                        </div>
                                    </div>
                                    
                                    <div className="session-field">
                                        <div className="label">Main Device:</div>
                                        <div className="value">
                                            {session.is_main_device && (
                                                <span className="status-badge main">Yes</span>
                                            )}
                                            {!session.is_main_device && 'No'}
                                        </div>
                                    </div>
                                    
                                    <div className="session-buttons">
                                        {isCurrentSessionMainDevice && (
                                            <>
                                                {!session.approved && (
                                                    <button 
                                                        onClick={() => handleApproveSession(session.sid)}  
                                                        className="approve-button"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {session.approved && !session.is_current && (
                                                    <button 
                                                        onClick={() => handleTransferMainDevice(session.sid)} 
                                                        className="transfer-main-button"
                                                    >
                                                        Transfer Main
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {(isCurrentSessionMainDevice || session.is_current) && (
                                            <button 
                                                onClick={() => handleRevoke(session.sid)} 
                                                className="revoke-button"
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};