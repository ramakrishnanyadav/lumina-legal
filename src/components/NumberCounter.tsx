import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface NumberCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

const NumberCounter = ({
  value,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: NumberCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const springValue = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) => {
    return latest.toFixed(decimals);
  });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        springValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, springValue, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

export default NumberCounter;
