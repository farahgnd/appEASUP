
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { useHealthData } from '../context/HealthDataContext';
import { getCoachResponse } from '../services/geminiService';
import { Send, Bot } from 'lucide-react';

const CoachScreen: React.FC = () => {
  const { healthData, condition } = useHealthData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm the EASUP AI, your personal health coach. How are you feeling today, or what's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getCoachResponse([], userMessage.text as string, healthData, condition);
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col relative z-10">
      <header className="p-4 bg-gray-900/50 backdrop-blur-lg border-b border-green-400/20 sticky top-0 z-20">
        <h1 className="text-xl font-orbitron text-center text-green-300">EASUP Coach</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500 flex-shrink-0">
                <Bot size={20} className="text-green-400" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                 <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500 flex-shrink-0">
                    <Bot size={20} className="text-green-400" />
                </div>
                 <div className="max-w-xs p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900/50 backdrop-blur-lg border-t border-green-400/20">
        <div className="flex items-center gap-2 bg-gray-800 rounded-full p-1 border border-gray-600 focus-within:border-green-400 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask EASUP AI anything..."
            className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 disabled:bg-gray-600 flex items-center justify-center transition-all transform disabled:scale-100 active:scale-90">
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachScreen;