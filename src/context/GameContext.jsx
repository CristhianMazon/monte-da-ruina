import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "./AuthContext";

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

const INITIAL_BALANCE = 100.0;
export const BET_AMOUNT = 10;

export const RISK_CARDS = [
    { id: '1', name: 'Bronze', multiplier: 1.5, winChance: 0.40, color: '#cd7f32', theme: 'Risco Baixo' }, 
    { id: '2', name: 'Prata', multiplier: 3, winChance: 0.20, color: '#c0c0c0', theme: 'Risco Médio' }, 
    { id: '3', name: 'Ouro', multiplier: 10, winChance: 0.05, color: '#FBBF24', theme: 'Risco Alto' }, 
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
    const { user } = useAuth();
    
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [bets, setBets] = useState([]);
    const [ruinCount, setRuinCount] = useState(0);
    const [round, setRound] = useState(1);
    const [winStreak, setWinStreak] = useState(0);

    // Carregar saldo ao trocar de usuário
    useEffect(() => {
        if (user && user.name) {
            const userKey = `monte_ruina_balance_${user.name}`;
            const savedBalance = localStorage.getItem(userKey);

            if (savedBalance) {
                const val = parseFloat(savedBalance);
                setBalance(val);
                setBets([{ round: 0, balance: val }]); 
            } else {
                setBalance(INITIAL_BALANCE);
                setBets([{ round: 0, balance: INITIAL_BALANCE }]);
            }
            setRound(1);
            setWinStreak(0);
        }
    }, [user]);

    // Salvar saldo automaticamente
    useEffect(() => {
        if (user && user.name) {
            const userKey = `monte_ruina_balance_${user.name}`;
            localStorage.setItem(userKey, balance);
        }
    }, [balance, user]);

    // --- NOVA LÓGICA: SEPARAR CÁLCULO DE ATUALIZAÇÃO ---

    // 1. Apenas calcula o resultado (Matemática pura, sem mexer no saldo)
    const simulateRound = useCallback((betAmount, cardId) => {
        const card = RISK_CARDS.find(c => c.id === cardId);
        if (!card) return null;

        const isWin = Math.random() < card.winChance;
        // Lucro puro (sem contar a aposta base, já que a lógica de dedução é separada)
        const payout = betAmount * (card.multiplier - 1); 

        return { isWin, card, payout, betAmount };
    }, []);

    // 2. Aplica o resultado no saldo (Chamado só depois da animação)
    const commitRound = useCallback((result) => {
        setBalance(prevBalance => {
            let newBalance = prevBalance;
            
            if (result.isWin) {
                newBalance += result.payout; // Ganhou: Soma o lucro
            } else {
                newBalance -= result.betAmount; // Perdeu: Subtrai a aposta
            }

            newBalance = Math.max(0, newBalance); // Nunca negativo

            // Atualiza histórico dentro do callback para garantir sincronia
            setBets(prevBets => [...prevBets, { round: prevBets.length, balance: newBalance }]);
            
            if (newBalance === 0) setRuinCount(prev => prev + 1);

            return newBalance;
        });

        setWinStreak(prev => result.isWin ? prev + 1 : 0);
        setRound(prev => prev + 1);
    }, []);

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
                const lastBet = prev[prev.length - 1] || { balance: 0, round: 0 };
                return [...prev.slice(0, -1), { ...lastBet, balance: lastBet.balance + integerAmount }];
            });
        }
    }, []);

    const withdraw = useCallback((amount) => {
        if (amount > 0 && balance >= amount) {
            setBalance(prev => prev - amount);
            setBets(prev => {
                const lastBet = prev[prev.length - 1] || { balance: 0, round: 0 };
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
        simulateRound, // Nova função exportada
        commitRound,   // Nova função exportada
        resetGame,
        deposit,
        withdraw,
        calculateExpectedValue,
    }), [balance, bets, ruinCount, round, winStreak, simulateRound, commitRound, deposit, withdraw]);

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};