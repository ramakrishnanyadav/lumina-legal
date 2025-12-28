import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CrimeAnalyzer from '@/components/CrimeAnalyzer';
import PerspectiveToggle from '@/components/PerspectiveToggle';
import ProceduralTimeline from '@/components/ProceduralTimeline';
import LawyerMarketplace from '@/components/LawyerMarketplace';
import FloatingAIChat from '@/components/FloatingAIChat';
import ScrollProgress from '@/components/ScrollProgress';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
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
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 70% 60%, rgba(123, 47, 247, 0.06) 0%, transparent 45%),
              radial-gradient(ellipse 50% 40% at 10% 70%, rgba(0, 217, 255, 0.05) 0%, transparent 40%)
            `,
            animation: 'mesh-shift 30s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Effects */}
      <ParticleBackground />
      <ScrollProgress />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <CrimeAnalyzer />
        <PerspectiveToggle />
        <section id="timeline">
          <ProceduralTimeline />
        </section>
        <section id="lawyers">
          <LawyerMarketplace />
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating Elements */}
      <FloatingAIChat />
    </div>
  );
};

export default Index;
