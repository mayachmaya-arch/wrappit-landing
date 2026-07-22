import { useEffect, useRef } from 'react';

// Looping background video, per the Figma prototype for the Hero section.
// Plain /public paths — see README.md → "העלאת נכסים בעצמך".
const POSTER_SRC = '/images/hero-bg.jpg';
const VIDEO_SRC_MP4 = '/videos/hero-bg.mp4';
const VIDEO_SRC_WEBM = '/videos/hero-bg.webm';

export default function HeroBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      poster={POSTER_SRC}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
    >
      <source src={VIDEO_SRC_WEBM} type="video/webm" />
      <source src={VIDEO_SRC_MP4} type="video/mp4" />
    </video>
  );
}
