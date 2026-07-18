import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import DarkGallery from './components/DarkGallery';
import Marquee from './components/Marquee';
import heroBg from './assets/images/hero-bg.svg';

function App() {
  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-cream text-ink">
      <div className="relative overflow-hidden bg-ink">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-ink/10 via-ink/40 to-ink/70" />
        <div className="relative mx-auto flex max-w-[1820px] flex-col px-4 pt-4 sm:px-8 sm:pt-6">
          <Header />
          <Hero />
        </div>
      </div>

      <ProblemSection />
      <DarkGallery />
      <Marquee />
    </div>
  );
}

export default App;
