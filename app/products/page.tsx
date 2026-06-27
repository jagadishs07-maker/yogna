'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useCart } from '@/context/CartContext';

const CATEGORY_COLORS: Record<string, string> = {
  'aerosol-dispenser': '#000000',
  'aroma-diffusers':   '#1a1a1a',
  'urinal-hygiene':    '#222222',
  'soap-dispenser':    '#111111',
  'paper-dispenser':   '#0d0d0d',
  'hand-dryer':        '#FF1A1A',
  'feminine-hygiene':  '#1c1c1c',
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const filtered = PRODUCTS.filter(p => {
    const matchCat  = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.pg-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' }
    );
  }, [activeCategory, search]);

  const handleAddToCart = (e: React.MouseEvent, product: { id: string; name: string; category: string }) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="pg-page">
      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="pg-header">
        <div className="pg-header-inner">
          <p className="pg-header-label">Product Catalog</p>
          <div className="pg-header-row">
            <h1 className="pg-header-title">Explore Our Range</h1>
            <div className="pg-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                className="pg-search"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pg-body">
        {/* ── Left Sidebar ──────────────────────────────────── */}
        <aside className="pg-sidebar">
          <p className="pg-sidebar-title">CATEGORIES</p>
          <ul className="pg-sidebar-list">
            <li>
              <label className="pg-sidebar-item">
                <input
                  type="radio"
                  name="cat"
                  checked={activeCategory === 'all'}
                  onChange={() => setActiveCategory('all')}
                />
                <span>All Products</span>
                <span className="pg-sidebar-count">{PRODUCTS.length}</span>
              </label>
            </li>
            {CATEGORIES.map(cat => (
              <li key={cat.id}>
                <label className="pg-sidebar-item">
                  <input
                    type="radio"
                    name="cat"
                    checked={activeCategory === cat.id}
                    onChange={() => setActiveCategory(cat.id)}
                  />
                  <span>{cat.name}</span>
                  <span className="pg-sidebar-count">
                    {PRODUCTS.filter(p => p.categoryId === cat.id).length}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Main Content ──────────────────────────────────── */}
        <div className="pg-main">
          {/* Category tabs */}
          <div className="pg-tabs" role="tablist">
            <button
              role="tab"
              className={`pg-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              ALL PRODUCTS
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                role="tab"
                className={`pg-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="pg-result-count">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Grid */}
          <div ref={gridRef} className="pg-grid">
            {filtered.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="pg-card"
                aria-label={product.name}
              >
                {/* Placeholder area */}
                <div
                  className="pg-card-thumb"
                  style={{ background: CATEGORY_COLORS[product.categoryId] ?? '#000' }}
                >
                  <span className="pg-card-thumb-letter">
                    {product.name.charAt(0)}
                  </span>
                  <span className="pg-card-category-badge">{product.category}</span>
                </div>

                {/* Info */}
                <div className="pg-card-body">
                  <p className="pg-card-cat">{product.category}</p>
                  <h3 className="pg-card-name">{product.name}</h3>
                  <p className="pg-card-desc">
                    {product.description.substring(0, 80)}…
                  </p>
                  <div className="pg-card-actions">
                    <button
                      className="pg-card-enquire"
                      onClick={e => handleAddToCart(e, product)}
                      aria-label={`Add ${product.name} to enquiry`}
                    >
                      + Enquire
                    </button>
                    <span className="pg-card-view">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="pg-empty">
              <p>No products found for &ldquo;{search}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pg-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p>Loading products...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
