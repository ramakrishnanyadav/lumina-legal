import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const springConfig = { damping: 20, stiffness: 300 };

const AnimatedCheckbox = ({
  checked: controlledChecked,
  onChange,
  label,
  disabled = false,
}: AnimatedCheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setInternalChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <motion.label
      className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', ...springConfig }}
    >
      <motion.div
        className="relative w-6 h-6 rounded-md flex items-center justify-center overflow-hidden"
        style={{
          background: isChecked ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isChecked ? 'transparent' : 'rgba(255, 255, 255, 0.2)'}`,
          boxShadow: isChecked 
            ? '0 0 20px rgba(0, 217, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)' 
            : 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
        animate={{
          scale: isChecked ? [1, 1.1, 1] : 1,
        }}
        transition={{ type: 'spring', ...springConfig }}
        onClick={handleToggle}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="absolute"
        >
          <motion.path
            d="M2 7L5.5 10.5L12 3.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isChecked ? 1 : 0,
              opacity: isChecked ? 1 : 0,
            }}
            transition={{ 
              type: 'spring',
              damping: 15,
              stiffness: 400,
              delay: isChecked ? 0.1 : 0,
            }}
          />
        </svg>
      </motion.div>

      {label && (
        <span className="text-foreground">{label}</span>
      )}
    </motion.label>
  );
};

export default AnimatedCheckbox;
