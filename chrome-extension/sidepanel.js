// OmniGateway Side Panel Script (Manifest V3)

document.addEventListener('DOMContentLoaded', async () => {
  const statusPill = document.getElementById('statusPill');
  const statusText = document.getElementById('statusText');
  const modelSelect = document.getElementById('modelSelect');
  const thinkingBtn = document.getElementById('thinkingBtn');
  const chatContainer = document.getElementById('chatContainer');
  const promptInput = document.getElementById('promptInput');
  const sendBtn = document.getElementById('sendBtn');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const gatewayUrlInput = document.getElementById('gatewayUrlInput');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');

  // Quick Action Buttons
  const actionSummarize = document.getElementById('actionSummarize');
  const actionExplain = document.getElementById('actionExplain');
  const actionKeyPoints = document.getElementById('actionKeyPoints');
  const actionCodeReview = document.getElementById('actionCodeReview');

  let thinkingEnabled = false;
  let isGenerating = false;
  let chatHistory = [];

  // Load Settings
  const stored = await chrome.storage.local.get(['gatewayUrl', 'apiKey', 'selectedModel', 'thinkingEnabled']);
  const gatewayUrl = stored.gatewayUrl || 'http://127.0.0.1:8317';
  const apiKey = stored.apiKey || 'sk-omni-gateway-demo-key';
  
  gatewayUrlInput.value = gatewayUrl;
  apiKeyInput.value = apiKey;
  if (stored.selectedModel) {
    modelSelect.value = stored.selectedModel;
  }
  if (stored.thinkingEnabled) {
    thinkingEnabled = true;
    thinkingBtn.classList.add('active');
  }

  // Toggle Thinking Mode
  thinkingBtn.addEventListener('click', async () => {
    thinkingEnabled = !thinkingEnabled;
    thinkingBtn.classList.toggle('active', thinkingEnabled);
    await chrome.storage.local.set({ thinkingEnabled });
  });

  // Settings Modal Toggle
  openSettingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
  closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));

  saveSettingsBtn.addEventListener('click', async () => {
    const newUrl = gatewayUrlInput.value.trim().replace(/\/+$/, '');
    const newKey = apiKeyInput.value.trim();
    await chrome.storage.local.set({ gatewayUrl: newUrl, apiKey: newKey });
    settingsModal.classList.remove('active');
    checkHealthAndLoadModels();
  });

  modelSelect.addEventListener('change', async () => {
    await chrome.storage.local.set({ selectedModel: modelSelect.value });
  });

  // Check pending prompts from Context Menu
  async function checkPendingPrompt() {
    const { pendingPrompt } = await chrome.storage.local.get(['pendingPrompt']);
    if (pendingPrompt && pendingPrompt.text && Date.now() - pendingPrompt.timestamp < 30000) {
      await chrome.storage.local.remove(['pendingPrompt']);
      promptInput.value = '';
      sendMessage(pendingPrompt.text);
    }
  }

  // Auto-resize textarea
  promptInput.addEventListener('input', () => {
    promptInput.style.height = 'auto';
    promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px';
  });

  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  function handleSend() {
    const text = promptInput.value.trim();
    if (!text || isGenerating) return;
    promptInput.value = '';
    promptInput.style.height = '44px';
    sendMessage(text);
  }

  // Healthcheck and load models
  async function checkHealthAndLoadModels() {
    const url = gatewayUrlInput.value.trim().replace(/\/+$/, '');
    const key = apiKeyInput.value.trim();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${url}/healthz`, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        statusPill.className = 'status-pill';
        statusText.textContent = 'Online';
      } else {
        throw new Error('HTTP ' + res.status);
      }

      // Fetch dynamic models
      try {
        const mRes = await fetch(`${url}/v1/models`, {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        if (mRes.ok) {
          const json = await mRes.json();
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            const currentSelected = modelSelect.value;
            modelSelect.innerHTML = '';
            json.data.forEach(m => {
              const opt = document.createElement('option');
              opt.value = m.id;
              opt.textContent = `${m.id} (${m.owned_by || 'ai'})`;
              modelSelect.appendChild(opt);
            });
            if (json.data.some(m => m.id === currentSelected)) {
              modelSelect.value = currentSelected;
            } else if (json.data.some(m => m.id === 'gemini-3.8-flash')) {
              modelSelect.value = 'gemini-3.8-flash';
            }
          }
        }
      } catch (errModels) {
        console.warn('Could not refresh models:', errModels);
      }
    } catch (err) {
      statusPill.className = 'status-pill offline';
      statusText.textContent = 'Offline';
    }
  }

  // Quick Action Helpers
  async function getActiveTabContent() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      throw new Error('No active browser tab found');
    }

    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_PAGE_CONTENT' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.ok) {
          // Fallback via scripting executeScript
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const text = document.body.innerText.replace(/\s+/g, ' ').trim();
              return { title: document.title, text: text.substring(0, 10000), url: window.location.href };
            }
          }).then(results => {
            if (results && results[0] && results[0].result) {
              resolve(results[0].result);
            } else {
              resolve({ title: tab.title || 'Current Page', text: '', url: tab.url || '' });
            }
          }).catch(() => {
            resolve({ title: tab.title || 'Current Page', text: '', url: tab.url || '' });
          });
          return;
        }
        resolve(response);
      });
    });
  }

  actionSummarize.addEventListener('click', async () => {
    try {
      const page = await getActiveTabContent();
      const prompt = `Please provide a clear, high-level summary of the following webpage:\n\nTitle: ${page.title}\nURL: ${page.url}\n\nContent:\n${page.text}`;
      sendMessage(prompt, `Summarize: ${page.title}`);
    } catch (err) {
      appendMessage('assistant', `⚠️ Could not read page: ${err.message}`);
    }
  });

  actionExplain.addEventListener('click', async () => {
    try {
      const page = await getActiveTabContent();
      const textToExplain = page.type === 'selection' ? page.text : page.text.substring(0, 4000);
      const prompt = `Please explain this in clear, intuitive terms:\n\n${textToExplain}`;
      sendMessage(prompt, `Explain selection from "${page.title}"`);
    } catch (err) {
      appendMessage('assistant', `⚠️ Could not read selection: ${err.message}`);
    }
  });

  actionKeyPoints.addEventListener('click', async () => {
    try {
      const page = await getActiveTabContent();
      const prompt = `Extract the top 5 most important key takeaways and actionable insights from this content:\n\n${page.text}`;
      sendMessage(prompt, `Extract Key Takeaways from "${page.title}"`);
    } catch (err) {
      appendMessage('assistant', `⚠️ Error: ${err.message}`);
    }
  });

  actionCodeReview.addEventListener('click', async () => {
    try {
      const page = await getActiveTabContent();
      const prompt = `Review the code provided below. Analyze potential bugs, performance bottlenecks, and security considerations, and suggest optimized code:\n\n${page.text}`;
      sendMessage(prompt, `Code Review for "${page.title}"`);
    } catch (err) {
      appendMessage('assistant', `⚠️ Error: ${err.message}`);
    }
  });

  // Message UI Appender
  function appendMessage(role, content, displayText = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    if (displayText && role === 'user') {
      msgDiv.textContent = displayText;
    } else {
      msgDiv.innerHTML = renderMarkdown(content);
    }

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return msgDiv;
  }

  // Core Send Message with Streaming support
  async function sendMessage(promptText, displayPrompt = null) {
    if (isGenerating) return;
    isGenerating = true;
    sendBtn.disabled = true;

    // Append user message
    appendMessage('user', promptText, displayPrompt || promptText);
    chatHistory.push({ role: 'user', content: promptText });

    // Create assistant bubble placeholder
    const assistantMsgDiv = document.createElement('div');
    assistantMsgDiv.className = 'message assistant';
    assistantMsgDiv.innerHTML = '<span style="color: var(--accent-cyan); animation: pulse 1s infinite;">🧠 Routing through OmniGateway...</span>';
    chatContainer.appendChild(assistantMsgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const url = gatewayUrlInput.value.trim().replace(/\/+$/, '');
    const key = apiKeyInput.value.trim();
    let selectedModelName = modelSelect.value;
    if (thinkingEnabled && !selectedModelName.includes(':thinking')) {
      selectedModelName += ':thinking';
    }

    const startTime = performance.now();
    let accumulatedContent = '';
    let accumulatedReasoning = '';

    try {
      const requestPayload = {
        model: selectedModelName,
        messages: [
          { role: 'system', content: 'You are OmniGateway Copilot, an elite AI assistant powered by unified frontier models. Provide direct, helpful, and insightful answers with code blocks where appropriate.' },
          ...chatHistory.slice(-6)
        ],
        stream: true
      };

      const res = await fetch(`${url}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(requestPayload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep partial line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          if (trimmed === 'data: [DONE]') break;

          try {
            const data = JSON.parse(trimmed.slice(6));
            const delta = data.choices?.[0]?.delta;
            if (delta) {
              if (delta.reasoning_content) {
                accumulatedReasoning += delta.reasoning_content;
              }
              if (delta.content) {
                accumulatedContent += delta.content;
              }

              // Update assistant bubble in real time
              let html = '';
              if (accumulatedReasoning) {
                html += `<div class="reasoning-block"><strong>Thinking Process:</strong>\n${escapeHTML(accumulatedReasoning)}</div>`;
              }
              html += renderMarkdown(accumulatedContent || '...');
              assistantMsgDiv.innerHTML = html;
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      const metaDiv = document.createElement('div');
      metaDiv.className = 'message-meta';
      metaDiv.textContent = `${selectedModelName} • ${elapsed}s`;
      assistantMsgDiv.appendChild(metaDiv);

      chatHistory.push({ role: 'assistant', content: accumulatedContent });
    } catch (err) {
      assistantMsgDiv.innerHTML = `<span style="color: var(--accent-rose);">❌ Gateway Error: ${escapeHTML(err.message)}</span>`;
    } finally {
      isGenerating = false;
      sendBtn.disabled = false;
    }
  }

  // Safe markdown parser
  function renderMarkdown(text) {
    if (!text) return '';
    let out = escapeHTML(text);

    // Code blocks ```code```
    out = out.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline `code`
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Bullet points
    out = out.replace(/^\s*-\s+(.*)$/gim, '• $1<br>');

    // Newlines
    out = out.replace(/\n/g, '<br>');

    return out;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial runs
  await checkHealthAndLoadModels();
  await checkPendingPrompt();
});
