// OmniGateway Extension Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(async () => {
  // Initialize default configuration in storage if empty
  const config = await chrome.storage.local.get(['gatewayUrl', 'apiKey', 'selectedModel', 'thinkingEnabled']);
  const defaults = {
    gatewayUrl: config.gatewayUrl || 'http://127.0.0.1:8317',
    apiKey: config.apiKey || 'sk-omni-gateway-demo-key',
    selectedModel: config.selectedModel || 'gemini-3.8-flash',
    thinkingEnabled: config.thinkingEnabled !== undefined ? config.thinkingEnabled : false
  };
  await chrome.storage.local.set(defaults);

  // Set side panel behavior to avoid unexpected auto-opens
  try {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
    }
  } catch (err) {
    console.warn('sidePanel.setPanelBehavior not supported or failed:', err);
  }

  // Create context menus
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'omni-ask-selection',
      title: 'OmniGateway: Ask AI about "%s"',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'omni-summarize-selection',
      title: 'OmniGateway: Summarize selection',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'omni-explain-selection',
      title: 'OmniGateway: Explain code or concept',
      contexts: ['selection']
    });
  });
});

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.windowId) return;

  const selectionText = (info.selectionText || '').trim();
  let promptText = selectionText;

  if (info.menuItemId === 'omni-summarize-selection') {
    promptText = `Please provide a concise, structured executive summary of the following text:\n\n${selectionText}`;
  } else if (info.menuItemId === 'omni-explain-selection') {
    promptText = `Please explain the following code or concept in detail, highlighting key logic and edge cases:\n\n${selectionText}`;
  }

  // Store in storage so the side panel picks it up
  await chrome.storage.local.set({
    pendingPrompt: {
      text: promptText,
      timestamp: Date.now(),
      sourceUrl: tab.url || ''
    }
  });

  // Open the side panel for this window
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } catch (err) {
    console.error('Failed to open side panel from context menu:', err);
  }
});

// Relay messages between popup/sidepanel/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_GATEWAY_HEALTH') {
    (async () => {
      try {
        const { gatewayUrl } = await chrome.storage.local.get(['gatewayUrl']);
        const url = (gatewayUrl || 'http://127.0.0.1:8317').replace(/\/+$/, '');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(`${url}/healthz`, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          sendResponse({ ok: true, status: response.status });
        } else {
          sendResponse({ ok: false, status: response.status });
        }
      } catch (err) {
        sendResponse({ ok: false, error: err.message });
      }
    })();
    return true; // Keep sendResponse open for async response
  }

  if (request.type === 'OPEN_SIDE_PANEL') {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.windowId) {
          await chrome.sidePanel.open({ windowId: tab.windowId });
          sendResponse({ ok: true });
        } else {
          sendResponse({ ok: false, error: 'No active window found' });
        }
      } catch (err) {
        sendResponse({ ok: false, error: err.message });
      }
    })();
    return true;
  }
});
