import React from 'react';
import { useGame } from '../context/GameContext';

const Header = ({ currentView, setCurrentView }) => {
    const { balance } = useGame();
    
    const tabs = [
        { id: 'game', label: 'Início' },
        { id: 'stats', label: 'Estatísticas' },
        { id: 'wallet', label: 'Saque/Depósito' },
        { id: 'support', label: 'Suporte' },
    ];

    return (
        <header className="w-full bg-black/20 border-b border-[#FBBF24]/30 px-6 py-4 mb-6 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Navigation Tabs */}
                <nav className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 justify-center md:justify-start">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentView(tab.id)}
                            className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border
                                ${currentView === tab.id 
                                    ? 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]' 
                                    : 'text-gray-300 hover:text-white border-transparent hover:border-white/20'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Balance & Profile */}
                <div className="flex items-center gap-4 ml-auto">
                    <div className="text-[#FBBF24] font-bold text-lg tracking-wider font-serif">
                        Saldo: R$ {balance.toFixed(2)}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-stone-800 border-2 border-[#FBBF24] flex items-center justify-center shadow-lg overflow-hidden">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Cristhian&backgroundColor=b6e3f4`} alt="User" className="w-full h-full" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;