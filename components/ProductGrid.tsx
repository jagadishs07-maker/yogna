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
    id: 'touchless-dispenser',
    name: 'TouchFree Pro Dispenser',
    category: 'Touchless Systems',
    image: '/images/touchless_dispenser.png',
  },
  {
    id: 'bio-sanitizer',
    name: 'BioClean Sanitizer',
    category: 'Bio Solutions',
    image: '/images/bio_sanitizer.png',
  },
  {
    id: 'feminine-hygiene',
    name: 'FemSafe Disposal Unit',
    category: 'Feminine Hygiene',
    image: '/images/feminine_hygiene.png',
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
    </section>
  );
}

export { PRODUCTS };
