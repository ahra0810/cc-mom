import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

type DialogVariant = 'danger' | 'warning' | 'info';

interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
}

interface ConfirmDialogContextType {
  confirm: (options: DialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
  confirm: () => Promise.resolve(false),
});

export function useConfirm() {
  return useContext(ConfirmDialogContext).confirm;
}

const VARIANT_STYLES: Record<DialogVariant, { icon: React.ReactNode; btnClass: string; iconBg: string }> = {
  danger: {
    icon: <Trash2 size={20} />,
    btnClass: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white',
    iconBg: 'bg-red-100 text-red-600',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    btnClass: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  info: {
    icon: <Info size={20} />,
    btnClass: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white',
    iconBg: 'bg-primary-100 text-primary-600',
  },
};

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<(DialogOptions & { resolve: (v: boolean) => void }) | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirmFn = useCallback((options: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ ...options, resolve });
    });
  }, []);

  useEffect(() => {
    if (dialog && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [dialog]);

  const handleConfirm = () => {
    dialog?.resolve(true);
    setDialog(null);
  };

  const handleCancel = () => {
    dialog?.resolve(false);
    setDialog(null);
  };

  // Trap focus and handle Escape
  useEffect(() => {
    if (!dialog) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dialog]);

  const variant = dialog?.variant || 'info';
  const styles = VARIANT_STYLES[variant];

  return (
    <ConfirmDialogContext.Provider value={{ confirm: confirmFn }}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4"
          onClick={handleCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-message"
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id="confirm-title" className="text-sm font-bold text-gray-800 mb-1">
                    {dialog.title}
                  </h3>
                  <p id="confirm-message" className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                    {dialog.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-4">
              <button
                ref={cancelRef}
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-pointer"
              >
                {dialog.cancelText || '취소'}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${styles.btnClass}`}
              >
                {dialog.confirmText || '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}
