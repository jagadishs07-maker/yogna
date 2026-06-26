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
import { useCart } from '@/context/CartContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { addToCart } = useCart();

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

  // addToCart now auto-shows toast via CartContext
  const handleAddToCart = useCallback((product: { id?: string; name: string; category?: string }) => {
    addToCart({
      id: product.id ?? product.name.toLowerCase().replace(/\s+/g, '-'),
      name: product.name,
      category: product.category ?? '',
    });
  }, [addToCart]);

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <main>
          <Hero />
          <TrustBar />
          <ProductGrid onAddToCart={handleAddToCart} />
          <FeatureSection />
          <ServiceCategories />
          <StatsSection />
          <AdditionalProducts onAddToCart={handleAddToCart} />
          <Partners />
        </main>
        <Footer />
      </div>
    </>
  );
}
