'use client';
import { use } from 'react';
import Link from 'next/link';
import { getProductById, PRODUCTS, CATEGORIES } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { notFound } from 'next/navigation';

const CATEGORY_COLORS: Record<string, string> = {
  'aerosol-dispenser': '#000000',
  'aroma-diffusers':   '#1a1a1a',
  'urinal-hygiene':    '#222222',
  'soap-dispenser':    '#111111',
  'paper-dispenser':   '#0d0d0d',
  'hand-dryer':        '#FF1A1A',
  'feminine-hygiene':  '#1c1c1c',
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);
  const { addToCart } = useCart();

  if (!product) return notFound();

  const related = PRODUCTS
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const categoryLabel = CATEGORIES.find(c => c.id === product.categoryId)?.name ?? product.category;

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, category: product.category });
  };

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link href="/" className="pd-bc-link">Home</Link>
        <span className="pd-bc-sep">›</span>
        <Link href="/products" className="pd-bc-link">Products</Link>
        <span className="pd-bc-sep">›</span>
        <span className="pd-bc-current">{product.name}</span>
      </div>

      {/* Main Detail */}
      <div className="pd-inner">
        {/* Left — Product visual placeholder */}
        <div className="pd-visual-wrap">
          <div
            className="pd-visual"
            style={{ background: CATEGORY_COLORS[product.categoryId] ?? '#000' }}
          >
            <span className="pd-visual-letter">{product.name.charAt(0)}</span>
            <span className="pd-visual-category">{categoryLabel}</span>
          </div>
          <div className="pd-visual-tag">
            <span className="pd-visual-tag-dot" />
            {product.category}
          </div>
        </div>

        {/* Right — Product info */}
        <div className="pd-info">
          <p className="pd-category-label">{categoryLabel}</p>
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-divider" />

          <p className="pd-description">{product.description}</p>

          {/* Specs */}
          {product.specs.length > 0 && (
            <div className="pd-specs">
              <p className="pd-specs-title">Specifications</p>
              <ul className="pd-specs-list">
                {product.specs.map((spec, i) => (
                  <li key={i} className="pd-spec-item">
                    <span className="pd-spec-dot" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="pd-actions">
            <button className="pd-add-btn" onClick={handleAdd} id={`add-to-enquiry-${product.id}`}>
              + Add to Enquiry
            </button>
            <Link href="/products" className="pd-back-link">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pd-related">
          <p className="section-label">More in {categoryLabel}</p>
          <div className="pd-related-grid">
            {related.map(rel => (
              <Link key={rel.id} href={`/products/${rel.id}`} className="pg-card">
                <div
                  className="pg-card-thumb"
                  style={{ background: CATEGORY_COLORS[rel.categoryId] ?? '#000' }}
                >
                  <span className="pg-card-thumb-letter">{rel.name.charAt(0)}</span>
                  <span className="pg-card-category-badge">{rel.category}</span>
                </div>
                <div className="pg-card-body">
                  <p className="pg-card-cat">{rel.category}</p>
                  <h3 className="pg-card-name">{rel.name}</h3>
                  <p className="pg-card-desc">{rel.description.substring(0, 70)}…</p>
                  <div className="pg-card-actions">
                    <span className="pg-card-view">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
