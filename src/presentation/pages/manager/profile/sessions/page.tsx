import React, { useState } from 'react';

import { useSessions } from '../../../../hooks/useSessions';
import { Session } from '../../../../../domain/entities/SessionEntities'; // Corrected import
import { format } from 'date-fns';
import '../../../../components/SideNavbar.css';
import './sessions.css';
import { useViewModel } from '../../../../hooks/useViewModel';
import { SessionViewModel } from '../../../../../domain/models/SessionViewModel';

export const ManagerSessionsPage: React.FC = () => {
    const { sessions, loading, error, revokeSession } = useSessions();
    const sessionViewModel = useViewModel(SessionViewModel);

    const handleRevoke = async (sessionId: string) => {
        await revokeSession(sessionId);
    };

    const handleApproveSession = async (sessionId: string) => {
        try {
            await sessionViewModel.approveSession(sessionId);
            alert('Session approved successfully!');
        } catch (err: any) {
            alert(`Error approving session: ${err.message}`);
        }
    };

    const handleTransferMainDevice = async (sessionId: string) => {
        try {
            // Assuming SessionViewModel will have a transferMainDevice method
            // For now, we'll use a direct fetch call as the backend is not yet integrated with SessionViewModel
            // Once integrated, this should be: await sessionViewModel.transferMainDevice(sessionId);
            const response = await fetch('/api/auth/sessions/transfer-main-device/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ session_id: sessionId }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert('Main device privileges transferred successfully!');
                sessionViewModel.fetchSessions(); // Refresh sessions after transfer
            } else {
                alert(`Failed to transfer main device: ${data.message || response.statusText}`);
            }
        } catch (err: any) {
            alert(`Error transferring main device: ${err.message}`);
        }
    };

    const handleRevokeOtherSessions = async () => {
        try {
            await sessionViewModel.revokeOtherSessions();
            alert('Other sessions revoked successfully!');
        } catch (err: any) {
            alert(`Error revoking other sessions: ${err.message}`);
        }
    };

    if (loading) {
        return <div>Loading sessions...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="sessions-page">
            <div className="content">
                <h1>Manage Sessions</h1>
                <button onClick={handleRevokeOtherSessions} className="revoke-others-button">Revoke Other Sessions</button>
                <div className="sessions-list">
                    {sessions.length === 0 ? (
                        <p>No sessions found.</p>
                    ) : (
                        sessions.map((session: Session) => (
                            <div key={session.sid} className="session-card">
                                <p><strong>Session ID:</strong> {session.sid}</p>
                                <p><strong>Device Name:</strong> {session.device_name}</p>
                                <p><strong>IP Address:</strong> {session.ip}</p>
                                <p><strong>User Agent:</strong> {session.user_agent}</p>
                                <p><strong>Created At:</strong> {format(new Date(session.created_at), 'PPP p')}</p>
                                <p><strong>Last Seen:</strong> {session.last_seen ? format(new Date(session.last_seen), 'PPP p') : 'N/A'}</p>
                                <p><strong>Approved:</strong> {session.approved ? 'Yes' : 'No'}</p>
                                <p><strong>Current Session:</strong> {session.is_current ? 'Yes' : 'No'}</p>
                                {!session.approved && (
                                    <button onClick={() => handleApproveSession(session.sid)} className="approve-button">Approve</button>
                                )}
                                {session.approved && !session.is_current && (
                                    <button onClick={() => handleTransferMainDevice(session.sid)} className="transfer-main-button">Transfer Main</button>
                                )}
                                <button onClick={() => handleRevoke(session.sid)} className="revoke-button">Revoke</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};