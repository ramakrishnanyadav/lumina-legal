import { motion, useScroll, useTransform } from 'framer-motion';
import { Scale, Shield, FileText, Gavel } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import TextReveal from './TextReveal';
import NumberCounter from './NumberCounter';
import { ParallaxLayer } from './ParallaxSection';
import MorphingBlob from './MorphingBlob';

const floatingCards = [
  { icon: Scale, label: 'Criminal Law', color: 'from-primary to-secondary' },
  { icon: Shield, label: 'Cyber Crime', color: 'from-secondary to-accent' },
  { icon: FileText, label: 'Property Law', color: 'from-accent to-primary' },
  { icon: Gavel, label: 'Civil Rights', color: 'from-primary to-purple' },
];

const springConfig = { damping: 20, stiffness: 300 };

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Four layers with different speeds (10%, 30%, 60%, 100%)
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -50]);   // 10% - Background
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);  // 30% - Mid
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -300]);  // 60% - Foreground
  const layer4Y = useTransform(scrollYProgress, [0, 1], [0, -500]);  // 100% - Text (normal)
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Layer 1 - Background (10% parallax) - Morphing blobs */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: layer1Y }}
      >
        <MorphingBlob 
          className="top-1/4 left-1/4" 
          color="hsl(266 93% 58%)" 
          size={600}
        />
        <MorphingBlob 
          className="bottom-1/4 right-1/4" 
          color="hsl(187 100% 50%)" 
          size={500}
        />
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

      {/* Layer 2 - Mid layer (30% parallax) - Decorative shapes */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: layer2Y, opacity }}
      >
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, hsl(${180 + index * 20} 80% 50%), transparent)`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3 - Foreground (60% parallax) - Floating cards */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: layer3Y, opacity }}
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

      {/* Layer 4 - Text content (100% - normal scroll) */}
      <motion.div 
        className="relative z-10 text-center max-w-5xl mx-auto"
        style={{ y: layer4Y, opacity, scale }}
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

        {/* Animated heading with split text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <TextReveal 
            text="Know Your Legal Rights Instantly" 
            type="letter"
            stagger={0.03}
            className="inline"
          />
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
          transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 1.5 }}
        />

        {/* Subtitle with word reveal */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', ...springConfig, delay: 1.8 }}
        >
          <TextReveal
            text="Understand complex legal situations with AI. Get instant analysis of applicable laws, your rights, and recommended next steps."
            type="word"
            stagger={0.03}
            delay={2}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', ...springConfig, delay: 2.5 }}
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

        {/* Trust indicators with number counters */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', ...springConfig, delay: 2.8 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', ...springConfig, delay: 2.9 }}
          >
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm">100% Confidential</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', ...springConfig, delay: 3.0 }}
          >
            <Scale className="w-5 h-5 text-secondary" />
            <span className="text-sm">
              <NumberCounter value={10000} suffix="+" className="font-bold" /> Cases Analyzed
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', ...springConfig, delay: 3.1 }}
          >
            <Gavel className="w-5 h-5 text-accent" />
            <span className="text-sm">
              <NumberCounter value={500} suffix="+" className="font-bold" /> Legal Experts
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
