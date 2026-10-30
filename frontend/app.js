"use strict";
(() => {
  // src/canvas/quantumGrid.ts
  var Particle = class {
    x;
    y;
    vx;
    vy;
    radius;
    color;
    alpha;
    constructor(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? "rgba(168, 85, 247, " : "rgba(6, 182, 212, ";
      this.alpha = Math.random() * 0.4 + 0.2;
    }
    update(width, height, mouse) {
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
          this.x -= dx / dist * force * 1.5;
          this.y -= dy / dist * force * 1.5;
        }
      }
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `${this.color}0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };
  function initQuantumCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
    const particles = [];
    const particleCount = Math.min(Math.floor(width * height / 18e3), 75);
    const mouse = { x: null, y: null, radius: 180 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(width, height));
    }
    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
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

  // src/animations/gsapTimelines.ts
  function initGSAPAnimations() {
    if (typeof gsap === "undefined") {
      console.warn("GSAP is not loaded globally.");
      return;
    }
    const cursorGlow = document.getElementById("cursorGlow");
    if (cursorGlow) {
      const setX = gsap.quickTo(cursorGlow, "x", { duration: 0.5, ease: "power3" });
      const setY = gsap.quickTo(cursorGlow, "y", { duration: 0.5, ease: "power3" });
      window.addEventListener("mousemove", (e) => {
        setX(e.clientX);
        setY(e.clientY);
      });
    }
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
    heroTl.from(".hero-reveal", {
      y: 40,
      opacity: 0,
      stagger: 0.15
    }).from(
      "#statLatency, #statConnections, #statRateLimits, #statMemory",
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray("section:not(#hero)").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 35,
          opacity: 0,
          duration: 0.85,
          ease: "power2.out"
        });
      });
    }
  }

  // src/api/gatewayClient.ts
  var GatewayClient = class {
    baseUrl;
    constructor(baseUrl = "http://127.0.0.1:8317") {
      this.baseUrl = baseUrl.replace(/\/+$/, "");
    }
    setBaseUrl(url) {
      this.baseUrl = url.replace(/\/+$/, "");
    }
    getBaseUrl() {
      return this.baseUrl;
    }
    async checkHealth() {
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${this.baseUrl}/healthz`, {
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timer);
        const latencyMs = Math.round(performance.now() - start);
        if (res.ok) {
          return { ok: true, latencyMs, statusText: `Online \u2022 ${latencyMs}ms` };
        }
        return { ok: false, latencyMs, statusText: `HTTP ${res.status}` };
      } catch {
        return { ok: false, latencyMs: 0, statusText: "Demo Mode (8317 Standby)" };
      }
    }
    async fetchModels(apiKey) {
      try {
        const res = await fetch(`${this.baseUrl}/v1/models`, {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        });
        if (res.ok) {
          return await res.json();
        }
        return null;
      } catch {
        return null;
      }
    }
    async streamChat(payload, apiKey, callbacks) {
      try {
        const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error?.message || `HTTP ${res.status}`);
        }
        if (payload.stream && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          let tokenCount = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              if (trimmed === "data: [DONE]") break;
              try {
                const chunk = JSON.parse(trimmed.slice(6));
                const delta = chunk.choices?.[0]?.delta;
                if (delta) {
                  if (delta.reasoning_content) {
                    callbacks.onReasoning(delta.reasoning_content);
                  }
                  if (delta.content) {
                    callbacks.onChunk(delta.content);
                    tokenCount++;
                  }
                }
              } catch {
              }
            }
          }
          callbacks.onDone(tokenCount);
        } else {
          const json = await res.json();
          const content = json.choices?.[0]?.message?.content || "No response";
          callbacks.onChunk(content);
          callbacks.onDone(json.usage?.completion_tokens || 50);
        }
      } catch (err) {
        callbacks.onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  };

  // src/components/studioPlayground.ts
  function initStudioPlayground(client) {
    const modelSelect = document.getElementById("studioModelSelect");
    const thinkingToggle = document.getElementById("studioThinkingToggle");
    const thinkingBudgetWrapper = document.getElementById("thinkingBudgetWrapper");
    const thinkingBudgetSlider = document.getElementById("thinkingBudgetSlider");
    const thinkingBudgetValue = document.getElementById("thinkingBudgetValue");
    const tempSlider = document.getElementById("studioTempSlider");
    const tempVal = document.getElementById("tempVal");
    const streamToggle = document.getElementById("studioStreamToggle");
    const systemPrompt = document.getElementById("studioSystemPrompt");
    const promptInput = document.getElementById("studioPromptInput");
    const sendBtn = document.getElementById("studioSendBtn");
    const chatMessages = document.getElementById("studioChatMessages");
    const clearChatBtn = document.getElementById("studioClearChatBtn");
    const metricLatency = document.getElementById("metricLatency");
    const metricSpeed = document.getElementById("metricSpeed");
    const playgroundModelBadge = document.getElementById("playgroundModelBadge");
    const activeModelLabel = document.getElementById("activeModelLabel");
    if (!modelSelect || !promptInput || !sendBtn || !chatMessages) return;
    let isBusy = false;
    const history = [];
    function updateModelBadge() {
      if (!modelSelect) return;
      const selected = modelSelect.value;
      if (activeModelLabel) activeModelLabel.textContent = selected;
      if (playgroundModelBadge) {
        if (selected.includes("gemini")) {
          playgroundModelBadge.textContent = "Google";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono";
        } else if (selected.includes("claude")) {
          playgroundModelBadge.textContent = "Anthropic";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono";
        } else if (selected.includes("gpt") || selected.includes("o3") || selected.includes("o1")) {
          playgroundModelBadge.textContent = "OpenAI";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono";
        } else if (selected.includes("grok")) {
          playgroundModelBadge.textContent = "xAI";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono";
        } else {
          playgroundModelBadge.textContent = "Frontier";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-mono";
        }
      }
    }
    modelSelect.addEventListener("change", updateModelBadge);
    updateModelBadge();
    if (thinkingToggle && thinkingBudgetWrapper) {
      thinkingToggle.addEventListener("change", () => {
        if (thinkingToggle.checked) {
          thinkingBudgetWrapper.classList.remove("opacity-50", "pointer-events-none");
        } else {
          thinkingBudgetWrapper.classList.add("opacity-50", "pointer-events-none");
        }
      });
    }
    if (thinkingBudgetSlider && thinkingBudgetValue) {
      thinkingBudgetSlider.addEventListener("input", () => {
        thinkingBudgetValue.textContent = `${Number(thinkingBudgetSlider.value).toLocaleString()} tokens`;
      });
    }
    if (tempSlider && tempVal) {
      tempSlider.addEventListener("input", () => {
        tempVal.textContent = tempSlider.value;
      });
    }
    document.querySelectorAll(".preset-prompt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        promptInput.value = btn.textContent ? btn.textContent.trim() : "";
        executeSend();
      });
    });
    if (clearChatBtn) {
      clearChatBtn.addEventListener("click", () => {
        chatMessages.innerHTML = `
        <div class="flex items-start gap-3 max-w-2xl">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
          </div>
          <div class="chat-bubble-assistant p-4 text-sm text-slate-200 leading-relaxed shadow-lg">
            <p class="font-medium text-white mb-1">OmniGateway AI Studio is ready.</p>
            <p class="text-xs text-slate-400">Chat history cleared. Choose a model and enter your prompt below.</p>
          </div>
        </div>
      `;
        history.length = 0;
        if (typeof lucide !== "undefined") lucide.createIcons();
      });
    }
    sendBtn.addEventListener("click", executeSend);
    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        executeSend();
      }
    });
    function appendMessage(role, content) {
      const wrapper = document.createElement("div");
      wrapper.className = "flex items-start gap-3 max-w-2xl" + (role === "user" ? " ml-auto justify-end" : "");
      const bubble = document.createElement("div");
      bubble.className = (role === "user" ? "chat-bubble-user" : "chat-bubble-assistant") + " p-4 text-sm leading-relaxed shadow-lg";
      bubble.innerHTML = role === "user" ? escapeHTML(content) : content;
      wrapper.appendChild(bubble);
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return bubble;
    }
    async function executeSend() {
      const text = promptInput.value.trim();
      if (!text || isBusy) return;
      promptInput.value = "";
      isBusy = true;
      sendBtn.disabled = true;
      appendMessage("user", text);
      history.push({ role: "user", content: text });
      const assistantBubble = appendMessage(
        "assistant",
        '<span class="text-cyan-400 animate-pulse font-mono text-xs">\u26A1 Routing request through OmniGateway...</span>'
      );
      const modelName = modelSelect.value;
      const isStreaming = streamToggle ? streamToggle.checked : true;
      const isThinking = thinkingToggle ? thinkingToggle.checked : false;
      const thinkingTokens = thinkingBudgetSlider ? parseInt(thinkingBudgetSlider.value, 10) : 4096;
      const sysPrompt = systemPrompt ? systemPrompt.value.trim() : "";
      let finalModel = modelName;
      if (isThinking && !finalModel.includes(":thinking")) {
        finalModel += ":thinking";
      }
      const payload = {
        model: finalModel,
        messages: [
          ...sysPrompt ? [{ role: "system", content: sysPrompt }] : [],
          ...history.slice(-6)
        ],
        temperature: tempSlider ? parseFloat(tempSlider.value) : 0.7,
        stream: isStreaming
      };
      if (isThinking) {
        payload.thinking = { budget_tokens: thinkingTokens };
      }
      const apiKey = document.getElementById("clientCustomKey")?.value || "sk-omni-gateway-demo-key";
      const start = performance.now();
      let accumulatedContent = "";
      let accumulatedReasoning = "";
      await client.streamChat(payload, apiKey, {
        onChunk: (chunk) => {
          accumulatedContent += chunk;
          renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
        },
        onReasoning: (reasoning) => {
          accumulatedReasoning += reasoning;
          renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
        },
        onDone: (tokenCount) => {
          const elapsedSec = (performance.now() - start) / 1e3;
          const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
          if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1e3)} ms`;
          if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
          history.push({ role: "assistant", content: accumulatedContent });
          isBusy = false;
          sendBtn.disabled = false;
        },
        onError: (_err) => {
          simulateResponse(assistantBubble, text, finalModel);
        }
      });
    }
    function simulateResponse(bubble, query, model) {
      if (metricLatency) metricLatency.textContent = "380 ms (simulated)";
      if (metricSpeed) metricSpeed.textContent = "95 t/s";
      const text = `**OmniGateway Response via ${model}**:

Received query: *"${query}"*

Here is an optimized architectural implementation in Go:

\`\`\`go
package main

import (
    "context"
    "fmt"
)

func ProcessTask(ctx context.Context) error {
    fmt.Println("Routing through multiplexer :8317")
    return nil
}
\`\`\`

*OmniGateway daemon is active on port 8317.*`;
      let i = 0;
      const timer = setInterval(() => {
        i += 8;
        const partial = text.slice(0, i);
        renderBubble(bubble, partial, "Thinking trace: validating schema and optimizing token allocation...");
        if (i >= text.length) {
          clearInterval(timer);
          isBusy = false;
          sendBtn.disabled = false;
        }
      }, 20);
    }
    function renderBubble(bubble, content, reasoning) {
      let html = "";
      if (reasoning) {
        html += `<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Trace:</strong>${escapeHTML(reasoning)}</div>`;
      }
      html += formatMarkdown(content);
      bubble.innerHTML = html;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
    function escapeHTML(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function formatMarkdown(text) {
      if (!text) return "";
      let out = escapeHTML(text);
      out = out.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_m, _lang, code) => {
        return `<pre class="my-3 p-4 rounded-xl bg-black/60 border border-white/10 overflow-x-auto text-xs font-mono text-cyan-300"><code>${code.trim()}</code></pre>`;
      });
      out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>');
      out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      out = out.replace(/^\s*-\s+(.*)$/gim, '<div class="flex items-center gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span><span>$1</span></div>');
      out = out.replace(/\n/g, "<br>");
      return out;
    }
  }

  // src/components/quotaSimulator.ts
  function initQuotaSimulator() {
    const slider = document.getElementById("poolSlider");
    const counter = document.getElementById("poolAccountCounter");
    const simRPM = document.getElementById("simRPM");
    const simTPM = document.getElementById("simTPM");
    const simUptime = document.getElementById("simUptime");
    if (!slider || !counter || !simRPM || !simTPM || !simUptime) return;
    function updateSimulator() {
      const count = parseInt(slider.value, 10);
      counter.textContent = `${count} Account${count > 1 ? "s" : ""}`;
      const rpm = count * 100;
      const tpm = (count * 1).toFixed(1);
      const uptime = count === 1 ? "92.5%" : count < 4 ? "99.5%" : "99.99%";
      simRPM.textContent = `${rpm} RPM`;
      simTPM.textContent = `${tpm} M`;
      simUptime.textContent = uptime;
    }
    slider.addEventListener("input", updateSimulator);
    updateSimulator();
  }

  // src/components/clientHub.ts
  function initClientHub() {
    const customUrlInput = document.getElementById("clientCustomUrl");
    const customKeyInput = document.getElementById("clientCustomKey");
    const snippetTitle = document.getElementById("clientSnippetTitle");
    const snippetCode = document.getElementById("clientSnippetCode");
    const copyBtn = document.getElementById("copySnippetBtn");
    const copyBtnText = document.getElementById("copyBtnText");
    const heroCopyConnectBtn = document.getElementById("heroCopyConnectBtn");
    if (!customUrlInput || !customKeyInput || !snippetTitle || !snippetCode || !copyBtn) return;
    let activeTab = "claude";
    const snippets = {
      claude: {
        title: "~/.zshrc or ~/.bashrc for Claude Code",
        generate: (url, key) => `export ANTHROPIC_BASE_URL="${url}"
export ANTHROPIC_API_KEY="${key}"

claude`
      },
      cursor: {
        title: "Cursor Settings > Models > Override OpenAI Base URL",
        generate: (url, key) => `// In Cursor Settings > Models:
// 1. Check "Override OpenAI Base URL"
// 2. Base URL: ${url}/v1
// 3. API Key:  ${key}
// 4. Model:    gemini-3.8-flash (or gpt-5.6, claude-3-7-sonnet)`
      },
      python: {
        title: "main.py with standard OpenAI SDK",
        generate: (url, key) => `from openai import OpenAI

client = OpenAI(
    base_url="${url}/v1",
    api_key="${key}"
)

response = client.chat.completions.create(
    model="gemini-3.8-flash",
    messages=[{"role": "user", "content": "Explain raft in Go."}],
    stream=True
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`
      },
      node: {
        title: "index.ts with official OpenAI npm package",
        generate: (url, key) => `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${url}/v1",
  apiKey: "${key}",
});

const stream = await client.chat.completions.create({
  model: "gemini-3.8-flash",
  messages: [{ role: "user", content: "Hello OmniGateway!" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`
      },
      curl: {
        title: "Direct Terminal cURL command",
        generate: (url, key) => `curl -X POST ${url}/v1/chat/completions \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.8-flash",
    "messages": [{"role": "user", "content": "Hello OmniGateway!"}]
  }'`
      }
    };
    function updateCode() {
      const url = customUrlInput.value.trim().replace(/\/+$/, "") || "http://localhost:8317";
      const key = customKeyInput.value.trim() || "sk-omni-gateway-demo-key";
      const current = snippets[activeTab];
      if (current) {
        snippetTitle.textContent = current.title;
        snippetCode.textContent = current.generate(url, key);
      }
    }
    document.querySelectorAll(".client-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".client-tab-btn").forEach((b) => {
          b.className = "client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all";
        });
        btn.className = "client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-all";
        const tabName = btn.getAttribute("data-tab");
        if (tabName) {
          activeTab = tabName;
          updateCode();
        }
      });
    });
    customUrlInput.addEventListener("input", updateCode);
    customKeyInput.addEventListener("input", updateCode);
    updateCode();
    copyBtn.addEventListener("click", () => {
      if (snippetCode) {
        navigator.clipboard.writeText(snippetCode.textContent || "");
        if (copyBtnText) copyBtnText.textContent = "Copied!";
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = "Copy";
        }, 2e3);
      }
    });
    if (heroCopyConnectBtn) {
      heroCopyConnectBtn.addEventListener("click", () => {
        navigator.clipboard.writeText('curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-omni-gateway-demo-key"');
        const span = heroCopyConnectBtn.querySelector("span");
        if (span) {
          const orig = span.textContent;
          span.textContent = "Copied to Clipboard!";
          setTimeout(() => {
            span.textContent = orig;
          }, 2e3);
        }
      });
    }
  }

  // src/components/configBuilder.ts
  function initConfigBuilder() {
    const cfgHost = document.getElementById("cfgHost");
    const cfgPort = document.getElementById("cfgPort");
    const cfgApiKey = document.getElementById("cfgApiKey");
    const cfgGeminiKey = document.getElementById("cfgGeminiKey");
    const cfgOpenAIKey = document.getElementById("cfgOpenAIKey");
    const cfgClaudeKey = document.getElementById("cfgClaudeKey");
    const cfgRemoteMgmt = document.getElementById("cfgRemoteMgmt");
    const yamlPreviewCode = document.getElementById("yamlPreviewCode");
    const downloadYamlBtn = document.getElementById("downloadYamlBtn");
    const copyYamlBtn = document.getElementById("copyYamlBtn");
    if (!cfgHost || !cfgPort || !cfgApiKey || !yamlPreviewCode) return;
    function generateYAML() {
      const host = cfgHost.value.trim() || "127.0.0.1";
      const port = cfgPort.value.trim() || "8317";
      const apiKey = cfgApiKey.value.trim() || "sk-omni-gateway-demo-key";
      const geminiKey = cfgGeminiKey ? cfgGeminiKey.value.trim() : "";
      const openaiKey = cfgOpenAIKey ? cfgOpenAIKey.value.trim() : "";
      const claudeKey = cfgClaudeKey ? cfgClaudeKey.value.trim() : "";
      const remoteMgmt = cfgRemoteMgmt ? cfgRemoteMgmt.checked : false;
      let yaml = `# OmniGateway API Generated Configuration
`;
      yaml += `host: "${host}"
`;
      yaml += `port: ${port}

`;
      yaml += `api-keys:
  - "${apiKey}"

`;
      yaml += `auth-dir: "./auths"

`;
      if (remoteMgmt) {
        yaml += `remote-management:
  allow-remote: false
  secret-key: "admin-secret-key"
  disable-control-panel: false

`;
      }
      if (geminiKey) {
        yaml += `gemini-api-key:
  - api-key: "${geminiKey}"

`;
      }
      if (openaiKey) {
        yaml += `codex-api-key:
  - api-key: "${openaiKey}"

`;
      }
      if (claudeKey) {
        yaml += `claude-api-key:
  - api-key: "${claudeKey}"

`;
      }
      yaml += `# Note: Multiple accounts can also be logged in via CLI:
# ./omni-gateway -antigravity-login
# ./omni-gateway -claude-login
# ./omni-gateway -codex-login
`;
      yamlPreviewCode.textContent = yaml;
    }
    [cfgHost, cfgPort, cfgApiKey, cfgGeminiKey, cfgOpenAIKey, cfgClaudeKey, cfgRemoteMgmt].forEach((el) => {
      if (el) {
        el.addEventListener("input", generateYAML);
        el.addEventListener("change", generateYAML);
      }
    });
    generateYAML();
    if (copyYamlBtn) {
      copyYamlBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(yamlPreviewCode.textContent || "");
        const span = copyYamlBtn.querySelector("span");
        if (span) {
          span.textContent = "Copied!";
          setTimeout(() => {
            span.textContent = "Copy";
          }, 2e3);
        }
      });
    }
    if (downloadYamlBtn) {
      downloadYamlBtn.addEventListener("click", () => {
        const blob = new Blob([yamlPreviewCode.textContent || ""], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "config.yaml";
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    initQuantumCanvas("quantum-canvas");
    initGSAPAnimations();
    const client = new GatewayClient("http://127.0.0.1:8317");
    const statusPill = document.getElementById("gatewayStatusPill");
    const statusText = document.getElementById("gatewayStatusText");
    const statLatency = document.getElementById("statLatency");
    const studioModelSelect = document.getElementById("studioModelSelect");
    async function syncGatewayStatus() {
      const health = await client.checkHealth();
      if (statusPill && statusText) {
        if (health.ok) {
          statusPill.className = "flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium";
          statusText.textContent = health.statusText;
          if (statLatency) statLatency.textContent = `${health.latencyMs} ms`;
          const apiKey = document.getElementById("clientCustomKey")?.value || "sk-omni-gateway-demo-key";
          const modelList = await client.fetchModels(apiKey);
          if (modelList && modelList.data && modelList.data.length > 0 && studioModelSelect) {
            const currentSelected = studioModelSelect.value;
            studioModelSelect.innerHTML = "";
            modelList.data.forEach((m) => {
              const opt = document.createElement("option");
              opt.value = m.id;
              opt.textContent = `${m.id} (${m.owned_by || "frontier"})`;
              studioModelSelect.appendChild(opt);
            });
            if (modelList.data.some((m) => m.id === currentSelected)) {
              studioModelSelect.value = currentSelected;
            } else if (modelList.data.some((m) => m.id === "gemini-3.8-flash")) {
              studioModelSelect.value = "gemini-3.8-flash";
            }
          }
        } else {
          statusPill.className = "flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium";
          statusText.textContent = health.statusText;
        }
      }
    }
    syncGatewayStatus();
    setInterval(syncGatewayStatus, 5e3);
    initStudioPlayground(client);
    initQuotaSimulator();
    initClientHub();
    initConfigBuilder();
  });
})();
//# sourceMappingURL=app.js.map
