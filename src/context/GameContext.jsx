import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

const INITIAL_BALANCE = 100.0;
export const BET_AMOUNT = 10;

// Definição das Cartas de Risco (Probabilidade enviesada: House Edge)
export const RISK_CARDS = [
    // Bronze: Risco Baixo (Multiplicador baixo, mas EV negativo)
    // Chance WIN: 40%
    { id: '1', name: 'Bronze', multiplier: 1.5, winChance: 0.40, color: '#cd7f32', theme: 'Risco Baixo' },
    // Prata: Risco Médio
    // Chance WIN: 20%
    { id: '2', name: 'Prata', multiplier: 3, winChance: 0.20, color: '#c0c0c0', theme: 'Risco Médio' },
    // Ouro: Risco Alto (Ganância, Multiplicador alto, EV mais negativo)
    // Chance WIN: 5%
    { id: '3', name: 'Ouro', multiplier: 10, winChance: 0.05, color: '#FFD700', theme: 'Risco Alto' },
];

// Posições visuais do Monte
export const VISUAL_POSITIONS = [
    { id: 'L', name: 'Esquerda' },
    { id: 'M', name: 'Meio' },
    { id: 'R', name: 'Direita' }
];

export const calculateExpectedValue = (card) => {
    const profit = card.multiplier - 1;
    const loss = 1;
    // EV = (Prob Ganhar * Lucro) - (Prob Perder * Perda)
    const ev = (card.winChance * profit) - ((1 - card.winChance) * loss);
    return ev;
};

export const GameProvider = ({ children }) => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [bets, setBets] = useState([{ round: 0, balance: INITIAL_BALANCE }]);
    const [ruinCount, setRuinCount] = useState(0);
    const [round, setRound] = useState(1);
    const [winStreak, setWinStreak] = useState(0);

    const processBet = useCallback((betAmount, cardId) => {
        const card = RISK_CARDS.find(c => c.id === cardId);
        if (!card || balance < betAmount) return { error: "Erro de aposta ou saldo." };

        const isWin = Math.random() < card.winChance;

        let newBalance = balance;
        let payout = 0;
        let result = 'LOSS';
        let newWinStreak = 0;

        if (isWin) {
            payout = betAmount * (card.multiplier - 1);
            newBalance += payout;
            result = 'WIN';
            newWinStreak = winStreak + 1;
        } else {
            newBalance -= betAmount;
            newWinStreak = 0;
        }

        newBalance = Math.max(0, newBalance);

        setBalance(newBalance);
        setWinStreak(newWinStreak);
        setRound(prev => prev + 1);
        setBets(prev => [...prev, { round: prev.length, balance: newBalance }]);

        if (newBalance === 0) {
            setRuinCount(prev => prev + 1);
        }

        return { isWin, card, payout, newBalance, betAmount };
    }, [balance, winStreak]);

    const resetGame = () => {
        setBalance(INITIAL_BALANCE);
        setBets([{ round: 0, balance: INITIAL_BALANCE }]);
        setRound(1);
        setRuinCount(0);
        setWinStreak(0);
    };

    // NOVO: Função para adicionar saldo (simulação de depósito)
    const deposit = useCallback((amount) => {
        // Garante que apenas o valor inteiro seja depositado
        const integerAmount = Math.floor(amount); 
        if (integerAmount > 0) {
            setBalance(prev => prev + integerAmount);
            // Atualiza o último registro no histórico de apostas
            setBets(prev => {
                const lastBet = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...lastBet, balance: lastBet.balance + integerAmount }];
            });
        }
    }, []);


    const contextValue = useMemo(() => ({
        balance,
        bets,
        ruinCount,
        round,
        winStreak,
        RISK_CARDS,
        VISUAL_POSITIONS,
        placeBet: processBet, 
        resetGame,
        deposit,
        calculateExpectedValue,
    }), [balance, bets, ruinCount, round, winStreak, processBet, deposit]);

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};