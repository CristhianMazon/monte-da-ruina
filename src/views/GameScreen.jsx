import React, { useState } from "react";
import { useGame, RISK_CARDS, VISUAL_POSITIONS, BET_AMOUNT } from "../context/GameContext";
import CardMonte from "../components/CardMonte";

const GameScreen = () => {
    const { balance, placeBet } = useGame();
    
    const [selectedRiskId, setSelectedRiskId] = useState('1'); 
    const [selectedPositionId, setSelectedPositionId] = useState(null);
    const [currentBetAmount, setCurrentBetAmount] = useState(BET_AMOUNT);
    
    const [isRevealed, setIsRevealed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [valetePositionId, setValetePositionId] = useState(null);
    const [message, setMessage] = useState("");

    const adjustBet = (amount) => {
        if(isRevealed || isProcessing) return;
        if (amount === 'MAX') {
            setCurrentBetAmount(balance);
        } else {
            const newAmount = currentBetAmount + amount;
            setCurrentBetAmount(Math.max(10, Math.min(balance, newAmount)));
        }
    };

    const resetRound = () => {
        setIsRevealed(false);
        setValetePositionId(null);
        setSelectedPositionId(null);
        setMessage("");
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

        setTimeout(() => {
            const result = placeBet(currentBetAmount, selectedRiskId); 
            
            let valetePos;
            if (result.isWin) {
                valetePos = selectedPositionId; 
            } else {
                const losingPositions = VISUAL_POSITIONS.map(p => p.id).filter(id => id !== selectedPositionId);
                valetePos = losingPositions[Math.floor(Math.random() * losingPositions.length)];
            }

            setValetePositionId(valetePos);
            
            setTimeout(() => {
                setIsRevealed(true); 
                setIsProcessing(false); 
                if(result.isWin) setMessage(`VITORIA! +R$${result.payout.toFixed(2)}`);
                else setMessage("DERROTA");
            }, 600);
        }, 500);
    };

    const betControlBtnStyle = "bg-[#3E2723] hover:bg-[#4E3733] text-[#FBBF24] font-extrabold py-3 px-6 rounded-full border-2 border-[#FBBF24] shadow-md transition-all active:scale-95 text-xl";
    const betControlMfBtnStyle = "bg-[#3E2723] hover:bg-[#4E3733] text-[#FBBF24]/80 font-extrabold py-3 px-6 rounded-full border-2 border-[#FBBF24]/50 shadow-md transition-all active:scale-95 text-xl";

    return (
        // Alterado para ocupar largura total e usar justify-between
        <div className="flex flex-col lg:flex-row w-full max-w-[1800px] justify-between items-center lg:items-start px-4 lg:px-12 gap-6 h-full min-h-[700px]">
            
            {/* ESQUERDA: SELEÇÃO DE RISCO */}
            <div className="w-full lg:w-64 flex flex-col gap-5 border-2 border-[#FBBF24] p-6 rounded-3xl bg-black/20 shadow-2xl mt-8">
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
                                relative p-4 rounded-xl border-4 transition-all flex flex-col items-center justify-center h-40
                                text-white text-shadow-sm font-serif
                                ${isSelected ? 'scale-105 z-10' : 'hover:opacity-90 opacity-100'}
                            `}
                        >
                            <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner"></div>
                            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner"></div>
                            <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner"></div>
                            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner"></div>

                            <span className="font-extrabold text-2xl mb-2 drop-shadow-md tracking-wide">{card.name}</span>
                            <span className="font-black text-5xl drop-shadow-lg">{card.multiplier}x</span>
                        </button>
                    );
                })}
            </div>

            {/* CENTRO: ÁREA DO JOGO (Cartas Maiores) */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl">
                
                <h1 className="text-6xl font-extrabold text-[#FBBF24] border-b-4 border-[#FBBF24] pb-4 px-16 mb-16 tracking-widest drop-shadow-lg uppercase text-center mt-4">
                    Monte da Ruína
                </h1>

                {/* Container das cartas com gap maior */}
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

                <div className="h-20 flex items-center justify-center">
                    <span className="text-[#FBBF24] font-extrabold text-4xl drop-shadow-md animate-pulse">
                        {message}
                    </span>
                </div>

                <div className="w-full max-w-lg mt-8">
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
            <div className="w-full lg:w-72 flex flex-col items-center border-2 border-[#FBBF24] p-8 rounded-3xl bg-[#580011] gap-6 shadow-2xl mt-8">
                
                <button onClick={() => adjustBet(100)} className={betControlBtnStyle}>
                    +100
                </button>

                <div className="flex gap-4 w-full justify-center">
                    <button onClick={() => adjustBet(1)} className={betControlBtnStyle}>
                        +01
                    </button>
                    <button onClick={() => adjustBet(10)} className={betControlBtnStyle}>
                        +10
                    </button>
                </div>

                {/* Display do Valor (Sem texto "Valor da Aposta") */}
                <div className="w-full bg-[#3E2723] border-4 border-[#FBBF24] rounded-2xl py-8 px-4 text-center my-2 shadow-inner shadow-black/50 flex items-center justify-center">
                    <div className="text-5xl font-black text-[#FBBF24] tracking-wider">
                        R$ {Number.isInteger(currentBetAmount) ? currentBetAmount : currentBetAmount.toFixed(2)}
                    </div>
                </div>

                <div className="flex gap-4 w-full justify-center">
                    <button onClick={() => adjustBet(-1)} className={betControlMfBtnStyle}>
                        -01
                    </button>
                    <button onClick={() => adjustBet(-10)} className={betControlMfBtnStyle}>
                        -10
                    </button>
                </div>

                <button onClick={() => adjustBet(-100)} className={`${betControlMfBtnStyle} mb-2`}>
                    -100
                </button>

                <button 
                    onClick={() => adjustBet('MAX')}
                    className="mt-4 w-full bg-[#b91c1c] hover:bg-[#c62828] text-[#FBBF24] font-extrabold py-5 rounded-full border-4 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.6)] uppercase text-2xl tracking-widest transition-all active:scale-95"
                >
                    TUDO OU NADA
                </button>

            </div>
        </div>
    );
};

export default GameScreen;