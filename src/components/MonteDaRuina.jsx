import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Play, RotateCcw, Zap, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import CardMonte from "./CardMonte";
import { useGame, RISK_CARDS, VISUAL_POSITIONS, BET_AMOUNT } from "../context/GameContext";

// Componentes simples (simulação de Shadcn/ui)
const Card = ({ children, className = "" }) => (
    <div className={`bg-neutral-800 text-gray-100 rounded-xl p-6 shadow-2xl ${className}`}>{children}</div>
);
const CardContent = ({ children }) => <>{children}</>;
const Button = ({ children, onClick, className = "", variant = "primary", disabled = false }) => {
    let bgColor = "bg-green-600 hover:bg-green-700";
    if (variant === "secondary") bgColor = "bg-gray-600 hover:bg-gray-700";
    if (variant === "danger") bgColor = "bg-red-600 hover:bg-red-700";
    
    const cursorStyle = disabled ? "cursor-default" : "cursor-pointer";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 font-semibold rounded-lg transition duration-150 ${bgColor} ${
                disabled ? "opacity-50" : ""
            } ${cursorStyle} ${className}`}
        >
            {children}
        </button>
    );
};

const MonteDaRuina = () => {
    const { balance, placeBet, resetGame, bets, ruinCount, round, winStreak, calculateExpectedValue } = useGame();
    
    // Estados do Fluxo
    const [selectedRiskId, setSelectedRiskId] = useState(null);
    const [selectedPositionId, setSelectedPositionId] = useState(null);
    const [message, setMessage] = useState("");
    const [isRevealed, setIsRevealed] = useState(false);
    const [valetePositionId, setValetePositionId] = useState(null);
    
    // Estado da Aposta
    const [currentBetAmount, setCurrentBetAmount] = useState(BET_AMOUNT); 
    const [showGreedPrompt, setShowGreedPrompt] = useState(false);

    const maxBet = balance;
    const currentRiskCard = RISK_CARDS.find(c => c.id === selectedRiskId);

    // Efeito para o Gatilho da Ganância (Acelerador da Ruína)
    useEffect(() => {
        if (winStreak >= 3 && winStreak % 3 === 0 && !isRevealed && balance > 0) {
            setShowGreedPrompt(true);
            setMessage(`🔥 Sequência de ${winStreak} vitórias! A Casa te desafia a aumentar o risco!`);
        } else {
            setShowGreedPrompt(false);
        }
        setCurrentBetAmount(prev => Math.min(prev, maxBet));

    }, [winStreak, isRevealed, maxBet, balance]);

    // Função de Reset Visual da Rodada
    const resetRoundVisuals = () => {
        setSelectedPositionId(null);
        setValetePositionId(null);
        setIsRevealed(false);
        setMessage("");
        setCurrentBetAmount(BET_AMOUNT); // Volta a aposta para 10
    };

    // FASE 1 & 2: Seleção de Risco e Posição
    const handleSelectRisk = (cardId) => {
        if (isRevealed) return;
        setSelectedRiskId(cardId);
    };

    const handleSelectPosition = (positionId) => {
        if (isRevealed) return;
        setSelectedPositionId(positionId);
    };
    
    // FASE 3: Execução da Jogada
    const handleExecuteBet = () => {
        
        if (!currentRiskCard || !selectedPositionId || currentBetAmount <= 0 || currentBetAmount > maxBet) {
            setMessage("🚨 Erro: Selecione Risco e Posição e verifique o valor da aposta.");
            return;
        }
        
        setMessage(`APOSTA TRAVADA: R$ ${currentBetAmount.toFixed(2)}. Revelando o Monte...`);

        // --- LÓGICA DE EXECUÇÃO DA RUÍNA ---
        const result = placeBet(currentBetAmount, selectedRiskId); 

        let valetePos;
        if (result.isWin) {
            valetePos = selectedPositionId; // Força o Valete a estar na carta escolhida se GANHOU
        } else {
            // Força o Valete a estar em uma das outras posições se PERDEU
            const losingPositions = VISUAL_POSITIONS.map(p => p.id).filter(id => id !== selectedPositionId);
            valetePos = losingPositions[Math.floor(Math.random() * losingPositions.length)];
        }

        setValetePositionId(valetePos);
        
        // Revelação das Cartas
        setTimeout(() => {
            setIsRevealed(true);
            setMessage(result.isWin
                ? `🎉 VENCEU! +R$ ${result.payout.toFixed(2)} (${result.card.multiplier}x) na carta ${currentRiskCard.name}.`
                : `💔 PERDEU. -R$ ${result.betAmount.toFixed(2)}. O Valete estava em ${VISUAL_POSITIONS.find(p => p.id === valetePos).name}.`
            );
        }, 800);
    };

    // Gatilho da Ganância (Aumentar Aposta)
    const handleGreedAction = () => {
        const doubledBet = Math.min(currentBetAmount * 2, maxBet);
        setCurrentBetAmount(doubledBet);
        setMessage(`GANÂNCIA ATIVADA! Aposta dobrada para R$ ${doubledBet.toFixed(2)}!`);
        setShowGreedPrompt(false);
    };
    
    // Condição de habilitação do botão EXECUTE
    const canExecute = !!currentRiskCard && !!selectedPositionId && currentBetAmount > 0 && currentBetAmount <= maxBet && !isRevealed;
    const isGameOver = balance === 0;

    if (isGameOver) {
        return (
            <div className="min-h-screen bg-neutral-950 text-gray-100 flex flex-col items-center justify-center p-6">
                <Card className="w-full max-w-lg text-center p-8">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">RUÍNA DO JOGADOR!</h2>
                    <p className="text-xl mb-4">Seu saldo zerou após {round - 1} rodadas.</p>
                    <p className="text-sm font-light italic mb-6">
                        "Mesmo com pequenas vitórias, a longo prazo a probabilidade de falência é quase 100%."
                    </p>
                    <Button onClick={resetGame} variant="danger" className="w-full">
                        <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar Simulação
                    </Button>
                </Card>
            </div>
        );
    }
    
    // Renderização do Painel de Jogo (Lobby/GameScreen)
    return (
        <div className="min-h-screen bg-neutral-950 text-gray-100 flex flex-col items-center justify-start p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-yellow-400">Monte da Ruína Educativo</h1>

            <div className="flex w-full max-w-6xl gap-8">
                
                {/* ===== PAINEL DE JOGO E APOSTA (Esquerda) ===== */}
                <Card className="flex-1 min-w-[500px] p-8">
                    <CardContent>
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Rodada {round} | Saldo: R$ {balance.toFixed(2)}</h2>
                        
                        <p className="text-lg font-light mb-4 text-center text-yellow-400">{message || "Escolha seu risco e posição para começar."}</p>

                        {/* 1. Escolha do Risco (Multiplicador) */}
                        <h3 className="text-xl font-semibold mb-3">1. Nível de Risco (Multiplicador)</h3>
                        <div className="flex gap-4 mb-8 justify-center">
                            {RISK_CARDS.map((card) => (
                                <motion.div
                                    key={card.id}
                                    onClick={() => handleSelectRisk(card.id)}
                                    whileHover={{ scale: 1.05 }}
                                    className={`cursor-pointer w-32 text-center py-4 rounded-lg transition-all border-4 ${
                                        selectedRiskId === card.id ? `border-yellow-400 scale-105` : "border-gray-700 hover:border-gray-500"
                                    } ${isRevealed && 'opacity-50 pointer-events-none'}`}
                                    style={{ backgroundColor: card.color, color: card.id === '3' ? '#000' : '#fff' }}
                                >
                                    <p className="font-bold text-lg">{card.name}</p>
                                    <p className="text-xl font-extrabold mt-1">{card.multiplier}x</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* 2. Escolha da Posição no Monte */}
                        <h3 className="text-xl font-semibold mb-4">2. Escolha a Posição no Monte</h3>
                        <div className="flex justify-center gap-6 mb-8 min-h-[180px]">
                            {VISUAL_POSITIONS.map((pos) => (
                                <CardMonte
                                    key={pos.id}
                                    positionId={pos.id}
                                    isSelected={selectedPositionId === pos.id}
                                    isRevealed={isRevealed}
                                    isValete={pos.id === valetePositionId}
                                    onClick={() => handleSelectPosition(pos.id)}
                                    riskCard={currentRiskCard}
                                />
                            ))}
                        </div>
                        
                        {/* 3. Aposta e Gatilho da Ganância */}
                        {selectedRiskId && (
                            <div className="mb-4 p-4 border-2 border-dashed border-gray-600 rounded-lg">
                                <h4 className="text-lg font-bold mb-3">3. Defina a Aposta (R$):</h4>
                                <div className="flex gap-3 items-center mb-3">
                                    <input
                                        type="number"
                                        value={currentBetAmount.toFixed(2)} 
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setCurrentBetAmount(Math.min(Math.max(0, val || 0), maxBet));
                                        }}
                                        min="0.01"
                                        max={maxBet}
                                        step="0.01"
                                        className="w-24 p-2 rounded bg-neutral-700 text-white border border-gray-600"
                                        disabled={isRevealed}
                                    />
                                    <Button onClick={() => setCurrentBetAmount(Math.min(BET_AMOUNT, maxBet))} disabled={isRevealed}>R${BET_AMOUNT}</Button>
                                    <Button onClick={() => setCurrentBetAmount(maxBet)} variant="danger" disabled={isRevealed}>Tudo ou Nada</Button>
                                </div>
                                {showGreedPrompt && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-yellow-800 p-3 rounded-lg mt-3 flex items-center justify-between"
                                    >
                                        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                                        <p className="text-sm font-semibold">GATILHO DA GANÂNCIA! Multiplique o risco!</p>
                                        <Button onClick={handleGreedAction} variant="danger">
                                            Dobrar Aposta (R$ {(currentBetAmount * 2).toFixed(2)})
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        )}


                        {/* BOTÕES DE AÇÃO PRINCIPAL */}
                        {isRevealed ? (
                            <Button
                                onClick={resetRoundVisuals}
                                variant="secondary"
                                className="w-full text-lg mt-4"
                            >
                                <RotateCcw className="w-5 h-5 mr-2" /> Próxima Rodada ({round})
                            </Button>
                        ) : (
                            <Button
                                onClick={handleExecuteBet}
                                disabled={!canExecute}
                                className={`w-full text-lg mt-4 ${canExecute ? 'bg-green-600 hover:bg-green-700' : 'bg-red-800'} transition-all`}
                            >
                                <Play className="w-5 h-5 mr-2" /> EXECUTAR JOGADA
                            </Button>
                        )}
                        <Button onClick={resetGame} variant="danger" className="mt-2 w-full">
                            Resetar Simulação Total
                        </Button>
                    </CardContent>
                </Card>

                {/* ===== DASHBOARD DE ESTATÍSTICAS (Direita) ===== */}
                <Card className="flex-1 p-8">
                    <CardContent>
                        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Estatísticas da Ruína</h3>
                        
                        {/* Tabela de House Edge */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-2 flex items-center"><TrendingDown className="w-4 h-4 mr-2 text-red-500"/> Vantagem Estrutural da Casa (House Edge)</h4>
                            <div className="bg-neutral-700 p-4 rounded-lg">
                                {RISK_CARDS.map(card => (
                                    <div key={card.id} className="flex justify-between text-sm py-1 border-b border-gray-600 last:border-b-0">
                                        <span className="font-semibold" style={{ color: card.color }}>{card.name} ({card.multiplier}x):</span>
                                        <span className="text-gray-400">
                                            Chance WIN: {(card.winChance * 100).toFixed(1)}% | 
                                            EV: <span className={calculateExpectedValue(card) < 0 ? 'text-red-400' : 'text-green-400'}>
                                                {calculateExpectedValue(card).toFixed(2)}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                                <p className="text-xs mt-2 text-gray-400">EV (Valor Esperado) negativo comprova a inevitabilidade da Ruína.</p>
                            </div>
                        </div>

                        <p className="mb-2">Ruínas (Simulações de Falência): {ruinCount}</p>
                        
                        {/* Gráfico de Saldo */}
                        <h4 className="text-lg font-semibold mb-2 mt-4 border-t border-gray-700 pt-4">Evolução do Saldo (Capital Finito)</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={bets}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="round" stroke="#888" tickFormatter={(t) => t.toString()} />
                                <YAxis domain={[0, 200]} stroke="#888" /> 
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                                    formatter={(value, name) => [`R$ ${value.toFixed(2)}`, name === 'balance' ? 'Saldo' : 'Rodada']}
                                />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="balance" 
                                    stroke="#4ade80" 
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        <h4 className="text-lg font-semibold mb-2 mt-4 border-t border-gray-700 pt-4">Histórico Recente</h4>
                        <div className="max-h-40 overflow-y-auto bg-neutral-700 p-3 rounded-lg text-sm">
                            {bets.slice().reverse().filter(b => b.round > 0).map((bet, index) => (
                                <div key={index} className="flex justify-between py-1 border-b border-gray-600 last:border-b-0">
                                    <span className="font-light">Rodada {bet.round}:</span>
                                    <span className={bet.balance > bets[bet.round - 1].balance ? 'text-green-400' : 'text-red-400'}>
                                        Saldo: R$ {bet.balance.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MonteDaRuina;