// OmniGateway AI Control Center & Studio App Logic
// Powered by GSAP 3.12, Canvas Quantum Grid, and Lucide Icons

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. QUANTUM NEURAL CANVAS BACKGROUND
     ========================================================================== */
  const canvas = document.getElementById('quantum-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const mouse = { x: null, y: null, radius: 180 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(6, 182, 212, ';
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
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

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
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

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  /* ==========================================================================
     2. GSAP INTERACTIVE ANIMATIONS
     ========================================================================== */
  if (window.gsap) {
    // Mouse follower glow
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
      const setX = gsap.quickTo(cursorGlow, 'x', { duration: 0.5, ease: 'power3' });
      const setY = gsap.quickTo(cursorGlow, 'y', { duration: 0.5, ease: 'power3' });

      window.addEventListener('mousemove', (e) => {
        setX(e.clientX);
        setY(e.clientY);
      });
    }

    // Hero entrance timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    heroTl
      .from('.hero-reveal', {
        y: 40,
        opacity: 0,
        stagger: 0.15
      })
      .from('#statLatency, #statConnections, #statRateLimits, #statMemory', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.4');

    // ScrollTrigger reveals
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('section:not(#hero)').forEach(section => {
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

  /* ==========================================================================
     3. LIVE GATEWAY HEALTHCHECK & MODEL DISCOVERY
     ========================================================================== */
  const gatewayStatusPill = document.getElementById('gatewayStatusPill');
  const gatewayStatusText = document.getElementById('gatewayStatusText');
  const studioModelSelect = document.getElementById('studioModelSelect');
  const playgroundModelBadge = document.getElementById('playgroundModelBadge');
  const activeModelLabel = document.getElementById('activeModelLabel');

  let gatewayUrl = 'http://127.0.0.1:8317';
  let isGatewayOnline = false;

  async function checkGatewayStatus() {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${gatewayUrl}/healthz`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const latency = Math.round(performance.now() - startTime);

      if (res.ok) {
        isGatewayOnline = true;
        gatewayStatusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium';
        gatewayStatusText.textContent = `Online • ${latency}ms`;

        // Update latency stat in hero if exists
        const statLatency = document.getElementById('statLatency');
        if (statLatency) statLatency.textContent = `${latency} ms`;

        // Refresh models if not already loaded
        fetchLiveModels();
      } else {
        throw new Error('HTTP ' + res.status);
      }
    } catch (err) {
      isGatewayOnline = false;
      gatewayStatusPill.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium';
      gatewayStatusText.textContent = 'Demo Mode (8317 Standby)';
    }
  }

  async function fetchLiveModels() {
    try {
      const apiKey = document.getElementById('clientCustomKey')?.value || 'sk-omni-gateway-demo-key';
      const res = await fetch(`${gatewayUrl}/v1/models`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          const currentSelected = studioModelSelect.value;
          studioModelSelect.innerHTML = '';
          json.data.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = `${m.id} (${m.owned_by || 'frontier'})`;
            studioModelSelect.appendChild(opt);
          });

          if (json.data.some(m => m.id === currentSelected)) {
            studioModelSelect.value = currentSelected;
          } else if (json.data.some(m => m.id === 'gemini-3.8-flash')) {
            studioModelSelect.value = 'gemini-3.8-flash';
          }
          updateActiveModelUI();
        }
      }
    } catch (e) {
      console.warn('Could not list dynamic models:', e);
    }
  }

  function updateActiveModelUI() {
    const selected = studioModelSelect.value;
    if (activeModelLabel) activeModelLabel.textContent = selected;

    if (playgroundModelBadge) {
      if (selected.includes('gemini')) {
        playgroundModelBadge.textContent = 'Google';
        playgroundModelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono';
      } else if (selected.includes('claude')) {
        playgroundModelBadge.textContent = 'Anthropic';
        playgroundModelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono';
      } else if (selected.includes('gpt') || selected.includes('o3') || selected.includes('o1')) {
        playgroundModelBadge.textContent = 'OpenAI';
        playgroundModelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono';
      } else if (selected.includes('grok')) {
        playgroundModelBadge.textContent = 'xAI';
        playgroundModelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono';
      } else {
        playgroundModelBadge.textContent = 'Frontier';
        playgroundModelBadge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-mono';
      }
    }
  }

  studioModelSelect.addEventListener('change', updateActiveModelUI);

  // Ping gateway initially and periodically
  checkGatewayStatus();
  setInterval(checkGatewayStatus, 5000);

  const studioTestPingBtn = document.getElementById('studioTestPingBtn');
  if (studioTestPingBtn) {
    studioTestPingBtn.addEventListener('click', checkGatewayStatus);
  }

  /* ==========================================================================
     4. AI STUDIO PLAYGROUND LOGIC & STREAMING SSE
     ========================================================================== */
  const studioPromptInput = document.getElementById('studioPromptInput');
  const studioSendBtn = document.getElementById('studioSendBtn');
  const studioChatMessages = document.getElementById('studioChatMessages');
  const studioThinkingToggle = document.getElementById('studioThinkingToggle');
  const thinkingBudgetWrapper = document.getElementById('thinkingBudgetWrapper');
  const thinkingBudgetSlider = document.getElementById('thinkingBudgetSlider');
  const thinkingBudgetValue = document.getElementById('thinkingBudgetValue');
  const studioTempSlider = document.getElementById('studioTempSlider');
  const tempVal = document.getElementById('tempVal');
  const studioStreamToggle = document.getElementById('studioStreamToggle');
  const studioSystemPrompt = document.getElementById('studioSystemPrompt');
  const studioClearChatBtn = document.getElementById('studioClearChatBtn');
  const metricLatency = document.getElementById('metricLatency');
  const metricSpeed = document.getElementById('metricSpeed');

  let isStudioBusy = false;
  let studioMessagesHistory = [];

  // Temperature display
  studioTempSlider.addEventListener('input', () => {
    tempVal.textContent = studioTempSlider.value;
  });

  // Thinking budget toggle
  studioThinkingToggle.addEventListener('change', () => {
    if (studioThinkingToggle.checked) {
      thinkingBudgetWrapper.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      thinkingBudgetWrapper.classList.add('opacity-50', 'pointer-events-none');
    }
  });

  thinkingBudgetSlider.addEventListener('input', () => {
    thinkingBudgetValue.textContent = `${Number(thinkingBudgetSlider.value).toLocaleString()} tokens`;
  });

  // Preset Prompts
  document.querySelectorAll('.preset-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      studioPromptInput.value = btn.textContent.trim();
      handleStudioSend();
    });
  });

  // Clear Chat
  studioClearChatBtn.addEventListener('click', () => {
    studioChatMessages.innerHTML = `
      <div class="flex items-start gap-3 max-w-2xl">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
        </div>
        <div class="chat-bubble-assistant p-4 text-sm text-slate-200 leading-relaxed shadow-lg">
          <p class="font-medium text-white mb-1">OmniGateway AI Studio is ready.</p>
          <p class="text-xs text-slate-400">Chat history cleared. Choose a model and ask your query below.</p>
        </div>
      </div>
    `;
    studioMessagesHistory = [];
    if (window.lucide) window.lucide.createIcons();
  });

  // Send Handler
  studioSendBtn.addEventListener('click', handleStudioSend);
  studioPromptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStudioSend();
    }
  });

  async function handleStudioSend() {
    const text = studioPromptInput.value.trim();
    if (!text || isStudioBusy) return;

    studioPromptInput.value = '';
    isStudioBusy = true;
    studioSendBtn.disabled = true;

    // Append user message
    appendStudioMessage('user', text);
    studioMessagesHistory.push({ role: 'user', content: text });

    // Append Assistant placeholder
    const assistantBubble = appendStudioMessage('assistant', '<span class="text-cyan-400 animate-pulse font-mono text-xs">⚡ Routing request through OmniGateway...</span>');

    const modelName = studioModelSelect.value;
    const isStreaming = studioStreamToggle.checked;
    const isThinking = studioThinkingToggle.checked;
    const thinkingTokens = parseInt(thinkingBudgetSlider.value, 10);
    const systemPrompt = studioSystemPrompt.value.trim();

    let finalModel = modelName;
    if (isThinking && !finalModel.includes(':thinking')) {
      finalModel += ':thinking';
    }

    const payload = {
      model: finalModel,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...studioMessagesHistory.slice(-6)
      ],
      temperature: parseFloat(studioTempSlider.value),
      stream: isStreaming
    };

    if (isThinking) {
      payload.thinking = { budget_tokens: thinkingTokens };
    }

    const startTime = performance.now();
    let tokenCount = 0;
    let accumulatedContent = '';
    let accumulatedReasoning = '';

    // If gateway is offline, provide high-quality simulated response
    if (!isGatewayOnline) {
      simulateGatewayResponse(assistantBubble, text, finalModel);
      return;
    }

    const apiKey = document.getElementById('clientCustomKey')?.value || 'sk-omni-gateway-demo-key';

    try {
      const res = await fetch(`${gatewayUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      if (isStreaming) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

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
                  tokenCount++;
                }

                // Render in real-time
                renderAssistantBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
              }
            } catch (errJson) {}
          }
        }
      } else {
        const json = await res.json();
        accumulatedContent = json.choices?.[0]?.message?.content || 'No response';
        renderAssistantBubble(assistantBubble, accumulatedContent, '');
        tokenCount = json.usage?.completion_tokens || 50;
      }

      const elapsedSec = (performance.now() - startTime) / 1000;
      const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
      metricLatency.textContent = `${Math.round(elapsedSec * 1000)} ms`;
      metricSpeed.textContent = `${speed} t/s`;

      studioMessagesHistory.push({ role: 'assistant', content: accumulatedContent });
    } catch (err) {
      assistantBubble.innerHTML = `<span class="text-rose-400 font-medium">❌ Gateway Error: ${escapeHTML(err.message)}</span>`;
    } finally {
      isStudioBusy = false;
      studioSendBtn.disabled = false;
    }
  }

  function simulateGatewayResponse(bubble, userPrompt, modelName) {
    const elapsedSec = 0.42;
    metricLatency.textContent = '420 ms (simulated)';
    metricSpeed.textContent = '88 t/s';

    const simResponse = `**OmniGateway Response via ${modelName}**:\n\n` +
      `Received query: *"${userPrompt}"*\n\n` +
      `Here is an optimized architectural implementation in Go:\n\n` +
      `\`\`\`go\n` +
      `package main\n\n` +
      `import (\n` +
      `    "context"\n` +
      `    "fmt"\n` +
      `)\n\n` +
      `// OmniGateway high-concurrency worker\n` +
      `func ProcessRequest(ctx context.Context, payload []byte) error {\n` +
      `    fmt.Println("Routing through multiplexer :8317")\n` +
      `    return nil\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `*Note: OmniGateway daemon is running on port 8317. Live upstream traffic will route seamlessly once upstream credentials are authenticated.*`;

    let i = 0;
    const interval = setInterval(() => {
      i += 8;
      const partial = simResponse.slice(0, i);
      renderAssistantBubble(bubble, partial, 'Model reasoning verified: analyzing token constraints and protocol schemas...');
      if (i >= simResponse.length) {
        clearInterval(interval);
        isStudioBusy = false;
        studioSendBtn.disabled = false;
      }
    }, 20);
  }

  function renderAssistantBubble(bubble, content, reasoning) {
    let html = '';
    if (reasoning) {
      html += `<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Trace:</strong>${escapeHTML(reasoning)}</div>`;
    }
    html += formatMarkdown(content);
    bubble.innerHTML = html;
    studioChatMessages.scrollTop = studioChatMessages.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  function appendStudioMessage(role, content) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-3 max-w-2xl' + (role === 'user' ? ' ml-auto justify-end' : '');

    const bubble = document.createElement('div');
    bubble.className = (role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant') + ' p-4 text-sm leading-relaxed shadow-lg';
    bubble.innerHTML = role === 'user' ? escapeHTML(content) : content;

    wrapper.appendChild(bubble);
    studioChatMessages.appendChild(wrapper);
    studioChatMessages.scrollTop = studioChatMessages.scrollHeight;
    return bubble;
  }

  /* ==========================================================================
     5. ACCOUNT POOL QUOTA MULTIPLIER SIMULATOR
     ========================================================================== */
  const poolSlider = document.getElementById('poolSlider');
  const poolAccountCounter = document.getElementById('poolAccountCounter');
  const simRPM = document.getElementById('simRPM');
  const simTPM = document.getElementById('simTPM');
  const simUptime = document.getElementById('simUptime');

  if (poolSlider) {
    poolSlider.addEventListener('input', () => {
      const count = parseInt(poolSlider.value, 10);
      poolAccountCounter.textContent = `${count} Account${count > 1 ? 's' : ''}`;

      const rpm = count * 100;
      const tpm = (count * 1.0).toFixed(1);
      const uptime = count === 1 ? '92.5%' : count < 4 ? '99.5%' : '99.99%';

      simRPM.textContent = `${rpm} RPM`;
      simTPM.textContent = `${tpm} M`;
      simUptime.textContent = uptime;
    });
  }

  /* ==========================================================================
     6. 1-CLICK CLIENT INTEGRATION HUB
     ========================================================================== */
  const clientCustomUrl = document.getElementById('clientCustomUrl');
  const clientCustomKey = document.getElementById('clientCustomKey');
  const clientSnippetTitle = document.getElementById('clientSnippetTitle');
  const clientSnippetCode = document.getElementById('clientSnippetCode');
  const copySnippetBtn = document.getElementById('copySnippetBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  let activeTab = 'claude';

  const snippets = {
    claude: {
      title: '~/.zshrc or ~/.bashrc for Claude Code',
      gen: (url, key) => `export ANTHROPIC_BASE_URL="${url}"\nexport ANTHROPIC_API_KEY="${key}"\n\nclaude`
    },
    cursor: {
      title: 'Cursor Settings > Models > Override OpenAI Base URL',
      gen: (url, key) => `// In Cursor Settings > Models:\n// 1. Check "Override OpenAI Base URL"\n// 2. Base URL: ${url}/v1\n// 3. API Key:  ${key}\n// 4. Model:    gemini-3.8-flash (or gpt-5.6, claude-3-7-sonnet)`
    },
    python: {
      title: 'main.py with standard OpenAI SDK',
      gen: (url, key) => `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="${url}/v1",\n    api_key="${key}"\n)\n\nresponse = client.chat.completions.create(\n    model="gemini-3.8-flash",\n    messages=[{"role": "user", "content": "Explain raft in Go."}],\n    stream=True\n)\n\nfor chunk in response:\n    if chunk.choices and chunk.choices[0].delta.content:\n        print(chunk.choices[0].delta.content, end="", flush=True)`
    },
    node: {
      title: 'index.ts with official OpenAI npm package',
      gen: (url, key) => `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${url}/v1",\n  apiKey: "${key}",\n});\n\nconst stream = await client.chat.completions.create({\n  model: "gemini-3.8-flash",\n  messages: [{ role: "user", content: "Hello OmniGateway!" }],\n  stream: true,\n});\n\nfor await (const chunk of stream) {\n  process.stdout.write(chunk.choices[0]?.delta?.content || "");\n}`
    },
    curl: {
      title: 'Direct Terminal cURL command',
      gen: (url, key) => `curl -X POST ${url}/v1/chat/completions \\\n  -H "Authorization: Bearer ${key}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "gemini-3.8-flash",\n    "messages": [{"role": "user", "content": "Hello OmniGateway!"}]\n  }'`
    }
  };

  function updateSnippet() {
    const url = clientCustomUrl.value.trim().replace(/\/+$/, '') || 'http://localhost:8317';
    const key = clientCustomKey.value.trim() || 'sk-omni-gateway-demo-key';
    const tabConfig = snippets[activeTab];
    if (tabConfig) {
      clientSnippetTitle.textContent = tabConfig.title;
      clientSnippetCode.textContent = tabConfig.gen(url, key);
    }
  }

  document.querySelectorAll('.client-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.client-tab-btn').forEach(b => {
        b.className = 'client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all';
      });
      btn.className = 'client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-all';
      activeTab = btn.getAttribute('data-tab');
      updateSnippet();
    });
  });

  clientCustomUrl.addEventListener('input', updateSnippet);
  clientCustomKey.addEventListener('input', updateSnippet);

  copySnippetBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(clientSnippetCode.textContent);
    copyBtnText.textContent = 'Copied!';
    setTimeout(() => { copyBtnText.textContent = 'Copy'; }, 2000);
  });

  // Hero Quick Connect copy button
  const heroCopyConnectBtn = document.getElementById('heroCopyConnectBtn');
  if (heroCopyConnectBtn) {
    heroCopyConnectBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-omni-gateway-demo-key"');
      const span = heroCopyConnectBtn.querySelector('span');
      const orig = span.textContent;
      span.textContent = 'Copied to Clipboard!';
      setTimeout(() => { span.textContent = orig; }, 2000);
    });
  }

  /* ==========================================================================
     7. VISUAL CONFIG.YAML BUILDER
     ========================================================================== */
  const cfgHost = document.getElementById('cfgHost');
  const cfgPort = document.getElementById('cfgPort');
  const cfgApiKey = document.getElementById('cfgApiKey');
  const cfgGeminiKey = document.getElementById('cfgGeminiKey');
  const cfgOpenAIKey = document.getElementById('cfgOpenAIKey');
  const cfgClaudeKey = document.getElementById('cfgClaudeKey');
  const cfgRemoteMgmt = document.getElementById('cfgRemoteMgmt');
  const yamlPreviewCode = document.getElementById('yamlPreviewCode');
  const downloadYamlBtn = document.getElementById('downloadYamlBtn');
  const copyYamlBtn = document.getElementById('copyYamlBtn');

  function generateYAML() {
    const host = cfgHost.value.trim() || '127.0.0.1';
    const port = cfgPort.value.trim() || '8317';
    const apiKey = cfgApiKey.value.trim() || 'sk-omni-gateway-demo-key';
    const geminiKey = cfgGeminiKey.value.trim();
    const openaiKey = cfgOpenAIKey.value.trim();
    const claudeKey = cfgClaudeKey.value.trim();
    const remoteMgmt = cfgRemoteMgmt.checked;

    let yaml = `# OmniGateway API Generated Configuration\n`;
    yaml += `host: "${host}"\n`;
    yaml += `port: ${port}\n\n`;
    yaml += `api-keys:\n  - "${apiKey}"\n\n`;
    yaml += `auth-dir: "./auths"\n\n`;

    if (remoteMgmt) {
      yaml += `remote-management:\n  allow-remote: false\n  secret-key: "admin-secret-key"\n  disable-control-panel: false\n\n`;
    }

    if (geminiKey) {
      yaml += `gemini-api-key:\n  - api-key: "${geminiKey}"\n\n`;
    }

    if (openaiKey) {
      yaml += `codex-api-key:\n  - api-key: "${openaiKey}"\n\n`;
    }

    if (claudeKey) {
      yaml += `claude-api-key:\n  - api-key: "${claudeKey}"\n\n`;
    }

    yaml += `# Note: Multiple accounts can also be logged in via CLI:\n# ./omni-gateway -antigravity-login\n# ./omni-gateway -claude-login\n# ./omni-gateway -codex-login\n`;

    yamlPreviewCode.textContent = yaml;
  }

  [cfgHost, cfgPort, cfgApiKey, cfgGeminiKey, cfgOpenAIKey, cfgClaudeKey, cfgRemoteMgmt].forEach(el => {
    el.addEventListener('input', generateYAML);
    el.addEventListener('change', generateYAML);
  });

  generateYAML();

  copyYamlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(yamlPreviewCode.textContent);
    const span = copyYamlBtn.querySelector('span');
    span.textContent = 'Copied!';
    setTimeout(() => { span.textContent = 'Copy'; }, 2000);
  });

  downloadYamlBtn.addEventListener('click', () => {
    const blob = new Blob([yamlPreviewCode.textContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.yaml';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ==========================================================================
     8. UTILITIES
     ========================================================================== */
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let out = escapeHTML(text);

    // Code blocks ```code```
    out = out.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
      return `<pre class="my-3 p-4 rounded-xl bg-black/60 border border-white/10 overflow-x-auto text-xs font-mono text-cyan-300"><code>${code.trim()}</code></pre>`;
    });

    // Inline `code`
    out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>');

    // Bold **text**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

    // Bullet points
    out = out.replace(/^\s*-\s+(.*)$/gim, '<div class="flex items-center gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span><span>$1</span></div>');

    // Newlines
    out = out.replace(/\n/g, '<br>');

    return out;
  }
});
