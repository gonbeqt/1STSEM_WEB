import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { APP_TOAST_EVENT, AppToastEvent, ToastContextValue, ToastItem, ToastOptions } from './types';

const ToastContext = createContext<ToastContextValue | null>(null);

const genId = () => Math.random().toString(36).slice(2);

export const ToastProvider: React.FC<{ children: React.ReactNode } > = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, any>>({});

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const scheduleAutoClose = useCallback((toast: ToastItem) => {
    if (toast.duration > 0) {
      const id = setTimeout(() => dismiss(toast.id), toast.duration);
      timers.current[toast.id] = id;
    }
  }, [dismiss]);

  const show = useCallback((opts: ToastOptions): string => {
    const id = opts.id || genId();
    const toast: ToastItem = {
      id,
      type: opts.type || 'info',
      title: opts.title,
      description: opts.description,
      duration: opts.duration ?? 4000,
      createdAt: Date.now(),
    };
    setToasts(prev => [...prev, toast]);
    scheduleAutoClose(toast);
    return id;
  }, [scheduleAutoClose]);

  const success = useCallback((description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => (
    show({ ...opts, type: 'success', description })
  ), [show]);
  const error = useCallback((description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => (
    show({ ...opts, type: 'error', description })
  ), [show]);
  const info = useCallback((description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => (
    show({ ...opts, type: 'info', description })
  ), [show]);
  const warning = useCallback((description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => (
    show({ ...opts, type: 'warning', description })
  ), [show]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as AppToastEvent;
      const { type = 'info', title, description, duration } = ev.detail || {};
      show({ type, title, description, duration });
    };
    window.addEventListener(APP_TOAST_EVENT, handler as EventListener);
    return () => window.removeEventListener(APP_TOAST_EVENT, handler as EventListener);
  }, [show]);

  const value = useMemo<ToastContextValue>(() => ({
    show, success, error, info, warning, dismiss,
    clear: () => setToasts([]),
  }), [dismiss, error, info, show, success, warning]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[99999] flex w-full max-w-sm flex-col gap-3">
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onClose={() => onDismiss(t.id)} />)
      )}
    </div>
  );
};

const tone = (type: ToastItem['type']) => {
  switch (type) {
    case 'success': return { bg: 'bg-green-50', text: 'text-green-800', ring: 'ring-green-200' };
    case 'error':   return { bg: 'bg-red-50',   text: 'text-red-800',   ring: 'ring-red-200' };
    case 'warning': return { bg: 'bg-yellow-50',text: 'text-yellow-800',ring: 'ring-yellow-200' };
    default:        return { bg: 'bg-blue-50',  text: 'text-blue-800',  ring: 'ring-blue-200' };
  }
};

const ToastCard: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  const t = tone(toast.type);
  return (
    <div className={`rounded-xl ${t.bg} ${t.text} ring-1 ${t.ring} shadow-sm px-4 py-3 flex items-start gap-3 animate-[fadeIn_150ms_ease-out]`}>      
      <div className="flex-1">
        {toast.title && <p className="text-sm font-semibold leading-5">{toast.title}</p>}
        {toast.description && <p className="text-sm leading-5 opacity-90">{toast.description}</p>}
      </div>
      <button onClick={onClose} aria-label="Dismiss" className="text-xs opacity-70 hover:opacity-100">✕</button>
    </div>
  );
};

export const dispatchAppToast = (detail: { type?: ToastOptions['type']; title?: string; description?: string; duration?: number }) => {
  const ev = new CustomEvent(APP_TOAST_EVENT, { detail });
  window.dispatchEvent(ev);
};
