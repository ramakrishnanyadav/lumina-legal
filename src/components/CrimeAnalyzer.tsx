import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Scale, Clock, FileText, Info, ChevronDown } from 'lucide-react';
import GlassCard from './GlassCard';
import AnimatedCheckbox from './AnimatedCheckbox';
import AnimatedDropdown from './AnimatedDropdown';
import PremiumCrimeInput from './PremiumCrimeInput';
import { showToast } from './AnimatedToast';
import ConfidenceIndicator from './ConfidenceIndicator';
import ExplainabilityAccordion from './ExplainabilityAccordion';
import AnalysisProgress from './AnalysisProgress';
import ScrollHint from './ScrollHint';
import { DetailLevelToggle, DetailContent, useDetailLevel, DetailLevelProvider } from './DetailLevelToggle';
import { 
  ImportantDisclaimerCard, 
  ProbabilisticEstimateNote, 
  UncertaintyBadges,
  ConfidenceBadge 
} from './DisclaimerSystem';
import EvidenceChecklist from './EvidenceChecklist';
import FIRTemplatePreview from './FIRTemplatePreview';
import UrgencyIndicator from './UrgencyIndicator';
import LegalHelpBanner from './LegalHelpBanner';

const mockResults = {
  overallConfidence: 82,
  sections: [
    { 
      code: 'IPC 420', 
      name: 'Cheating', 
      confidence: 92,
      matchedKeywords: ['deception', 'financial loss', 'fraudulent intent'],
      reasoning: 'The description indicates fraudulent misrepresentation leading to financial harm.',
      isPrimary: true,
    },
    { 
      code: 'IPC 406', 
      name: 'Criminal Breach of Trust', 
      confidence: 78,
      matchedKeywords: ['trust violation', 'property misuse', 'entrustment'],
      reasoning: 'Elements suggest violation of fiduciary duty and misappropriation.',
      isPrimary: false,
    },
    { 
      code: 'IPC 468', 
      name: 'Forgery for cheating', 
      confidence: 65,
      matchedKeywords: ['false documents', 'signature forgery'],
      reasoning: 'Potential document manipulation to facilitate the fraud.',
      isPrimary: false,
    },
  ],
  severity: 'Moderate',
  maxPunishment: '7 years imprisonment',
  bail: 'Bailable',
  bailProbability: 65,
  punishmentNote: 'Range based on statute and precedents',
};

const springConfig = { damping: 20, stiffness: 300 };

const caseTypes = [
  { value: 'criminal', label: 'Criminal Case' },
  { value: 'civil', label: 'Civil Case' },
  { value: 'family', label: 'Family Dispute' },
  { value: 'property', label: 'Property Matter' },
  { value: 'cyber', label: 'Cyber Crime' },
];

// Revelation stages for progressive disclosure
type RevealStage = 'confidence' | 'primary' | 'related' | 'toggle' | 'scroll' | 'complete';

