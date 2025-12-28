import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { Scale, Gavel, Check, Loader2 } from 'lucide-react';

// Full Page Loader with morphing shapes
interface FullPageLoaderProps {
  isLoading: boolean;
  variant?: 'shapes' | 'scales' | 'gavel';
}

export const FullPageLoader = ({ 
  isLoading, 
  variant = 'shapes' 
}: FullPageLoaderProps) => {
  const [shapeIndex, setShapeIndex] = useState(0);
  const shapes = ['circle', 'square', 'triangle', 'circle'];

  useEffect(() => {
    if (variant === 'shapes' && isLoading) {
      const interval = setInterval(() => {
        setShapeIndex(prev => (prev + 1) % shapes.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isLoading, variant]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {variant === 'shapes' && (
            <motion.div
              key={shapes[shapeIndex]}
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.4 }}
              style={{
                borderRadius: shapes[shapeIndex] === 'circle' ? '50%' 
                  : shapes[shapeIndex] === 'square' ? '10%' 
                  : '0%',
                clipPath: shapes[shapeIndex] === 'triangle' 
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                  : undefined,
              }}
            />
          )}

          {variant === 'scales' && (
            <motion.div className="relative">
              <Scale className="w-16 h-16 text-primary" />
              <motion.div
                className="absolute inset-0"
                animate={{ 
                  rotateZ: [0, 10, -10, 10, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Scale className="w-16 h-16 text-primary" />
              </motion.div>
            </motion.div>
          )}

          {variant === 'gavel' && (
            <motion.div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, -45, 0],
                  y: [0, -10, 5, 0],
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{ transformOrigin: 'bottom right' }}
              >
                <Gavel className="w-16 h-16 text-secondary" />
              </motion.div>
              
              {/* Impact effect */}
              <motion.div
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-primary/50"
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: 0.4,
                }}
              />
            </motion.div>
          )}

          <motion.p
            className="absolute bottom-1/3 text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Reviewing applicable statutes...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Skeleton with shimmer effect
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
  const baseClass = variant === 'circle' 
    ? 'rounded-full' 
    : variant === 'text' 
      ? 'rounded h-4' 
      : 'rounded-lg';

  return (
    <div 
      className={`relative overflow-hidden bg-muted ${baseClass} ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
    </div>
  );
};

// Skeleton Card
export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`glass rounded-xl p-6 ${className}`}>
    <div className="flex items-start gap-4">
      <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  </div>
);

// Animated Loading Button
interface LoadingButtonProps {
  isLoading: boolean;
  isSuccess?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LoadingButton = ({ 
  isLoading, 
  isSuccess = false,
  children, 
  onClick, 
  className = '',
  disabled = false,
}: LoadingButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold overflow-hidden ${className}`}
      animate={{
        scale: isLoading ? 0.98 : 1,
      }}
      whileHover={{ scale: isLoading ? 0.98 : 1.02 }}
      whileTap={{ scale: isLoading ? 0.98 : 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            {/* Custom spinner */}
            <motion.div
              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span>Reviewing...</span>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <Check className="w-5 h-5" />
            </motion.div>
            <span>Success!</span>
          </motion.div>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Progress Steps
interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps = ({ 
  steps, 
  currentStep, 
  className = '' 
}: ProgressStepsProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {index > 0 && (
                <motion.div
                  className="absolute top-4 right-1/2 h-0.5 -translate-y-1/2"
                  style={{ width: 'calc(100% - 32px)', right: '50%', marginRight: '16px' }}
                  initial={{ scaleX: 0, backgroundColor: 'hsl(var(--muted))' }}
                  animate={{ 
                    scaleX: isCompleted || isCurrent ? 1 : 0,
                    backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                  }}
                  transition={{ duration: 0.5, delay: isCompleted ? 0.2 : 0 }}
                />
              )}

              {/* Step circle */}
              <motion.div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-primary border-primary' 
                    : isCurrent 
                      ? 'bg-primary/20 border-primary' 
                      : 'bg-muted border-muted'
                }`}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  scale: { duration: 2, repeat: isCurrent ? Infinity : 0 }
                }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <span className={`text-xs font-bold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {index + 1}
                    </span>
                  )}
                </AnimatePresence>
                
                {/* Current step glow */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Step label */}
              <motion.p
                className={`mt-2 text-xs text-center ${
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}
                animate={{ opacity: isPending ? 0.5 : 1 }}
              >
                {step.label}
              </motion.p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Circular Progress
interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgress = ({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  className = '' 
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="hsl(var(--muted))"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="url(#progress-gradient)"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(187 100% 50%)" />
            <stop offset="100%" stopColor="hsl(266 93% 58%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Percentage text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
      </motion.div>
      
      {/* Completion checkmark */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-primary rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Check className="w-8 h-8 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
