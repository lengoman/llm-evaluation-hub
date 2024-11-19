import React from 'react';
import { LLMModel } from '../types/llm';
import { Brain, Zap, Box, Cpu, Scale } from 'lucide-react';
import { clsx } from 'clsx';
import { formatBytes } from '../utils/format';
import { useSelectedModels } from '../contexts/SelectedModelsContext';

interface ModelCardProps {
  model: LLMModel;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const { toggleModel, isSelected } = useSelectedModels();
  const modelFamily = model.details?.family || model.provider;
  const parameterSize = model.details?.parameter_size || `${model.parameters}B`;
  const quantLevel = model.details?.quantization_level;
  const modelSize = model.size ? formatBytes(model.size) : undefined;

  return (
    <div
      className={clsx(
        'p-6 rounded-xl transition-all cursor-pointer hover:scale-102 relative overflow-hidden',
        isSelected(model) ? 'bg-gray-800 ring-2 ring-blue-500' : 'bg-gray-800/50 hover:bg-gray-800'
      )}
      onClick={() => toggleModel(model)}
    >
      {/* Background Gradient Effect */}
      <div className={clsx(
        'absolute inset-0 opacity-10 transition-opacity',
        isSelected(model) ? 'opacity-20' : 'opacity-0'
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-100">{model.name}</h3>
          <span className="px-3 py-1 text-sm rounded-full bg-gray-700/50 text-gray-300 font-medium">
            {modelFamily}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-blue-400" />
              Parameters
            </p>
            <p className="font-medium text-gray-200">{parameterSize}</p>
          </div>
          
          {quantLevel && (
            <div className="space-y-1">
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-400" />
                Quantization
              </p>
              <p className="font-medium text-gray-200">{quantLevel}</p>
            </div>
          )}
          
          {modelSize && (
            <div className="space-y-1">
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-green-400" />
                Model Size
              </p>
              <p className="font-medium text-gray-200">{modelSize}</p>
            </div>
          )}
          
          {model.modified_at && (
            <div className="space-y-1">
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-yellow-400" />
                Updated
              </p>
              <p className="font-medium text-gray-200">
                {new Date(model.modified_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};