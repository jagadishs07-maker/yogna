'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ParticleHero from './ParticleHero';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal bottom bar and divider line as loader finishes
    const tl = gsap.timeline({ delay: 1.8 });

    tl.fromTo(
      bottomRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(
      dividerRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power3.inOut', transformOrigin: 'left center' },
      '-=0.4'
    );
  }, []);

  return (
    <section ref={heroRef} className="hero">
      {/* Premium particle animated YOGNA typography with soft depth shadow */}
      <ParticleHero />

      {/* Bottom bar */}
      <div ref={bottomRef} className="hero-bottom">
        <p className="hero-tagline">Corporate Hygiene Solutions · Est. 2015</p>
        <p className="hero-scroll-hint">Scroll to explore</p>
      </div>

      {/* Red divider line */}
      <div ref={dividerRef} className="hero-divider" />
    </section>
  );
}
