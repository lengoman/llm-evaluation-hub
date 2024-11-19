import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Clock, MessageCircle, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useSelectedModels } from '../contexts/SelectedModelsContext';
import { useChat } from '../contexts/ChatContext';
import { useSettings } from '../contexts/SettingsContext';
import { nanoid } from 'nanoid';

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-1">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1.4s_ease-in-out_infinite]" />
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
  </div>
);

export const MetaChatTab: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [showParticipants, setShowParticipants] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedModels } = useSelectedModels();
  const { settings } = useSettings();
  const {
    messages,
    addMessage,
    pendingResponses,
    setPendingResponses,
    replyingTo,
    setReplyingTo,
    replyPreview,
    setReplyPreview,
  } = useChat();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingResponses]);

  // Get the last message for each model to show typing indicator
  const lastMessagePerModel = useMemo(() => {
    const lastMessages = new Map<string, number>();
    messages.forEach((msg, index) => {
      if (msg.sender !== 'user') {
        lastMessages.set(msg.sender, index);
      }
    });
    return lastMessages;
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || (!replyingTo && selectedModels.length === 0)) return;

    // Check if replying to an unselected model
    if (replyingTo && !selectedModels.some(m => m.id === replyingTo)) {
      return;
    }

    const userMessage = {
      id: nanoid(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
      replyTo: replyingTo || undefined,
      replyPreview: replyPreview || undefined,
    };
    addMessage(userMessage);
    setInputText('');

    const respondingModels = replyingTo 
      ? [selectedModels.find(m => m.id === replyingTo)].filter(Boolean)
      : selectedModels;

    // Add models to pending responses
    setPendingResponses(new Set(respondingModels.map(m => m.id)));

    // Simulate responses in dev mode
    if (settings.devMode) {
      for (const model of respondingModels) {
        const responseTime = Math.random() * 2 + 1; // 1-3 seconds
        await new Promise(resolve => setTimeout(resolve, responseTime * 1000));

        const response = {
          id: nanoid(),
          text: `${model.name}'s response to: ${inputText}`,
          sender: model.id,
          timestamp: Date.now(),
          responseTime,
        };
        addMessage(response);
        setPendingResponses(prev => {
          const next = new Set(prev);
          next.delete(model.id);
          return next;
        });
      }
    }

    // Clear reply state
    setReplyingTo(null);
    setReplyPreview(null);
  };

  const handleReply = (messageId: string, preview: string, modelId: string) => {
    // Only allow replies to currently selected models
    if (selectedModels.some(m => m.id === modelId)) {
      setReplyingTo(modelId);
      setReplyPreview(preview);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      <div className={clsx(
        "flex-1 flex flex-col transition-all duration-300",
        showParticipants ? "mr-64" : "mr-0"
      )}>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-4">
          {messages.map((message, index) => {
            const isUser = message.sender === 'user';
            const model = selectedModels.find(m => m.id === message.sender);
            const isPending = pendingResponses.has(message.sender);
            const isLastMessageFromModel = lastMessagePerModel.get(message.sender) === index;
            const shouldShowTyping = isPending && isLastMessageFromModel;
            const isModelSelected = model || isUser;

            return (
              <div key={message.id} className={clsx(
                'flex',
                isUser ? 'justify-end' : 'justify-start'
              )}>
                <div className={clsx(
                  'max-w-[80%] rounded-lg p-4 relative',
                  isUser ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-100',
                  !isModelSelected && !isUser && 'opacity-75'
                )}>
                  {message.replyTo && message.replyPreview && (
                    <div className="text-sm opacity-75 pb-2 mb-2 border-b border-gray-700">
                      ↱ {message.replyPreview}
                    </div>
                  )}
                  
                  {!isUser && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-400">
                          @{message.sender.replace(/\s+/g, '_')}
                        </span>
                        {!isModelSelected && (
                          <AlertCircle className="w-4 h-4 text-yellow-400" title="Model no longer selected" />
                        )}
                      </div>
                      {!isPending && isModelSelected && (
                        <button
                          onClick={() => handleReply(message.id, message.text.slice(0, 60) + '...', message.sender)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  <p className="mb-6">{message.text}</p>
                  
                  {!isUser && !isPending && message.responseTime && (
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {message.responseTime.toFixed(1)}s
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicators */}
          {Array.from(pendingResponses).map(modelId => {
            const model = selectedModels.find(m => m.id === modelId);
            if (!model) return null;

            return (
              <div key={`typing-${modelId}`} className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-800 text-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-400">
                      @{model.name.replace(/\s+/g, '_')}
                    </span>
                  </div>
                  <TypingIndicator />
                </div>
              </div>
            );
          })}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          {replyingTo && (
            <div className="mb-2 text-sm text-gray-400 flex items-center gap-2">
              <span>Replying to:</span>
              <span className="text-blue-400">
                @{selectedModels.find(m => m.id === replyingTo)?.name.replace(/\s+/g, '_')}
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyPreview(null);
                }}
                className="text-gray-500 hover:text-gray-400"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || (!replyingTo && selectedModels.length === 0) || (replyingTo && !selectedModels.some(m => m.id === replyingTo))}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Participants Sidebar */}
      <div className={clsx(
        "fixed right-0 top-0 h-full bg-gray-800 border-l border-gray-700 transition-all duration-300 pt-24",
        showParticipants ? "w-64" : "w-0"
      )}>
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="absolute -left-8 top-1/2 -translate-y-1/2 bg-gray-800 text-gray-400 hover:text-gray-300 p-1.5 rounded-l-lg border border-r-0 border-gray-700"
        >
          {showParticipants ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-100">Participants</h3>
          </div>
          <div className="space-y-2">
            {selectedModels.map(model => (
              <div
                key={model.id}
                className="px-3 py-2 bg-gray-700/50 rounded-lg text-sm font-medium text-gray-300"
              >
                @{model.name.replace(/\s+/g, '_')}
              </div>
            ))}
            {selectedModels.length === 0 && (
              <p className="text-sm text-gray-400">
                No models selected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};