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
          'flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-bold';
        statusText.textContent = health.statusText;
        if (statLatency) statLatency.textContent = `${health.latencyMs} ms`;

        // Sync live models
        const apiKey = (document.getElementById('clientCustomKey') as HTMLInputElement)?.value || 'sk-omni-gateway-demo-key';
        const modelList = await client.fetchModels(apiKey);
        if (modelList && modelList.data && modelList.data.length > 0 && studioModelSelect) {
          const currentSelected = studioModelSelect.value;
          studioModelSelect.innerHTML = `
            <option value="omni-embedded-core">✨ Omni AI (Friendly Consumer Copilot • Instant Zero-Fail)</option>
          `;
          modelList.data.forEach((m) => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = `${m.id} (${m.owned_by || 'frontier'})`;
            studioModelSelect.appendChild(opt);
          });
          if (currentSelected && (currentSelected === 'omni-embedded-core' || modelList.data.some((m) => m.id === currentSelected))) {
            studioModelSelect.value = currentSelected;
          } else {
            studioModelSelect.value = 'omni-embedded-core';
          }
        }
      } else {
        statusPill.className =
          'flex items-center gap-2 px-3 py-1 bg-[#ffe17c] border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-bold';
        statusText.textContent = 'Omni AI Live (Zero-Fail)';
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
