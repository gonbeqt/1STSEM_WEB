import { useState, useEffect, useCallback } from 'react';
import { useViewModel } from './useViewModel';
import { SessionViewModel } from '../../domain/viewmodel/SessionViewModel';
import { Session } from '../../domain/entities/SessionEntities';
import { autorun } from 'mobx';

export const useSessions = () => {
  const viewModel = useViewModel(SessionViewModel);
  const [sessions, setSessions] = useState<Session[]>(viewModel.sessions);
  const [loading, setLoading] = useState(viewModel.isLoading);
  const [error, setError] = useState<string | null>(viewModel.error);

  useEffect(() => {
    const disposer = autorun(() => {
      setSessions(viewModel.sessions);
      setLoading(viewModel.isLoading);
      setError(viewModel.error);
    });

    viewModel.fetchSessions();

    return () => {
      disposer();
    };
  }, [viewModel]);

  const revokeSession = useCallback(async (sid: string) => {
    await viewModel.revokeSession(sid);
  }, [viewModel]);

  const transferMainDevice = useCallback(async (sid: string) => {
    await viewModel.transferMainDevice(sid);
  }, [viewModel]);

  return {
    sessions,
    loading,
    error,
    revokeSession,
    transferMainDevice,
    refreshSessions: viewModel.fetchSessions.bind(viewModel), // Bind fetchSessions to viewModel
  };
};
