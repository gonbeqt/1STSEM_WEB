export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
  id?: string;
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number; // ms
};

export type ToastItem = Required<Pick<ToastOptions, 'id' | 'type'>> & {
  title?: string;
  description?: string;
  duration: number;
  createdAt: number;
};

export type ToastContextValue = {
  show: (opts: ToastOptions) => string;
  success: (description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => string;
  error: (description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => string;
  info: (description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => string;
  warning: (description: string, opts?: Omit<ToastOptions, 'type' | 'description'>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const APP_TOAST_EVENT = 'app:toast';
export type AppToastEventDetail = {
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
};
export type AppToastEvent = CustomEvent<AppToastEventDetail>;
