'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);

  // Magnetic CTA (desktop only)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024)) return;
    const wrap = ctaWrapRef.current;
    const btn = ctaRef.current;
    if (!wrap || !btn) return;

    const handleMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };

    wrap.addEventListener('mousemove', handleMove);
    wrap.addEventListener('mouseleave', handleLeave);
    return () => {
      wrap.removeEventListener('mousemove', handleMove);
      wrap.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // ScrollTrigger: sequential reveal
  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        once: true,
      },
    });

    // Image unmask
    tl.to(imageRef.current, {
      clipPath: 'inset(0% 0 0% 0)',
      duration: 1.2,
      ease: 'power4.inOut',
    })
    // Headline slide up
    .to(
      headlineRef.current,
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    // Body text
    .to(
      bodyRef.current,
      { y: 0, opacity: 0.75, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    )
    // CTA pop in
    .to(
      ctaRef.current,
      { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className="feature-section">
      <div className="feature-inner">
        {/* Product image */}
        <div ref={imageRef} className="feature-image-wrap">
          <Image
            src="/products/automatic-sanitary-vending.png"
            alt="YOGNA Automatic Sanitary Vending Machine — Flagship System"
            fill
            sizes="50vw"
            style={{ objectFit: 'contain', padding: '36px' }}
          />
        </div>

        {/* Content */}
        <div className="feature-content">
          <span className="feature-label">Flagship System</span>

          <h2 ref={headlineRef} className="feature-headline">
            AUTOMATIC<br />SANITARY<br />VENDING
          </h2>

          <p ref={bodyRef} className="feature-body" style={{ transform: 'translateY(40px)' }}>
            A fully automated sanitary vending machine engineered with digital
            payment (UPI, card, coin), touchless QR-code dispensing, and real-time
            inventory telemetry. Delivers 24/7 dignified, hygienic access across
            commercial facilities.
          </p>

          <div ref={ctaWrapRef} className="magnetic-wrap" style={{ alignSelf: 'flex-start' }}>
            <Link
              ref={ctaRef}
              href="/products/automatic-sanitary-vending"
              className="feature-cta"
              id="feature-cta-btn"
              style={{ textDecoration: 'none' }}
            >
              VIEW<br />MORE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
