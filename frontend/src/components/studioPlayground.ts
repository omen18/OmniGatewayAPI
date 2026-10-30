// AI Studio & Live Playground Component in TypeScript

import { GatewayClient } from '../api/gatewayClient';
import { ChatMessage, ChatCompletionRequest } from '../types/gateway';

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

  // Preset Buttons
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

    const bubble = document.createElement('div');
    bubble.className = (role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant') + ' p-4 text-sm leading-relaxed shadow-lg';
    bubble.innerHTML = role === 'user' ? escapeHTML(content) : content;

    wrapper.appendChild(bubble);
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

    const assistantBubble = appendMessage(
      'assistant',
      '<span class="text-cyan-400 animate-pulse font-mono text-xs">⚡ Routing request through OmniGateway...</span>'
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

    const apiKey = (document.getElementById('clientCustomKey') as HTMLInputElement)?.value || 'sk-omni-gateway-demo-key';
    const start = performance.now();
    let accumulatedContent = '';
    let accumulatedReasoning = '';

    await client.streamChat(payload, apiKey, {
      onChunk: (chunk: string) => {
        accumulatedContent += chunk;
        renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
      },
      onReasoning: (reasoning: string) => {
        accumulatedReasoning += reasoning;
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
      },
      onError: (_err: Error) => {
        // Fallback simulation if offline
        simulateResponse(assistantBubble, text, finalModel);
      }
    });
  }

  function simulateResponse(bubble: HTMLElement, query: string, model: string): void {
    if (metricLatency) metricLatency.textContent = '380 ms (simulated)';
    if (metricSpeed) metricSpeed.textContent = '95 t/s';

    const text = `**OmniGateway Response via ${model}**:\n\n` +
      `Received query: *"${query}"*\n\n` +
      `Here is an optimized architectural implementation in Go:\n\n` +
      `\`\`\`go\n` +
      `package main\n\n` +
      `import (\n` +
      `    "context"\n` +
      `    "fmt"\n` +
      `)\n\n` +
      `func ProcessTask(ctx context.Context) error {\n` +
      `    fmt.Println("Routing through multiplexer :8317")\n` +
      `    return nil\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `*OmniGateway daemon is active on port 8317.*`;

    let i = 0;
    const timer = setInterval(() => {
      i += 8;
      const partial = text.slice(0, i);
      renderBubble(bubble, partial, 'Thinking trace: validating schema and optimizing token allocation...');
      if (i >= text.length) {
        clearInterval(timer);
        isBusy = false;
        sendBtn!.disabled = false;
      }
    }, 20);
  }

  function renderBubble(bubble: HTMLElement, content: string, reasoning: string): void {
    let html = '';
    if (reasoning) {
      html += `<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Trace:</strong>${escapeHTML(reasoning)}</div>`;
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
    out = out.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_m, _lang, code) => {
      return `<pre class="my-3 p-4 rounded-xl bg-black/60 border border-white/10 overflow-x-auto text-xs font-mono text-cyan-300"><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>');

    // Bold
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

    // Bullets
    out = out.replace(/^\s*-\s+(.*)$/gim, '<div class="flex items-center gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span><span>$1</span></div>');

    // Newlines
    out = out.replace(/\n/g, '<br>');

    return out;
  }
}
