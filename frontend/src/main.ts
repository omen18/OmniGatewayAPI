// OmniGateway Frontend Application Entrypoint in TypeScript

import { initQuantumCanvas } from './canvas/quantumGrid';
import { initGSAPAnimations } from './animations/gsapTimelines';
import { initSmoothScroll } from './animations/smoothScroll';
import { GatewayClient } from './api/gatewayClient';
import { initStudioPlayground } from './components/studioPlayground';
import { initQuotaSimulator } from './components/quotaSimulator';
import { initClientHub } from './components/clientHub';
import { initConfigBuilder } from './components/configBuilder';

declare const lucide: any;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Initialize Quantum Particle Canvas
  initQuantumCanvas('quantum-canvas');

  // 3. Initialize GSAP Animation Timelines & ScrollTrigger
  initGSAPAnimations();

  // 3b. Initialize GSAP & Lenis Smooth Scroll
  initSmoothScroll();

  // 4. Initialize Gateway API Client
  const client = new GatewayClient('http://127.0.0.1:8317');

  const statusPill = document.getElementById('gatewayStatusPill');
  const statusText = document.getElementById('gatewayStatusText');
  const statLatency = document.getElementById('statLatency');
  const studioModelSelect = document.getElementById('studioModelSelect') as HTMLSelectElement | null;

  async function syncGatewayStatus(): Promise<void> {
    const health = await client.checkHealth();
    if (statusPill && statusText) {
      if (health.ok) {
        statusPill.className =
          'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium';
        statusText.textContent = health.statusText;
        if (statLatency) statLatency.textContent = `${health.latencyMs} ms`;

        // Sync live models
        const apiKey = (document.getElementById('clientCustomKey') as HTMLInputElement)?.value || 'sk-omni-gateway-demo-key';
        const modelList = await client.fetchModels(apiKey);
        if (modelList && modelList.data && modelList.data.length > 0 && studioModelSelect) {
          const currentSelected = studioModelSelect.value;
          studioModelSelect.innerHTML = '';
          modelList.data.forEach((m) => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = `${m.id} (${m.owned_by || 'frontier'})`;
            studioModelSelect.appendChild(opt);
          });
          if (modelList.data.some((m) => m.id === currentSelected)) {
            studioModelSelect.value = currentSelected;
          } else if (modelList.data.some((m) => m.id === 'gemini-3.8-flash')) {
            studioModelSelect.value = 'gemini-3.8-flash';
          }
        }
      } else {
        statusPill.className =
          'flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium';
        statusText.textContent = health.statusText;
      }
    }
  }

  syncGatewayStatus();
  setInterval(syncGatewayStatus, 5000);

  // 5. Initialize Subsystems
  initStudioPlayground(client);
  initQuotaSimulator();
  initClientHub();
  initConfigBuilder();
});
