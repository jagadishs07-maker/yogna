'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, onAddToCart }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Magnetic effect on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(card, {
        x: x * 0.04,
        y: y * 0.04,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const handleAdd = () => {
    addToCart(product);
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div ref={cardRef} className="product-card" data-product>
      {/* Image with clip-path mask (animated by ProductGrid) */}
      <div className="product-card-image-wrap" data-image-wrap>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
          priority={index < 3}
        />
      </div>

      {/* Info */}
      <div className="product-card-body">
        <div className="product-card-top">
          <h3 className="product-name">{product.name}</h3>
        </div>
        <div className="product-category">
          <span className="product-category-dot" />
          {product.category}
        </div>
      </div>

      {/* Add to enquiry (slides in on hover) */}
      <button className="product-add-btn" onClick={handleAdd} aria-label={`Enquire about ${product.name}`}>
        Enquire Now
      </button>
    </div>
  );
}
