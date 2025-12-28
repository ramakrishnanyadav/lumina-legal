import { motion } from 'framer-motion';
import { Scale, Shield, FileText, Gavel } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { ArrowRight } from 'lucide-react';

const floatingCards = [
  { icon: Scale, label: 'Criminal Law', color: 'from-primary to-secondary' },
  { icon: Shield, label: 'Cyber Crime', color: 'from-secondary to-accent' },
  { icon: FileText, label: 'Property Law', color: 'from-accent to-primary' },
  { icon: Gavel, label: 'Civil Rights', color: 'from-primary to-purple' },
];

const HeroSection = () => {
  const words = ['Know', 'Your', 'Legal', 'Rights', 'Instantly'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
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
      </div>

      {/* Floating cards in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.label}
            className="absolute glass rounded-xl p-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.6,
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              delay: index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
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
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Glowing underline */}
        <motion.div
          className="h-1 mx-auto rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '60%', opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ boxShadow: '0 0 20px hsl(187 100% 50% / 0.5)' }}
        />

        {/* Subtitle */}
        <motion.p
          className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Understand complex legal situations with AI. Get instant analysis of applicable laws,
          your rights, and recommended next steps.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
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
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm">100% Confidential</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-secondary" />
            <span className="text-sm">10,000+ Cases Analyzed</span>
          </div>
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-accent" />
            <span className="text-sm">500+ Legal Experts</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
