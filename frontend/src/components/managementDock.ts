// Management Console Dock & Embedded Drawer Subsystem

declare const lucide: any;

export function initManagementDock(): void {
  const dockBtn = document.getElementById('dockOpenDrawerBtn');
  const drawer = document.getElementById('managementDrawer');
  const backdrop = document.getElementById('managementDrawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const refreshBtn = document.getElementById('drawerRefreshBtn');
  const expandBtn = document.getElementById('drawerExpandBtn');
  const popoutBtn = document.getElementById('drawerPopoutBtn') as HTMLAnchorElement | null;
  const iframe = document.getElementById('managementIframe') as HTMLIFrameElement | null;
  const loadingOverlay = document.getElementById('iframeLoadingOverlay');
  const targetDisplay = document.getElementById('drawerTargetDisplay');
  const standardBtn = document.getElementById('switchStandardModeBtn');
  const safeModeBtn = document.getElementById('switchSafeModeBtn');
  const navManagementBtn = document.getElementById('navManagementBtn');
  const heroManagementDrawerBtn = document.getElementById('heroManagementDrawerBtn');
  const overviewManagementDrawerBtn = document.getElementById('overviewManagementDrawerBtn');

  if (!drawer || !backdrop) return;

  // The console is served by the Go gateway. When this page is served elsewhere (e.g. Vercel),
  // browsers block embedding localhost from a public page, so we open it in a new tab instead.
  const LOCAL_GATEWAY = 'http://127.0.0.1:8317';
  const isLocalHost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const isHosted = !isLocalHost;
  const gatewayBase = isHosted ? LOCAL_GATEWAY : '';

  const hostedPanel = document.getElementById('hostedManagementPanel');
  const hostedOpenBtn = document.getElementById('hostedManagementOpenBtn') as HTMLAnchorElement | null;
  const bridgeStatus = document.getElementById('drawerBridgeStatus');

  let currentMode: 'safe' | 'standard' = 'safe';
  let isExpanded = false;
  let isLoaded = false;

  function getTargetUrl(): string {
    const path = currentMode === 'safe' ? '/management.html?safe-mode=configure' : '/management.html';
    return `${gatewayBase}${path}`;
  }

  // Point every static management link at the reachable console and open it in a new tab when hosted.
  if (isHosted) {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="/management.html"]').forEach((a) => {
      a.href = `${LOCAL_GATEWAY}${a.getAttribute('href')}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (hostedPanel) {
      hostedPanel.classList.remove('hidden');
      hostedPanel.classList.add('flex');
    }
    if (iframe) iframe.style.display = 'none';
    if (bridgeStatus) bridgeStatus.innerHTML = 'Hosted preview &bull; console opens from <strong class="text-[#ffe17c]">127.0.0.1:8317</strong>';
  }

  function updateTargetDisplay(): void {
    const url = getTargetUrl();
    if (targetDisplay) {
      targetDisplay.textContent = currentMode === 'safe' ? '/management.html?safe-mode=configure' : '/management.html';
    }
    if (popoutBtn) {
      popoutBtn.href = url;
    }
    if (hostedOpenBtn) {
      hostedOpenBtn.href = `${LOCAL_GATEWAY}${currentMode === 'safe' ? '/management.html?safe-mode=configure' : '/management.html'}`;
    }
    if (standardBtn && safeModeBtn) {
      if (currentMode === 'standard') {
        standardBtn.className = 'px-2 py-0.5 bg-black text-white border border-black font-bold text-[11px]';
        safeModeBtn.className = 'px-2 py-0.5 bg-white text-black border border-black hover:bg-slate-100 font-bold text-[11px]';
      } else {
        standardBtn.className = 'px-2 py-0.5 bg-white text-black border border-black hover:bg-slate-100 font-bold text-[11px]';
        safeModeBtn.className = 'px-2 py-0.5 bg-black text-white border border-black font-bold text-[11px]';
      }
    }
  }

  function loadIframe(forceReload = false): void {
    if (!iframe || isHosted) return;
    const targetUrl = getTargetUrl();
    if (!isLoaded || forceReload || iframe.src !== targetUrl) {
      if (loadingOverlay) loadingOverlay.style.display = 'flex';
      iframe.src = targetUrl;
      isLoaded = true;
    }
  }

  if (iframe) {
    iframe.addEventListener('load', () => {
      if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
      }
    });
  }

  function openDrawer(): void {
    updateTargetDisplay();
    drawer!.classList.remove('translate-x-full');
    backdrop!.classList.remove('hidden');
    // Microtask for opacity transition
    setTimeout(() => {
      backdrop!.classList.remove('opacity-0');
      backdrop!.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
    loadIframe();
  }

  function closeDrawer(): void {
    drawer!.classList.add('translate-x-full');
    backdrop!.classList.remove('opacity-100');
    backdrop!.classList.add('opacity-0');
    setTimeout(() => {
      backdrop!.classList.add('hidden');
    }, 200);
    document.body.style.overflow = '';
  }

  function toggleExpand(): void {
    isExpanded = !isExpanded;
    if (isExpanded) {
      drawer!.classList.remove('sm:w-[560px]', 'md:w-[720px]', 'lg:w-[860px]');
      drawer!.classList.add('w-full');
      if (expandBtn) expandBtn.textContent = '🗗';
    } else {
      drawer!.classList.remove('w-full');
      drawer!.classList.add('sm:w-[560px]', 'md:w-[720px]', 'lg:w-[860px]');
      if (expandBtn) expandBtn.textContent = '🗖';
    }
  }

  // Event Listeners
  dockBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  navManagementBtn?.addEventListener('click', (e) => {
    // If user clicked nav button, open drawer (allow cmd/ctrl click to open tab directly)
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      openDrawer();
    }
  });

  heroManagementDrawerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  overviewManagementDrawerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  refreshBtn?.addEventListener('click', () => {
    loadIframe(true);
  });

  expandBtn?.addEventListener('click', toggleExpand);

  standardBtn?.addEventListener('click', () => {
    if (currentMode !== 'standard') {
      currentMode = 'standard';
      updateTargetDisplay();
      loadIframe(true);
    }
  });

  safeModeBtn?.addEventListener('click', () => {
    if (currentMode !== 'safe') {
      currentMode = 'safe';
      updateTargetDisplay();
      loadIframe(true);
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Escape closes drawer
    if (e.key === 'Escape') {
      if (!drawer!.classList.contains('translate-x-full')) {
        closeDrawer();
      }
    }
    // Ctrl+M or Cmd+M toggles drawer
    if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
      e.preventDefault();
      if (drawer!.classList.contains('translate-x-full')) {
        openDrawer();
      } else {
        closeDrawer();
      }
    }
  });

  // Initialize display
  updateTargetDisplay();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}
