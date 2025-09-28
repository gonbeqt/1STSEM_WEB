import React from 'react';
import { useSessions } from '../../../../hooks/useSessions';
import { Session } from '../../../../../domain/entities/SessionEntities';
import { format } from 'date-fns';
import { useViewModel } from '../../../../hooks/useViewModel';
import { SessionViewModel } from '../../../../../domain/viewmodel/SessionViewModel';
import { RefreshCcw, Monitor, Smartphone, Tablet } from 'lucide-react';

export const EmoployeeSessionsPage: React.FC = () => {
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

    const getDeviceIcon = (userAgent: string) => {
        if (userAgent.includes('iPhone') || userAgent.includes('Android')) {
            return <Smartphone className="w-4 h-4 text-gray-600" />;
        }
        if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
            return <Tablet className="w-4 h-4 text-gray-600" />;
        }
        return <Monitor className="w-4 h-4 text-gray-600" />;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600 text-lg">Loading sessions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 m-5">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Sessions</h1>
                <button 
                    onClick={refreshSessions} 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700 font-medium"
                >
                    <RefreshCcw size={18} />
                    Refresh
                </button>
            </div>

            {/* Revoke Others Button */}
            {isCurrentSessionMainDevice && (
                <div className="mb-6">
                    <button 
                        onClick={handleRevokeOtherSessions}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                        Revoke Other Sessions
                    </button>
                </div>
            )}

            {/* Sessions List - Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {sessions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No sessions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Device</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Session ID</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Browser</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Seen</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sessions.map((session: Session) => (
                                    <tr 
                                        key={session.sid}
                                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                                            session.is_current ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {getDeviceIcon(session.user_agent)}
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {formatDeviceName(session.device_name)}
                                                    </p>
                                                    {session.is_current && (
                                                        <span className="text-xs text-blue-600 font-medium">Current Session</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                {session.sid.substring(0, 8)}...
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-gray-900">{session.ip}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-gray-900">{formatUserAgent(session.user_agent)}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm text-gray-900">
                                                    {format(new Date(session.created_at), 'MMM dd, yyyy')}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {format(new Date(session.created_at), 'h:mm a')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {session.last_seen ? (
                                                <div>
                                                    <p className="text-sm text-gray-900">
                                                        {format(new Date(session.last_seen), 'MMM dd, yyyy')}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {format(new Date(session.last_seen), 'h:mm a')}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">Never</p>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    session.approved 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {session.approved ? 'Approved' : 'Pending'}
                                                </span>
                                                {session.is_main_device && (
                                                    <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                                        Main Device
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                {isCurrentSessionMainDevice && (
                                                    <>
                                                        {!session.approved && (
                                                            <button 
                                                                onClick={() => handleApproveSession(session.sid)}
                                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors duration-200"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {session.approved && !session.is_current && (
                                                            <button 
                                                                onClick={() => handleTransferMainDevice(session.sid)}
                                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
                                                            >
                                                                Transfer
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {(isCurrentSessionMainDevice || session.is_current) && (
                                                    <button 
                                                        onClick={() => handleRevoke(session.sid)}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};