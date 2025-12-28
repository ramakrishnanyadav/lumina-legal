import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import Confetti from './Confetti';

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

const springConfig = { damping: 20, stiffness: 300 };

const icons = {
  success: Check,
  error: X,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'from-green-500 to-emerald-500',
  error: 'from-red-500 to-rose-500',
  warning: 'from-yellow-500 to-orange-500',
  info: 'from-blue-500 to-cyan-500',
};

const glowColors = {
  success: 'rgba(34, 197, 94, 0.3)',
  error: 'rgba(239, 68, 68, 0.3)',
  warning: 'rgba(234, 179, 8, 0.3)',
  info: 'rgba(59, 130, 246, 0.3)',
};

let toastId = 0;
const listeners: Set<(toast: ToastMessage) => void> = new Set();

export const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
  const toast: ToastMessage = { id: ++toastId, type, title, message };
  listeners.forEach((listener) => listener(toast));
};

const AnimatedToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.type === 'success') {
        setConfettiOrigin({ x: 0.9, y: 0.1 });
        setShowConfetti(true);
      }

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <Confetti 
        active={showConfetti} 
        origin={confettiOrigin}
        onComplete={() => setShowConfetti(false)} 
      />
      
      <div className="fixed top-4 right-4 z-[90] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = icons[toast.type];

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: 'spring', ...springConfig }}
                className="relative max-w-sm"
              >
                <div
                  className="rounded-xl p-4 pr-12 backdrop-blur-xl"
                  style={{
                    background: 'rgba(10, 14, 39, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px ${glowColors[toast.type]}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[toast.type]} flex items-center justify-center flex-shrink-0`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', ...springConfig, delay: 0.1 }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <motion.h4
                        className="font-semibold text-foreground"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {toast.title}
                      </motion.h4>
                      {toast.message && (
                        <motion.p
                          className="text-sm text-muted-foreground mt-1"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {toast.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <motion.button
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    onClick={() => removeToast(toast.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </motion.button>

                  {/* Progress bar */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r ${colors[toast.type]}`}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AnimatedToast;
