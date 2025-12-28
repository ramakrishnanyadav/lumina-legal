import { motion, useInView, Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';

type RevealType = 'fade' | 'slide' | 'scale' | 'mask' | 'split';

interface ScrollRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const slideVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const getVariants = (type: RevealType): Variants => {
  switch (type) {
    case 'slide':
      return slideVariants;
    case 'scale':
      return scaleVariants;
    default:
      return fadeVariants;
  }
};

const ScrollReveal = ({
  children,
  type = 'fade',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getVariants(type)}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Masked reveal component
export const MaskedReveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const clipPaths = {
    up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
    down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
    left: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
    right: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: clipPaths[direction][0], opacity: 0 }}
        animate={isInView ? { clipPath: clipPaths[direction][1], opacity: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;
