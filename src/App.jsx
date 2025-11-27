import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import Header from './components/Header';
import GameScreen from './views/GameScreen';
import StatsScreen from './views/StatsScreen';
import SupportScreen from './views/SupportScreen';
import WalletScreen from './views/WalletScreen';

function App() {
  const [currentView, setCurrentView] = useState('game');

  const renderView = () => {
      switch(currentView) {
          case 'game': return <GameScreen />;
          case 'stats': return <StatsScreen />;
          case 'support': return <SupportScreen />;
          case 'wallet': return <WalletScreen />;
          default: return <GameScreen />;
      }
  }

  return (
    <GameProvider>
      {/* Alterei 'font-sans' para 'font-serif' para herdar a Abhaya Libre.
          Adicionei 'font-bold' globalmente para dar aquele peso extra que você pediu,
          mas nos títulos usaremos 'font-extrabold'.
      */}
      <div className="min-h-screen bg-[#580011] text-gray-100 font-serif font-bold selection:bg-[#FBBF24] selection:text-[#580011]">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="container mx-auto px-4 pb-12 flex justify-center w-full">
             {renderView()}
        </main>
      </div>
    </GameProvider>
  );
}

export default App;