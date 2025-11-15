
import React, { useState } from 'react';
// Fix: TabID is not exported from './constants'. It should be imported from './types'.
import { TABS } from './constants';
import { TabID } from './types';
import AnalyzeImage from './components/AnalyzeImage';
import EditImage from './components/EditImage';
import GenerateImage from './components/GenerateImage';
import TabButton from './components/TabButton';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>(TabID.Analyze);

  const renderContent = () => {
    switch (activeTab) {
      case TabID.Analyze:
        return <AnalyzeImage />;
      case TabID.Edit:
        return <EditImage />;
      case TabID.Generate:
        return <GenerateImage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini Image Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">Analyze, Edit, and Generate images with AI.</p>
        </header>

        <div className="flex justify-center border-b border-gray-700 mb-6">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
