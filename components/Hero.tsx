'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LETTERS = ['Y', 'O', 'G', 'N', 'A'];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 });

    // Letter stagger
    tl.to(lettersRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power4.out',
    })
    .fromTo(
      bottomRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
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
      {/* Giant YOGNA text */}
      <div className="hero-bg-text" aria-label="YOGNA">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={el => { lettersRef.current[i] = el; }}
            className="hero-letter"
          >
            {letter}
          </span>
        ))}
      </div>

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
