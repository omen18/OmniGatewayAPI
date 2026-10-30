// AI Studio & Live Playground Component in TypeScript
// Provides ultra-fast, friendly consumer chatbot experience

import { GatewayClient } from '../api/gatewayClient';
import { ChatMessage, ChatCompletionRequest } from '../types/gateway';
import { EmbeddedAIEngine } from '../api/embeddedAI';

declare const lucide: any;

export function initStudioPlayground(client: GatewayClient): void {
  const modelSelect = document.getElementById('studioModelSelect') as HTMLSelectElement | null;
  const thinkingToggle = document.getElementById('studioThinkingToggle') as HTMLInputElement | null;
  const thinkingBudgetWrapper = document.getElementById('thinkingBudgetWrapper');
  const thinkingBudgetSlider = document.getElementById('thinkingBudgetSlider') as HTMLInputElement | null;
  const thinkingBudgetValue = document.getElementById('thinkingBudgetValue');
  const tempSlider = document.getElementById('studioTempSlider') as HTMLInputElement | null;
  const tempVal = document.getElementById('tempVal');
  const streamToggle = document.getElementById('studioStreamToggle') as HTMLInputElement | null;
  const systemPrompt = document.getElementById('studioSystemPrompt') as HTMLTextAreaElement | null;
  const promptInput = document.getElementById('studioPromptInput') as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById('studioSendBtn') as HTMLButtonElement | null;
  const chatMessages = document.getElementById('studioChatMessages');
  const clearChatBtn = document.getElementById('studioClearChatBtn');
  const metricLatency = document.getElementById('metricLatency');
  const metricSpeed = document.getElementById('metricSpeed');
  const playgroundModelBadge = document.getElementById('playgroundModelBadge');
  const activeModelLabel = document.getElementById('activeModelLabel');

  if (!modelSelect || !promptInput || !sendBtn || !chatMessages) return;

  let isBusy = false;
  const history: ChatMessage[] = [];

  // Update badge & label
  function updateModelBadge(): void {
    if (!modelSelect) return;
    const selected = modelSelect.value;
    if (activeModelLabel) activeModelLabel.textContent = selected;

    if (playgroundModelBadge) {
      if (selected.includes('omni-embedded')) {
        playgroundModelBadge.textContent = '✨ Omni AI';
        playgroundModelBadge.className =
          'text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold';
      } else if (selected.includes('gemini')) {
        playgroundModelBadge.textContent = 'Google';
        playgroundModelBadge.className =
          'text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono';
      } else if (selected.includes('claude')) {
        playgroundModelBadge.textContent = 'Anthropic';
        playgroundModelBadge.className =
          'text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono';
      } else if (selected.includes('gpt') || selected.includes('o3') || selected.includes('o1')) {
        playgroundModelBadge.textContent = 'OpenAI';
        playgroundModelBadge.className =
          'text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono';
      } else if (selected.includes('grok')) {
        playgroundModelBadge.textContent = 'xAI';
        playgroundModelBadge.className =
          'text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono';
      } else {
        playgroundModelBadge.textContent = 'Frontier';
        playgroundModelBadge.className =
          'text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-mono';
      }
    }
  }

  modelSelect.addEventListener('change', updateModelBadge);
  updateModelBadge();

  // Thinking toggle
  if (thinkingToggle && thinkingBudgetWrapper) {
    thinkingToggle.addEventListener('change', () => {
      if (thinkingToggle.checked) {
        thinkingBudgetWrapper.classList.remove('opacity-50', 'pointer-events-none');
      } else {
        thinkingBudgetWrapper.classList.add('opacity-50', 'pointer-events-none');
      }
    });
  }

  if (thinkingBudgetSlider && thinkingBudgetValue) {
    thinkingBudgetSlider.addEventListener('input', () => {
      thinkingBudgetValue.textContent = `${Number(thinkingBudgetSlider.value).toLocaleString()} tokens`;
    });
  }

  if (tempSlider && tempVal) {
    tempSlider.addEventListener('input', () => {
      tempVal.textContent = tempSlider.value;
    });
  }

  // Preset Buttons (Click to send or fill)
  document.querySelectorAll('.preset-prompt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      promptInput.value = btn.textContent ? btn.textContent.trim() : '';
      executeSend();
    });
  });

  // Clear Chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      chatMessages.innerHTML = `
        <div class="flex items-start gap-3 max-w-2xl">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs">
            ✨
          </div>
          <div class="chat-bubble-assistant p-4 text-sm text-slate-200 leading-relaxed shadow-lg">
            <p class="font-medium text-white mb-1">Hey there! 👋 Omni AI is ready.</p>
            <p class="text-xs text-slate-400">Ask me anything, brainstorm ideas, request code in any language, or just say hello!</p>
          </div>
        </div>
      `;
      history.length = 0;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  sendBtn.addEventListener('click', executeSend);
  promptInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeSend();
    }
  });

  function appendMessage(role: 'user' | 'assistant', content: string): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-3 max-w-2xl' + (role === 'user' ? ' ml-auto justify-end' : '');

    // Avatar
    const avatar = document.createElement('div');
    if (role === 'user') {
      avatar.className =
        'w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-xs order-2';
      avatar.textContent = '👤';
    } else {
      avatar.className =
        'w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs';
      avatar.textContent = '✨';
    }

    const bubble = document.createElement('div');
    bubble.className =
      (role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant') + ' p-4 text-sm leading-relaxed shadow-lg';
    bubble.innerHTML = role === 'user' ? escapeHTML(content) : content;

    if (role === 'user') {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    } else {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    }

    chatMessages!.appendChild(wrapper);
    chatMessages!.scrollTop = chatMessages!.scrollHeight;
    return bubble;
  }

  async function executeSend(): Promise<void> {
    const text = promptInput!.value.trim();
    if (!text || isBusy) return;

    promptInput!.value = '';
    isBusy = true;
    sendBtn!.disabled = true;

    appendMessage('user', text);
    history.push({ role: 'user', content: text });

    // Friendly typing indicator placeholder
    const assistantBubble = appendMessage(
      'assistant',
      `<div class="flex items-center gap-2 py-1 text-slate-300">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style="animation-delay: 150ms"></span>
        <span class="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style="animation-delay: 300ms"></span>
        <span class="text-xs text-slate-400 ml-1">Omni AI is thinking...</span>
      </div>`
    );

    const modelName = modelSelect!.value;
    const isStreaming = streamToggle ? streamToggle.checked : true;
    const isThinking = thinkingToggle ? thinkingToggle.checked : false;
    const thinkingTokens = thinkingBudgetSlider ? parseInt(thinkingBudgetSlider.value, 10) : 4096;
    const sysPrompt = systemPrompt ? systemPrompt.value.trim() : '';

    let finalModel = modelName;
    if (isThinking && !finalModel.includes(':thinking')) {
      finalModel += ':thinking';
    }

    const start = performance.now();

    // 1. Direct Instant Omni AI (Zero-Fail Local Core)
    if (modelName === 'omni-embedded-core') {
      let accumulatedContent = '';
      let accumulatedReasoning = '';

      EmbeddedAIEngine.streamResponse(
        text,
        'omni-embedded-core',
        {
          onReasoning: (reasoningChunk: string) => {
            accumulatedReasoning = reasoningChunk;
            renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
          },
          onChunk: (chunk: string) => {
            accumulatedContent += chunk;
            renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
          },
          onDone: (tokenCount: number) => {
            const elapsedSec = (performance.now() - start) / 1000;
            const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
            if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1000)} ms`;
            if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
            history.push({ role: 'assistant', content: accumulatedContent });
            isBusy = false;
            sendBtn!.disabled = false;
          }
        },
        history
      );
      return;
    }

    // 2. Remote Model with Active 1.5s Race Fallback
    // If upstream Google/Claude takes > 1500ms (e.g. 503 high demand spikes), fail over seamlessly!
    const payload: ChatCompletionRequest = {
      model: finalModel,
      messages: [
        ...(sysPrompt ? [{ role: 'system' as const, content: sysPrompt }] : []),
        ...history.slice(-6)
      ],
      temperature: tempSlider ? parseFloat(tempSlider.value) : 0.7,
      stream: isStreaming
    };

    if (isThinking) {
      payload.thinking = { budget_tokens: thinkingTokens };
    }

    const apiKey =
      (document.getElementById('clientCustomKey') as HTMLInputElement)?.value || 'sk-omni-gateway-demo-key';
    let accumulatedContent = '';
    let accumulatedReasoning = '';
    let firstChunkReceived = false;

    // Race timeout: if remote provider doesn't deliver first chunk in 1.5s, trigger friendly AI immediately!
    const raceFallbackTimer = setTimeout(() => {
      if (!firstChunkReceived && isBusy) {
        console.warn('Upstream provider latency > 1500ms, activating instant Omni AI fallback');
        runFriendlyFallback('⚡ [Fast Failover Active] Responding via Omni AI Copilot...');
      }
    }, 1500);

    function runFriendlyFallback(reasoningPrefix: string) {
      clearTimeout(raceFallbackTimer);
      firstChunkReceived = true;
      let fallbackReasoning = reasoningPrefix;
      let fallbackContent = '';

      EmbeddedAIEngine.streamResponse(
        text,
        finalModel,
        {
          onReasoning: (reasoningChunk: string) => {
            fallbackReasoning = `${reasoningPrefix}\n\n${reasoningChunk}`;
            renderBubble(assistantBubble, fallbackContent, fallbackReasoning);
          },
          onChunk: (chunk: string) => {
            fallbackContent += chunk;
            renderBubble(assistantBubble, fallbackContent, fallbackReasoning);
          },
          onDone: (tokenCount: number) => {
            const elapsedSec = (performance.now() - start) / 1000;
            const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
            if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1000)} ms (Zero-Wait)`;
            if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
            history.push({ role: 'assistant', content: fallbackContent });
            isBusy = false;
            sendBtn!.disabled = false;
          }
        },
        history
      );
    }

    await client.streamChat(payload, apiKey, {
      onChunk: (chunk: string) => {
        firstChunkReceived = true;
        clearTimeout(raceFallbackTimer);
        accumulatedContent += chunk;
        renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
      },
      onReasoning: (reasoning: string) => {
        firstChunkReceived = true;
        clearTimeout(raceFallbackTimer);
        accumulatedReasoning += reasoning;
        renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
      },
      onDone: (tokenCount: number) => {
        clearTimeout(raceFallbackTimer);
        const elapsedSec = (performance.now() - start) / 1000;
        const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
        if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1000)} ms`;
        if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
        history.push({ role: 'assistant', content: accumulatedContent });
        isBusy = false;
        sendBtn!.disabled = false;
      },
      onError: (err: Error) => {
        if (!firstChunkReceived) {
          console.warn('Gateway error, engaging Omni AI fallback:', err);
          runFriendlyFallback('🛡️ [Zero-Fail Active] Upstream unavailable. Answering with Omni AI...');
        }
      }
    });
  }

  function renderBubble(bubble: HTMLElement, content: string, reasoning: string): void {
    let html = '';
    if (reasoning) {
      html += `<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Process:</strong>${escapeHTML(
        reasoning
      )}</div>`;
    }
    html += formatMarkdown(content);
    bubble.innerHTML = html;
    chatMessages!.scrollTop = chatMessages!.scrollHeight;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text: string): string {
    if (!text) return '';
    let out = escapeHTML(text);

    // Code blocks
    out = out.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_m, lang, code) => {
      const language = lang || 'code';
      return `<div class="my-3 rounded-xl overflow-hidden border border-white/10 bg-black/70 shadow-lg">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-[11px] font-mono text-slate-400">
          <span>${language}</span>
          <span class="text-cyan-400 text-[10px]">copyable</span>
        </div>
        <pre class="p-4 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed"><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Tables
    out = out.replace(/\|(.+)\|/g, (match) => {
      const cells = match
        .split('|')
        .filter((c) => c.trim().length > 0)
        .map((c) => `<td class="px-3 py-1.5 border border-white/10">${c.trim()}</td>`)
        .join('');
      return `<tr class="hover:bg-white/5 transition-colors">${cells}</tr>`;
    });
    out = out.replace(/(<tr[\s\S]*?<\/tr>)/gi, '<table class="my-3 w-full text-xs border-collapse">$1</table>');

    // Headings
    out = out.replace(/^### (.*$)/gim, '<h3 class="font-bold text-white text-base mt-3 mb-1.5">$1</h3>');
    out = out.replace(/^#### (.*$)/gim, '<h4 class="font-semibold text-cyan-300 text-sm mt-2 mb-1">$1</h4>');

    // Inline code
    out = out.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>'
    );

    // Bold
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

    // Italics
    out = out.replace(/\*([^*]+)\*/g, '<em class="text-slate-300 italic">$1</em>');

    // Bullets
    out = out.replace(
      /^\s*-\s+(.*)$/gim,
      '<div class="flex items-start gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span><span>$1</span></div>'
    );

    // Numbered lists
    out = out.replace(
      /^\s*(\d+)\.\s+(.*)$/gim,
      '<div class="flex items-start gap-2 my-1"><span class="text-cyan-400 font-mono text-xs font-bold">$1.</span><span>$2</span></div>'
    );

    // Newlines
    out = out.replace(/\n/g, '<br>');

    return out;
  }
}
