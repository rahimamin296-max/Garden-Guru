
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToBot } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';
import { PlantIcon } from './icons/PlantIcon';

interface ChatBotProps {
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBot: React.FC<ChatBotProps> = ({ history, setHistory }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: inputMessage };
    setHistory(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponseText = await sendMessageToBot(history, inputMessage);
      const botMessage: Message = { role: 'model', text: botResponseText };
      setHistory(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-500/20">
      <h2 className="text-2xl font-semibold mb-4 text-green-300">Chat with Guru</h2>
      <div className="h-96 bg-gray-900/50 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto">
        {history.length === 0 && (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <PlantIcon className="w-16 h-16 mb-4" />
            <p>Ask me anything about your plants!</p>
            <p className="text-sm">e.g., "How do I prune my rose bush?"</p>
          </div>
        )}
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <div
                  className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a gardening question..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </section>
  );
};

export default ChatBot;
