import { motion } from 'framer-motion';
import { FileText, Users, Scale, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const timelineSteps = [
  {
    icon: FileText,
    title: 'File FIR / Complaint',
    description: 'Lodge your complaint at the police station with all evidence',
    duration: '1-2 Days',
    status: 'completed',
  },
  {
    icon: Users,
    title: 'Investigation',
    description: 'Police conducts investigation and collects evidence',
    duration: '30-90 Days',
    status: 'current',
  },
  {
    icon: Scale,
    title: 'Charge Sheet',
    description: 'Formal charges filed in court based on investigation',
    duration: '60-180 Days',
    status: 'pending',
  },
  {
    icon: Clock,
    title: 'Trial Process',
    description: 'Court hearings, witness examination, and arguments',
    duration: '1-3 Years',
    status: 'pending',
  },
  {
    icon: CheckCircle,
    title: 'Judgment',
    description: 'Final verdict by the court after trial completion',
    duration: 'Variable',
    status: 'pending',
  },
];

const ProceduralTimeline = () => {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Legal Process Timeline</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Understanding the journey from complaint to judgment
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ originY: 0 }}
          />

          {timelineSteps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <motion.div
                key={step.title}
                className={`relative flex items-center mb-12 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <motion.div
                    className="glass rounded-2xl p-6 inline-block"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className={`flex items-center gap-2 text-sm ${isEven ? 'md:justify-end' : ''}`}>
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">{step.duration}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Center node */}
                <motion.div
                  className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-gradient-to-br from-primary to-secondary animate-pulse-glow'
                        : 'glass'
                    }`}
                  >
                    <step.icon className={`w-5 h-5 ${isCompleted || isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                </motion.div>

                {/* Empty space for layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            whileHover={{ x: 5 }}
          >
            View Detailed Process Guide
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProceduralTimeline;
