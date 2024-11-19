import { LLMModel } from '../types/llm';
import { Settings } from '../contexts/SettingsContext';
import { mockModels } from '../mocks/models';

export async function fetchModels(settings: Settings): Promise<LLMModel[]> {
  if (settings.devMode) {
    return mockModels;
  }

  try {
    const response = await fetch(`${settings.ollamaUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return data.models.map((model: any) => ({
      id: model.name,
      name: model.name,
      provider: model.details?.family || 'Unknown',
      parameters: parseFloat(model.details?.parameter_size || '0'),
      modified_at: model.modified_at,
      size: model.size,
      digest: model.digest,
      details: model.details,
      contextLength: 0,
      performance: {
        throughput: 0,
        latency: 0
      }
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error('Failed to fetch models. Please check your Ollama server configuration.');
  }
}

export async function evaluateModel(
  model: LLMModel,
  text: string,
  settings: Settings
): Promise<void> {
  if (settings.devMode) {
    return Promise.resolve();
  }

  try {
    const response = await fetch(`${settings.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.id,
        prompt: text,
        ...settings.evaluationParams,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during evaluation:', error);
    throw new Error('Failed to evaluate model. Please check your configuration.');
  }
}