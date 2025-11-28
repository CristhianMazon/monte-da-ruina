import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import FooterAds from './components/FooterAds';
import GameScreen from './views/GameScreen';
import StatsScreen from './views/StatsScreen';
import SupportScreen from './views/SupportScreen';
import WalletScreen from './views/WalletScreen';
import LoginScreen from './views/LoginScreen';

const MainApp = () => {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('game');

    if (!user) {
        return (
            <div style={{ zoom: '0.7' }} className="w-full h-full">
                <LoginScreen />
            </div>
        );
    }

    const renderView = () => {
        switch(currentView) {
            case 'game': return <GameScreen navigateTo={setCurrentView} />;
            case 'stats': return <StatsScreen />;
            case 'support': return <SupportScreen />;
            case 'wallet': return <WalletScreen />;
            default: return <GameScreen navigateTo={setCurrentView} />;
        }
    }

    return (
        <GameProvider>
            <div 
                style={{ zoom: '0.7' }} 
                className="min-h-screen bg-[#580011] text-gray-100 font-serif font-bold selection:bg-[#FBBF24] selection:text-[#580011] flex flex-col relative overflow-x-hidden"
            >
                <Header currentView={currentView} setCurrentView={setCurrentView} />
                
                <main className="container mx-auto px-4 pb-32 flex justify-center w-full flex-1">
                     {renderView()}
                </main>

                {/* Passando a navegação para o Footer (para o vírus usar) */}
                <FooterAds navigateTo={setCurrentView} />
            </div>
        </GameProvider>
    );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;