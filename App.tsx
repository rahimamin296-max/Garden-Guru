
import React, { useState } from 'react';
import Header from './components/Header';
import PlantIdentifier from './components/PlantIdentifier';
import ChatBot from './components/ChatBot';
import { Message } from './types';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const handleNewAnalysis = (plantInfo: string) => {
    const newMessages: Message[] = [
      ...chatHistory,
      { role: 'model', text: `Here is the analysis for your plant:\n\n${plantInfo}` }
    ];
    setChatHistory(newMessages);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />
        <main className="space-y-12">
          <PlantIdentifier onAnalysisComplete={handleNewAnalysis} />
          <ChatBot history={chatHistory} setHistory={setChatHistory} />
        </main>
      </div>
      <footer className="text-center text-gray-500 mt-12 text-sm">
        <p>&copy; 2024 Garden Guru. Nurturing your green thumb with AI.</p>
      </footer>
    </div>
  );
};

export default App;
