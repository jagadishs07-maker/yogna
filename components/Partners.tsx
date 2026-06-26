'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PARTNERS = [
  {
    abbr: 'JCP',
    name: 'Jade Consumer Products Pvt. Limited',
    desc: 'Strategic product partner supplying premium consumer hygiene and washroom care solutions across commercial establishments.',
    link: 'View Partnership',
  },
  {
    abbr: 'EUR',
    name: 'Euronics Industries Pvt. Ltd.',
    desc: 'Technical and manufacturing partner for automated, eco-friendly washroom hygiene dispensing systems.',
    link: 'View Partnership',
  },
  {
    abbr: 'RHS',
    name: 'Roots Hygiene Solutions',
    desc: 'Authorized distribution and service partner for industrial cleaning equipment and washroom hygiene infrastructure.',
    link: 'View Partnership',
  },
];

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.partner-card');

    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="partners-section" id="partners">
      <div className="partners-header">
        <p className="section-label">Authorized Partners</p>
        <h2 className="partners-title">Our Partners</h2>
        <p className="partners-desc">
          We supply certified hygiene solutions to India&apos;s leading corporations, 
          healthcare groups, and commercial real estate portfolios.
        </p>
      </div>

      <div className="partners-grid">
        {PARTNERS.map((partner, i) => (
          <div key={i} className="partner-card">
            <div className="partner-logo-area">{partner.abbr}</div>
            <h3 className="partner-name">{partner.name}</h3>
            <p className="partner-desc">{partner.desc}</p>
            <a href="#contact" className="partner-link">{partner.link}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
