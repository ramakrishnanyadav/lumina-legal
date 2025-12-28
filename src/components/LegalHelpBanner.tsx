import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Phone, User, FileText, AlertTriangle, Shield, ChevronRight } from 'lucide-react';

interface LegalHelpBannerProps {
  isVisible: boolean;
  isUrgent?: boolean;
  severity?: 'low' | 'medium' | 'high';
  caseType?: string;
}

const LegalHelpBanner = ({ 
  isVisible, 
  isUrgent = false, 
  severity = 'medium',
  caseType 
}: LegalHelpBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine context-aware messaging
  const getContextMessage = () => {
    if (isUrgent) {
      return {
        title: 'Urgent Situation Detected',
        subtitle: 'Consider immediate legal consultation',
        icon: AlertTriangle,
        accentColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        textColor: 'text-red-400',
      };
    }
    if (severity === 'high') {
      return {
        title: 'This Appears Serious',
        subtitle: 'Professional legal assistance may be helpful',
        icon: Shield,
        accentColor: 'rgba(251, 146, 60, 0.15)',
        borderColor: 'rgba(251, 146, 60, 0.3)',
        textColor: 'text-orange-400',
      };
    }
    return {
      title: 'Legal Assistance Options',
      subtitle: 'For professional guidance on your matter',
      icon: Scale,
      accentColor: 'rgba(0, 217, 255, 0.08)',
      borderColor: 'rgba(0, 217, 255, 0.2)',
      textColor: 'text-cyan-400',
    };
  };

  const context = getContextMessage();
  const IconComponent = context.icon;

  const options = [
    {
      id: 'helpline',
      icon: Phone,
      label: 'Free Legal Aid Helpline',
      description: 'NALSA Toll-free: 15100',
      action: 'Call Now',
      primary: false,
    },
    {
      id: 'advocate',
      icon: User,
      label: 'Find Advocate',
      description: 'Browse verified legal professionals',
      action: 'Browse',
      primary: true,
    },
    {
      id: 'summary',
      icon: FileText,
      label: 'Download Summary',
      description: 'Get case analysis as PDF',
      action: 'Download',
      primary: false,
    },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: context.accentColor,
        border: `1px solid ${context.borderColor}`,
      }}
    >
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${context.borderColor}, transparent 60%)`,
        }}
      />

      {/* Main content */}
      <div className="relative p-4">
        {/* Header row - always visible */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: context.borderColor }}
            >
              <IconComponent className={`w-5 h-5 ${context.textColor}`} />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-foreground">{context.title}</h4>
              <p className="text-sm text-muted-foreground">{context.subtitle}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        {/* Expandable options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                {options.map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      option.primary
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className={`w-5 h-5 ${option.primary ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                      <div className="text-left">
                        <p className={`text-sm font-medium ${option.primary ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground/70">{option.description}</p>
                      </div>
                    </div>
                    <span className={`text-sm ${option.primary ? 'text-cyan-400' : 'text-muted-foreground'}`}>
                      {option.action} →
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Emergency hotlines */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-xs text-muted-foreground mb-2">Emergency Hotlines:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Police: 100', color: 'red' },
                    { label: 'Women: 1091', color: 'purple' },
                    { label: 'Cyber: 1930', color: 'cyan' },
                  ].map((hotline) => (
                    <span
                      key={hotline.label}
                      className="px-2 py-1 rounded-md text-xs bg-white/5 text-muted-foreground"
                    >
                      {hotline.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Compact inline banner version
export const LegalHelpInlineBanner = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-muted-foreground">Need legal representation?</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View Advocates
        </button>
        <span className="text-muted-foreground/30">|</span>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Emergency Hotlines
        </button>
      </div>
    </motion.div>
  );
};

export default LegalHelpBanner;
