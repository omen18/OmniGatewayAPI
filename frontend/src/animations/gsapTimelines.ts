// GSAP Animation Suite Orchestrator in TypeScript

declare const gsap: any;
declare const ScrollTrigger: any;

export function initGSAPAnimations(): void {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP is not loaded globally.');
    return;
  }

  // Mouse Follower Glow
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    const setX = gsap.quickTo(cursorGlow, 'x', { duration: 0.5, ease: 'power3' });
    const setY = gsap.quickTo(cursorGlow, 'y', { duration: 0.5, ease: 'power3' });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    });
  }

  // Hero Entrance Sequence
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  heroTl
    .from('.hero-reveal', {
      y: 40,
      opacity: 0,
      stagger: 0.15
    })
    .from(
      '#statLatency, #statConnections, #statRateLimits, #statMemory',
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      },
      '-=0.4'
    );

  // ScrollTrigger reveals
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('section:not(#hero)').forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.out'
      });
    });
  }
}
