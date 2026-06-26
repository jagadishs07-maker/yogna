'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = [
  {
    num: '01',
    icon: '◉',
    name: 'Touchless Dispensers',
    desc: 'Sensor-activated soap, sanitizer, and paper dispensers for a zero-contact washroom experience.',
    link: '/products?category=soap-dispenser',
  },
  {
    num: '02',
    icon: '◈',
    name: 'Bio-Sanitizers',
    desc: 'Eco-certified, non-toxic bio-sanitizing systems that eliminate 99.9% of bacteria without harsh chemicals.',
    link: '/products?category=urinal-hygiene',
  },
  {
    num: '03',
    icon: '◆',
    name: 'Feminine Hygiene',
    desc: 'Dignified, discreet feminine hygiene disposal systems designed for modern commercial washrooms.',
    link: '/products?category=feminine-hygiene',
  },
  {
    num: '04',
    icon: '✦',
    name: 'Air Care Systems',
    desc: 'Automated ambient air freshening with long-lasting, eco-friendly fragrance refills.',
    link: '/products?category=aroma-diffusers',
  },
  {
    num: '05',
    icon: '◇',
    name: 'Hand Drying',
    desc: 'High-speed, energy-efficient hand dryers with HEPA filtration for hygienic drying.',
    link: '/products?category=hand-dryer',
  },
  {
    num: '06',
    icon: '▣',
    name: 'Managed Services',
    desc: 'Full-service restocking, maintenance, and hygiene audits on a monthly subscription model.',
    link: '/products',
  },
];

export default function ServiceCategories() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.category-card');

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
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
    <section ref={sectionRef} className="categories-section" id="services">
      <p className="section-label">Our Services</p>
      <div className="categories-grid">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className="category-card">
            <span className="category-num">{cat.num}</span>
            <span className="category-icon">{cat.icon}</span>
            <h3 className="category-name">{cat.name}</h3>
            <p className="category-desc">{cat.desc}</p>
            <Link href={cat.link} className="category-link">
              Explore
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
