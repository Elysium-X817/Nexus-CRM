import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useCRM();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-teal-500/50 text-teal-300';
        let bgClass = 'bg-[#1e1f1c]/95';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-monokai-pink/60 text-monokai-pink';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-monokai-cyan/60 text-monokai-cyan';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md animate-fade-in ${bgClass} ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon size={18} className="shrink-0" />
              <p className="text-sm font-medium text-monokai-text">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-monokai-dim hover:text-monokai-text transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
