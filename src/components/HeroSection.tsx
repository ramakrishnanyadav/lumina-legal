import { motion, useScroll, useTransform } from 'framer-motion';
import { Scale, Shield, FileText, Gavel } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const floatingCards = [
  { icon: Scale, label: 'Criminal Law', color: 'from-primary to-secondary' },
  { icon: Shield, label: 'Cyber Crime', color: 'from-secondary to-accent' },
  { icon: FileText, label: 'Property Law', color: 'from-accent to-primary' },
  { icon: Gavel, label: 'Civil Rights', color: 'from-primary to-purple' },
];

const springConfig = { damping: 20, stiffness: 300 };

const HeroSection = () => {
  const words = ['Know', 'Your', 'Legal', 'Rights', 'Instantly'];
  const containerRef = useRef<HTMLElement>(null);
  
  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Three layers with different speeds
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Layer 1 - Background gradient (slowest) */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"
        style={{ y: layer1Y }}
      >
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 50%, hsl(266 93% 58% / 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(187 100% 50% / 0.2) 0%, transparent 40%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Layer 2 - Floating cards (medium speed) */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: layer2Y, opacity }}
      >
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.label}
            className="absolute glass rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 0.6,
              scale: 1,
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              type: 'spring',
              ...springConfig,
              delay: index * 0.2,
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 },
              rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 },
            }}
            style={{
              top: `${20 + index * 15}%`,
              left: index % 2 === 0 ? '5%' : 'auto',
              right: index % 2 === 1 ? '5%' : 'auto',
            }}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
              <card.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Layer 3 - Main content (fastest - stays in view longer) */}
      <motion.div 
        className="relative z-10 text-center max-w-5xl mx-auto"
        style={{ y: layer3Y, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', ...springConfig }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">AI-Powered Legal Analysis</span>
        </motion.div>

        {/* Animated heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          {words.map((word, index) => (
            <motion.span
              key={word}
              className={`inline-block mr-4 ${index === 2 || index === 3 ? 'gradient-text' : 'text-foreground'}`}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                type: 'spring',
                ...springConfig,
                delay: 0.3 + index * 0.1,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Glowing underline */}
        <motion.div
          className="h-1 mx-auto rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%))',
            boxShadow: '0 0 20px hsl(187 100% 50% / 0.5)',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '60%', opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 1 }}
        />

        {/* Subtitle */}
        <motion.p
          className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', ...springConfig, delay: 1.2 }}
        >
          Understand complex legal situations with AI. Get instant analysis of applicable laws,
          your rights, and recommended next steps.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', ...springConfig, delay: 1.4 }}
        >
          <AnimatedButton
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Analyze Your Case
          </AnimatedButton>

          <AnimatedButton variant="secondary" size="lg">
            How It Works
          </AnimatedButton>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', ...springConfig, delay: 1.6 }}
        >
          {[
            { icon: Shield, text: '100% Confidential', color: 'text-primary' },
            { icon: Scale, text: '10,000+ Cases Analyzed', color: 'text-secondary' },
            { icon: Gavel, text: '500+ Legal Experts', color: 'text-accent' },
          ].map((item, index) => (
            <motion.div 
              key={item.text}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', ...springConfig, delay: 1.6 + index * 0.1 }}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
