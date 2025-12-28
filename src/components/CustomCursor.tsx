import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

interface CursorState {
  type: 'default' | 'interactive' | 'link' | 'button' | 'drag';
  text?: string;
}

const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>({ type: 'default' });
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    
    // Add trail
    setTrails(prev => {
      const newTrails = [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }];
      return newTrails.slice(-5);
    });
  }, [cursorX, cursorY]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  useEffect(() => {
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('button') || target.closest('[role="button"]')) {
        setCursorState({ type: 'button', text: '+' });
      } else if (target.closest('a')) {
        setCursorState({ type: 'link' });
      } else if (target.closest('[data-interactive]') || target.closest('.glass-card') || target.closest('[data-cursor="view"]')) {
        setCursorState({ type: 'interactive', text: 'View' });
      } else if (target.closest('[data-draggable]')) {
        setCursorState({ type: 'drag', text: 'Drag' });
      } else {
        setCursorState({ type: 'default' });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleElementHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleElementHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  const getCursorSize = () => {
    switch (cursorState.type) {
      case 'interactive':
      case 'button':
      case 'link':
      case 'drag':
        return 40;
      default:
        return 8;
    }
  };

  return (
    <>
      {/* Trailing circles */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="fixed pointer-events-none z-[9998]"
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'hsl(var(--primary))',
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-[9997]"
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 100, height: 100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              borderRadius: '50%',
              border: '2px solid hsl(var(--primary))',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: getCursorSize(),
          height: getCursorSize(),
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Default glowing dot */}
        {cursorState.type === 'default' && (
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background: 'hsl(var(--primary))',
              boxShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)',
            }}
          />
        )}

        {/* Interactive state */}
        {(cursorState.type === 'interactive' || cursorState.type === 'drag') && (
          <motion.div
            className="w-full h-full rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: 'hsl(var(--primary))',
              background: 'hsl(var(--primary) / 0.1)',
              backdropFilter: 'blur(4px)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-[10px] font-semibold text-primary">
              {cursorState.text}
            </span>
          </motion.div>
        )}

        {/* Button state - plus icon */}
        {cursorState.type === 'button' && (
          <motion.div
            className="w-full h-full rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: 'hsl(var(--primary))',
              background: 'hsl(var(--primary) / 0.1)',
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-bold text-primary">+</span>
          </motion.div>
        )}

        {/* Link state - arrow */}
        {cursorState.type === 'link' && (
          <motion.div
            className="w-full h-full rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: 'hsl(var(--primary))',
              background: 'hsl(var(--primary) / 0.1)',
            }}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ rotate: -45 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
