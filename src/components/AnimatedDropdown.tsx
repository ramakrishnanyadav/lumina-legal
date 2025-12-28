import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface AnimatedDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const springConfig = { damping: 20, stiffness: 300 };

const containerVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      ...springConfig,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', ...springConfig },
  },
};

const AnimatedDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}: AnimatedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        type="button"
        className="w-full px-4 py-3 rounded-xl flex items-center justify-between gap-2 text-left"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isOpen ? 'hsl(187 100% 50%)' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isOpen 
            ? '0 0 20px rgba(0, 217, 255, 0.2), inset 0 1px 2px rgba(0, 0, 0, 0.2)' 
            : 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', ...springConfig }}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption?.icon && <span className="mr-2">{selectedOption.icon}</span>}
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
            style={{
              background: 'rgba(10, 14, 39, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                className="w-full px-4 py-3 flex items-center gap-2 text-left transition-colors"
                style={{
                  background: value === option.value ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                }}
                variants={itemVariants}
                onClick={() => handleSelect(option.value)}
                whileHover={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  x: 4,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', ...springConfig }}
              >
                {option.icon && <span>{option.icon}</span>}
                <span className={value === option.value ? 'text-primary' : 'text-foreground'}>
                  {option.label}
                </span>
                {value === option.value && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', ...springConfig }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedDropdown;
