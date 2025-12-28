import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  Clock, 
  Phone, 
  FileText,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';
import GlassCard from './GlassCard';

interface UrgencyIndicatorProps {
  isUrgent: boolean;
  onToggle: (value: boolean) => void;
}

const easeOut = [0.25, 0.46, 0.45, 0.94];

const urgentActions = [
  {
    icon: FileText,
    title: 'File FIR Within 24 Hours',
    description: 'Time-sensitive evidence may be lost. Visit the nearest police station immediately.',
    priority: 'critical',
  },
  {
    icon: Phone,
    title: 'Contact Advocate Immediately',
    description: 'For situations involving arrest or custody, legal representation is essential.',
    priority: 'high',
  },
  {
    icon: Shield,
    title: 'Preserve Evidence Now',
    description: 'Take photos, save messages, note down details while they are fresh.',
    priority: 'high',
  },
  {
    icon: Clock,
    title: 'Note Timeline Carefully',
    description: 'Record exact times and sequence of events for accurate reporting.',
    priority: 'medium',
  },
];

const UrgencyIndicator = ({ isUrgent, onToggle }: UrgencyIndicatorProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Toggle with tooltip trigger */}
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <motion.button
            onClick={() => onToggle(!isUrgent)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isUrgent 
                ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ 
                scale: isUrgent ? [1, 1.2, 1] : 1,
              }}
              transition={{ 
                duration: 1, 
                repeat: isUrgent ? Infinity : 0,
                ease: 'easeInOut'
              }}
            >
              <Zap className={`w-4 h-4 ${isUrgent ? 'text-red-400' : ''}`} />
            </motion.div>
            <span className="text-sm font-medium">
              {isUrgent ? 'Urgent Case' : 'Mark as Urgent'}
            </span>
            <HelpCircle className="w-3.5 h-3.5 opacity-50" />
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: easeOut }}
                className="absolute z-20 left-0 top-full mt-2 w-72 p-3 rounded-lg glass border border-border shadow-xl"
              >
                <div className="absolute -top-1.5 left-6 w-3 h-3 rotate-45 bg-background border-l border-t border-border" />
                <p className="text-sm text-foreground font-medium mb-2">When to mark as urgent:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Situations involving immediate safety risk
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Active arrest warrant or custody
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Time-sensitive evidence that may be destroyed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    Ongoing threat or harassment
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Urgent Actions Panel */}
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="mt-4"
          >
            <GlassCard variant="dark" className="border-red-500/20 bg-red-500/5">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400">Urgent Actions Required</h4>
                    <p className="text-xs text-muted-foreground">Time-critical steps for your situation</p>
                  </div>
                </div>

                {/* Action Items */}
                <div className="space-y-3">
                  {urgentActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        action.priority === 'critical' 
                          ? 'bg-red-500/10 border border-red-500/20' 
                          : action.priority === 'high'
                            ? 'bg-yellow-500/10 border border-yellow-500/20'
                            : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        action.priority === 'critical' 
                          ? 'bg-red-500/20 text-red-400' 
                          : action.priority === 'high'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-primary/20 text-primary'
                      }`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          action.priority === 'critical' ? 'text-red-400' : 'text-foreground'
                        }`}>
                          {action.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                      </div>
                      {action.priority === 'critical' && (
                        <motion.span
                          className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs flex-shrink-0"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Critical
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Emergency Contact */}
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Need immediate legal help?</span>
                    </div>
                    <motion.button
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Find Advocate Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrgencyIndicator;
