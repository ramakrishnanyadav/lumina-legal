import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SeasonalTheme {
  season: 'winter' | 'spring' | 'summer' | 'fall' | 'none';
  isHoliday: boolean;
  holidayName?: string;
}

const SeasonalContext = createContext<SeasonalTheme>({
  season: 'none',
  isHoliday: false,
});

export const useSeasonal = () => useContext(SeasonalContext);

// Detect current season and holidays
const getSeasonalTheme = (): SeasonalTheme => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // Holidays
  if (month === 11 && day >= 20 && day <= 31) {
    return { season: 'winter', isHoliday: true, holidayName: 'Christmas' };
  }
  if (month === 0 && day === 1) {
    return { season: 'winter', isHoliday: true, holidayName: 'New Year' };
  }
  if (month === 9 && day === 31) {
    return { season: 'fall', isHoliday: true, holidayName: 'Halloween' };
  }
  if (month === 6 && day === 4) {
    return { season: 'summer', isHoliday: true, holidayName: 'Independence Day' };
  }

  // Seasons (Northern Hemisphere)
  if (month >= 11 || month <= 1) return { season: 'winter', isHoliday: false };
  if (month >= 2 && month <= 4) return { season: 'spring', isHoliday: false };
  if (month >= 5 && month <= 7) return { season: 'summer', isHoliday: false };
  return { season: 'fall', isHoliday: false };
};

// Snowflake component
const Snowflake = ({ delay, duration, left }: { delay: number; duration: number; left: number }) => (
  <motion.div
    className="fixed pointer-events-none z-50 text-white/60"
    style={{ left: `${left}%`, top: -20 }}
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{ 
      y: '100vh', 
      opacity: [0, 1, 1, 0],
      rotate: 360,
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    ❄
  </motion.div>
);

// Leaf component for fall
const FallingLeaf = ({ delay, duration, left }: { delay: number; duration: number; left: number }) => (
  <motion.div
    className="fixed pointer-events-none z-50"
    style={{ left: `${left}%`, top: -20, fontSize: '1.2rem' }}
    initial={{ y: -20, opacity: 0, rotate: 0, x: 0 }}
    animate={{ 
      y: '100vh', 
      opacity: [0, 1, 1, 0],
      rotate: [0, 180, 360],
      x: [0, 30, -30, 20, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    🍂
  </motion.div>
);

// Seasonal Effects Provider
export const SeasonalProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<SeasonalTheme>({ season: 'none', isHoliday: false });
  const [showEffects, setShowEffects] = useState(true);

  useEffect(() => {
    setTheme(getSeasonalTheme());
  }, []);

  // Generate particles based on season
  const particles = [];
  
  if (showEffects && theme.season === 'winter') {
    for (let i = 0; i < 30; i++) {
      particles.push(
        <Snowflake
          key={i}
          delay={Math.random() * 10}
          duration={8 + Math.random() * 4}
          left={Math.random() * 100}
        />
      );
    }
  }

  if (showEffects && theme.season === 'fall') {
    for (let i = 0; i < 15; i++) {
      particles.push(
        <FallingLeaf
          key={i}
          delay={Math.random() * 15}
          duration={12 + Math.random() * 6}
          left={Math.random() * 100}
        />
      );
    }
  }

  return (
    <SeasonalContext.Provider value={theme}>
      {children}
      
      {/* Seasonal particles */}
      {particles}
      
      {/* Holiday banner */}
      {theme.isHoliday && (
        <motion.div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 py-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-sm">
            {theme.holidayName === 'Christmas' && '🎄'}
            {theme.holidayName === 'Halloween' && '🎃'}
            {theme.holidayName === 'New Year' && '🎆'}
            {theme.holidayName === 'Independence Day' && '🇺🇸'}
            {' '}Happy {theme.holidayName}!
          </span>
        </motion.div>
      )}

      {/* Toggle seasonal effects button */}
      {theme.season !== 'none' && (
        <motion.button
          className="fixed bottom-4 right-4 z-50 glass rounded-full px-3 py-1 text-xs text-muted-foreground"
          onClick={() => setShowEffects(!showEffects)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showEffects ? 'Hide' : 'Show'} seasonal effects
        </motion.button>
      )}
    </SeasonalContext.Provider>
  );
};

export default SeasonalProvider;
