import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Check, X, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import Confetti from './Confetti';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToasts must be used within ToastProvider');
  return context;
};

// Individual Toast Component
const ToastItem = ({ 
  toast, 
  onRemove, 
  index 
}: { 
  toast: Toast; 
  onRemove: () => void;
  index: number;
}) => {
  const [progress, setProgress] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const duration = toast.duration || 5000;

  useEffect(() => {
    if (toast.type === 'success') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        onRemove();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onRemove, toast.type]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.velocity.x) > 200 || Math.abs(info.offset.x) > 100) {
      onRemove();
    }
  };

  const icons = {
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'border-l-green-500 bg-green-500/10',
    error: 'border-l-red-500 bg-red-500/10',
    warning: 'border-l-yellow-500 bg-yellow-500/10',
    info: 'border-l-primary bg-primary/10',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-primary',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        y: index * 10,
      }}
      exit={{ 
        opacity: 0, 
        x: 300, 
        scale: 0.8,
        transition: { duration: 0.2 }
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, opacity }}
      className={`relative w-80 glass rounded-xl border-l-4 ${colors[toast.type]} overflow-hidden cursor-grab active:cursor-grabbing`}
    >
      {/* Confetti for success */}
      {showConfetti && toast.type === 'success' && (
        <div className="absolute inset-0 pointer-events-none">
          <Confetti active={showConfetti} particleCount={30} />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 15, 
            stiffness: 300,
            delay: 0.1 
          }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-500/20' : toast.type === 'error' ? 'bg-red-500/20' : toast.type === 'warning' ? 'bg-yellow-500/20' : 'bg-primary/20'}`}
        >
          {toast.type === 'success' ? (
            <motion.svg
              viewBox="0 0 24 24"
              className={`w-5 h-5 ${iconColors[toast.type]}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </motion.svg>
          ) : toast.type === 'error' ? (
            <motion.div
              initial={{ rotate: 45, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <X className={`w-5 h-5 ${iconColors[toast.type]}`} />
            </motion.div>
          ) : (
            <Icon className={`w-5 h-5 ${iconColors[toast.type]}`} />
          )}
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{toast.title}</p>
          {toast.message && (
            <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
          )}
        </div>

        {/* Swipe indicator */}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-muted-foreground/50"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Progress bar */}
      <motion.div
        className={`h-1 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : toast.type === 'warning' ? 'bg-yellow-500' : 'bg-primary'}`}
        initial={{ width: '100%' }}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.05 }}
      />

      {/* Error shake animation */}
      {toast.type === 'error' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ 
            x: [0, -5, 5, -5, 5, 0],
          }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Warning pulse */}
      {toast.type === 'warning' && (
        <motion.div
          className="absolute inset-0 bg-yellow-500/10 pointer-events-none"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

// Toast Container
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              index={index}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Hook for easy toast creation
export const usePremiumToast = () => {
  const { addToast } = useToasts();

  return {
    success: (title: string, message?: string) => 
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => 
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => 
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => 
      addToast({ type: 'info', title, message }),
  };
};

export default ToastProvider;
