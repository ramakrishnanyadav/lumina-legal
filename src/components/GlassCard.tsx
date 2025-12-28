import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: boolean;
  index?: number;
}

const springConfig = { damping: 20, stiffness: 300 };

const GlassCard = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  gradient = false,
  index = 0,
}: GlassCardProps) => {
  // Calculate stagger delay based on index
  const staggerDelay = delay + index * 0.1;

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
      
      <div className={`relative glass rounded-2xl p-6 h-full ${gradient ? 'bg-card' : ''}`}>
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100"
          transition={{ type: 'spring', ...springConfig }}
        />
        
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
