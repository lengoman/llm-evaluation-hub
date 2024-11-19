import { useQuery } from 'react-query';
import { LLMModel } from '../types/llm';
import { useSettings } from '../contexts/SettingsContext';
import { fetchModels } from '../services/evaluationService';

export function useModels() {
  const { settings } = useSettings();

  return useQuery<LLMModel[], Error>(
    ['models', settings.devMode, settings.ollamaUrl],
    () => fetchModels(settings),
    {
      enabled: settings.devMode || !!settings.ollamaUrl,
      retry: 1,
      staleTime: 30000,
      cacheTime: 60000,
    }
  );
}