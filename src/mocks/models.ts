import { LLMModel } from '../types/llm';

export const mockModels: LLMModel[] = [
  {
    id: 'llama2-7b',
    name: 'Llama 2 7B',
    provider: 'Meta',
    parameters: 7,
    contextLength: 4096,
    performance: {
      throughput: 150,
      latency: 50
    }
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    parameters: 7,
    contextLength: 8192,
    performance: {
      throughput: 180,
      latency: 45
    }
  },
  {
    id: 'codellama-13b',
    name: 'CodeLlama 13B',
    provider: 'Meta',
    parameters: 13,
    contextLength: 16384,
    performance: {
      throughput: 120,
      latency: 75
    }
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    parameters: 47,
    contextLength: 32768,
    performance: {
      throughput: 200,
      latency: 60
    }
  },
  {
    id: 'llama2-13b',
    name: 'Llama 2 13B',
    provider: 'Meta',
    parameters: 13,
    contextLength: 4096,
    performance: {
      throughput: 130,
      latency: 65
    }
  },
  {
    id: 'llama2-70b',
    name: 'Llama 2 70B',
    provider: 'Meta',
    parameters: 70,
    contextLength: 4096,
    performance: {
      throughput: 90,
      latency: 100
    }
  },
  {
    id: 'phi-2',
    name: 'Phi-2',
    provider: 'Microsoft',
    parameters: 2.7,
    contextLength: 2048,
    performance: {
      throughput: 220,
      latency: 35
    }
  },
  {
    id: 'openchat-3.5',
    name: 'OpenChat 3.5',
    provider: 'OpenChat AI',
    parameters: 7,
    contextLength: 8192,
    performance: {
      throughput: 170,
      latency: 55
    }
  },
  {
    id: 'neural-chat-7b',
    name: 'Neural Chat 7B',
    provider: 'Intel',
    parameters: 7,
    contextLength: 4096,
    performance: {
      throughput: 160,
      latency: 58
    }
  },
  {
    id: 'stable-beluga-7b',
    name: 'Stable Beluga 7B',
    provider: 'Stability AI',
    parameters: 7,
    contextLength: 4096,
    performance: {
      throughput: 155,
      latency: 62
    }
  }
];