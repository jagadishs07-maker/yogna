'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { number: '500', suffix: '+', label: 'Commercial Clients' },
  { number: '12', suffix: 'K+', label: 'Units Deployed' },
  { number: '99', suffix: '%', label: 'Germ Elimination' },
  { number: '8', suffix: '+', label: 'Years of Service' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      numbersRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-item"
            ref={el => { numbersRef.current[i] = el; }}
          >
            <div className="stat-number">
              {stat.number}<span>{stat.suffix}</span>
            </div>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
