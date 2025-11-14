import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Play, RotateCcw, Zap, TrendingDown, Gavel, HandCoins, DollarSign, Loader2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import CardMonte from "./CardMonte";
import { useGame, RISK_CARDS, VISUAL_POSITIONS, BET_AMOUNT } from "../context/GameContext";

// Componentes simples (simulação de Shadcn/ui) - ESTILO WESTERN
const Card = ({ children, className = "" }) => (
    // NOVO: Altera a cor da borda principal para o Ouro Antigo (amber-400)
    <div className={`bg-stone-800 text-gray-100 rounded-lg p-6 shadow-2xl border-4 border-amber-400 ${className}`}>{children}</div>
);
const CardContent = ({ children }) => <>{children}</>;
// Componente Button com animação e estilo Western
const Button = ({ children, onClick, className = "", variant = "primary", disabled = false }) => {
    // Cores Western/Ruína
    let bgColor = "bg-lime-700 hover:bg-lime-600"; // Primary: Verde Musgo/Esperança
    if (variant === "secondary") bgColor = "bg-stone-600 hover:bg-stone-700"; // Secondary: Pedra/Cinza escuro
    if (variant === "danger") bgColor = "bg-red-800 hover:bg-red-700"; // Danger: Vermelho Queimado/Tijolo
    
    const cursorStyle = disabled ? "cursor-default" : "cursor-pointer";

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }} 
            whileTap={{ scale: disabled ? 1 : 0.98 }} 
            className={`px-4 py-2 font-semibold rounded transition duration-150 ${bgColor} ${
                disabled ? "opacity-50" : ""
            } ${cursorStyle} ${className}`}
        >
            {children}
        </motion.button>
    );
};

// Variantes de animação para as mensagens
const messageVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } },
    exit: { opacity: 0, y: 10 }
};

