import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Loader2, Paperclip, Camera, Info } from 'lucide-react';

interface PremiumCrimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  maxLength?: number;
}

const easeOut = [0.25, 0.46, 0.45, 0.94];

// Static, fully visible placeholder
const placeholderText = "Describe your situation in detail. Example: Someone stole my laptop from the office, or I received threatening messages on social media...";

const PremiumCrimeInput = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  maxLength = 2000,
}: PremiumCrimeInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '200px'; // Reset to min height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, 200), 500)}px`;
    }
  }, [value]);

  // Character count color based on length
  const getCharCountColor = () => {
    if (value.length >= maxLength) return 'text-red-400';
    if (value.length >= 1500) return 'text-yellow-400';
    if (value.length >= 100) return 'text-cyan-400';
    return 'text-muted-foreground';
  };

  const getCharCountBg = () => {
    if (value.length >= maxLength) return 'bg-red-500/10';
    if (value.length >= 1500) return 'bg-yellow-500/10';
    if (value.length >= 100) return 'bg-cyan-500/10';
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
    if (!value.trim() || isLoading) return;
    setHasClicked(true);
    onSubmit();
    setTimeout(() => setHasClicked(false), 500);
  };

  const isButtonEnabled = value.trim().length > 0 && !isLoading;
  const showPulse = value.length >= 50 && !isLoading;

  return (
    <div className="space-y-4">
      {/* Main Input Container */}
      <div className="relative">
        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl pointer-events-none"
          style={{
            background: isFocused 
              ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))' 
              : 'rgba(255, 255, 255, 0.1)',
            opacity: isFocused ? 1 : 1,
          }}
          animate={{
            boxShadow: isFocused ? '0 0 20px rgba(0, 217, 255, 0.3)' : 'none',
          }}
          transition={{ duration: 0.3, ease: easeOut }}
        />

        {/* Glass container */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Textarea with auto-expand */}
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={maxLength}
              placeholder={placeholderText}
              className="w-full p-6 pr-20 bg-transparent border-none outline-none resize-none text-foreground text-base md:text-lg leading-relaxed placeholder:text-muted-foreground/50 placeholder:leading-relaxed"
              style={{ 
                caretColor: 'hsl(187 100% 50%)', 
                minHeight: '200px',
                maxHeight: '500px',
                fontSize: '16px', // Prevents iOS zoom on focus
              }}
            />

            {/* Microphone button - larger with better hover/active states */}
            <div className="absolute top-4 right-4">
              <motion.button
                type="button"
                onClick={toggleMicrophone}
                onMouseEnter={() => setShowTooltip('mic')}
                onMouseLeave={() => setShowTooltip(null)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative"
                style={{
                  background: isListening 
                    ? 'linear-gradient(135deg, hsl(0 85% 55%), hsl(336 100% 50%))' 
                    : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                    '0 0 40px rgba(239, 68, 68, 0.5)',
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                  ],
                } : {}}
                transition={isListening ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-muted-foreground" />
                )}
              </motion.button>

              {/* Tooltip for mic */}
              <AnimatePresence>
                {showTooltip === 'mic' && !isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg bg-background border border-border shadow-lg text-xs whitespace-nowrap z-10"
                  >
                    Voice input (click to record)
                    <div className="absolute -top-1 right-4 w-2 h-2 rotate-45 bg-background border-l border-t border-border" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Listening indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="absolute top-4 right-20 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(239, 68, 68, 0.15)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
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

          {/* Footer with actions and character count */}
          <div className="px-4 md:px-6 pb-4 flex items-center justify-between gap-4">
            {/* Left side - attachment buttons */}
            <div className="flex items-center gap-2">
              {[
                { icon: Paperclip, label: 'Attach File', id: 'attach' },
                { icon: Camera, label: 'Add Photo', id: 'photo' },
              ].map((action) => (
                <div key={action.id} className="relative">
                  <motion.button
                    type="button"
                    onMouseEnter={() => setShowTooltip(action.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <action.icon className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltip === action.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-background border border-border shadow-lg text-xs whitespace-nowrap z-10"
                      >
                        {action.label}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-background border-r border-b border-border" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Progress indicator */}
              <div className="hidden md:flex items-center gap-2 ml-2">
                <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: value.length >= 200 
                        ? 'linear-gradient(90deg, hsl(142 76% 50%), hsl(160 84% 40%))'
                        : value.length >= 100
                          ? 'linear-gradient(90deg, hsl(187 100% 50%), hsl(200 100% 50%))'
                          : 'linear-gradient(90deg, hsl(225 15% 40%), hsl(225 15% 50%))',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((value.length / 200) * 100, 100)}%` }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {value.length < 100 ? 'Add more details' : value.length < 200 ? 'Good' : 'Great!'}
                </span>
              </div>
            </div>

            {/* Right side - character counter with proper positioning */}
            <motion.div
              className={`px-3 py-1.5 rounded-lg font-mono text-sm ${getCharCountColor()} ${getCharCountBg()}`}
              style={{ marginRight: '4px', marginBottom: '0' }}
            >
              <motion.span
                key={value.length}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                {value.length}
              </motion.span>
              <span className="text-muted-foreground/70"> / {maxLength}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Submit Button with improved states */}
      <div className="relative">
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          className="w-full py-4 rounded-xl font-semibold text-lg relative overflow-hidden transition-all"
          style={{
            background: isButtonEnabled
              ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))'
              : 'hsl(var(--muted))',
            opacity: isButtonEnabled ? 1 : 0.4,
            cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
          }}
          whileHover={isButtonEnabled ? { scale: 1.02 } : {}}
          whileTap={isButtonEnabled ? { scale: 0.98 } : {}}
          animate={showPulse ? {
            boxShadow: [
              '0 0 20px rgba(0, 217, 255, 0.2)',
              '0 0 40px rgba(0, 217, 255, 0.4)',
              '0 0 20px rgba(0, 217, 255, 0.2)',
            ],
          } : {}}
          transition={showPulse ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
          onMouseEnter={() => !isButtonEnabled && setShowTooltip('submit')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <motion.span 
            className="relative z-10 flex items-center justify-center gap-3"
            style={{ color: isButtonEnabled ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))' }}
            animate={isLoading ? { width: 'auto' } : {}}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Situation</span>
              </>
            )}
          </motion.span>

          {/* Ripple effect on click */}
          <AnimatePresence>
            {hasClicked && !isLoading && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0.5, originY: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip for disabled state */}
        <AnimatePresence>
          {showTooltip === 'submit' && !isButtonEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-background border border-border shadow-lg text-sm flex items-center gap-2 z-10"
            >
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Please describe your situation first</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-background border-r border-b border-border" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper text */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Provide a detailed description for preliminary statutory analysis
      </motion.p>
    </div>
  );
};

export default PremiumCrimeInput;
