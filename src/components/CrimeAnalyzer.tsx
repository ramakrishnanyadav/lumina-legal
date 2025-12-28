import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Scale, Clock, FileText } from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedCheckbox from './AnimatedCheckbox';
import AnimatedToggle from './AnimatedToggle';
import AnimatedDropdown from './AnimatedDropdown';
import PremiumCrimeInput from './PremiumCrimeInput';
import { showToast } from './AnimatedToast';

const mockResults = {
  sections: [
    { code: 'IPC 420', name: 'Cheating', confidence: 92 },
    { code: 'IPC 406', name: 'Criminal Breach of Trust', confidence: 78 },
    { code: 'IPC 468', name: 'Forgery for cheating', confidence: 65 },
  ],
  severity: 'Moderate',
  maxPunishment: '7 years imprisonment',
  bail: 'Bailable',
};

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

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', ...springConfig },
  },
};

const caseTypes = [
  { value: 'criminal', label: 'Criminal Case' },
  { value: 'civil', label: 'Civil Case' },
  { value: 'family', label: 'Family Dispute' },
  { value: 'property', label: 'Property Matter' },
  { value: 'cyber', label: 'Cyber Crime' },
];

const CrimeAnalyzer = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [caseType, setCaseType] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [needsLawyer, setNeedsLawyer] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    setIsAnalyzing(false);
    setResults(mockResults);
    
    // Show success toast with confetti
    showToast('success', 'Analysis Complete!', 'We found 3 applicable legal sections for your case.');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <section id="analyzer" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">AI Crime Analyzer</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Describe the situation and our AI will identify applicable legal sections
          </p>
        </motion.div>

        {/* Options Row */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.1 }}
        >
          <div 
            className="rounded-xl p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <AnimatedDropdown
                options={caseTypes}
                value={caseType}
                onChange={setCaseType}
                placeholder="Select case type"
              />
              <div className="flex items-center justify-center">
                <AnimatedToggle
                  checked={isUrgent}
                  onChange={setIsUrgent}
                  label="Mark as Urgent"
                />
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <AnimatedCheckbox
                  checked={needsLawyer}
                  onChange={setNeedsLawyer}
                  label="Connect with lawyer"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Crime Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.2 }}
        >
          <PremiumCrimeInput
            value={text}
            onChange={setText}
            onSubmit={handleAnalyze}
            isLoading={isAnalyzing}
          />
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', ...springConfig }}
              className="mt-12 space-y-6"
            >
              {/* Success indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', ...springConfig }}
                className="flex items-center justify-center gap-2 text-green-400"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', ...springConfig, delay: 0.2 }}
                  className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center"
                >
                  <Check className="w-5 h-5" />
                </motion.div>
                <span className="font-medium">Analysis Complete</span>
              </motion.div>

              {/* Quick Stats with stagger */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: AlertTriangle, label: 'Severity', value: results.severity, color: 'yellow' },
                  { icon: Clock, label: 'Max Punishment', value: results.maxPunishment, color: 'red' },
                  { icon: Scale, label: 'Bail Status', value: results.bail, color: 'green' },
                ].map((stat, index) => (
                  <motion.div key={stat.label} variants={itemVariants}>
                    <GlassCard index={index}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                          <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className={`font-semibold text-${stat.color}-400`}>{stat.value}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* Applicable Sections */}
              <div className="space-y-4">
                <motion.h3 
                  className="text-xl font-semibold flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', ...springConfig, delay: 0.3 }}
                >
                  <FileText className="w-5 h-5 text-primary" />
                  Applicable Legal Sections
                </motion.h3>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {results.sections.map((section, index) => (
                    <motion.div
                      key={section.code}
                      variants={itemVariants}
                      className="mb-4"
                    >
                      <GlassCard hover gradient index={index}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="font-mono text-lg font-bold text-primary"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: 'spring', ...springConfig, delay: 0.5 + index * 0.1 }}
                            >
                              {section.code}
                            </motion.div>
                            <div>
                              <p className="font-medium">{section.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Indian Penal Code
                              </p>
                            </div>
                          </div>

                          {/* Confidence Ring */}
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-muted"
                              />
                              <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                className={getConfidenceColor(section.confidence)}
                                initial={{ strokeDasharray: '0 176' }}
                                animate={{
                                  strokeDasharray: `${(section.confidence / 100) * 176} 176`,
                                }}
                                transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 0.6 + index * 0.1 }}
                              />
                            </svg>
                            <motion.span
                              className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getConfidenceColor(section.confidence)}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ type: 'spring', ...springConfig, delay: 1 + index * 0.1 }}
                            >
                              {section.confidence}%
                            </motion.span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CrimeAnalyzer;
