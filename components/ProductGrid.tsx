'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PRODUCTS = [
  {
    id: 'disp-auto-foam-lotion-spray-1000ml',
    name: 'DISP AUTOMATIC 1000 ML',
    category: 'Soap Dispenser',
    image: '/products/disp-auto-foam-lotion-spray-1000ml.png',
  },
  {
    id: 'disp-autojanitor-bottle',
    name: 'DISP AUTOJANITOR BOTTLE',
    category: 'Urinal Hygiene System',
    image: '/products/disp-autojanitor-bottle.png',
  },
  {
    id: 'sanipod-manual-12ltr',
    name: 'SANIPOD MANUAL 12 LTR',
    category: 'Feminine Hygiene',
    image: '/products/sanipod-manual-12ltr.png',
  },
];

interface ProductGridProps {
  onAddToCart?: (product: typeof PRODUCTS[0]) => void;
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const imageWraps = sectionRef.current.querySelectorAll('[data-image-wrap]');
    const cards = sectionRef.current.querySelectorAll('[data-product]');

    // Image mask reveal stagger
    gsap.to(imageWraps, {
      clipPath: 'inset(0% 0 0% 0)',
      duration: 1.0,
      stagger: 0.15,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    // Card slide up
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="product-section" id="products">
      <div className="product-section-inner">
        <div className="product-section-header">
          <p className="section-label">Our Products</p>
          <Link href="/products" className="view-all-link">View All Products</Link>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { PRODUCTS };
