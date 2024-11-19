import React, { useState, useMemo } from 'react';
import { LLMModel } from '../types/llm';
import { ModelCard } from './ModelCard';
import { Settings2, BarChart2, Search, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useModels } from '../hooks/useModels';
import { evaluateModel } from '../services/evaluationService';

export const EvaluationTab: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [evaluationText, setEvaluationText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const { settings } = useSettings();
  const { data: models, isLoading, error } = useModels();

  const families = useMemo(() => {
    if (!models) return [];
    const familySet = new Set<string>();
    models.forEach(model => {
      if (model.details?.family) familySet.add(model.details.family);
      if (model.details?.families) {
        model.details.families.forEach(f => familySet.add(f));
      }
      familySet.add(model.provider);
    });
    return Array.from(familySet).sort();
  }, [models]);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    return models.filter(model => {
      const matchesSearch = searchQuery === '' || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFamilies = selectedFamilies.length === 0 || 
        selectedFamilies.some(family => 
          model.provider === family ||
          model.details?.family === family ||
          model.details?.families?.includes(family)
        );
      
      return matchesSearch && matchesFamilies;
    });
  }, [models, searchQuery, selectedFamilies]);

  const toggleFamily = (family: string) => {
    setSelectedFamilies(prev => 
      prev.includes(family)
        ? prev.filter(f => f !== family)
        : [...prev, family]
    );
  };

  const handleEvaluation = async () => {
    if (!selectedModel || !evaluationText) return;

    setEvaluating(true);
    try {
      await evaluateModel(selectedModel, evaluationText, settings);
      alert(settings.devMode ? 'Evaluation completed! (Mock response in dev mode)' : 'Evaluation completed!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setEvaluating(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
    </div>
  );

  if (error) return (
    <div className="text-center text-red-400 p-4">
      {error instanceof Error ? error.message : 'Error loading models. Please check your configuration.'}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-gray-900 pt-4 pb-2 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search models by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {families.map(family => (
            <button
              key={family}
              onClick={() => toggleFamily(family)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedFamilies.includes(family)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {family}
              {selectedFamilies.includes(family) && (
                <X className="w-3 h-3" />
              )}
            </button>
          ))}
          {selectedFamilies.length > 0 && (
            <button
              onClick={() => setSelectedFamilies([])}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={setSelectedModel}
            isSelected={selectedModel?.id === model.id}
          />
        ))}
        {filteredModels.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            No models found matching your criteria
          </div>
        )}
      </div>

      {selectedModel && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
              <Settings2 className="w-5 h-5" />
              Evaluation Setup
            </h3>
            <textarea
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400"
              placeholder="Enter text for evaluation..."
              value={evaluationText}
              onChange={(e) => setEvaluationText(e.target.value)}
              disabled={evaluating}
            />
            <button
              onClick={handleEvaluation}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!evaluationText || evaluating}
            >
              {evaluating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Evaluating...
                </>
              ) : (
                'Start Evaluation'
              )}
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
              <BarChart2 className="w-5 h-5" />
              Results
            </h3>
            <div className="text-gray-400 text-center py-8">
              Run an evaluation to see results
            </div>
          </div>
        </div>
      )}
    </div>
  );
};