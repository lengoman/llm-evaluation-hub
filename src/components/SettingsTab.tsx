import React from 'react';
import { Save, Link, Server, Code } from 'lucide-react';
import { useSettings, Settings } from '../contexts/SettingsContext';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleSave = async () => {
    try {
      if (!settings.devMode) {
        const response = await fetch(`${settings.ollamaUrl}/api/tags`);
        if (!response.ok) throw new Error('Failed to connect to Ollama');
      }
      updateSettings(settings);
      alert('Settings saved successfully!' + (!settings.devMode ? ' Ollama connection verified.' : ''));
    } catch (error) {
      alert(`Warning: Could not connect to Ollama server. Please check the URL. (${error instanceof Error ? error.message : 'Unknown error'})`);
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    updateSettings({ ...settings, [key]: value });
  };

  const updateEvaluationParam = (key: keyof Settings['evaluationParams'], value: number) => {
    updateSettings({
      ...settings,
      evaluationParams: { ...settings.evaluationParams, [key]: value },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
          <Code className="w-5 h-5" />
          Development Mode
        </h3>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.devMode}
              onChange={(e) => updateSetting('devMode', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
          <span className="text-sm font-medium text-gray-300">
            {settings.devMode ? 'Development Mode (Using Mock Data)' : 'Production Mode (Using Ollama)'}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Toggle between development mode with mock data and production mode using Ollama server.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
          <Link className="w-5 h-5" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              External API Endpoint URL
            </label>
            <input
              type="url"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              value={settings.apiUrl}
              onChange={(e) => updateSetting('apiUrl', e.target.value)}
              placeholder="https://api.example.com/llms"
            />
            <p className="mt-1 text-sm text-gray-400">
              Optional: External API endpoint for additional LLM services
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ollama Server URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                value={settings.ollamaUrl}
                onChange={(e) => updateSetting('ollamaUrl', e.target.value)}
                placeholder="http://localhost:11434"
                disabled={settings.devMode}
              />
              <button
                onClick={() => {
                  fetch(`${settings.ollamaUrl}/api/tags`)
                    .then(response => response.json())
                    .then(() => alert('Successfully connected to Ollama server!'))
                    .catch(() => alert('Failed to connect to Ollama server. Please check the URL.'));
                }}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={settings.devMode}
              >
                <Server className="w-4 h-4" />
                Test
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              The URL where your Ollama server is running (default: http://localhost:11434)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Evaluation Parameters</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              value={settings.evaluationParams.maxTokens}
              onChange={(e) => updateEvaluationParam('maxTokens', parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Temperature
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full accent-blue-500"
              value={settings.evaluationParams.temperature}
              onChange={(e) => updateEvaluationParam('temperature', parseFloat(e.target.value))}
            />
            <div className="text-sm text-gray-400 mt-1">
              Value: {settings.evaluationParams.temperature}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Top P
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full accent-blue-500"
              value={settings.evaluationParams.topP}
              onChange={(e) => updateEvaluationParam('topP', parseFloat(e.target.value))}
            />
            <div className="text-sm text-gray-400 mt-1">
              Value: {settings.evaluationParams.topP}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Settings
      </button>
    </div>
  );
};