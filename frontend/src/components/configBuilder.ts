// Visual Config.yaml Builder Component in TypeScript

export function initConfigBuilder(): void {
  const cfgHost = document.getElementById('cfgHost') as HTMLInputElement | null;
  const cfgPort = document.getElementById('cfgPort') as HTMLInputElement | null;
  const cfgApiKey = document.getElementById('cfgApiKey') as HTMLInputElement | null;
  const cfgGeminiKey = document.getElementById('cfgGeminiKey') as HTMLInputElement | null;
  const cfgOpenAIKey = document.getElementById('cfgOpenAIKey') as HTMLInputElement | null;
  const cfgClaudeKey = document.getElementById('cfgClaudeKey') as HTMLInputElement | null;
  const cfgRemoteMgmt = document.getElementById('cfgRemoteMgmt') as HTMLInputElement | null;
  const yamlPreviewCode = document.getElementById('yamlPreviewCode');
  const downloadYamlBtn = document.getElementById('downloadYamlBtn');
  const copyYamlBtn = document.getElementById('copyYamlBtn');

  if (!cfgHost || !cfgPort || !cfgApiKey || !yamlPreviewCode) return;

  function generateYAML(): void {
    const host = cfgHost!.value.trim() || '127.0.0.1';
    const port = cfgPort!.value.trim() || '8317';
    const apiKey = cfgApiKey!.value.trim() || 'sk-omni-gateway-demo-key';
    const geminiKey = cfgGeminiKey ? cfgGeminiKey.value.trim() : '';
    const openaiKey = cfgOpenAIKey ? cfgOpenAIKey.value.trim() : '';
    const claudeKey = cfgClaudeKey ? cfgClaudeKey.value.trim() : '';
    const remoteMgmt = cfgRemoteMgmt ? cfgRemoteMgmt.checked : false;

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

    yamlPreviewCode!.textContent = yaml;
  }

  [cfgHost, cfgPort, cfgApiKey, cfgGeminiKey, cfgOpenAIKey, cfgClaudeKey, cfgRemoteMgmt].forEach((el) => {
    if (el) {
      el.addEventListener('input', generateYAML);
      el.addEventListener('change', generateYAML);
    }
  });

  generateYAML();

  if (copyYamlBtn) {
    copyYamlBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(yamlPreviewCode.textContent || '');
      const span = copyYamlBtn.querySelector('span');
      if (span) {
        span.textContent = 'Copied!';
        setTimeout(() => {
          span.textContent = 'Copy';
        }, 2000);
      }
    });
  }

  if (downloadYamlBtn) {
    downloadYamlBtn.addEventListener('click', () => {
      const blob = new Blob([yamlPreviewCode.textContent || ''], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.yaml';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
