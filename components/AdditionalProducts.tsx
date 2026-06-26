'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ADDITIONAL_PRODUCTS = [
  {
    id: 'air-freshener',
    name: 'AutoScent Air System',
    category: 'Air Care',
    image: '/images/air_freshener.png',
  },
  {
    id: 'hand-dryer',
    name: 'VeloStar Hand Dryer',
    category: 'Hand Drying',
    image: '/images/hand_dryer.png',
  },
  {
    id: 'tissue-dispenser',
    name: 'PaperMax Dispenser',
    category: 'Tissue Systems',
    image: '/images/tissue_dispenser.png',
  },
];

interface AdditionalProductsProps {
  onAddToCart?: (product: typeof ADDITIONAL_PRODUCTS[0]) => void;
}

export default function AdditionalProducts({ onAddToCart }: AdditionalProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const imageWraps = sectionRef.current.querySelectorAll('[data-image-wrap]');
    const cards = sectionRef.current.querySelectorAll('[data-product]');
    const header = sectionRef.current.querySelector('.additional-header');

    // Header reveal
    gsap.fromTo(
      header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );

    // Image reveals with slightly different stagger
    gsap.to(imageWraps, {
      clipPath: 'inset(0% 0 0% 0)',
      duration: 1.0,
      stagger: 0.2,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      },
    });

    // Cards slide up
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.16,
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
    <section ref={sectionRef} className="additional-section">
      <div className="additional-header">
        <h2 className="additional-title">
          MORE<br />FROM<br />YOGNA
        </h2>
        <Link href="/products" className="view-all-link">
          View All Products
        </Link>
      </div>

      <div className="additional-grid">
        {ADDITIONAL_PRODUCTS.map((product, i) => (
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
