'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

const CHARS = [
  { letter: 'Y', tag: '01 · PRECISION' },
  { letter: 'O', tag: '02 · PURE CARE' },
  { letter: 'G', tag: '03 · ISO GRADE' },
  { letter: 'N', tag: '04 · NETWORK' },
  { letter: 'A', tag: '05 · EST. 2015' },
];

export default function Hero() {
  const { count, openCart } = useCart();
  const heroStageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check for pointer fine (desktop)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isFinePointer) {
      document.body.classList.add('custom-cursor-on');
    }

    // 1. Split .ln-roll-link text into Lando Norris slot-machine character spans
    const rollLinks = document.querySelectorAll<HTMLElement>('.ln-roll-link');
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

    // 2. Sliding Magnetic Pill Behind Navbar Links
    const navContainer = document.getElementById('nav-links-container');
    const navPill = document.getElementById('nav-hover-pill');
    const navItems = document.querySelectorAll<HTMLElement>('#nav-links-container .nav-item');

    const handleNavItemEnter = (e: MouseEvent) => {
      if (!navContainer || !navPill) return;
      const cRect = navContainer.getBoundingClientRect();
      const iRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      gsap.to(navPill, {
        x: iRect.left - cRect.left,
        width: iRect.width,
        opacity: 1,
        duration: 0.36,
        ease: 'expo.out',
      });
    };

    const handleNavLeave = () => {
      if (navPill) {
        gsap.to(navPill, { opacity: 0, duration: 0.25, ease: 'power2.out' });
      }
    };

    if (navContainer && navPill) {
      navItems.forEach((item) => {
        item.addEventListener('mouseenter', handleNavItemEnter);
      });
      navContainer.addEventListener('mouseleave', handleNavLeave);
    }

    // 3. Staggered Entrance Animation for YOGNA Letters & Navbar
    const heroWord = document.getElementById('yogna-hero-word');
    const charSlots = document.querySelectorAll<HTMLElement>('.yogna-char-slot');
    const charInners = document.querySelectorAll<HTMLElement>('.yogna-char-inner');
    const charAccents = document.querySelectorAll<HTMLElement>('.yogna-char-accent');
    const interactiveBlob = document.getElementById('interactive-blob');
    const interactiveBlobOuter = document.getElementById('interactive-blob-outer');
    const shockwaveCircle = document.getElementById('hover-shockwave');

    gsap.fromTo(
      charInners,
      { yPercent: 115, rotateX: -50 },
      { yPercent: 0, rotateX: 0, duration: 1.05, stagger: 0.06, ease: 'expo.out' }
    );
    gsap.fromTo(
      '#hero-nav',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }
    );

    // 4. Continuous Flow on 12 Thick Multi-Line Curvy Background Tracks
    const contourFlowTween = gsap.to('.contour-path, .contour-path-red:not(#interactive-blob)', {
      strokeDashoffset: (i) => (i % 2 === 0 ? -1380 : 1380),
      duration: 15,
      repeat: -1,
      ease: 'none',
    });

    let blobTween1: gsap.core.Tween | null = null;
    let blobTween2: gsap.core.Tween | null = null;

    if (interactiveBlob) {
      blobTween1 = gsap.to(interactiveBlob, {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 34,
        repeat: -1,
        ease: 'none',
      });
    }

    if (interactiveBlobOuter) {
      blobTween2 = gsap.to(interactiveBlobOuter, {
        rotation: -360,
        transformOrigin: '50% 50%',
        duration: 46,
        repeat: -1,
        ease: 'none',
      });
    }

    const energizeCurves = (boostLevel: number) => {
      document.body.classList.add('hero-energized');
      gsap.to(contourFlowTween, { timeScale: boostLevel, duration: 0.4, overwrite: 'auto' });
    };

    const calmCurves = () => {
      document.body.classList.remove('hero-energized');
      gsap.to(contourFlowTween, { timeScale: 1, duration: 0.7, overwrite: 'auto' });
    };

    // 5. Per-Letter Hover 3D Extrusion + Expanding Crimson Shockwave
    const slotEnterCleanups: (() => void)[] = [];
    charSlots.forEach((slot, idx) => {
      const inner = slot.querySelector<HTMLElement>('.yogna-char-inner');
      const onEnter = () => {
        energizeCurves(3.2);
        if (inner) {
          gsap.to(inner, {
            y: -22,
            scaleY: 1.12,
            scaleX: 1.04,
            rotateZ: (idx - 2) * -1.8,
            duration: 0.34,
            ease: 'back.out(2.4)',
            overwrite: 'auto',
          });
        }
        if (shockwaveCircle) {
          const r = slot.getBoundingClientRect();
          const svgX = ((r.left + r.width / 2) / window.innerWidth) * 1440;
          const svgY = ((r.top + r.height / 2) / window.innerHeight) * 900;
          shockwaveCircle.setAttribute('cx', String(svgX));
          shockwaveCircle.setAttribute('cy', String(svgY));
          gsap.fromTo(
            shockwaveCircle,
            { attr: { r: 25, 'stroke-width': 18 }, opacity: 0.55 },
            { attr: { r: 340, 'stroke-width': 1 }, opacity: 0, duration: 0.75, ease: 'expo.out', overwrite: 'auto' }
          );
        }
      };

      const onLeave = () => {
        calmCurves();
        if (inner) {
          gsap.to(inner, {
            y: 0,
            scaleY: 1,
            scaleX: 1,
            rotateZ: 0,
            duration: 0.65,
            ease: 'elastic.out(1, 0.42)',
            overwrite: 'auto',
          });
        }
      };

      slot.addEventListener('mouseenter', onEnter);
      slot.addEventListener('mouseleave', onLeave);
      slotEnterCleanups.push(() => {
        slot.removeEventListener('mouseenter', onEnter);
        slot.removeEventListener('mouseleave', onLeave);
      });
    });

    // 6. Velocity Spring Cursor + 3D Mouse Tilt & Multi-Layer Parallax
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorLabel = document.getElementById('cursor-label');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isTicking = true;
    let animFrameId: number;

    const onGlobalMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Multi-layer parallax
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (mouseX - cx) / cx;
      const ny = (mouseY - cy) / cy;

      gsap.to('#contour-svg', {
        x: nx * 18,
        y: ny * 18,
        rotation: nx * 1.2,
        duration: 0.8,
        ease: 'power2.out',
      });

      if (heroWord) {
        gsap.to(heroWord, {
          rotateY: nx * 12,
          rotateX: -ny * 10,
          transformPerspective: 1200,
          duration: 0.6,
          ease: 'power3.out',
        });
      }
    };

    window.addEventListener('mousemove', onGlobalMouseMove);

    // 7. Secondary Crimson Mask Revealed by Spotlight
    const onWordEnter = () => heroWord?.classList.add('spotlight-active');
    const onWordLeave = () => heroWord?.classList.remove('spotlight-active');
    const onWordMove = (e: MouseEvent) => {
      charAccents.forEach((accent) => {
        const r = accent.getBoundingClientRect();
        accent.style.clipPath = `circle(135px at ${e.clientX - r.left}px ${e.clientY - r.top}px)`;
      });
    };
    const onWordClick = () => {
      energizeCurves(4.5);
      gsap.fromTo(
        charInners,
        { scaleY: 1, y: 0 },
        {
          scaleY: 1.22,
          y: -28,
          duration: 0.22,
          stagger: { each: 0.045, from: 'center', yoyo: true, repeat: 1 },
          ease: 'power2.out',
          onComplete: calmCurves,
        }
      );
    };

    if (heroWord) {
      heroWord.addEventListener('mouseenter', onWordEnter);
      heroWord.addEventListener('mouseleave', onWordLeave);
      heroWord.addEventListener('mousemove', onWordMove);
      heroWord.addEventListener('click', onWordClick);
    }

    // 8. Magnetic Elements & Custom Cursor Hover Labels
    const magneticElements = document.querySelectorAll<HTMLElement>('.magnetic-el');
    const magneticCleanups: (() => void)[] = [];

    magneticElements.forEach((el) => {
      const onEnter = () => energizeCurves(2.2);
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: dx * 0.34, y: dy * 0.34, duration: 0.32, ease: 'power3.out' });
      };
      const onLeave = () => {
        calmCurves();
        gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      magneticCleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });

    const cursorElements = document.querySelectorAll<HTMLElement>('[data-cursor]');
    const cursorCleanups: (() => void)[] = [];

    cursorElements.forEach((el) => {
      const onEnter = () => {
        if (!cursorRing || !cursorLabel) return;
        cursorRing.classList.add('cursor-expanded');
        cursorLabel.textContent = el.getAttribute('data-cursor');
        cursorLabel.style.opacity = '1';
      };
      const onLeave = () => {
        if (!cursorRing || !cursorLabel) return;
        cursorRing.classList.remove('cursor-expanded');
        cursorLabel.style.opacity = '0';
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      cursorCleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    });

    const tickCursor = () => {
      if (!isTicking) return;

      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = Math.min(Math.hypot(dx, dy) * 0.0045, 0.34);

      if (cursorDot && cursorRing) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.5})`;
      }

      animFrameId = requestAnimationFrame(tickCursor);
    };

    animFrameId = requestAnimationFrame(tickCursor);

    // 9. Bottom-Left Metadata Text Scramble on Hover
    const scrambleEl = document.getElementById('scramble-text');
    const bottomLeftMeta = document.getElementById('bottom-left-meta');
    const originalMeta = 'CORPORATE HYGIENE SOLUTIONS · EST. 2015';
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/';
    let scrambleTimer: NodeJS.Timeout | null = null;

    const onMetaEnter = () => {
      let iter = 0;
      if (scrambleTimer) clearInterval(scrambleTimer);
      scrambleTimer = setInterval(() => {
        if (!scrambleEl) return;
        scrambleEl.textContent = originalMeta
          .split('')
          .map((ch, idx) => {
            if (ch === ' ' || ch === '·') return ch;
            if (idx < iter) return originalMeta[idx];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');

        iter += 1.5;
        if (iter >= originalMeta.length) {
          scrambleEl.textContent = originalMeta;
          if (scrambleTimer) clearInterval(scrambleTimer);
        }
      }, 22);
    };

    if (bottomLeftMeta && scrambleEl) {
      bottomLeftMeta.addEventListener('mouseenter', onMetaEnter);
    }

    // 10. Scroll-Driven Depth Zoom & Smooth Scroll
    const onScroll = () => {
      if (!heroWord) return;
      const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.65), 0), 1);
      gsap.to(heroWord, {
        scale: 1 + progress * 0.28,
        y: progress * -45,
        opacity: 1 - progress * 0.55,
        duration: 0.2,
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const scrollBtn = document.getElementById('scroll-explore-btn');
    const onScrollClick = () => {
      const heroStage = heroStageRef.current;
      const nextSection = heroStage?.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    };

    if (scrollBtn) {
      scrollBtn.addEventListener('click', onScrollClick);
    }

    // Cleanup on unmount
    return () => {
      isTicking = false;
      cancelAnimationFrame(animFrameId);
      document.body.classList.remove('custom-cursor-on');
      document.body.classList.remove('hero-energized');

      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('scroll', onScroll);

      if (scrollBtn) scrollBtn.removeEventListener('click', onScrollClick);
      if (scrambleTimer) clearInterval(scrambleTimer);

      if (navContainer) navContainer.removeEventListener('mouseleave', handleNavLeave);
      navItems.forEach((item) => item.removeEventListener('mouseenter', handleNavItemEnter));

      slotEnterCleanups.forEach((cleanup) => cleanup());
      magneticCleanups.forEach((cleanup) => cleanup());
      cursorCleanups.forEach((cleanup) => cleanup());

      if (heroWord) {
        heroWord.removeEventListener('mouseenter', onWordEnter);
        heroWord.removeEventListener('mouseleave', onWordLeave);
        heroWord.removeEventListener('mousemove', onWordMove);
        heroWord.removeEventListener('click', onWordClick);
      }

      contourFlowTween.kill();
      if (blobTween1) blobTween1.kill();
      if (blobTween2) blobTween2.kill();
    };
  }, []);

  return (
    <>
      {/* Custom Dual Cursor */}
      <div id="cursor-dot" aria-hidden="true" />
      <div id="cursor-ring" aria-hidden="true">
        <span
          id="cursor-label"
          className="font-mono-tech text-[8px] font-semibold tracking-widest uppercase text-[#D91E18] opacity-0 transition-opacity duration-200"
        />
      </div>

      {/* HERO SECTION (1st Page) */}
      <section
        ref={heroStageRef}
        id="hero-stage"
        className="relative h-screen w-full overflow-hidden flex flex-col justify-between px-5 sm:px-10 md:px-14 py-5 sm:py-7 grain-overlay select-none"
      >
        {/* LAYER 1: 12 Thick Multi-Line Curvy Background Tracks */}
        <svg
          id="contour-svg"
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g id="contour-group-outer">
            <path
              className="contour-path thick-heavy"
              d="M-220,110 C180,-60 440,380 840,160 C1180,-20 1340,290 1680,90"
            />
            <path
              className="contour-path thick-heavy"
              d="M-240,810 C190,600 540,980 940,720 C1260,510 1420,840 1700,690"
            />
          </g>
          <g id="contour-group-1">
            <path
              className="contour-path thick-primary"
              d="M-160,165 C230,20 470,390 835,205 C1190,25 1330,320 1620,165"
            />
            <path
              className="contour-path thick-medium"
              d="M-160,198 C235,55 475,422 840,238 C1195,58 1335,352 1620,198"
            />
            <path
              className="contour-path thick-accent-black"
              d="M-160,226 C240,85 480,450 845,266 C1200,88 1340,380 1620,226"
            />
            <path
              className="contour-path thick-primary"
              d="M-180,460 C210,250 550,690 920,430 C1210,225 1370,560 1640,400"
            />
            <path
              className="contour-path thick-medium"
              d="M-180,495 C215,285 555,725 925,465 C1215,260 1375,595 1640,435"
            />
            <path
              className="contour-path thick-accent-black"
              d="M-180,525 C220,315 560,755 930,495 C1220,290 1380,625 1640,465"
            />
            <path
              className="contour-path-red"
              d="M-180,425 C205,215 545,655 915,395 C1205,190 1365,525 1640,365"
            />
            <path
              className="contour-path thick-primary"
              d="M-150,720 C200,540 530,890 900,670 C1220,490 1380,790 1630,650"
            />
            <path
              className="contour-path thick-medium"
              d="M-150,752 C205,572 535,922 905,702 C1225,522 1385,822 1630,682"
            />
            <path
              className="contour-path thick-medium"
              d="M 120,-80 C 360,280 290,590 690,740 C 1090,890 1190,530 1560,790"
            />
            <path
              className="contour-path-red"
              d="M 155,-80 C 395,280 325,590 725,740 C 1125,890 1225,530 1595,790"
            />
            <path
              className="contour-path-red blob-loop"
              id="interactive-blob"
              d="M 480 230 C 650 130, 910 150, 990 320 C 1070 490, 940 700, 730 710 C 520 720, 380 570, 395 395 C 405 275, 435 255, 480 230 Z"
            />
            <path
              className="contour-path thick-accent-black"
              id="interactive-blob-outer"
              d="M 445 195 C 645 85, 945 110, 1035 305 C 1125 500, 975 740, 735 750 C 495 760, 335 590, 355 390 C 368 255, 395 225, 445 195 Z"
            />
          </g>
          <circle
            id="hover-shockwave"
            cx="720"
            cy="450"
            r="20"
            fill="none"
            stroke="#D91E18"
            strokeWidth="8"
            opacity="0"
          />
          <g id="telemetry-hud" className="opacity-60">
            <path d="M 52 135 L 70 135 M 61 126 L 61 144" stroke="#0A0A0A" strokeWidth="1.5" />
            <path d="M 1376 135 L 1394 135 M 1385 126 L 1385 144" stroke="#0A0A0A" strokeWidth="1.5" />
            <path d="M 52 790 L 70 790 M 61 781 L 61 799" stroke="#0A0A0A" strokeWidth="1.5" />
            <path d="M 1376 790 L 1394 790 M 1385 781 L 1385 799" stroke="#0A0A0A" strokeWidth="1.5" />
          </g>
        </svg>

        {/* LAYER 2: Floating Frosted Pill Navbar */}
        <header className="relative z-20 w-full max-w-[1260px] mx-auto pt-1">
          <nav
            id="hero-nav"
            className="hero-navbar rounded-full px-5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between"
          >
            <a
              href="#hero-stage"
              id="brand-logo"
              data-cursor="BRAND"
              className="magnetic-el inline-flex items-center font-display-condensed text-2xl sm:text-[28px] tracking-normal select-none focus:outline-none"
            >
              <span className="logo-yog text-[#0A0A0A]">YOG</span>
              <span className="logo-na text-[#D91E18]">NA</span>
            </a>

            <div className="flex items-center gap-4 sm:gap-8 md:gap-10">
              <div
                id="nav-links-container"
                className="relative hidden md:flex items-center gap-3 lg:gap-5 text-[12px] font-medium tracking-[0.16em] text-[#0A0A0A]"
              >
                <span id="nav-hover-pill" aria-hidden="true" />
                <Link
                  href="/products"
                  data-cursor="EXPLORE"
                  className="nav-item ln-roll-link uppercase focus:outline-none"
                >
                  PRODUCTS
                </Link>
                <a
                  href="#services"
                  data-cursor="EXPLORE"
                  className="nav-item ln-roll-link uppercase focus:outline-none"
                >
                  SERVICES
                </a>
                <a
                  href="#partners"
                  data-cursor="EXPLORE"
                  className="nav-item ln-roll-link uppercase focus:outline-none"
                >
                  PARTNERS
                </a>
                <a
                  href="#contact"
                  data-cursor="CONNECT"
                  className="nav-item ln-roll-link uppercase focus:outline-none"
                >
                  CONTACT
                </a>
              </div>

              <button
                type="button"
                id="cart-btn"
                data-cursor="CART"
                aria-label="Cart"
                onClick={openCart}
                className="magnetic-el relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-md hover:bg-[#D91E18] transition-colors duration-300 focus:outline-none"
              >
                <svg
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1.5" />
                  <circle cx="19" cy="21" r="1.5" />
                  <path d="M2.5 3h2.8l2.4 11.4a2 2 0 0 0 2 1.6h9.5a2 2 0 0 0 1.9-1.4L23 6H6.2" />
                </svg>
                {count > 0 && <span className="hero-cart-badge">{count}</span>}
              </button>
            </div>
          </nav>
        </header>

        {/* LAYER 3: Centerpiece Giant "YOGNA" Typography */}
        <main className="relative z-10 my-auto flex flex-col items-center justify-center select-none py-6">
          <div
            id="yogna-hero-word"
            data-cursor="KINETIC"
            className="hero-title-wrap relative flex items-center justify-center cursor-pointer"
            role="heading"
            aria-level={1}
            aria-label="YOGNA"
          >
            {CHARS.map((charObj, index) => (
              <div key={charObj.letter} className="yogna-char-slot" data-char-index={index}>
                <span className="char-telemetry-tag">{charObj.tag}</span>
                <span className="yogna-char-inner font-display-condensed text-[23vw] sm:text-[22vw] md:text-[20.5vw] lg:text-[245px] text-[#0A0A0A]">
                  {charObj.letter}
                </span>
                <span
                  className="yogna-char-accent font-display-condensed text-[23vw] sm:text-[22vw] md:text-[20.5vw] lg:text-[245px]"
                  aria-hidden="true"
                >
                  {charObj.letter}
                </span>
              </div>
            ))}
          </div>
        </main>

        {/* LAYER 4: Bottom Metadata Bar */}
        <footer className="relative z-20 w-full max-w-[1360px] mx-auto pb-1 sm:pb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            id="bottom-left-meta"
            data-cursor="DECODE"
            className="magnetic-el hover-underline-sweep text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#0A0A0A]/85 font-semibold flex items-center gap-2 cursor-pointer"
          >
            <span id="scramble-text">CORPORATE HYGIENE SOLUTIONS · EST. 2015</span>
          </div>

          <button
            type="button"
            id="scroll-explore-btn"
            data-cursor="SCROLL"
            className="magnetic-el hover-underline-sweep group flex items-center gap-3 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#0A0A0A]/85 hover:text-[#D91E18] font-semibold transition-colors focus:outline-none"
          >
            <span className="relative w-8 sm:w-12 h-[2px] bg-black/30 group-hover:w-16 transition-all duration-300 overflow-hidden inline-block">
              <span className="absolute inset-0 bg-[#D91E18] scroll-line-active" />
            </span>
            <span className="ln-roll-link roll-red-clone">SCROLL TO EXPLORE</span>
          </button>
        </footer>
      </section>
    </>
  );
}
