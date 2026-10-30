// Quantum Neural Particle Mesh Canvas in TypeScript

interface MousePosition {
  x: number | null;
  y: number | null;
  radius: number;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.65;
    this.vy = (Math.random() - 0.5) * 0.65;
    this.radius = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(6, 182, 212, ';
    this.alpha = Math.random() * 0.4 + 0.2;
  }

  update(width: number, height: number, mouse: MousePosition): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.alpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `${this.color}0.8)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export function initQuantumCanvas(canvasId: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles: Particle[] = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const mouse: MousePosition = { x: null, y: null, radius: 180 };

  window.addEventListener('mousemove', (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(width, height));
  }

  function render(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Render connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update(width, height, mouse);
      p.draw(ctx);
    });

    requestAnimationFrame(render);
  }

  render();
}
