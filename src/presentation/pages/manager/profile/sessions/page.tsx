import React from 'react';
import { useSessions } from '../../../../hooks/useSessions';
import { Session } from '../../../../../domain/entities/SessionEntities';
import { format } from 'date-fns';
import { useViewModel } from '../../../../hooks/useViewModel';
import { SessionViewModel } from '../../../../../domain/viewmodel/SessionViewModel';
import { RefreshCcw } from 'lucide-react';

export const ManagerSessionsPage: React.FC = () => {
    const { sessions, loading, error, revokeSession, transferMainDevice, refreshSessions } = useSessions();
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
        const parts = deviceName.split(' ');
        if (parts.length > 1) {
            return parts.slice(0, 3).join(' ');
        }
        return deviceName;
    };

    const formatUserAgent = (userAgent: string) => {
        const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
        if (match) {
            return match[0];
        }
        return userAgent.length > 30 ? userAgent.substring(0, 30) + '...' : userAgent;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full w-full text-xl text-gray-600">
                <p>Loading sessions...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-5 font-sans text-black">
            <div className="content">
                <div className="flex justify-between items-center w-full">
                    <h1 className="mb-5 text-2xl font-bold text-black">Manage Sessions</h1>
                    <button onClick={refreshSessions} className="h-10 rounded-lg bg-gray-200 p-2 hover:bg-gray-300 transition-colors" title="Refresh Sessions">
                        <RefreshCcw size={20} />
                    </button>
                </div>
                {isCurrentSessionMainDevice && (
                    <button onClick={handleRevokeOtherSessions} className="mb-5 bg-yellow-400 text-gray-900 border-none py-3 px-5 rounded-md text-sm font-medium hover:bg-yellow-500 transition-colors">
                        Revoke Other Sessions
                    </button>
                )}
                <div className="flex flex-col gap-2.5">
                    {sessions.length === 0 ? (
                        <p>No sessions found.</p>
                    ) : (
                        sessions.map((session: Session) => (
                            <div 
                                key={session.sid} 
                                className={`bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm ${session.is_current ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
                            >
                                <div className="grid grid-cols-[1fr_2fr_1fr_3fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center min-h-10 xl:grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr_auto] md:grid-cols-1">
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Session ID:</div>
                                        <div className="text-gray-800 text-xs font-mono">{session.sid.substring(0, 8)}...</div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Device Name:</div>
                                        <div className="text-gray-800 text-xs leading-tight">{formatDeviceName(session.device_name)}</div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">IP Address:</div>
                                        <div className="text-gray-800 text-sm break-all">{session.ip}</div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">User Agent:</div>
                                        <div className="text-gray-800 text-xs leading-tight">{formatUserAgent(session.user_agent)}</div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Created At:</div>
                                        <div className="text-gray-800 text-sm">
                                            {format(new Date(session.created_at), 'MMM dd, yyyy')}<br/>
                                            <small className="text-xs">{format(new Date(session.created_at), 'h:mm a')}</small>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Last Seen:</div>
                                        <div className="text-gray-800 text-sm">
                                            {session.last_seen ? (
                                                <>
                                                    {format(new Date(session.last_seen), 'MMM dd, yyyy')}<br/>
                                                    <small className="text-xs">{format(new Date(session.last_seen), 'h:mm a')}</small>
                                                </>
                                            ) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Approved:</div>
                                        <div className="text-gray-800 text-sm">
                                            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase ${session.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {session.approved ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Current Session:</div>
                                        <div className="text-gray-800 text-sm">
                                            {session.is_current ? (
                                                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase bg-blue-100 text-blue-800">Yes</span>
                                            ) : 'No'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] md:items-center md:gap-2.5">
                                        <div className="font-bold text-xs text-gray-600 uppercase tracking-[0.5px] mb-0.5 md:mb-0">Main Device:</div>
                                        <div className="text-gray-800 text-sm">
                                            {session.is_main_device ? (
                                                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase bg-yellow-100 text-yellow-800">Yes</span>
                                            ) : 'No'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap md:mt-2.5 md:justify-start">
                                        {isCurrentSessionMainDevice && (
                                            <>
                                                {!session.approved && (
                                                    <button 
                                                        onClick={() => handleApproveSession(session.sid)}  
                                                        className="px-3 py-1.5 bg-green-600 text-white border-none rounded-md text-xs font-medium hover:bg-green-700 transition-all"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {session.approved && !session.is_current && (
                                                    <button 
                                                        onClick={() => handleTransferMainDevice(session.sid)} 
                                                        className="px-3 py-1.5 bg-blue-600 text-white border-none rounded-md text-xs font-medium hover:bg-blue-700 transition-all"
                                                    >
                                                        Transfer Main
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {(isCurrentSessionMainDevice || session.is_current) && (
                                            <button 
                                                onClick={() => handleRevoke(session.sid)} 
                                                className="px-3 py-1.5 bg-red-600 text-white border-none rounded-md text-xs font-medium hover:bg-red-700 transition-all"
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