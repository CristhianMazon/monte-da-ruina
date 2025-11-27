import React, { useState, useEffect } from "react";
import { useGame, RISK_CARDS, VISUAL_POSITIONS, BET_AMOUNT } from "../context/GameContext";
import { useAuth } from "../context/AuthContext"; 
import CardMonte from "../components/CardMonte";
import VictoryEffect from "../components/VictoryEffect";
import { Flame, Star, Skull, LogOut, ArrowRight } from "lucide-react";

const GameScreen = ({ navigateTo }) => {
    const { balance, simulateRound, commitRound, winStreak } = useGame();
    const { logout } = useAuth(); 
    
    const [selectedRiskId, setSelectedRiskId] = useState('1'); 
    const [selectedPositionId, setSelectedPositionId] = useState(null);
    const [currentBetAmount, setCurrentBetAmount] = useState(BET_AMOUNT);
    
    const [isRevealed, setIsRevealed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [valetePositionId, setValetePositionId] = useState(null);
    const [message, setMessage] = useState("");
    
    // Modais
    const [showGreedModal, setShowGreedModal] = useState(false);
    const [showBankruptcyModal, setShowBankruptcyModal] = useState(false);

    const showVictory = isRevealed && message.includes("VITORIA");

    // --- GATILHO DA FALÊNCIA (Pé na Cova) ---
    useEffect(() => {
        if (!isProcessing && balance < BET_AMOUNT) {
            const timer = setTimeout(() => {
                setShowBankruptcyModal(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowBankruptcyModal(false);
        }
    }, [balance, isProcessing, BET_AMOUNT]);

    // --- GATILHO DA GANÂNCIA (3 Vitórias) ---
    useEffect(() => {
        if (isRevealed && winStreak === 3 && balance >= BET_AMOUNT) {
            const timer = setTimeout(() => {
                setShowGreedModal(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [winStreak, isRevealed, balance]);

    const handleDoubleBet = () => {
        const doubled = currentBetAmount * 2;
        setCurrentBetAmount(Math.min(doubled, balance));
        setShowGreedModal(false);
        resetRound(); 
        setMessage("Aposta Dobrada! Escolha sua carta.");
    };

    const adjustBet = (amount) => {
        if(isRevealed || isProcessing) return;
        if (amount === 'MAX') {
            setCurrentBetAmount(balance);
        } else {
            const newAmount = currentBetAmount + amount;
            setCurrentBetAmount(Math.max(BET_AMOUNT, Math.min(balance, newAmount)));
        }
    };

    const resetRound = () => {
        setIsRevealed(false);
        setValetePositionId(null);
        setSelectedPositionId(null);
        setMessage("");
        setShowGreedModal(false);
    };

    const handlePlay = () => {
        if (!selectedPositionId) {
            setMessage("Selecione uma carta!");
            return;
        }
        if (currentBetAmount < BET_AMOUNT) {
            setMessage(`Aposta mínima é R$ ${BET_AMOUNT.toFixed(2)}`);
            return;
        }
        if (balance < currentBetAmount) {
            setMessage("Saldo insuficiente.");
            return;
        }

        setIsProcessing(true);
        setMessage("");

        // 1. Simula o resultado (Matemática)
        const result = simulateRound(currentBetAmount, selectedRiskId); 

        setTimeout(() => {
            // 2. Define posição visual
            let valetePos;
            if (result.isWin) {
                valetePos = selectedPositionId; 
            } else {
                const losingPositions = VISUAL_POSITIONS.map(p => p.id).filter(id => id !== selectedPositionId);
                valetePos = losingPositions[Math.floor(Math.random() * losingPositions.length)];
            }

            setValetePositionId(valetePos);
            
            // 3. Revela, Toca Som e Atualiza Saldo
            setTimeout(() => {
                setIsRevealed(true); 
                setIsProcessing(false); 
                
                commitRound(result); // Atualiza o dinheiro agora

                const basePath = import.meta.env.BASE_URL; // Garante o caminho do som

                if (result.isWin) {
                    const audio = new Audio(`${basePath}sounds/win.mp3`);
                    audio.volume = 0.4;
                    audio.play().catch(e => console.log("Erro som:", e));
                    
                    setMessage(`VITORIA! +R$${result.payout.toFixed(2)}`);
                } else {
                    const audio = new Audio(`${basePath}sounds/loss.mp3`);
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log("Erro som:", e));
                    
                    setMessage("DERROTA");
                }
            }, 600);
        }, 500);
    };

    // Estilos Visuais
    const betControlBtnStyle = "bg-[#3E2723] hover:bg-[#4E3733] text-[#FBBF24] font-extrabold py-3 px-4 rounded-full border-2 border-[#FBBF24] shadow-md transition-all active:scale-95 text-xl";
    const betControlMfBtnStyle = "bg-[#3E2723] hover:bg-[#4E3733] text-[#FBBF24]/80 font-extrabold py-3 px-4 rounded-full border-2 border-[#FBBF24]/50 shadow-md transition-all active:scale-95 text-xl";

    return (
        <div className="flex flex-col lg:flex-row w-full h-full min-h-[750px] justify-between items-start px-8 gap-4 pb-10 relative">
            
            {showVictory && <VictoryEffect />}

            {/* --- MODAL DE FALÊNCIA (Z-Index 10000) --- */}
            {showBankruptcyModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-[#2a0a0a] border-4 border-red-900 p-10 rounded-3xl max-w-lg w-full text-center relative shadow-[0_0_100px_rgba(220,38,38,0.3)] transform scale-100 animate-in zoom-in-95 duration-500">
                        
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-900 p-6 rounded-full border-4 border-[#2a0a0a] shadow-xl">
                            <Skull className="w-16 h-16 text-red-200 fill-red-950" />
                        </div>

                        <h2 className="text-5xl font-black text-red-600 mt-8 mb-2 uppercase tracking-widest font-serif drop-shadow-md">
                            Fim da Linha!
                        </h2>
                        <p className="text-red-400/80 text-xl font-bold mb-8 uppercase tracking-wide">
                            Saldo Insuficiente
                        </p>

                        <p className="text-gray-300 text-2xl font-serif mb-10 leading-relaxed">
                            Parece que você está com <span className="text-red-500 font-black">um pé na cova</span>, parceiro. 
                            <br/>Seu saldo secou.
                        </p>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => navigateTo('wallet')}
                                className="w-full py-4 bg-[#FBBF24] hover:bg-[#d9a520] text-[#580011] font-black text-2xl rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Ressuscitar (Depositar)
                            </button>
                            
                            <button 
                                onClick={logout}
                                className="w-full py-3 bg-transparent hover:bg-red-900/20 text-red-500/60 hover:text-red-500 font-bold text-lg rounded-xl border-2 border-transparent hover:border-red-900/50 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" /> Aceitar a Derrota (Sair)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DA GANÂNCIA (Z-Index 10000) --- */}
            {showGreedModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#580011] border-4 border-[#FBBF24] p-10 rounded-3xl max-w-lg w-full text-center relative shadow-[0_0_100px_rgba(251,191,36,0.4)] transform scale-100 animate-in zoom-in-95 duration-300">
                        
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#FBBF24] p-4 rounded-full border-4 border-[#580011]">
                            <Flame className="w-12 h-12 text-[#580011] fill-[#580011]" />
                        </div>

                        <h2 className="text-5xl font-black text-[#FBBF24] mt-6 mb-2 uppercase tracking-widest font-serif drop-shadow-md">
                            Maré de Sorte!
                        </h2>
                        <p className="text-[#FBBF24]/80 text-xl font-bold mb-8 uppercase tracking-wide">
                            3 Vitórias Seguidas
                        </p>

                        <p className="text-white text-2xl font-serif mb-8 leading-relaxed">
                            A sorte está sorrindo para você. <br/>
                            Que tal <span className="text-[#3AFF7A] font-black">DOBRAR</span> a aposta para 
                            <br/><span className="text-4xl font-black text-[#FBBF24] block mt-2">R$ {(currentBetAmount * 2).toFixed(2)}?</span>
                        </p>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={handleDoubleBet}
                                className="w-full py-4 bg-[#3AFF7A] hover:bg-[#32d46b] text-[#064e3b] font-black text-2xl rounded-xl shadow-[0_0_20px_rgba(58,255,122,0.6)] uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
                            >
                                Sim, Dobrar Aposta!
                            </button>
                            
                            <button 
                                onClick={() => setShowGreedModal(false)}
                                className="w-full py-3 bg-transparent hover:bg-black/20 text-[#FBBF24]/60 font-bold text-lg rounded-xl border-2 border-transparent hover:border-[#FBBF24]/30 transition-colors uppercase tracking-widest"
                            >
                                Não, sou cauteloso
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ESQUERDA: SELEÇÃO DE RISCO */}
            <div className="w-full lg:w-64 flex flex-col justify-between border-2 border-[#FBBF24] p-5 rounded-3xl bg-black/20 shadow-2xl mt-4 relative z-10 h-[600px]">
                {RISK_CARDS.map((card) => {
                    const isSelected = selectedRiskId === card.id;
                    return (
                        <button
                            key={card.id}
                            onClick={() => !isProcessing && !isRevealed && setSelectedRiskId(card.id)}
                            style={{ 
                                backgroundColor: card.color, 
                                borderColor: isSelected ? '#84cc16' : 'rgba(0,0,0,0.2)', 
                                boxShadow: isSelected 
                                    ? '0 0 20px #84cc16, inset 0 0 10px rgba(0,0,0,0.3)' 
                                    : 'inset 0 0 20px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.5)'
                            }}
                            className={`
                                relative p-4 rounded-xl border-4 transition-all flex flex-col items-center justify-center flex-1 mb-4 last:mb-0
                                text-white text-shadow-sm font-serif
                                ${isSelected ? 'scale-105 z-10' : 'hover:opacity-90 opacity-100'}
                            `}
                        >
                            <Star className="absolute top-2 left-2 w-4 h-4 text-black/40 fill-black/20" />
                            <Star className="absolute top-2 right-2 w-4 h-4 text-black/40 fill-black/20" />
                            <Star className="absolute bottom-2 left-2 w-4 h-4 text-black/40 fill-black/20" />
                            <Star className="absolute bottom-2 right-2 w-4 h-4 text-black/40 fill-black/20" />

                            <span className="font-extrabold text-2xl mb-1 drop-shadow-md tracking-wide">{card.name}</span>
                            <span className="font-black text-5xl drop-shadow-lg">{card.multiplier}x</span>
                        </button>
                    );
                })}
            </div>

            {/* CENTRO: ÁREA DO JOGO */}
            <div className="flex-1 flex flex-col items-center justify-start w-full relative z-10 px-4">
                
                {/* MUDANÇA AQUI: Título ajustado para 5xl e inline-block */}
                <div className="mb-12 mt-4 text-center">
                    <h1 className="text-5xl font-extrabold text-[#FBBF24] tracking-widest drop-shadow-lg uppercase inline-block border-b-4 border-[#FBBF24] pb-2">
                        Monte da Ruína
                    </h1>
                </div>

                <div className="flex justify-center gap-12 w-full px-4 mb-8">
                     {VISUAL_POSITIONS.map((pos) => (
                        <CardMonte
                            key={pos.id}
                            positionId={pos.id}
                            isSelected={selectedPositionId === pos.id}
                            isRevealed={isRevealed}
                            isValete={pos.id === valetePositionId}
                            onClick={() => !isProcessing && !isRevealed && setSelectedPositionId(pos.id)}
                        />
                    ))}
                </div>

                <div className="h-24 flex items-center justify-center w-full">
                    <span className={`font-extrabold text-5xl drop-shadow-md animate-pulse text-center ${message.includes('VITORIA') ? 'text-[#3AFF7A]' : 'text-[#FBBF24]'}`}>
                        {message}
                    </span>
                </div>

                <div className="w-full max-w-lg mt-auto mb-4">
                    {isRevealed ? (
                         <button 
                            onClick={resetRound}
                            className="w-full py-5 bg-stone-600 hover:bg-stone-500 text-white font-extrabold rounded-2xl shadow-2xl border-b-8 border-stone-800 transition-transform active:scale-95 text-3xl uppercase tracking-wider"
                        >
                            JOGAR NOVAMENTE
                        </button>
                    ) : (
                        <button 
                            onClick={handlePlay}
                            disabled={isProcessing || !selectedPositionId}
                            className={`
                                w-full py-5 text-white font-extrabold text-3xl rounded-2xl shadow-2xl border-b-8 transition-transform active:scale-95 uppercase tracking-wider
                                ${!selectedPositionId 
                                    ? 'bg-gray-600 border-gray-800 cursor-not-allowed opacity-50' 
                                    : 'bg-[#4a7c0a] hover:bg-[#5da00d] border-[#3a6308] shadow-[0_0_40px_rgba(74,222,128,0.3)]'}
                            `}
                        >
                            {isProcessing ? 'PROCESSANDO...' : 'CONFIRMAR JOGADA'}
                        </button>
                    )}
                </div>
            </div>

            {/* DIREITA: CONTROLES DE APOSTA */}
            <div className="w-full lg:w-64 flex flex-col justify-between items-center border-2 border-[#FBBF24] p-6 rounded-3xl bg-[#580011] shadow-2xl mt-4 relative z-10 h-[600px]">
                
                <div className="w-full flex flex-col gap-4">
                    <button onClick={() => adjustBet(100)} className={`${betControlBtnStyle} w-full`}>
                        +100
                    </button>

                    <div className="flex gap-2 w-full justify-between">
                        <button onClick={() => adjustBet(1)} className={`${betControlBtnStyle} flex-1`}>
                            +01
                        </button>
                        <button onClick={() => adjustBet(10)} className={`${betControlBtnStyle} flex-1`}>
                            +10
                        </button>
                    </div>
                </div>

                {/* Display do Valor */}
                <div className="w-full bg-[#3E2723] border-4 border-[#FBBF24] rounded-2xl py-6 px-2 text-center shadow-inner shadow-black/50 flex items-center justify-center">
                    <div className="text-4xl font-black text-[#FBBF24] tracking-tight">
                        R$ {Number.isInteger(currentBetAmount) ? currentBetAmount : currentBetAmount.toFixed(2)}
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex gap-2 w-full justify-between">
                        <button onClick={() => adjustBet(-1)} className={`${betControlMfBtnStyle} flex-1`}>
                            -01
                        </button>
                        <button onClick={() => adjustBet(-10)} className={`${betControlMfBtnStyle} flex-1`}>
                            -10
                        </button>
                    </div>

                    <button onClick={() => adjustBet(-100)} className={`${betControlMfBtnStyle} w-full`}>
                        -100
                    </button>

                    <button 
                        onClick={() => adjustBet('MAX')}
                        className="mt-2 w-full bg-[#b91c1c] hover:bg-[#c62828] text-[#FBBF24] font-extrabold py-4 rounded-full border-4 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.6)] uppercase text-lg tracking-widest transition-all active:scale-95"
                    >
                        TUDO OU NADA
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GameScreen;