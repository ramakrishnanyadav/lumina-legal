import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: boolean;
}

const GlassCard = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  gradient = false,
}: GlassCardProps) => {
  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
    >
      {gradient && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%))' }}
        />
      )}
      
      <div className={`relative glass rounded-2xl p-6 h-full ${gradient ? 'bg-card' : ''}`}>
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
