'use client';
import { useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Loader from '@/components/Loader';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ProductGrid from '@/components/ProductGrid';
import FeatureSection from '@/components/FeatureSection';
import ServiceCategories from '@/components/ServiceCategories';
import StatsSection from '@/components/StatsSection';
import AdditionalProducts from '@/components/AdditionalProducts';
import Partners from '@/components/Partners';
import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  const handleLoaderComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <main>
          <Hero />
          <TrustBar />
          <ProductGrid />
          <FeatureSection />
          <ServiceCategories />
          <StatsSection />
          <AdditionalProducts />
          <Partners />
        </main>
        <Footer />
      </div>
    </>
  );
}
