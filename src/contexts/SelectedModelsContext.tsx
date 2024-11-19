import React, { createContext, useContext, useState } from 'react';
import { LLMModel } from '../types/llm';

interface SelectedModelsContextType {
  selectedModels: LLMModel[];
  toggleModel: (model: LLMModel) => void;
  isSelected: (model: LLMModel) => boolean;
  clearSelection: () => void;
}

const SelectedModelsContext = createContext<SelectedModelsContextType | undefined>(undefined);

export const SelectedModelsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedModels, setSelectedModels] = useState<LLMModel[]>([]);

  const toggleModel = (model: LLMModel) => {
    setSelectedModels(prev => 
      prev.some(m => m.id === model.id)
        ? prev.filter(m => m.id !== model.id)
        : [...prev, model]
    );
  };

  const isSelected = (model: LLMModel) => {
    return selectedModels.some(m => m.id === model.id);
  };

  const clearSelection = () => {
    setSelectedModels([]);
  };

  return (
    <SelectedModelsContext.Provider value={{ selectedModels, toggleModel, isSelected, clearSelection }}>
      {children}
    </SelectedModelsContext.Provider>
  );
};

export const useSelectedModels = () => {
  const context = useContext(SelectedModelsContext);
  if (context === undefined) {
    throw new Error('useSelectedModels must be used within a SelectedModelsProvider');
  }
  return context;
};