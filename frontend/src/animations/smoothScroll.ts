// GSAP & Lenis Smooth Scroll Integration in TypeScript

import Lenis from 'lenis';

declare const gsap: any;
declare const ScrollTrigger: any;

export function initSmoothScroll(): Lenis {
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.05,
    touchMultiplier: 2.0,
    infinite: false
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  });

  // Drive Lenis from GSAP Ticker for perfect frame synchronization
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // Handle anchor clicks with buttery smooth inertia
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e: Event) => {
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target as HTMLElement, {
            offset: -85,
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    });
  });

  // Scroll Progress Bar
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  lenis.on('scroll', (e: any) => {
    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? e.scroll / maxScroll : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }

    if (backToTopBtn) {
      if (e.scroll > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.5 });
    });
  }

  // Parallax scrubbing with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Ambient light parallax
    gsap.to('.ambient-purple', {
      y: 250,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    });

    gsap.to('.ambient-cyan', {
      y: -250,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    });
  }

  // Expose to window for debugging or manual programmatic scrolls
  (window as any).lenis = lenis;

  return lenis;
}
