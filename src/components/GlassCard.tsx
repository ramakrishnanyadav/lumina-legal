import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: boolean;
  index?: number;
  variant?: 'default' | 'dark' | 'strong';
}

const springConfig = { damping: 20, stiffness: 300 };

const GlassCard = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  gradient = false,
  index = 0,
  variant = 'default',
}: GlassCardProps) => {
  // Calculate stagger delay based on index
  const staggerDelay = delay + index * 0.1;

  const variantClasses = {
    default: 'glass',
    dark: 'glass-dark',
    strong: 'glass-strong',
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        type: 'spring',
        ...springConfig,
        delay: staggerDelay,
      }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        transition: { type: 'spring', ...springConfig }
      } : undefined}
    >
      {gradient && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100"
          style={{ background: 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%))' }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ type: 'spring', ...springConfig }}
        />
      )}
      
      <div className={`relative ${variantClasses[variant]} rounded-2xl p-6 h-full overflow-hidden`}>
        {/* Inner glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Subtle gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, transparent 50%, rgba(123, 47, 247, 0.05) 100%)',
          }}
        />
        
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
