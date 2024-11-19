import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TabPanel } from './components/TabPanel';
import { EvaluationTab } from './components/EvaluationTab';
import { SettingsTab } from './components/SettingsTab';
import { MetaChatTab } from './components/MetaChatTab';
import { SettingsProvider } from './contexts/SettingsContext';
import { SelectedModelsProvider } from './contexts/SelectedModelsContext';
import { ChatProvider } from './contexts/ChatContext';
import { Brain, Settings, MessageSquareMore } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'settings' | 'metachat'>('evaluation');

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <SelectedModelsProvider>
          <ChatProvider>
            <div className="min-h-screen bg-gray-900 text-gray-100">
              <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                      <Brain className="w-6 h-6 text-blue-400" />
                      <h1 className="text-xl font-bold text-gray-100">LLM Evaluation Hub</h1>
                    </div>
                  </div>
                </div>
              </header>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex space-x-1 border-b border-gray-700">
                  <button
                    className={`px-4 py-2 font-medium text-sm inline-flex items-center gap-2 ${
                      activeTab === 'evaluation'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('evaluation')}
                  >
                    <Brain className="w-4 h-4" />
                    Evaluation
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm inline-flex items-center gap-2 ${
                      activeTab === 'metachat'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('metachat')}
                  >
                    <MessageSquareMore className="w-4 h-4" />
                    MetaChat
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm inline-flex items-center gap-2 ${
                      activeTab === 'settings'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                <TabPanel isActive={activeTab === 'evaluation'}>
                  <EvaluationTab />
                </TabPanel>
                <TabPanel isActive={activeTab === 'metachat'}>
                  <MetaChatTab />
                </TabPanel>
                <TabPanel isActive={activeTab === 'settings'}>
                  <SettingsTab />
                </TabPanel>
              </main>
            </div>
          </ChatProvider>
        </SelectedModelsProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;