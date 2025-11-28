import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "./AuthContext";

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

const INITIAL_BALANCE = 100.0;
export const BET_AMOUNT = 10;
export const MAX_BALANCE = 1000000.0; 

export const RISK_CARDS = [
    { id: '1', name: 'Bronze', multiplier: 2, winChance: 0.45, color: '#cd7f32', theme: 'Risco Baixo' }, 
    { id: '2', name: 'Prata', multiplier: 4, winChance: 0.20, color: '#c0c0c0', theme: 'Risco Médio' }, 
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
    const [bets, setBets] = useState([{ round: 0, balance: INITIAL_BALANCE, invested: INITIAL_BALANCE }]); 
    const [ruinCount, setRuinCount] = useState(0);
    const [round, setRound] = useState(1);
    const [winStreak, setWinStreak] = useState(0);
    const [totalInvested, setTotalInvested] = useState(INITIAL_BALANCE);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // --- CARREGAR DADOS ---
    useEffect(() => {
        if (user && user.name) {
            setIsDataLoaded(false); 
            const saveKey = `monte_ruina_gamestate_${user.name}`;
            const savedDataString = localStorage.getItem(saveKey);

            if (savedDataString) {
                const data = JSON.parse(savedDataString);
                setBalance(data.balance);
                setTotalInvested(data.totalInvested || INITIAL_BALANCE);
                
                const sanitizedBets = (Array.isArray(data.bets) && data.bets.length > 0 ? data.bets : [{ round: 0, balance: INITIAL_BALANCE }])
                    .map(b => ({ ...b, invested: b.invested || INITIAL_BALANCE }));

                setBets(sanitizedBets);
                setRuinCount(data.ruinCount || 0);
                setRound(data.round || 1);
                setWinStreak(data.winStreak || 0);
            } else {
                setBalance(INITIAL_BALANCE);
                setTotalInvested(INITIAL_BALANCE);
                setBets([{ round: 0, balance: INITIAL_BALANCE, invested: INITIAL_BALANCE }]);
                setRuinCount(0);
                setRound(1);
                setWinStreak(0);
            }
            setIsDataLoaded(true); 
        }
    }, [user]); 

    // --- SALVAR DADOS ---
    useEffect(() => {
        if (user && user.name && isDataLoaded) {
            const saveKey = `monte_ruina_gamestate_${user.name}`;
            const gameState = {
                balance,
                totalInvested,
                bets,
                ruinCount,
                round,
                winStreak
            };
            localStorage.setItem(saveKey, JSON.stringify(gameState));
        }
    }, [balance, bets, ruinCount, round, winStreak, user, isDataLoaded, totalInvested]);

    // --- NOVA FUNÇÃO: O VÍRUS ATACA ---
    const applyVirusPenalty = useCallback(() => {
        let stolenAmount = 0;
        let isBankrupt = false;

        setBalance(prev => {
            const penalty = Math.floor(prev * 0.10);
            const actualPenalty = penalty < 1 && prev > 0 ? 1 : penalty;
            const newBalance = Math.floor(prev - actualPenalty);
            
            stolenAmount = actualPenalty;
            isBankrupt = newBalance < BET_AMOUNT;

            setBets(prevBets => {
                const nextRoundNum = prevBets.length; 
                return [...prevBets, { round: nextRoundNum, balance: newBalance, invested: totalInvested }];
            });

            if (newBalance === 0) setRuinCount(count => count + 1);

            return newBalance;
        });
        
        return { stolenAmount, isBankrupt };
    }, [totalInvested]);

    const simulateRound = useCallback((betAmount, cardId) => {
        const card = RISK_CARDS.find(c => c.id === cardId);
        if (!card) return null;
        const isWin = Math.random() < card.winChance;
        const payout = betAmount * (card.multiplier - 1); 
        return { isWin, card, payout, betAmount };
    }, []);

    const commitRound = useCallback((result) => {
        setBalance(prevBalance => {
            let newBalance = prevBalance;
            if (result.isWin) {
                newBalance += result.payout; 
            } else {
                newBalance -= result.betAmount; 
            }
            newBalance = Math.max(0, newBalance);

            setBets(prevBets => {
                const nextRoundNum = prevBets.length; 
                return [...prevBets, { round: nextRoundNum, balance: newBalance, invested: totalInvested }];
            });
            
            if (newBalance === 0) setRuinCount(prev => prev + 1);

            return newBalance;
        });

        setWinStreak(prev => result.isWin ? prev + 1 : 0);
        setRound(prev => prev + 1);
    }, [totalInvested]);

    const resetGame = () => {
        setBalance(INITIAL_BALANCE);
        setTotalInvested(INITIAL_BALANCE);
        setBets([{ round: 0, balance: INITIAL_BALANCE, invested: INITIAL_BALANCE }]);
        setRound(1);
        setRuinCount(prev => prev + 1); 
        setWinStreak(0);
    };

    const deposit = useCallback((amount) => {
        const integerAmount = Math.floor(amount); 
        if (integerAmount > 0) {
            if (balance + integerAmount > MAX_BALANCE) {
                return { success: false, message: "O cofre está cheio! Limite de R$ 1 Milhão atingido." };
            }

            setBalance(prev => prev + integerAmount);
            setTotalInvested(prev => prev + integerAmount);

            setBets(prev => {
                const lastBet = prev[prev.length - 1] || { balance: 0, round: 0 };
                return [
                    ...prev.slice(0, -1), 
                    { 
                        ...lastBet, 
                        balance: lastBet.balance + integerAmount, 
                        invested: (lastBet.invested || 0) + integerAmount 
                    }
                ];
            });
            return { success: true };
        }
        return { success: false, message: "Valor inválido." };
    }, [balance]);

    const withdraw = useCallback((amount) => {
        if (amount > 0 && balance >= amount) {
            setBalance(prev => prev - amount);
            setBets(prev => {
                const lastBet = prev[prev.length - 1] || { balance: 0, round: 0 };
                return [...prev, { round: prev.length, balance: lastBet.balance - amount, invested: totalInvested }];
            });
            return true;
        }
        return false;
    }, [balance, totalInvested]);

    const contextValue = useMemo(() => ({
        balance,
        bets,
        ruinCount,
        round,
        winStreak,
        RISK_CARDS,
        VISUAL_POSITIONS,
        simulateRound, 
        commitRound,   
        resetGame,
        deposit,
        withdraw,
        applyVirusPenalty,
        calculateExpectedValue,
    }), [balance, bets, ruinCount, round, winStreak, simulateRound, commitRound, deposit, withdraw, applyVirusPenalty]);

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};