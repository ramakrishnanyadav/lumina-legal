import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CrimeAnalyzer from '@/components/CrimeAnalyzer';
import PerspectiveSwitcher from '@/components/PerspectiveSwitcher';
import ProceduralTimeline from '@/components/ProceduralTimeline';
import LawyerMarketplace from '@/components/LawyerMarketplace';
import FloatingAIChat from '@/components/FloatingAIChat';
import ScrollProgress from '@/components/ScrollProgress';
import Footer from '@/components/Footer';
import AnimatedToast from '@/components/AnimatedToast';
import CustomCursor from '@/components/CustomCursor';
import { ScrollSpotlight } from '@/components/ParallaxSection';
import ScrollReveal from '@/components/ScrollReveal';
import { useIsMobile } from '@/hooks/use-mobile';
import { AudioProvider } from '@/components/AudioManager';
import SoundToggle from '@/components/SoundToggle';
import { EasterEggProvider } from '@/components/EasterEggs';
import { SeasonalProvider } from '@/components/SeasonalThemes';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <AudioProvider>
      <EasterEggProvider>
        <SeasonalProvider>
          <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
            {/* Custom cursor - desktop only */}
            {!isMobile && <CustomCursor />}
            
            {/* Toast notifications */}
            <AnimatedToast />
            
            {/* Sound toggle */}
            <SoundToggle />
            
            {/* Animated gradient mesh background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(0, 217, 255, 0.08) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(123, 47, 247, 0.06) 0%, transparent 40%),
                    radial-gradient(ellipse 50% 30% at 40% 80%, rgba(255, 0, 110, 0.05) 0%, transparent 40%),
                    radial-gradient(ellipse 40% 40% at 90% 70%, rgba(0, 217, 255, 0.04) 0%, transparent 35%)
                  `,
                  animation: 'mesh-shift 25s ease-in-out infinite',
                }}
              />
            </div>

            {/* Scroll spotlight effect */}
            <ScrollSpotlight />

            {/* Effects */}
            <ParticleBackground />
            <ScrollProgress />
            
            {/* Navigation */}
            <Navbar />
            
            {/* Main Content */}
            <main className="relative z-10">
              <HeroSection />
              <ScrollReveal type="scale">
                <CrimeAnalyzer />
              </ScrollReveal>
              <ScrollReveal type="fade" delay={0.1}>
                <PerspectiveSwitcher />
              </ScrollReveal>
              <section id="timeline">
                <ScrollReveal type="slide">
                  <ProceduralTimeline />
                </ScrollReveal>
              </section>
              <section id="lawyers">
                <ScrollReveal type="scale" delay={0.1}>
                  <LawyerMarketplace />
                </ScrollReveal>
              </section>
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* Floating Elements */}
            <FloatingAIChat />
          </div>
        </SeasonalProvider>
      </EasterEggProvider>
    </AudioProvider>
  );
};

export default Index;
