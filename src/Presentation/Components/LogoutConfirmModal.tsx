import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LogoutConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  errorMessage?: string | null;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  open,
  onConfirm,
  onCancel,
  isProcessing = false,
  errorMessage,
}) => {
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  useEffect(() => {
    if (!open || !portalTarget) {
      return;
    }

    const originalOverflow = portalTarget.style.overflow;
    portalTarget.style.overflow = 'hidden';

    return () => {
      portalTarget.style.overflow = originalOverflow;
    };
  }, [open, portalTarget]);

  if (!open || !portalTarget) {
    return null;
  }

  const handleBackdropClick = () => {
    if (!isProcessing) {
      onCancel();
    }
  };

  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={stopPropagation}
      >
        <h2 className="text-lg font-semibold text-gray-900">Sign out?</h2>
        <p className="mt-2 text-sm text-gray-600">
          You will need to sign in again to access your account.
        </p>
        {errorMessage && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  );
};

export default LogoutConfirmModal;
