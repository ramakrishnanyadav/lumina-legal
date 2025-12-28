import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Loader2 } from 'lucide-react';

interface PremiumCrimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  maxLength?: number;
}

const placeholderExamples = [
  "Someone stole my laptop from the office...",
  "I was assaulted during a road rage incident...",
  "Received threatening messages on social media...",
  "My business partner embezzled company funds...",
  "Neighbor is trespassing on my property repeatedly...",
];

const springConfig = { damping: 20, stiffness: 300 };

const PremiumCrimeInput = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  maxLength = 2000,
}: PremiumCrimeInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Animated placeholder cycling
  useEffect(() => {
    if (value) return; // Don't animate if there's content

    const currentExample = placeholderExamples[placeholderIndex];
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // Typing effect
      const typeChar = () => {
        if (charIndex <= currentExample.length) {
          setDisplayedPlaceholder(currentExample.slice(0, charIndex));
          charIndex++;
          timeout = setTimeout(typeChar, 50);
        } else {
          // Pause at end
          timeout = setTimeout(() => setIsTyping(false), 2000);
        }
      };
      typeChar();
    } else {
      // Deleting effect
      let deleteIndex = currentExample.length;
      const deleteChar = () => {
        if (deleteIndex >= 0) {
          setDisplayedPlaceholder(currentExample.slice(0, deleteIndex));
          deleteIndex--;
          timeout = setTimeout(deleteChar, 30);
        } else {
          // Move to next example
          setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
          setIsTyping(true);
        }
      };
      deleteChar();
    }

    return () => clearTimeout(timeout);
  }, [placeholderIndex, isTyping, value]);

  // Character count color
  const getCharCountColor = () => {
    if (value.length >= 200) return 'text-green-400';
    if (value.length >= 100) return 'text-yellow-400';
    return 'text-muted-foreground';
  };

  const getCharCountBg = () => {
    if (value.length >= 200) return 'bg-green-400/10';
    if (value.length >= 100) return 'bg-yellow-400/10';
    return 'bg-white/5';
  };

  // Handle microphone (simulated)
  const toggleMicrophone = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        onChange(value + " [Voice transcription would appear here]");
        setIsListening(false);
      }, 3000);
    }
  };

  const handleSubmit = () => {
    setHasClicked(true);
    onSubmit();
    setTimeout(() => setHasClicked(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Main Input Container */}
      <div className="relative">
        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-[2px] rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%), hsl(187 100% 50%))',
            backgroundSize: '300% 300%',
          }}
          animate={{
            opacity: isFocused ? 1 : 0.4,
            backgroundPosition: isFocused ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
          }}
          transition={{
            opacity: { duration: 0.5 },
            backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' },
          }}
        />

        {/* Glass container */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: isFocused
              ? '0 0 40px rgba(0, 217, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
              : 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'box-shadow 0.5s ease',
          }}
        >
          {/* Textarea with resize handle */}
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={maxLength}
              className="w-full min-h-[200px] p-6 bg-transparent border-none outline-none resize-y text-foreground text-lg leading-relaxed"
              style={{ caretColor: 'hsl(187 100% 50%)', maxHeight: '500px' }}
              data-draggable
            />
            
            {/* Resize indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <path d="M22 22L12 22M22 22L22 12M22 22L16 16" />
              </svg>
            </div>

            {/* Animated placeholder */}
            <AnimatePresence>
              {!value && (
                <motion.div
                  className="absolute top-6 left-6 right-20 pointer-events-none text-lg text-muted-foreground/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {displayedPlaceholder}
                  <motion.span
                    className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Microphone button */}
            <motion.button
              type="button"
              onClick={toggleMicrophone}
              className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: isListening 
                  ? 'linear-gradient(135deg, hsl(0 85% 55%), hsl(336 100% 50%))' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isListening ? {
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                  '0 0 40px rgba(239, 68, 68, 0.5)',
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.button>

            {/* Listening indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="absolute top-4 right-20 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: 'spring', ...springConfig }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-red-400">Listening...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with character count */}
          <div className="px-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Progress bar */}
              <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: value.length >= 200 
                      ? 'linear-gradient(90deg, hsl(142 76% 50%), hsl(160 84% 40%))'
                      : value.length >= 100
                        ? 'linear-gradient(90deg, hsl(45 100% 50%), hsl(35 100% 50%))'
                        : 'linear-gradient(90deg, hsl(225 15% 40%), hsl(225 15% 50%))',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((value.length / 200) * 100, 100)}%` }}
                  transition={{ type: 'spring', ...springConfig }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {value.length < 100 ? 'Add more details' : value.length < 200 ? 'Good detail' : 'Great!'}
              </span>
            </div>

            {/* Character counter */}
            <motion.div
              className={`px-3 py-1.5 rounded-lg font-mono text-sm ${getCharCountColor()} ${getCharCountBg()}`}
              animate={{
                scale: value.length > 0 && value.length % 50 === 0 ? [1, 1.1, 1] : 1,
              }}
              transition={{ type: 'spring', ...springConfig }}
            >
              <motion.span
                key={value.length}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', ...springConfig }}
              >
                {value.length}
              </motion.span>
              <span className="text-muted-foreground"> / {maxLength}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || !value.trim()}
        className="w-full py-4 rounded-xl font-semibold text-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(90deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%), hsl(187 100% 50%))',
          backgroundSize: '300% 100%',
        }}
        whileHover={!isLoading && value.trim() ? { scale: 1.02 } : {}}
        whileTap={!isLoading && value.trim() ? { scale: 0.98 } : {}}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
          scale: { type: 'spring', ...springConfig },
        }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          }}
        />

        <span className="relative z-10 flex items-center justify-center gap-3 text-primary-foreground">
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-6 h-6" />
              </motion.div>
              <span>Analyzing Your Case...</span>
            </>
          ) : (
            <>
              <motion.div
                animate={hasClicked ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Search className="w-6 h-6" />
              </motion.div>
              <span>Analyze Legal Situation</span>
            </>
          )}
        </span>

        {/* Ripple effect on click */}
        <AnimatePresence>
          {hasClicked && !isLoading && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-xl"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ originX: 0.5, originY: 0.5 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Helper text */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Describe the incident in detail for accurate legal section identification
      </motion.p>
    </div>
  );
};

export default PremiumCrimeInput;
