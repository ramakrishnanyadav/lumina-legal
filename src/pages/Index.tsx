import { Suspense, lazy, memo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ScrollProgress from '@/components/ScrollProgress';
import Footer from '@/components/Footer';
import { ScrollSpotlight } from '@/components/ParallaxSection';
import ScrollReveal from '@/components/ScrollReveal';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePerformanceMode } from '@/hooks/usePerformance';
import { AudioProvider } from '@/components/AudioManager';
import SoundToggle from '@/components/SoundToggle';
import { EasterEggProvider } from '@/components/EasterEggs';
import { SeasonalProvider } from '@/components/SeasonalThemes';
import { LazyLoader, SectionSkeleton, Deferred, Progressive } from '@/components/PerformanceWrapper';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { SkipToContent } from '@/components/AccessibilityComponents';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import { DisclaimerBadge } from '@/components/DisclaimerSystem';
import SourcesFooter from '@/components/SourcesFooter';

// Lazy load heavy components
const ParticleBackground = lazy(() => import('@/components/ParticleBackground'));
const CrimeAnalyzer = lazy(() => import('@/components/CrimeAnalyzer'));
const PerspectiveSwitcher = lazy(() => import('@/components/PerspectiveSwitcher'));
const ProceduralTimeline = lazy(() => import('@/components/ProceduralTimeline'));
const LawyerMarketplace = lazy(() => import('@/components/LawyerMarketplace'));
const FloatingAIChat = lazy(() => import('@/components/FloatingAIChat'));
const AnimatedToast = lazy(() => import('@/components/AnimatedToast'));
const CustomCursor = lazy(() => import('@/components/CustomCursor'));

// Memoized background gradient
const BackgroundGradient = memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
));

BackgroundGradient.displayName = 'BackgroundGradient';

const Index = () => {
  const isMobile = useIsMobile();
  const { shouldAnimate, shouldUseHeavyEffects } = usePerformanceMode();
  
  return (
    <AccessibilityProvider>
      <AudioProvider>
        <EasterEggProvider>
          <SeasonalProvider>
            <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
              {/* Skip to content link for keyboard users */}
              <SkipToContent />
              
              {/* Accessibility settings panel */}
              <AccessibilityPanel />
              
              {/* Custom cursor - desktop only with performance check */}
              {!isMobile && shouldUseHeavyEffects && (
                <LazyLoader>
                  <CustomCursor />
                </LazyLoader>
              )}
              
              {/* Toast notifications - deferred */}
              <Deferred delay={500}>
                <LazyLoader>
                  <AnimatedToast />
                </LazyLoader>
              </Deferred>
              
              {/* Sound toggle */}
              <SoundToggle />
              
              {/* Background - simplified on low-end devices */}
              <BackgroundGradient />

              {/* Scroll spotlight effect - only on capable devices */}
              <Progressive
                children={null}
                enhancedChildren={<ScrollSpotlight />}
              />

              {/* Particle effects - only on capable devices */}
              {shouldUseHeavyEffects && (
                <LazyLoader>
                  <ParticleBackground />
                </LazyLoader>
              )}
              
              <ScrollProgress />
              
              {/* Navigation */}
              <header role="banner">
                <Navbar />
              </header>
              
              {/* Main Content */}
              <main id="main-content" role="main" className="relative z-10">
                <HeroSection />
                
                <ScrollReveal type="scale">
                  <LazyLoader fallback={<SectionSkeleton rows={2} />}>
                    <CrimeAnalyzer />
                  </LazyLoader>
                </ScrollReveal>
                
                <ScrollReveal type="fade" delay={0.1}>
                  <LazyLoader fallback={<SectionSkeleton rows={2} />}>
                    <PerspectiveSwitcher />
                  </LazyLoader>
                </ScrollReveal>
                
                <section id="timeline" aria-label="Legal timeline">
                  <ScrollReveal type={shouldAnimate ? "slide" : "fade"}>
                    <LazyLoader fallback={<SectionSkeleton rows={4} />}>
                      <ProceduralTimeline />
                    </LazyLoader>
                  </ScrollReveal>
                </section>
                
                <section id="lawyers" aria-label="Lawyer marketplace">
                  <ScrollReveal type="scale" delay={0.1}>
                    <LazyLoader fallback={<SectionSkeleton rows={3} />}>
                      <LawyerMarketplace />
                    </LazyLoader>
                  </ScrollReveal>
                </section>
              </main>
              
              {/* Sources Footer */}
              <SourcesFooter />
              
              {/* Footer */}
              <Footer />
              
              {/* Floating Elements */}
              <DisclaimerBadge />
              
              <Deferred delay={1000}>
                <LazyLoader>
                  <FloatingAIChat />
                </LazyLoader>
              </Deferred>
            </div>
          </SeasonalProvider>
        </EasterEggProvider>
      </AudioProvider>
    </AccessibilityProvider>
  );
};

export default Index;
