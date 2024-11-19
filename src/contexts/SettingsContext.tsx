import React, { createContext, useContext, useState, useEffect } from 'react';

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

const defaultSettings: Settings = {
  apiUrl: import.meta.env.VITE_API_URL || '',
  ollamaUrl: 'http://localhost:11434',
  devMode: import.meta.env.DEV || false,
  evaluationParams: {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
  },
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('llm-eval-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse settings:', error);
        localStorage.removeItem('llm-eval-settings');
      }
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('llm-eval-settings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};