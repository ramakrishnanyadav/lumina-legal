import { motion, useSpring } from 'framer-motion';
import { Star, MapPin, Briefcase, MessageSquare, Award } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import TiltCard from './TiltCard';
import { useRef, useCallback, useState } from 'react';
import ContextMenu from './ContextMenu';
import { useLongPress } from '@/hooks/useGestureInteractions';

const lawyers = [
  {
    name: 'Adv. Priya Sharma',
    specialty: 'Criminal Defense',
    location: 'Mumbai',
    experience: '15 years',
    rating: 4.9,
    cases: 450,
    successRate: 92,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    tags: ['IPC', 'Cyber Crime', 'POCSO'],
  },
  {
    name: 'Adv. Rajesh Kumar',
    specialty: 'Corporate Law',
    location: 'Delhi',
    experience: '20 years',
    rating: 4.8,
    cases: 620,
    successRate: 89,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    tags: ['Fraud', 'White Collar', 'Taxation'],
  },
  {
    name: 'Adv. Meera Patel',
    specialty: 'Family Law',
    location: 'Bangalore',
    experience: '12 years',
    rating: 4.9,
    cases: 380,
    successRate: 95,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    tags: ['Divorce', 'Custody', 'Domestic Violence'],
  },
  {
    name: 'Adv. Arjun Reddy',
    specialty: 'Property Law',
    location: 'Chennai',
    experience: '18 years',
    rating: 4.7,
    cases: 520,
    successRate: 88,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    tags: ['Real Estate', 'Land Disputes', 'RERA'],
  },
];

const springConfig = { damping: 20, stiffness: 300 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', ...springConfig },
  },
};

const LawyerCard = ({ lawyer, index }: { lawyer: typeof lawyers[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const { isLongPressed, handlers: longPressHandlers } = useLongPress({
    threshold: 500,
    onLongPress: () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setContextMenu({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    },
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 150) {
      const factor = (1 - distance / 150) * 0.15;
      mouseX.set(distanceX * factor);
      mouseY.set(distanceY * factor);
    }
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <>
      <ContextMenu
        isOpen={contextMenu !== null}
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        onClose={() => setContextMenu(null)}
      />
      <TiltCard className="group" maxTilt={12} glare parallaxElements>
        <motion.div
          ref={cardRef}
          className="relative"
          variants={cardVariants}
          style={{ x: mouseX, y: mouseY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...longPressHandlers}
          data-interactive
        >
      {/* Gradient border on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%))',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ type: 'spring', ...springConfig }}
      />

      <div className="relative glass rounded-2xl p-6 h-full bg-card">
        {/* Avatar */}
        <div className="relative mb-4">
          <motion.div
            className="w-20 h-20 rounded-full overflow-hidden mx-auto ring-2 ring-white/10"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', ...springConfig }}
          >
            <img
              src={lawyer.image}
              alt={lawyer.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Online indicator */}
          <motion.div
            className="absolute bottom-0 right-1/2 translate-x-8 w-4 h-4 bg-green-500 rounded-full border-2 border-card"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Info */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg">{lawyer.name}</h3>
          <p className="text-primary text-sm font-medium">{lawyer.specialty}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{lawyer.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{lawyer.location}</span>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{lawyer.experience}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{lawyer.cases} cases</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Success Rate</span>
            <motion.span
              className="text-green-400 font-bold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {lawyer.successRate}%
            </motion.span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-green-400"
              initial={{ width: 0 }}
              whileInView={{ width: `${lawyer.successRate}%` }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 0.3 + index * 0.1 }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lawyer.tags.map((tag, tagIndex) => (
            <motion.span
              key={tag}
              className="text-xs px-2 py-1 rounded-full glass text-muted-foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', ...springConfig, delay: 0.4 + tagIndex * 0.05 }}
              whileHover={{
                background: 'linear-gradient(135deg, hsl(187 100% 50% / 0.2), hsl(266 93% 58% / 0.2))',
                color: 'hsl(187 100% 50%)',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* CTA */}
        <AnimatedButton
          variant="secondary"
          size="sm"
          className="w-full"
          icon={<MessageSquare className="w-4 h-4" />}
        >
          Contact
        </AnimatedButton>
      </div>
        </motion.div>
      </TiltCard>
    </>
  );
};

const LawyerMarketplace = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Legal Assistance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with verified advocates specializing in relevant practice areas
          </p>
        </motion.div>

        {/* Bento Grid with staggered animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {lawyers.map((lawyer, index) => (
            <LawyerCard key={lawyer.name} lawyer={lawyer} index={index} />
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.5 }}
        >
          <AnimatedButton variant="primary" size="lg">
            Browse All Advocates
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
};

export default LawyerMarketplace;
