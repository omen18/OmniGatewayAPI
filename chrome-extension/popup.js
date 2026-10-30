// OmniGateway Popup Script (Manifest V3)

document.addEventListener('DOMContentLoaded', async () => {
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const latencyText = document.getElementById('latencyText');
  const modelSelect = document.getElementById('modelSelect');
  const modelCount = document.getElementById('modelCount');
  const promptInput = document.getElementById('promptInput');
  const sendBtn = document.getElementById('sendBtn');
  const summarizePageBtn = document.getElementById('summarizePageBtn');
  const responseBox = document.getElementById('responseBox');
  const openSidepanelBtn = document.getElementById('openSidepanelBtn');
  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const toggleSettings = document.getElementById('toggleSettings');
  const settingsPanel = document.getElementById('settingsPanel');
  const gatewayUrlInput = document.getElementById('gatewayUrlInput');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');

  // Load saved settings
  const stored = await chrome.storage.local.get(['gatewayUrl', 'apiKey', 'selectedModel']);
  const gatewayUrl = stored.gatewayUrl || 'http://127.0.0.1:8317';
  const apiKey = stored.apiKey || 'sk-omni-gateway-demo-key';
  
  gatewayUrlInput.value = gatewayUrl;
  apiKeyInput.value = apiKey;
  if (stored.selectedModel) {
    modelSelect.value = stored.selectedModel;
  }

  // Toggle settings drawer
  toggleSettings.addEventListener('click', () => {
    const isHidden = settingsPanel.style.display === 'none' || settingsPanel.style.display === '';
    settingsPanel.style.display = isHidden ? 'block' : 'none';
  });

  // Save settings
  saveSettingsBtn.addEventListener('click', async () => {
    const newUrl = gatewayUrlInput.value.trim().replace(/\/+$/, '');
    const newKey = apiKeyInput.value.trim();
    await chrome.storage.local.set({ gatewayUrl: newUrl, apiKey: newKey });
    settingsPanel.style.display = 'none';
    checkHealthAndLoadModels();
  });

  // Open side panel
  openSidepanelBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.windowId) {
        await chrome.sidePanel.open({ windowId: tab.windowId });
        window.close(); // Close popup once side panel opens
      }
    } catch (err) {
      console.error('Failed to open side panel:', err);
      alert('Could not open side panel: ' + err.message);
    }
  });

  // Open Dashboard
  openDashboardBtn.addEventListener('click', () => {
    const targetUrl = `${gatewayUrlInput.value.trim().replace(/\/+$/, '')}/dashboard`;
    chrome.tabs.create({ url: targetUrl });
  });

  // Model selection change
  modelSelect.addEventListener('change', async () => {
    await chrome.storage.local.set({ selectedModel: modelSelect.value });
  });

  // Healthcheck & Load Models function
  async function checkHealthAndLoadModels() {
    const url = gatewayUrlInput.value.trim().replace(/\/+$/, '');
    const key = apiKeyInput.value.trim();
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const healthRes = await fetch(`${url}/healthz`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const latency = Math.round(performance.now() - startTime);
      latencyText.textContent = `${latency} ms`;

      if (healthRes.ok) {
        statusBadge.className = 'status-badge';
        statusText.textContent = 'Online';
      } else {
        throw new Error('HTTP ' + healthRes.status);
      }

      // Fetch models
      try {
        const modelsRes = await fetch(`${url}/v1/models`, {
          headers: {
            'Authorization': `Bearer ${key}`
          }
        });
        if (modelsRes.ok) {
          const json = await modelsRes.json();
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            modelCount.textContent = `${json.data.length + 1} Models`;
            const currentSelected = modelSelect.value;
            modelSelect.innerHTML = '<option value="omni-embedded-core">omni-embedded-core (✨ Guaranteed Zero-Fail Core)</option>';
            
            json.data.forEach(m => {
              const opt = document.createElement('option');
              opt.value = m.id;
              opt.textContent = `${m.id} (${m.owned_by || 'ai'})`;
              modelSelect.appendChild(opt);
            });

            if (json.data.some(m => m.id === currentSelected) || currentSelected === 'omni-embedded-core') {
              modelSelect.value = currentSelected;
            } else if (json.data.some(m => m.id === 'gemini-3.8-flash')) {
              modelSelect.value = 'gemini-3.8-flash';
            }
          }
        }
      } catch (errModels) {
        console.warn('Models fetch error:', errModels);
      }
    } catch (err) {
      statusBadge.className = 'status-badge offline';
      statusText.textContent = 'Offline';
      latencyText.textContent = 'timeout';
    }
  }

  // Quick Send
  sendBtn.addEventListener('click', async () => {
    const text = promptInput.value.trim();
    if (!text) return;
    await executePrompt(text);
  });

  // Summarize current page
  summarizePageBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        alert('No active tab found');
        return;
      }

      // Ask content script to extract content
      chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_PAGE_CONTENT' }, async (response) => {
        if (chrome.runtime.lastError || !response || !response.ok) {
          // If content script was not ready, fallback to executeScript
          try {
            const results = await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                const text = document.body.innerText.replace(/\s+/g, ' ').trim();
                return { title: document.title, text: text.substring(0, 10000) };
              }
            });
            if (results && results[0] && results[0].result) {
              const page = results[0].result;
              const prompt = `Please provide a 3-bullet executive summary of this page ("${page.title}"):\n\n${page.text}`;
              promptInput.value = `Summarize page: ${page.title}`;
              await executePrompt(prompt);
            }
          } catch (scriptErr) {
            alert('Could not inspect tab content: ' + scriptErr.message);
          }
          return;
        }

        const prompt = `Please provide a 3-bullet executive summary of this page ("${response.title}"):\n\n${response.text}`;
        promptInput.value = `Summarize page: ${response.title}`;
        await executePrompt(prompt);
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  async function executePrompt(prompt) {
    const url = gatewayUrlInput.value.trim().replace(/\/+$/, '');
    const key = apiKeyInput.value.trim();
    const model = modelSelect.value;

    responseBox.style.display = 'block';
    responseBox.textContent = '🧠 Routing through OmniGateway...';
    sendBtn.disabled = true;

    // Direct Zero-Fail local execution
    if (model === 'omni-embedded-core' && window.EmbeddedAIEngine) {
      const res = window.EmbeddedAIEngine.generateResponse(prompt, model);
      responseBox.textContent = res.content;
      sendBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(`${url}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'You are OmniGateway AI, a concise, ultra-intelligent copilot.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content || 'No response content';
      responseBox.textContent = content;
    } catch (err) {
      console.warn('Gateway error, engaging Zero-Fail Core:', err);
      if (window.EmbeddedAIEngine) {
        const fallback = window.EmbeddedAIEngine.generateResponse(prompt, model);
        responseBox.textContent = `[Zero-Fail Neural Core Fallback]:\n\n${fallback.content}`;
      } else {
        responseBox.textContent = `❌ Gateway Error: ${err.message}`;
      }
    } finally {
      sendBtn.disabled = false;
    }
  }

  // Initial health check
  checkHealthAndLoadModels();
});
