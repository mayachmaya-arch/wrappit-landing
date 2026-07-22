import Header from './components/Header';
import Hero from './components/Hero';
import HeroBackground from './components/HeroBackground';
import Marquee from './components/Marquee';
import ProblemSection from './components/ProblemSection';
import GiftCollage from './components/GiftCollage';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

function App() {
  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-cream text-ink">
      {/* hero-viewport: min-height:100svh at lg+ only, so the hero fills the
          initial viewport on desktop while mobile keeps its content-driven
          height. overflow-x-hidden (not overflow-hidden) so the ticker's
          rotated band can bleed past the hero's bottom edge without being
          clipped, while the video/gradient — always bounded to inset-0 —
          are unaffected. */}
      <div className="hero-viewport relative flex flex-col overflow-x-hidden bg-ink">
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-l from-ink/10 via-ink/40 to-ink/70" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1820px] flex-1 flex-col px-4 pt-4 sm:px-8 sm:pt-6">
          <Header />
          <Hero />
        </div>
        <Marquee />
      </div>

      <ProblemSection />
      <GiftCollage />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;
