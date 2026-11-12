'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navPillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Lando Norris slot-machine staggered character roll for navbar links
  useEffect(() => {
    const rollLinks = document.querySelectorAll<HTMLElement>('.hero-navbar .ln-roll-link');
    rollLinks.forEach((link) => {
      if (link.dataset.splitDone === 'true') return;
      const text = link.textContent?.trim() || '';
      link.textContent = '';
      link.dataset.splitDone = 'true';
      link.setAttribute('aria-label', text);

      [...text].forEach((ch, idx) => {
        const wrap = document.createElement('span');
        wrap.className = 'char-wrap';

        const primary = document.createElement('span');
        primary.className = 'char-primary';
        primary.style.transitionDelay = `${idx * 16}ms`;
        primary.textContent = ch === ' ' ? '\u00A0' : ch;

        const clone = document.createElement('span');
        clone.className = 'char-clone';
        clone.style.transitionDelay = `${idx * 16}ms`;
        clone.setAttribute('aria-hidden', 'true');
        clone.textContent = ch === ' ' ? '\u00A0' : ch;

        wrap.appendChild(primary);
        wrap.appendChild(clone);
        link.appendChild(wrap);
      });
    });

    // Sliding Magnetic Hover Pill Behind Navbar Links
    const navContainer = navContainerRef.current;
    const navPill = navPillRef.current;
    if (!navContainer || !navPill) return;

    const navItems = navContainer.querySelectorAll<HTMLElement>('.nav-item');

    const handleEnter = (e: MouseEvent) => {
      const cRect = navContainer.getBoundingClientRect();
      const iRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      gsap.to(navPill, {
        x: iRect.left - cRect.left,
        width: iRect.width,
        opacity: 1,
        duration: 0.32,
        ease: 'expo.out',
      });
    };

    const handleLeave = () => {
      gsap.to(navPill, { opacity: 0, duration: 0.22, ease: 'power2.out' });
    };

    navItems.forEach((item) => item.addEventListener('mouseenter', handleEnter));
    navContainer.addEventListener('mouseleave', handleLeave);

    return () => {
      navItems.forEach((item) => item.removeEventListener('mouseenter', handleEnter));
      navContainer.removeEventListener('mouseleave', handleLeave);
    };
  }, [pathname]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-[100] w-full px-4 sm:px-6 pointer-events-none">
        <nav
          id="global-floating-nav"
          className={`hero-navbar rounded-full px-5 sm:px-8 py-2.5 sm:py-3.5 mx-auto max-w-[1260px] flex items-center justify-between pointer-events-auto transition-all duration-300 ${
            scrolled ? 'nav-scrolled' : ''
          }`}
        >
          {/* Brand Logo Split Kinetic Hover */}
          <Link
            href="/"
            id="brand-logo"
            data-cursor="BRAND"
            className="magnetic-el inline-flex items-center font-display-condensed text-2xl sm:text-[28px] tracking-normal select-none focus:outline-none"
            onClick={closeMenu}
          >
            <span className="logo-yog text-[#0A0A0A]">YOG</span>
            <span className="logo-na text-[#D91E18]">NA</span>
          </Link>

          {/* Desktop Links + Cart Button */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
            <div
              ref={navContainerRef}
              id="nav-links-container"
              className="relative hidden md:flex items-center gap-2 lg:gap-4 text-[12px] font-medium tracking-[0.16em] text-[#0A0A0A]"
            >
              <span ref={navPillRef} id="nav-hover-pill" aria-hidden="true" />
              <Link
                href="/products"
                data-cursor="EXPLORE"
                className={`nav-item ln-roll-link uppercase focus:outline-none ${
                  pathname === '/products' ? 'text-[#D91E18] font-bold' : ''
                }`}
              >
                PRODUCTS
              </Link>
              <a
                href="/#services"
                data-cursor="EXPLORE"
                className="nav-item ln-roll-link uppercase focus:outline-none"
              >
                SERVICES
              </a>
              <a
                href="/#partners"
                data-cursor="EXPLORE"
                className="nav-item ln-roll-link uppercase focus:outline-none"
              >
                PARTNERS
              </a>
              <a
                href="/#contact"
                data-cursor="CONNECT"
                className="nav-item ln-roll-link uppercase focus:outline-none"
              >
                CONTACT
              </a>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              id="cart-btn"
              data-cursor="CART"
              aria-label={`Open enquiry cart, ${count} item${count !== 1 ? 's' : ''}`}
              onClick={openCart}
              className="magnetic-el relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-md hover:bg-[#D91E18] transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              <svg
                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2.5 3h2.8l2.4 11.4a2 2 0 0 0 2 1.6h9.5a2 2 0 0 0 1.9-1.4L23 6H6.2" />
              </svg>
              {count > 0 && (
                <span className="hero-cart-badge" aria-hidden="true">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className={`hamburger md:hidden ${menuOpen ? 'hamburger-active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="font-display-condensed text-3xl tracking-normal" onClick={closeMenu}>
            <span className="text-[#0A0A0A]">YOG</span>
            <span className="text-[#D91E18]">NA</span>
          </Link>
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
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
              PRODUCTS
            </Link>
          </li>
          <li>
            <a href="/#services" onClick={closeMenu}>
              SERVICES
            </a>
          </li>
          <li>
            <a href="/#partners" onClick={closeMenu}>
              PARTNERS
            </a>
          </li>
          <li>
            <a href="/#contact" onClick={closeMenu}>
              CONTACT
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
