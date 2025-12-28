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

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

const GlassCard = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  gradient = false,
  index = 0,
  variant = 'default',
}: GlassCardProps) => {
  // Calculate stagger delay based on index (50ms between elements)
  const staggerDelay = delay + index * 0.05;

  const variantClasses = {
    default: 'glass',
    dark: 'glass-dark',
    strong: 'glass-strong',
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.4,
        delay: staggerDelay,
        ease: easeOut,
      }}
      whileHover={hover ? { 
        y: -4, 
        transition: { duration: 0.3, ease: easeOut }
      } : undefined}
    >
      {gradient && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
          transition={{ duration: 0.3, ease: easeOut }}
        />
      )}
      
      <div className={`relative ${variantClasses[variant]} rounded-2xl p-6 h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-primary/5`}>
        {/* Subtle inner glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.05) 0%, transparent 50%)',
          }}
        />
        
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
