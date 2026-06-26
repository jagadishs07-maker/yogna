'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current(),
    });

    // Fade in + scale up YOGNA text
    tl.fromTo(
      textRef.current,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    )
    // Tagline fade in
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    // Red flash
    .to(flashRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: 'none',
    }, '+=0.5')
    .to(flashRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: 'none',
    })
    // Fade out loader
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = 'none';
      },
    }, '+=0.1');

    return () => {
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={loaderRef} className="loader">
      <div ref={flashRef} className="loader-flash" />
      <div ref={textRef} className="loader-text">YOGNA</div>
      <div ref={taglineRef} className="loader-tagline">Corporate Hygiene Solutions</div>
    </div>
  );
}
