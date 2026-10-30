// TypeScript Type Definitions for OmniGateway Protocol & UI

export interface ModelInfo {
  id: string;
  object: string;
  created?: number;
  owned_by: string;
}

export interface ModelListResponse {
  object: string;
  data: ModelInfo[];
}

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ThinkingConfig {
  budget_tokens?: number;
  level?: 'low' | 'medium' | 'high' | 'xhigh' | 'auto';
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  stream?: boolean;
  thinking?: ThinkingConfig;
}

export interface ChatCompletionChoiceDelta {
  role?: string;
  content?: string;
  reasoning_content?: string;
}

export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: ChatCompletionChoiceDelta;
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    completion_tokens_details?: {
      reasoning_tokens?: number;
    };
  };
}

export interface HealthCheckResult {
  ok: boolean;
  latencyMs: number;
  statusText: string;
}

export interface ClientCodeTemplate {
  title: string;
  generate: (url: string, key: string) => string;
}
