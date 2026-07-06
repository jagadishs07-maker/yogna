'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo" onClick={closeMenu}>
        YOG<span>NA</span>
      </Link>
      
      {/* Desktop Links */}
      <ul className="navbar-links">
        <li>
          <Link href="/products" className={pathname === '/products' ? 'nav-active' : ''}>
            Products
          </Link>
        </li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/#partners">Partners</a></li>
        <li><a href="/#contact">Contact</a></li>
        <li>
          {/* Cart icon with badge */}
          <button
            className="cart-icon-btn"
            id="cart-icon-btn"
            onClick={openCart}
            aria-label={`Open enquiry cart, ${count} item${count !== 1 ? 's' : ''}`}
          >
            {/* Shopping cart SVG */}
            <svg
              className="cart-icon-svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            {/* Badge */}
            {count > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </li>
      </ul>

      {/* Mobile Navbar Actions */}
      <div className="mobile-nav-actions">
        <button
          className="cart-icon-btn"
          onClick={openCart}
          aria-label={`Open enquiry cart, ${count} item${count !== 1 ? 's' : ''}`}
        >
          <svg
            className="cart-icon-svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {count > 0 && (
            <span className="cart-badge" aria-hidden="true">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>

        <button
          className={`hamburger ${menuOpen ? 'hamburger-active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="navbar-logo" onClick={closeMenu}>
            YOG<span>NA</span>
          </Link>
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <ul className="mobile-menu-links">
          <li>
            <Link
              href="/products"
              className={pathname === '/products' ? 'nav-active' : ''}
              onClick={closeMenu}
            >
              Products
            </Link>
          </li>
          <li>
            <a href="/#services" onClick={closeMenu}>
              Services
            </a>
          </li>
          <li>
            <a href="/#partners" onClick={closeMenu}>
              Partners
            </a>
          </li>
          <li>
            <a href="/#contact" onClick={closeMenu}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
