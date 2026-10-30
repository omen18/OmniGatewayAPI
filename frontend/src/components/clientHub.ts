// 1-Click Client Integration Hub in TypeScript

import { ClientCodeTemplate } from '../types/gateway';

export function initClientHub(): void {
  const customUrlInput = document.getElementById('clientCustomUrl') as HTMLInputElement | null;
  const customKeyInput = document.getElementById('clientCustomKey') as HTMLInputElement | null;
  const snippetTitle = document.getElementById('clientSnippetTitle');
  const snippetCode = document.getElementById('clientSnippetCode');
  const copyBtn = document.getElementById('copySnippetBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const heroCopyConnectBtn = document.getElementById('heroCopyConnectBtn');

  if (!customUrlInput || !customKeyInput || !snippetTitle || !snippetCode || !copyBtn) return;

  let activeTab = 'claude';

  const snippets: Record<string, ClientCodeTemplate> = {
    claude: {
      title: '~/.zshrc or ~/.bashrc for Claude Code',
      generate: (url, key) => `export ANTHROPIC_BASE_URL="${url}"\nexport ANTHROPIC_API_KEY="${key}"\n\nclaude`
    },
    cursor: {
      title: 'Cursor Settings > Models > Override OpenAI Base URL',
      generate: (url, key) => `// In Cursor Settings > Models:\n// 1. Check "Override OpenAI Base URL"\n// 2. Base URL: ${url}/v1\n// 3. API Key:  ${key}\n// 4. Model:    gemini-3.8-flash (or gpt-5.6, claude-3-7-sonnet)`
    },
    python: {
      title: 'main.py with standard OpenAI SDK',
      generate: (url, key) => `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="${url}/v1",\n    api_key="${key}"\n)\n\nresponse = client.chat.completions.create(\n    model="gemini-3.8-flash",\n    messages=[{"role": "user", "content": "Explain raft in Go."}],\n    stream=True\n)\n\nfor chunk in response:\n    if chunk.choices and chunk.choices[0].delta.content:\n        print(chunk.choices[0].delta.content, end="", flush=True)`
    },
    node: {
      title: 'index.ts with official OpenAI npm package',
      generate: (url, key) => `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${url}/v1",\n  apiKey: "${key}",\n});\n\nconst stream = await client.chat.completions.create({\n  model: "gemini-3.8-flash",\n  messages: [{ role: "user", content: "Hello OmniGateway!" }],\n  stream: true,\n});\n\nfor await (const chunk of stream) {\n  process.stdout.write(chunk.choices[0]?.delta?.content || "");\n}`
    },
    curl: {
      title: 'Direct Terminal cURL command',
      generate: (url, key) => `curl -X POST ${url}/v1/chat/completions \\\n  -H "Authorization: Bearer ${key}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "gemini-3.8-flash",\n    "messages": [{"role": "user", "content": "Hello OmniGateway!"}]\n  }'`
    }
  };

  function updateCode(): void {
    const url = customUrlInput!.value.trim().replace(/\/+$/, '') || 'http://localhost:8317';
    const key = customKeyInput!.value.trim() || 'sk-omni-gateway-demo-key';
    const current = snippets[activeTab];
    if (current) {
      snippetTitle!.textContent = current.title;
      snippetCode!.textContent = current.generate(url, key);
    }
  }

  document.querySelectorAll('.client-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.client-tab-btn').forEach((b) => {
        b.className = 'client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all';
      });
      btn.className = 'client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-all';
      const tabName = btn.getAttribute('data-tab');
      if (tabName) {
        activeTab = tabName;
        updateCode();
      }
    });
  });

  customUrlInput.addEventListener('input', updateCode);
  customKeyInput.addEventListener('input', updateCode);
  updateCode();

  copyBtn.addEventListener('click', () => {
    if (snippetCode) {
      navigator.clipboard.writeText(snippetCode.textContent || '');
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copy';
      }, 2000);
    }
  });

  if (heroCopyConnectBtn) {
    heroCopyConnectBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-omni-gateway-demo-key"');
      const span = heroCopyConnectBtn.querySelector('span');
      if (span) {
        const orig = span.textContent;
        span.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
          span.textContent = orig;
        }, 2000);
      }
    });
  }
}
