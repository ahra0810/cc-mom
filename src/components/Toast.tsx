import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-primary-600 text-white',
};

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = String(++toastId);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  /* 여러 줄 메시지는 더 오래 노출 */
  const isMultiline = toast.message.includes('\n');
  const duration = isMultiline ? 6000 : 3000;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss, duration]);

  return (
    <div className={`pointer-events-auto flex items-start gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-slideUp max-w-md ${STYLES[toast.type]}`}>
      <span className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</span>
      <span className="whitespace-pre-line leading-relaxed flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="flex-shrink-0 ml-1 opacity-70 hover:opacity-100 p-0.5 mt-0.5">
        <X size={14} />
      </button>
    </div>
  );
}
