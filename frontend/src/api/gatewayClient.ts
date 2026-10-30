// Strongly Typed OmniGateway API Client

import {
  ChatCompletionRequest,
  ChatCompletionChunk,
  HealthCheckResult,
  ModelListResponse
} from '../types/gateway';

export class GatewayClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:8317') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async checkHealth(): Promise<HealthCheckResult> {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timer);

      const latencyMs = Math.round(performance.now() - start);

      if (res.ok) {
        return { ok: true, latencyMs, statusText: `Online • ${latencyMs}ms` };
      }
      return { ok: false, latencyMs, statusText: `HTTP ${res.status}` };
    } catch {
      return { ok: false, latencyMs: 0, statusText: 'Demo Mode (8317 Standby)' };
    }
  }

  async fetchModels(apiKey: string): Promise<ModelListResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      if (res.ok) {
        return (await res.json()) as ModelListResponse;
      }
      return null;
    } catch {
      return null;
    }
  }

  async streamChat(
    payload: ChatCompletionRequest,
    apiKey: string,
    callbacks: {
      onChunk: (content: string) => void;
      onReasoning: (reasoning: string) => void;
      onDone: (tokenCount: number) => void;
      onError: (err: Error) => void;
    }
  ): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      if (payload.stream && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let tokenCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            if (trimmed === 'data: [DONE]') break;

            try {
              const chunk = JSON.parse(trimmed.slice(6)) as ChatCompletionChunk;
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
              // Ignore partial chunk parse errors
            }
          }
        }
        callbacks.onDone(tokenCount);
      } else {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content || 'No response';
        callbacks.onChunk(content);
        callbacks.onDone(json.usage?.completion_tokens || 50);
      }
    } catch (err: any) {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
