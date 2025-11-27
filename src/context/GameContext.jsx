import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

const INITIAL_BALANCE = 100.0;
export const BET_AMOUNT = 10;

export const RISK_CARDS = [
    { id: '1', name: 'Bronze', multiplier: 1.5, winChance: 0.40, color: '#cd7f32', theme: 'Risco Baixo' }, 
    { id: '2', name: 'Prata', multiplier: 3, winChance: 0.20, color: '#c0c0c0', theme: 'Risco Médio' }, 
    { id: '3', name: 'Ouro', multiplier: 10, winChance: 0.05, color: '#FFD700', theme: 'Risco Alto' }, 
];

export const VISUAL_POSITIONS = [
    { id: 'L', name: 'Esquerda' },
    { id: 'M', name: 'Meio' },
    { id: 'R', name: 'Direita' }
];

export const calculateExpectedValue = (card) => {
    const profit = card.multiplier - 1;
    const loss = 1;
    return (card.winChance * profit) - ((1 - card.winChance) * loss);
};

export const GameProvider = ({ children }) => {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    // CORRIGIDO AQUI (removido o "ZS")
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

        if (newBalance === 0) setRuinCount(prev => prev + 1);

        return { isWin, card, payout, newBalance, betAmount };
    }, [balance, winStreak]);

    const resetGame = () => {
        setBalance(INITIAL_BALANCE);
        setBets([{ round: 0, balance: INITIAL_BALANCE }]);
        setRound(1);
        setRuinCount(0);
        setWinStreak(0);
    };

    const deposit = useCallback((amount) => {
        const integerAmount = Math.floor(amount); 
        if (integerAmount > 0) {
            setBalance(prev => prev + integerAmount);
            setBets(prev => {
                const lastBet = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...lastBet, balance: lastBet.balance + integerAmount }];
            });
        }
    }, []);

    const withdraw = useCallback((amount) => {
        if (amount > 0 && balance >= amount) {
            setBalance(prev => prev - amount);
            setBets(prev => {
                const lastBet = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...lastBet, balance: lastBet.balance - amount }];
            });
            return true;
        }
        return false;
    }, [balance]);

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
        withdraw,
        calculateExpectedValue,
    }), [balance, bets, ruinCount, round, winStreak, processBet, deposit, withdraw]);

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};