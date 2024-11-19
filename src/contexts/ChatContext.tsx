import React, { createContext, useContext, useState } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  replyTo?: string;
  replyPreview?: string;
  responseTime?: number;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  replyingTo: string | null;
  setReplyingTo: (value: string | null) => void;
  replyPreview: string | null;
  setReplyPreview: (value: string | null) => void;
  singleAgentReply: string | null;
  setSingleAgentReply: (value: string | null) => void;
  pendingResponses: Set<string>;
  setPendingResponses: (value: Set<string>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyPreview, setReplyPreview] = useState<string | null>(null);
  const [singleAgentReply, setSingleAgentReply] = useState<string | null>(null);
  const [pendingResponses, setPendingResponses] = useState<Set<string>>(new Set());

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      isGenerating,
      setIsGenerating,
      replyingTo,
      setReplyingTo,
      replyPreview,
      setReplyPreview,
      singleAgentReply,
      setSingleAgentReply,
      pendingResponses,
      setPendingResponses,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};