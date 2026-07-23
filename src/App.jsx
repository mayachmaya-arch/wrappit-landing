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
          clipped. hero-viewport itself carries no background color — the
          dark backdrop lives only on the clipped wrapper below, so wherever
          that wrapper stops, this page's own bg-cream (set on the root div
          above) shows through directly. Nothing paints "next section
          background" on purpose; it's just what's already behind everything. */}
      <div className="hero-viewport relative flex flex-col overflow-x-hidden">
        {/* Video + dark gradient, clipped to stop short of the hero's bottom
            edge (see bottom-20 below) instead of running the full inset-0
            height. The purple marquee's band is thick enough to fully cover
            that stopped-short strip on its own (verified empirically — see
            commit message), so the strip never shows on its own; it only
            ever shows through in the sliver where the marquee's rotation
            recedes from the hero's flat bottom edge, and now that sliver is
            genuinely empty rather than backed by dark content, so it reveals
            the page's real cream background instead of a manufactured patch. */}
        <div className="absolute inset-x-0 top-0 bottom-20 overflow-hidden bg-ink">
          <HeroBackground />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/10 via-ink/40 to-ink/70" />
        </div>
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
