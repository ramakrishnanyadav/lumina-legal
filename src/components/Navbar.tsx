import { motion, useSpring } from 'framer-motion';
import { Scale, Menu, X } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import AnimatedButton from './AnimatedButton';

const navLinks = [
  { label: 'Situation Assessment', href: '#analyzer' },
  { label: 'Procedural Steps', href: '#timeline' },
  { label: 'Legal Assistance', href: '#lawyers' },
  { label: 'Resources', href: '#resources' },
];

const springConfig = { damping: 20, stiffness: 300 };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 200) {
      const factor = (1 - distance / 200) * 0.02;
      mouseX.set(distanceX * factor);
      mouseY.set(distanceY * factor);
    }
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-4 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', ...springConfig }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          ref={navRef}
          className="rounded-2xl px-6 py-3 flex items-center justify-between"
          style={{
            x: mouseX,
            y: mouseY,
            background: 'rgba(10, 14, 39, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', ...springConfig }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Legal<span className="text-primary">AI</span>
            </span>
          </motion.a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors relative"
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', ...springConfig }}
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ type: 'spring', ...springConfig }}
                />
              </motion.a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <AnimatedButton variant="ghost" size="sm">
              Sign In
            </AnimatedButton>
            <AnimatedButton variant="primary" size="sm">
              Begin Analysis
            </AnimatedButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </motion.div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden mt-2 overflow-hidden"
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <div 
            className="glass-dark rounded-2xl p-4 space-y-2"
            style={{
              background: 'rgba(10, 14, 39, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="block py-3 px-4 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', ...springConfig, delay: index * 0.1 }}
              >
                {link.label}
              </motion.a>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <AnimatedButton variant="ghost" size="sm" className="w-full">
                Sign In
              </AnimatedButton>
              <AnimatedButton variant="primary" size="sm" className="w-full">
                Begin Analysis
              </AnimatedButton>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
