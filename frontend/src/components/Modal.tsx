import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop blur trigger click-out */}
      <div
        className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Frosted Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800/80 p-6 z-10 transition-all transform scale-100">
        {/* Title Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 text-2xl leading-none transition-colors p-1"
          >
            &times;
          </button>
        </div>
        {/* Body content */}
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
