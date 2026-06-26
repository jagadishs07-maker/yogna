'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { count, openCart } = useCart();
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        YOG<span>NA</span>
      </Link>
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
    </nav>
  );
}
