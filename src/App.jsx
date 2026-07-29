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
      {/* hero-viewport: min-height:100svh at every width, so only the hero
          and its marquee band are visible before the user scrolls, on
          phones as much as desktop. hero-viewport itself carries no
          background color — the dark backdrop lives only on the clipped
          wrapper below, so wherever that wrapper stops, this page's own
          bg-cream (set on the root div above) shows through directly.
          Nothing paints "next section background" on purpose; it's just
          what's already behind everything.

          overflow-x-clip (not overflow-x-hidden) is deliberate: per the
          CSS overflow spec, an element with overflow-x:hidden and no
          explicit overflow-y has its overflow-y computed as auto, not
          visible — a real, reproduced bug here (verified: hero-viewport's
          scrollHeight exceeded its clientHeight by ~41px, exactly the
          marquee band's rotated bottom-corner bleed past this element's
          own box). That made hero-viewport an actual nested scroll
          container with its own tiny scroll range, so a mouse-wheel/touch
          scroll starting over the hero had to exhaust that ~41px of
          internal scroll before the page scroll continued — read as the
          scroll "sticking" right at the hero/next-section boundary.
          overflow-x:clip clips the same horizontal overflow without ever
          pairing with overflow-y, so overflow-y stays visible and the
          band's intentional bottom bleed (needed for the clean hero
          boundary) renders without creating any scrollable region. */}
      <div className="hero-viewport relative flex flex-col overflow-x-clip">
        {/* Video + dark gradient, clipped to stop short of the hero's bottom
            edge (see bottom-[4vw] below) instead of running the full inset-0
            height. 4vw is proportional, not a fixed pixel patch: the purple
            band is rotated -2.7deg at 120vw wide, so its far corners recede
            from the hero's flat bottom edge by (0.6*100vw)*sin(2.7deg) ≈
            2.83vw at any viewport width. Clipping the video short by 4vw
            keeps a ~1.4x safety margin over that recession at every width,
            while staying comfortably under the band's own thickness, so the
            strip this reveals is always fully covered by the band except in
            that receded sliver — where it now reveals the page's real cream
            background instead of a manufactured patch. */}
        <div className="absolute inset-x-0 top-0 bottom-[4vw] overflow-hidden bg-ink">
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