const CrimeAnalyzerContent = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [caseType, setCaseType] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [needsLawyer, setNeedsLawyer] = useState(false);
  
  // Reveal stages for progressive disclosure
  const [revealStage, setRevealStage] = useState<RevealStage | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResults(null);
    setRevealStage(null);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setResults(mockResults);
    
    // Progressive reveal sequence
    setTimeout(() => setRevealStage('confidence'), 500);
    setTimeout(() => setRevealStage('primary'), 1000);
    setTimeout(() => setRevealStage('related'), 1500);
    setTimeout(() => setRevealStage('toggle'), 2000);
    setTimeout(() => setRevealStage('scroll'), 2500);
    setTimeout(() => setRevealStage('complete'), 3000);
    
    showToast('success', 'Analysis Complete', 'Preliminary assessment ready for review.');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const handleSectionClick = (code: string) => {
    setExpandedSection(expandedSection === code ? null : code);
  };

  const isStageReached = (stage: RevealStage) => {
    const stages: RevealStage[] = ['confidence', 'primary', 'related', 'toggle', 'scroll', 'complete'];
    const currentIndex = revealStage ? stages.indexOf(revealStage) : -1;
    const targetIndex = stages.indexOf(stage);
    return currentIndex >= targetIndex;
  };

  return (
    <section id="analyzer" className="relative py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            <span className="gradient-text">Situation Assessment</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Describe the circumstances for preliminary statutory analysis
          </p>
        </motion.div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="glass rounded-2xl p-6 md:p-8 space-y-6"
        >
          {/* Options Bar - Compact horizontal layout */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pb-6 border-b border-white/10">
            {/* Case Type Dropdown */}
            <div className="flex-1 min-w-[200px]">
              <AnimatedDropdown
                options={caseTypes}
                value={caseType}
                onChange={setCaseType}
                placeholder="Select case type"
              />
            </div>
            
            {/* Urgency Toggle */}
            <UrgencyIndicator
              isUrgent={isUrgent}
              onToggle={setIsUrgent}
            />
            
            {/* Advocate Checkbox */}
            <AnimatedCheckbox
              checked={needsLawyer}
              onChange={setNeedsLawyer}
              label="Connect with advocate"
            />
          </div>

          {/* Detail Level Toggle - centered */}
          <div className="flex justify-center">
            <DetailLevelToggle />
          </div>

          {/* Premium Crime Input */}
          <PremiumCrimeInput
            value={text}
            onChange={setText}
            onSubmit={handleAnalyze}
            isLoading={isAnalyzing}
          />
        </motion.div>

        {/* Analysis Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <AnalysisProgress 
              isAnalyzing={isAnalyzing} 
              onComplete={handleAnalysisComplete}
            />
          )}
        </AnimatePresence>

        {/* Results Section - Progressive Reveal */}
        <AnimatePresence mode="wait">
          {results && revealStage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-6"
            >
              {/* Stage 1: Confidence Score */}
              <AnimatePresence>
                {isStageReached('confidence') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', ...springConfig }}
                    className="flex flex-col items-center gap-4"
                  >
                    <ConfidenceIndicator 
                      score={results.overallConfidence} 
                      size="lg"
                      breakdown={{
                        statutoryMatch: 88,
                        precedentAvailability: 76,
                        informationCompleteness: 82,
                      }}
                    />
                    <ProbabilisticEstimateNote />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 2: Primary Section */}
              <AnimatePresence>
                {isStageReached('primary') && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', ...springConfig }}
                  >
                    <ImportantDisclaimerCard />
                    
                    <motion.h3 
                      className="text-xl font-semibold flex items-center gap-2 mt-6 mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      Primary Applicable Section
                    </motion.h3>

                    {results.sections.filter(s => s.isPrimary).map((section) => (
                      <SectionCard
                        key={section.code}
                        section={section}
                        isExpanded={expandedSection === section.code}
                        onToggle={() => handleSectionClick(section.code)}
                        getConfidenceColor={getConfidenceColor}
                        userDescription={text}
                        isPrimary
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 3: Related Sections */}
              <AnimatePresence>
                {isStageReached('related') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.h3 
                      className="text-lg font-semibold flex items-center gap-2 mb-4 text-muted-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      Related Sections
                    </motion.h3>

                    {results.sections.filter(s => !s.isPrimary).map((section, index) => (
                      <motion.div
                        key={section.code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <SectionCard
                          section={section}
                          isExpanded={expandedSection === section.code}
                          onToggle={() => handleSectionClick(section.code)}
                          getConfidenceColor={getConfidenceColor}
                          userDescription={text}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 4: Quick Stats (with toggle active indicator) */}
              <AnimatePresence>
                {isStageReached('toggle') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <DetailContent
                      simple={
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Severity', value: results.severity, color: 'yellow' },
                            { label: 'Punishment', value: results.maxPunishment, color: 'red' },
                            { label: 'Bail', value: results.bail, color: 'green' },
                          ].map((stat) => (
                            <div key={stat.label} className="text-center p-3 rounded-xl glass">
                              <p className="text-xs text-muted-foreground">{stat.label}</p>
                              <p className={`font-semibold text-sm text-${stat.color}-400`}>{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      }
                      detailed={
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { icon: AlertTriangle, label: 'Severity', value: results.severity, color: 'yellow', type: 'general' as const },
                            { icon: Clock, label: 'Max Punishment', value: results.maxPunishment, color: 'red', note: results.punishmentNote, type: 'punishment' as const },
                            { icon: Scale, label: 'Bail Status', value: results.bail, color: 'green', probability: results.bailProbability, type: 'bail' as const },
                          ].map((stat, index) => (
                            <motion.div 
                              key={stat.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <GlassCard index={index}>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                                      <p className={`font-semibold text-${stat.color}-400`}>{stat.value}</p>
                                    </div>
                                  </div>
                                  {stat.probability && <ConfidenceBadge value={stat.probability} />}
                                  {stat.note && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Info className="w-3 h-3" />{stat.note}
                                    </p>
                                  )}
                                  <UncertaintyBadges type={stat.type} />
                                </div>
                              </GlassCard>
                            </motion.div>
                          ))}
                        </div>
                      }
                    />

                    {/* Viewing indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center mt-4"
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs text-primary">
                        <Info className="w-3 h-3" />
                        Viewing preliminary assessment
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage 5: Scroll Hint */}
              <AnimatePresence>
                {isStageReached('scroll') && !isStageReached('complete') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center pt-4"
                  >
                    <ScrollHint targetId="timeline" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Evidence Checklist */}
              <AnimatePresence>
                {isStageReached('complete') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <EvidenceChecklist crimeType={results.sections[0]?.name || caseType || 'general'} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FIR Template */}
              <AnimatePresence>
                {isStageReached('complete') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FIRTemplatePreview
                      userDescription={text}
                      primarySection={{
                        code: results.sections[0]?.code || 'IPC',
                        name: results.sections[0]?.name || 'Unknown',
                      }}
                      relatedSections={results.sections.slice(1).map(s => ({ code: s.code, name: s.name }))}
                      caseType={caseType}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Legal Help Banner - contextual */}
              <AnimatePresence>
                {isStageReached('complete') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <LegalHelpBanner
                      isVisible={true}
                      isUrgent={isUrgent}
                      severity={results.overallConfidence >= 80 ? 'high' : 'medium'}
                      caseType={caseType}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final note */}
              <AnimatePresence>
                {isStageReached('complete') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <p className="text-sm text-muted-foreground">
                      This preliminary assessment is based on the information provided. 
                      Individual outcomes may vary based on specific circumstances and evidence.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Section Card Component with Accordion behavior
interface SectionCardProps {
  section: typeof mockResults.sections[0];
  isExpanded: boolean;
  onToggle: () => void;
  getConfidenceColor: (c: number) => string;
  userDescription: string;
  isPrimary?: boolean;
}

const SectionCard = ({ 
  section, 
  isExpanded, 
  onToggle, 
  getConfidenceColor, 
  userDescription,
  isPrimary 
}: SectionCardProps) => {
  // Auto-scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        document.getElementById(`section-${section.code}`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [isExpanded, section.code]);

  return (
    <motion.div
      id={`section-${section.code}`}
      className="mb-4"
      layout
    >
      <GlassCard 
        hover 
        gradient={isPrimary} 
        variant={isPrimary ? 'strong' : 'default'}
      >
        <div 
          className="cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-lg font-bold text-primary">
                  {section.code}
                </span>
                <div>
                  <p className="font-medium">{section.name}</p>
                  <p className="text-sm text-muted-foreground">Indian Penal Code</p>
                </div>
              </div>

              {/* Expand indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
                <span>{isExpanded ? 'Click to collapse' : 'Click for details'}</span>
              </div>
            </div>

            {/* Confidence Ring */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted/30"
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
                    transition={{ type: 'spring', damping: 25, stiffness: 100 }}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getConfidenceColor(section.confidence)}`}>
                  {section.confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="pt-4 mt-4 border-t border-white/10"
              >
                <ExplainabilityAccordion
                  sectionCode={section.code}
                  sectionName={section.name}
                  userDescription={userDescription}
                  matchedKeywords={section.matchedKeywords}
                  reasoning={section.reasoning}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

// Wrap with provider
const CrimeAnalyzer = () => (
  <DetailLevelProvider>
    <CrimeAnalyzerContent />
  </DetailLevelProvider>
);

export default CrimeAnalyzer;
