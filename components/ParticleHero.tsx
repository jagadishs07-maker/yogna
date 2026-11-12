'use client';
import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  delay: number;
}

interface ParticleHeroProps {
  onAssembled?: () => void;
  className?: string;
  startDelay?: number; // Delay in seconds before assembly begins
}

export default function ParticleHero({
  onAssembled,
  className = '',
  startDelay = 1.4,
}: ParticleHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const startTimeRef = useRef<number | null>(null);
  const hasTriggeredAssemblyRef = useRef<boolean>(false);

  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    radius: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    radius: 120,
    active: false,
  });

  const scrollRef = useRef<number>(0);

  // Compute font size strictly matching existing design language
  const computeFontSize = useCallback((width: number): number => {
    if (width <= 480) {
      return Math.min(100, Math.max(62, width * 0.23));
    }
    if (width <= 768) {
      return Math.min(140, Math.max(72, width * 0.21));
    }
    return Math.min(340, Math.max(52, width * 0.20));
  }, []);

  // Sample points from rasterized text
  const initParticles = useCallback(
    (width: number, height: number) => {
      const fontSize = computeFontSize(width);

      // Create offscreen canvas for crisp text sampling and diffuse shadow
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Draw text with exact typography: Bebas Neue
      offCtx.fillStyle = '#000000';
      offCtx.font = `${fontSize}px "Bebas Neue", sans-serif`;
      try {
        offCtx.letterSpacing = '-0.02em';
      } catch {}
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const textX = width / 2;
      const textY = height / 2;
      offCtx.fillText('YOGNA', textX, textY);

      shadowCanvasRef.current = offscreen;

      // Sample pixels
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const newParticles: Particle[] = [];

      // Adaptive step: 2.5px on mobile, 3px on desktop for dense crisp particles
      const isMobile = width < 768;
      const step = isMobile ? 2.5 : 3.0;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          const alpha = data[idx + 3];
          if (alpha > 120) {
            // Sub-pixel organic positioning for natural cluster density
            const jx = (Math.random() - 0.5) * 0.7;
            const jy = (Math.random() - 0.5) * 0.7;
            const originX = x + jx;
            const originY = y + jy;

            // Initial scattered position in broad 3D elliptical cloud
            const angle = Math.random() * Math.PI * 2;
            const scatterDist = 80 + Math.random() * Math.max(width, height) * 0.55;
            const startX = originX + Math.cos(angle) * scatterDist;
            const startY = originY + Math.sin(angle) * scatterDist;

            // Initial swirling tangential velocity
            const tangent = angle + (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 2);
            const initSpeed = 1.2 + Math.random() * 2.5;

            newParticles.push({
              x: startX,
              y: startY,
              originX,
              originY,
              vx: Math.cos(tangent) * initSpeed,
              vy: Math.sin(tangent) * initSpeed,
              // Size ensures overlap at target so glyphs are solid
              size: isMobile ? 1.35 + Math.random() * 0.35 : 1.75 + Math.random() * 0.55,
              alpha: 0.85 + Math.random() * 0.15,
              phase: Math.random() * Math.PI * 2,
              speed: 0.8 + Math.random() * 0.5,
              delay: startDelay + Math.random() * 0.85, // staggered assembly trigger
            });
          }
        }
      }

      particlesRef.current = newParticles;
      startTimeRef.current = performance.now();
    },
    [computeFontSize, startDelay]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resize handling with DPR scaling
    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = Math.round(rect.width) || window.innerWidth;
      const height = Math.round(rect.height) || window.innerHeight;

      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles(width, height);
    };

    // Immediate initial sync resize
    handleResize();

    // Async re-sample once Bebas Neue is loaded
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (!destroyed) {
          handleResize();
        }
      });
    }

    // Mouse listeners for gentle particle displacement
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    // Touch support for mobile interaction
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.targetX = touch.clientX - rect.left;
        mouseRef.current.targetY = touch.clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // IntersectionObserver to pause loop when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Main 60 FPS Render Loop
    const render = (now: number) => {
      if (destroyed) return;

      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      const elapsed = (now - startTimeRef.current) / 1000;
      const assemblyDuration = 2.2; // 2.2s cinematic convergence
      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      // Smooth mouse interpolation
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;
      } else {
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
      }

      // Scroll progress for gentle dispersion
      const scrollProgress = Math.min(1, Math.max(0, scrollRef.current / (height * 0.75)));

      // Overall assembly progress
      const globalProgress = prefersReducedMotion
        ? 1
        : Math.min(1, Math.max(0, (elapsed - startDelay) / assemblyDuration));

      if (globalProgress >= 1 && !hasTriggeredAssemblyRef.current) {
        hasTriggeredAssemblyRef.current = true;
        onAssembled?.();
      }

      ctx.clearRect(0, 0, width, height);

      // ─── 1. Realistic Soft Bottom Shadow & Ambient Occlusion ─────
      // Appears smoothly as particles gather together into the letters
      const shadowCanvas = shadowCanvasRef.current;
      if (shadowCanvas && globalProgress > 0.05) {
        const shadowAlpha =
          Math.min(1, (globalProgress - 0.05) / 0.65) * (1 - scrollProgress * 0.9);

        if (shadowAlpha > 0.01) {
          const fontSize = computeFontSize(width);
          const shadowScale = Math.max(0.4, Math.min(1.2, fontSize / 280));

          ctx.save();
          // Layer A: Broad diffuse soft floor shadow
          ctx.filter = `blur(${Math.round(22 * shadowScale)}px)`;
          ctx.globalAlpha = 0.14 * shadowAlpha;
          ctx.drawImage(shadowCanvas, 0, Math.round(16 * shadowScale));

          // Layer B: Tight ambient occlusion contact shadow
          ctx.filter = `blur(${Math.max(2, Math.round(6 * shadowScale))}px)`;
          ctx.globalAlpha = 0.10 * shadowAlpha;
          ctx.drawImage(shadowCanvas, 0, Math.max(2, Math.round(6 * shadowScale)));
          ctx.restore();
        }
      }

      // ─── 2. Particle Physics & Drawing ──────────────────────────
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const mouseRadius = mouse.radius;

      ctx.fillStyle = '#000000';
      ctx.beginPath();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (prefersReducedMotion) {
          p.x = p.originX;
          p.y = p.originY;
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          continue;
        }

        // Particle-specific assembly progress (respects individual staggered delay)
        let ease = 0;
        if (elapsed > p.delay) {
          const pElapsed = elapsed - p.delay;
          const pProgress = Math.min(1, pElapsed / (assemblyDuration - 0.4));
          // Quartic ease-out for organic deceleration
          ease = 1 - Math.pow(1 - pProgress, 4);
        }

        // Subtle organic breathing & micro-flutter when assembled
        const breatheX = Math.sin(now * 0.0016 * p.speed + p.phase) * (0.55 * ease);
        const breatheY = Math.cos(now * 0.0013 * p.speed + p.phase * 1.2) * (0.65 * ease);

        // Scroll dispersion: particles lift and slightly scatter as user scrolls down
        const scrollOffsetY = scrollProgress * -40 * (1 + Math.sin(p.phase));
        const scrollScatterX =
          Math.sin(p.phase * 2.5 + scrollRef.current * 0.015) * scrollProgress * 20;

        const targetX = p.originX + breatheX + scrollScatterX;
        const targetY = p.originY + breatheY + scrollOffsetY;

        // Assembly pull + spring dynamics
        const dx = targetX - p.x;
        const dy = targetY - p.y;

        // Dynamic spring strength increases as convergence progresses
        const springK = 0.028 + ease * 0.052;
        const friction = 0.86 + ease * 0.04;

        p.vx += dx * springK;
        p.vy += dy * springK;

        // Mouse displacement: gentle repulsive force
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const distSq = mdx * mdx + mdy * mdy;

          if (distSq < mouseRadius * mouseRadius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouseRadius) * 11;
            const angle = Math.atan2(mdy, mdx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        // Fast batched circle rendering
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }

      ctx.fill();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
    };
  }, [initParticles, onAssembled, startDelay]);

  return (
    <div ref={containerRef} className={`hero-particle-wrap ${className}`}>
      <canvas ref={canvasRef} className="hero-particle-canvas" aria-hidden="true" />
      {/* Accessible heading for screen readers & SEO */}
      <h1 className="sr-only">YOGNA — Corporate Hygiene Solutions</h1>
    </div>
  );
}