const MonteDaRuina = () => {
    // ADICIONANDO 'deposit' ao useGame
    const { balance, placeBet, resetGame, bets, ruinCount, round, winStreak, calculateExpectedValue, deposit } = useGame();
    
    // Estados do Fluxo
    const [selectedRiskId, setSelectedRiskId] = useState(null);
    const [selectedPositionId, setSelectedPositionId] = useState(null);
    const [message, setMessage] = useState("");
    const [isRevealed, setIsRevealed] = useState(false);
    const [valetePositionId, setValetePositionId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // Estado para processamento
    
    // Estado da Aposta
    const MIN_BET = BET_AMOUNT; // R$10.00 como novo valor mínimo
    const [currentBetAmount, setCurrentBetAmount] = useState(MIN_BET); // Inicia com o mínimo
    const [showGreedPrompt, setShowGreedPrompt] = useState(false);
    
    // NOVO: Estado para o valor de depósito (valor inicial de 50 para conveniência)
    const [depositAmount, setDepositAmount] = useState(50); 


    const maxBet = balance;
    const currentRiskCard = RISK_CARDS.find(c => c.id === selectedRiskId);

    // Mapeamento das cores de brilho para os cards de risco
    const getRiskShadowColor = (cardId) => {
        switch (cardId) {
            case '1': return '#cd7f32'; // Bronze
            case '2': return '#c0c0c0'; // Prata
            case '3': return '#FFD700'; // Ouro
            default: return 'transparent';
        }
    };
    
    // NOVO: Lógica para executar o depósito
    const handleDeposit = () => {
        if (depositAmount <= 0) {
            setMessage("O valor de depósito deve ser positivo e inteiro.");
            return;
        }
        deposit(depositAmount);
        setMessage(`✅ Depósito de R$${depositAmount.toFixed(2)} adicionado!`);
        setDepositAmount(50); // Reseta o valor do campo
    };
    
    // Função para ajustar o valor da aposta com botões rápidos
    const handleAdjustBet = (amount) => {
        if (isRevealed || isProcessing) return;
        
        let newAmount = currentBetAmount + amount;
        
        // Garante que o valor respeite os limites (min BET_AMOUNT, max maxBet)
        newAmount = Math.min(Math.max(MIN_BET, newAmount), maxBet);
        
        // Arredonda para 2 casas decimais
        newAmount = parseFloat(newAmount.toFixed(2));
        
        setCurrentBetAmount(newAmount);
    };

    // Efeito para o Gatilho da Ganância (Mantido)
    useEffect(() => {
        if (winStreak >= 3 && winStreak % 3 === 0 && !isRevealed && balance > 0) {
            setShowGreedPrompt(true);
            setMessage(`🔥 Sequência de ${winStreak} vitórias! A Casa te desafia a aumentar o risco!`);
        } else {
            setShowGreedPrompt(false);
        }
        // Garante que a aposta atual seja no mínimo MIN_BET (R$10)
        setCurrentBetAmount(prev => Math.min(Math.max(MIN_BET, prev), maxBet)); 

    }, [winStreak, isRevealed, maxBet, balance]);

    // Função de Reset Visual da Rodada (Mantida)
    const resetRoundVisuals = () => {
        setSelectedPositionId(null);
        setValetePositionId(null);
        setIsRevealed(false);
        setMessage("");
        setCurrentBetAmount(MIN_BET); // Volta a aposta para o mínimo (R$10)
    };

    // FASE 1 & 2: Seleção de Risco e Posição (Mantidas)
    const handleSelectRisk = (cardId) => {
        if (isRevealed || isProcessing) return;
        setSelectedRiskId(cardId);
    };

    const handleSelectPosition = (positionId) => {
        if (isRevealed || isProcessing) return;
        setSelectedPositionId(positionId);
    };
    
    // FASE 3: Execução da Jogada (Lógica de timing corrigida)
    const handleExecuteBet = () => {
        
        if (!currentRiskCard || !selectedPositionId || currentBetAmount < MIN_BET || currentBetAmount > maxBet) { // Verifica se aposta é no mínimo R$10
            setMessage(`🚨 Erro: Selecione Risco e Posição e a aposta mínima é de R$${MIN_BET.toFixed(2)}.`);
            return;
        }
        
        setIsProcessing(true); // Bloqueia inputs
        setMessage(`APOSTA TRAVADA: R$ ${currentBetAmount.toFixed(2)}. Revelando o Monte...`);

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
            
            // Ativa isRevealed após 850ms (tempo de flip + buffer)
            setTimeout(() => {
                setIsRevealed(true); 
                setIsProcessing(false); 
                setMessage(result.isWin
                    ? `🎉 VENCEU! +R$ ${result.payout.toFixed(2)} (${result.card.multiplier}x) na carta ${currentRiskCard.name}.`
                    : `💔 PERDEU. -R$ ${result.betAmount.toFixed(2)}. O Valete estava em ${VISUAL_POSITIONS.find(p => p.id === valetePos).name}.`
                );
            }, 850); 
        }, 500); 
    };

    // ... (handleGreedAction e canExecute permanecem iguais)
    const handleGreedAction = () => {
        const doubledBet = Math.min(currentBetAmount * 2, maxBet);
        setCurrentBetAmount(doubledBet);
        setMessage(`GANÂNCIA ATIVADA! Aposta dobrada para R$ ${doubledBet.toFixed(2)}!`);
        setShowGreedPrompt(false);
    };

    const canExecute = !!currentRiskCard && !!selectedPositionId && currentBetAmount >= MIN_BET && currentBetAmount <= maxBet && !isRevealed && !isProcessing;
    const isGameOver = balance < MIN_BET; // Fim de jogo se o saldo for menor que a aposta mínima

    if (isGameOver) {
        return (
            <div className="min-h-screen bg-amber-950/70 text-gray-100 flex flex-col items-center justify-center p-6">
                <Card className="w-full max-w-lg text-center p-8">
                    <h2 className="text-3xl font-bold text-red-500 mb-4 font-cinzel">CAPITAL INSUFICIENTE!</h2>
                    <p className="text-xl mb-4">Seu saldo (R$ {balance.toFixed(2)}) está abaixo da aposta mínima (R$ {MIN_BET.toFixed(2)}).</p>
                    <p className="text-sm font-light italic mb-6 font-crete">
                        "O limite do capital é o limite do risco."
                    </p>
                    {/* Botão de Depósito no Game Over */}
                    <Button onClick={() => deposit(50)} variant="secondary" className="w-full bg-amber-600 hover:bg-amber-500 mb-2">
                        Depositar R$50
                    </Button>
                    <Button onClick={resetGame} variant="danger" className="w-full">
                        <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar Simulação
                    </Button>
                </Card>
            </div>
        );
    }

    // Renderização do Painel de Jogo (Lobby/GameScreen)
    return (
        // CONTÊINER PRINCIPAL: w-full e sem padding lateral fixo para não forçar o overflow
        <div className="min-h-screen bg-amber-950/70 text-gray-100 flex flex-col items-center justify-start w-full">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                // Adicionado mt-6 para espaçamento superior, já que removemos p-6 do container
                className="text-4xl font-extrabold mt-6 mb-8 text-amber-400 font-cinzel tracking-widest"
            >
                <Gavel className="inline w-6 h-6 mb-1 mr-2"/> Monte da Ruína Educativo
            </motion.h1>

            {/* CONTÊINER DE COLUNAS: 
                flex-col (stack) em telas menores, lg:flex-row (side-by-side) em telas grandes.
                Adiciona padding horizontal responsivo (px-4) para respeitar as bordas da tela.
            */}
            <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8 mx-auto px-4 pb-6">
                
                {/* ===== PAINEL DE JOGO E APOSTA (Esquerda) ===== */}
                <Card className="flex-1 p-8">
                    <CardContent>
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2 flex items-center">
                            <HandCoins className="w-5 h-5 mr-2 text-amber-400"/> Rodada {round} | Saldo: R$ {balance.toFixed(2)}
                        </h2>
                        
                        {/* NOVO: Bloco de Depósito Livre */}
                        <div className="mb-4 p-4 border-4 border-dashed border-stone-700 rounded-lg bg-stone-700/30"> 
                            <h4 className="text-lg font-bold mb-3 flex items-center text-amber-400">
                                <PlusCircle className="w-5 h-5 mr-2"/> Depósito Rápido (Apenas Inteiros):
                            </h4>
                            <div className="flex gap-3 items-center">
                                <span className="text-xl font-bold text-gray-400">R$</span>
                                <input
                                    type="number"
                                    value={depositAmount} 
                                    onChange={(e) => {
                                        // Garante que o valor seja inteiro e no mínimo 1
                                        const val = Math.floor(parseFloat(e.target.value));
                                        setDepositAmount(Math.max(1, val || 0));
                                    }}
                                    min="1"
                                    step="1" // Garante que as setas avancem em números inteiros
                                    className="flex-1 p-2 rounded bg-stone-700 text-white border border-gray-600 text-center font-bold appearance-none"
                                />
                                <Button onClick={handleDeposit} variant="primary" className="bg-amber-600 hover:bg-amber-500">
                                    Depositar
                                </Button>
                            </div>
                        </div>
                        
                        <motion.p
                            key={message}
                            variants={messageVariants}
                            initial="initial"
                            animate="animate"
                            className="text-lg font-light mb-4 text-center text-amber-400 font-crete"
                        >
                            {message || `Aposta mínima: R$${MIN_BET.toFixed(2)}. Escolha seu risco e posição.`}
                        </motion.p>

                        {/* 1. Escolha do Risco (Multiplicador) */}
                        <h3 className="text-xl font-semibold mb-3 border-t border-gray-700 pt-3">1. Nível de Risco (Multiplicador)</h3>
                        <div className="flex gap-4 mb-8 justify-center">
                            {RISK_CARDS.map((card) => (
                                <motion.div
                                    key={card.id}
                                    onClick={() => handleSelectRisk(card.id)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`cursor-pointer w-32 text-center py-4 rounded-lg transition-all border-4 ${
                                        selectedRiskId === card.id ? `scale-105` : "border-stone-600 hover:border-stone-400"
                                    } ${(isRevealed || isProcessing) && 'opacity-50 pointer-events-none'} shadow-lg`}
                                    // APLICAÇÃO DO BRILHO TEMÁTICO
                                    style={{ 
                                        backgroundColor: card.color, 
                                        color: card.id === '3' ? '#000' : '#fff',
                                        borderColor: getRiskShadowColor(card.id),
                                        boxShadow: selectedRiskId === card.id 
                                            ? `0 0 20px ${getRiskShadowColor(card.id)}, 0 0 5px ${getRiskShadowColor(card.id)} inset` 
                                            : '0 4px 6px rgba(0, 0, 0, 0.5)'
                                    }}
                                >
                                    <p className="font-bold text-lg">{card.name}</p>
                                    <p className="text-xl font-extrabold mt-1">{card.multiplier}x</p>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* 2. Escolha da Posição no Monte (Usa CardMonte.jsx com destaque) */}
                        <h3 className="text-xl font-semibold mb-4 border-t border-gray-700 pt-3">2. Escolha a Posição no Monte</h3>
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
                            <div className="mb-4 p-4 border-4 border-dashed border-amber-950 rounded-lg bg-stone-700/50"> 
                                <h4 className="text-lg font-bold mb-3 flex items-center"><DollarSign className="w-4 h-4 mr-2"/> 3. Defina a Aposta (R$):</h4>
                                {/* CONTROLE DE APOSTA */}
                                <div className="flex gap-2 items-center mb-3 flex-wrap justify-center sm:justify-start">
                                    
                                    {/* Botões de Decremento Rápido */}
                                    <Button onClick={() => handleAdjustBet(-10)} disabled={isRevealed || isProcessing || currentBetAmount <= MIN_BET + 9.99} variant="secondary" className="w-12 h-8 p-1 text-sm font-bold">-10</Button>
                                    <Button onClick={() => handleAdjustBet(-1)} disabled={isRevealed || isProcessing || currentBetAmount <= MIN_BET} variant="secondary" className="w-12 h-8 p-1 text-sm font-bold">-1</Button>
                                    
                                    {/* Input Field - Mínimo R$10.00 */}
                                    <input
                                        type="number"
                                        value={currentBetAmount.toFixed(2)} 
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setCurrentBetAmount(Math.min(Math.max(MIN_BET, val || 0), maxBet));
                                        }}
                                        min={MIN_BET} // Mínimo R$10.00
                                        max={maxBet}
                                        className="w-24 p-2 rounded bg-stone-700 text-white border border-gray-600 text-center"
                                        disabled={isRevealed || isProcessing}
                                    />
                                    
                                    {/* Botões de Incremento Rápido */}
                                    <Button onClick={() => handleAdjustBet(1)} disabled={isRevealed || isProcessing || currentBetAmount >= maxBet} variant="secondary" className="w-12 h-8 p-1 text-sm font-bold">+1</Button>
                                    <Button onClick={() => handleAdjustBet(10)} disabled={isRevealed || isProcessing || currentBetAmount >= maxBet - 9.99} variant="secondary" className="w-12 h-8 p-1 text-sm font-bold">+10</Button>
                                    
                                    {/* Botões de Aposta Predefinida */}
                                    <Button onClick={() => setCurrentBetAmount(Math.min(MIN_BET, maxBet))} disabled={isRevealed || isProcessing} variant="secondary">R${MIN_BET}</Button>
                                    <Button onClick={() => setCurrentBetAmount(maxBet)} variant="danger" disabled={isRevealed || isProcessing}>Tudo ou Nada</Button>
                                </div>
                                {showGreedPrompt && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-900 p-3 rounded-lg mt-3 flex items-center justify-between"
                                    >
                                        <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                                        <p className="text-sm font-semibold">GATILHO DA GANÂNCIA! Multiplique o risco!</p>
                                        <Button onClick={handleGreedAction} variant="secondary" className="bg-amber-400 text-stone-900 hover:bg-amber-300">
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
                                disabled={!canExecute || isProcessing}
                                className={`w-full text-lg mt-4 ${canExecute ? 'bg-lime-700 hover:bg-lime-600' : 'bg-red-900/70'} transition-all`}
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Play className="w-5 h-5 mr-2" />
                                )}
                                {isProcessing ? "PROCESSANDO..." : "EXECUTAR JOGADA"}
                            </Button>
                        )}
                        <Button onClick={resetGame} variant="danger" className="mt-2 w-full">
                            Resetar Simulação Total
                        </Button>
                    </CardContent>
                </Card>

                {/* ===== DASHBOARD DE ESTATÍSTICAS (Direita) - Mantido ===== */}
                <Card className="flex-1 p-8">
                   <CardContent>
                        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Estatísticas da Ruína</h3>
                        
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-2 flex items-center"><TrendingDown className="w-4 h-4 mr-2 text-red-500"/> Vantagem Estrutural da Casa (House Edge)</h4>
                            <div className="bg-neutral-700 p-4 rounded-lg">
                                {RISK_CARDS.map(card => (
                                    <div key={card.id} className="flex justify-between py-1 border-b border-gray-600 last:border-b-0">
                                        <span className="font-semibold" style={{ color: card.color }}>{card.name} ({card.multiplier}x):</span>
                                        <span className="text-gray-400">
                                            Chance WIN: {(card.winChance * 100).toFixed(1)}% | 
                                            EV: <span className={calculateExpectedValue(card) < 0 ? 'text-red-400' : 'text-green-400'}>
                                                {calculateExpectedValue(card).toFixed(2)}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                                <p className="text-xs mt-2 text-gray-400 font-crete">EV (Valor Esperado) negativo comprova a inevitabilidade da Ruína.</p>
                            </div>
                        </div>

                        <p className="mb-2">Ruínas (Simulações de Falência): {ruinCount}</p>
                        
                        <h4 className="text-lg font-semibold mb-2 mt-4 border-t border-gray-700 pt-4">Evolução do Saldo (Capital Finito)</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={bets}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                                <XAxis dataKey="round" stroke="#888" tickFormatter={(t) => t.toString()} />
                                <YAxis domain={[0, 'auto']} stroke="#888" /> 
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#3e2723', border: '1px solid #777' }} 
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