import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  parallaxElements?: boolean;
}

const TiltCard = ({
  children,
  className = '',
  maxTilt = 15,
  glare = true,
  parallaxElements = true,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(smoothMouseY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-maxTilt, maxTilt]);
  
  const glareX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
      data-interactive
    >
      {/* Glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-10"
          style={{
            opacity: isHovered ? 0.15 : 0,
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, white, transparent 50%)`,
          }}
          animate={{
            background: isHovered 
              ? `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), white, transparent 50%)`
              : 'none'
          }}
        />
      )}
      
      {/* Parallax wrapper for children */}
      {parallaxElements ? (
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default TiltCard;
