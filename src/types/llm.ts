export interface LLMDetails {
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
  parent_model?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  modified_at?: string;
  size?: number;
  digest?: string;
  details?: LLMDetails;
  parameters: number;
  contextLength: number;
  performance: {
    throughput: number;
    latency: number;
  };
}

export interface EvaluationResult {
  modelId: string;
  score: number;
  metrics: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
  timestamp: string;
}

export interface Settings {
  apiUrl: string;
  ollamaUrl: string;
  devMode: boolean;
  evaluationParams: {
    maxTokens: number;
    temperature: number;
    topP: number;
  };
}