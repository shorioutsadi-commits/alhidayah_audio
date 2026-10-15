import React from 'react';
import { Info, CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const bgColors = {
    info: 'bg-stone-900 text-white',
    success: 'bg-emerald-700 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-rose-700 text-white',
  };

  const icons = {
    info: <Info className="w-4 h-4 text-orange-400 shrink-0" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-200 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />,
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto ${bgColors[toast.type]}`}>
        <div className="flex items-center gap-2 min-w-0">
          {icons[toast.type]}
          <p className="text-xs font-semibold leading-tight">{toast.text}</p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
          aria-label="বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
