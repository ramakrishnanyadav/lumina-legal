import { motion, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useState, useRef, useCallback } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  icon?: ReactNode;
}

const springConfig = { damping: 20, stiffness: 300 };

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon,
}: AnimatedButtonProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Magnetic effect
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);
  
  // Gradient animation position
  const gradientPosition = useSpring(0, { damping: 30, stiffness: 100 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Magnetic pull within 100px radius
    if (distance < 100) {
      const factor = (1 - distance / 100) * 0.3;
      mouseX.set(distanceX * factor);
      mouseY.set(distanceY * factor);
    }
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  const baseClasses = 'relative overflow-hidden font-semibold rounded-xl transition-colors duration-300';
  
  const variantClasses = {
    primary: 'text-primary-foreground hover:shadow-lg hover:shadow-primary/25',
    secondary: 'glass border-white/20 text-foreground hover:bg-white/10',
    ghost: 'bg-transparent text-foreground hover:bg-white/5',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        variant === 'primary' ? 'animated-gradient-bg' : ''
      }`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseX,
        y: mouseY,
        background: variant === 'primary' 
          ? 'linear-gradient(90deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%), hsl(187 100% 50%))'
          : undefined,
        backgroundSize: variant === 'primary' ? '300% 100%' : undefined,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={variant === 'primary' ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : undefined}
      transition={variant === 'primary' ? {
        backgroundPosition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        },
        scale: springConfig,
      } : { type: 'spring', ...springConfig }}
      disabled={loading}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            left: ripple.x - 150,
            top: ripple.y - 150,
          }}
        />
      ))}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;
