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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Effects */}
      <ParticleBackground />
      <ScrollProgress />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main>
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
