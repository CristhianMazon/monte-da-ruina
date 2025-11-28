import React, { useState, useEffect, useRef } from 'react';
import { X, Skull, ShieldAlert, ArrowRight } from 'lucide-react';

const HACKER_LOGS = [
    "Connecting to host 192.168.0.1...",
    "Bypassing firewall security...",
    "Accessing wallet_data.json...",
    "Transferring funds to: CONTA_DO_AGIOTA...",
    "Injecting malicious script...",
    "Calculating 10% tax...",
    "Deleting System32...",
    "Formatting C: drive...",
    "ERROR: CRITICAL FAILURE...",
    "OPERATION SUCCESSFUL."
];

const FakeVirusModal = ({ isOpen, onClose, onPunish, navigateTo }) => {
    const [logs, setLogs] = useState([]);
    const [showReveal, setShowReveal] = useState(false);
    const [progress, setProgress] = useState(0);
    const [punishmentResult, setPunishmentResult] = useState({ stolen: 0, bankrupt: false });
    
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setLogs([]);
            setShowReveal(false);
            setProgress(0);

            let logIndex = 0;
            const logInterval = setInterval(() => {
                if (logIndex < HACKER_LOGS.length) {
                    setLogs(prev => [...prev, HACKER_LOGS[logIndex]]);
                    logIndex++;
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                } else {
                    clearInterval(logInterval);
                    
                    // EXECUTA O ROUBO
                    if (onPunish) {
                        const result = onPunish(); 
                        setPunishmentResult({ stolen: result.stolenAmount, bankrupt: result.isBankrupt });
                    }

                    setTimeout(() => setShowReveal(true), 800);
                }
            }, 250); 

            const progressInterval = setInterval(() => {
                setProgress(old => {
                    if (old >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return old + Math.random() * 15;
                });
            }, 300);

            return () => {
                clearInterval(logInterval);
                clearInterval(progressInterval);
            };
        }
    }, [isOpen, onPunish]);

    if (!isOpen) return null;

    const handleFinalAction = () => {
        if (punishmentResult.bankrupt) {
            navigateTo('wallet');
            onClose();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col font-mono p-4 md:p-10">
            
            {!showReveal ? (
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 h-full justify-center">
                    <div className="text-red-500 font-bold text-2xl animate-pulse flex items-center gap-2 uppercase">
                        <ShieldAlert className="w-8 h-8" />
                        ALERTA DE SEGURANÇA CRÍTICO
                    </div>
                    
                    <div className="w-full bg-gray-900 h-6 rounded-full border border-red-500 overflow-hidden relative">
                        <div 
                            className="h-full bg-red-600 transition-all duration-200" 
                            style={{ width: `${progress}%` }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">
                            TRANSFERINDO FUNDOS: {Math.min(100, progress).toFixed(0)}%
                        </span>
                    </div>

                    <div 
                        ref={scrollRef}
                        className="flex-1 bg-black border-2 border-green-500 p-4 rounded-lg overflow-y-auto font-mono text-green-500 text-sm md:text-lg shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    >
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-green-300 mr-2">{`>`}</span>
                                {log}
                            </div>
                        ))}
                        <div className="animate-pulse">_</div>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-[#580011] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-300">
                    <div className="bg-black/30 p-8 rounded-[3rem] border-4 border-[#FBBF24] shadow-2xl max-w-2xl w-full">
                        <Skull className="w-24 h-24 text-[#FBBF24] mx-auto mb-6 animate-bounce" />
                        
                        <h1 className="text-4xl md:text-6xl font-black text-[#FBBF24] font-serif uppercase tracking-widest mb-2 drop-shadow-md">
                            FOI TROLADO!
                        </h1>
                        
                        <p className="text-white text-lg md:text-2xl font-serif mb-6 leading-relaxed">
                            Achou mesmo que ia ganhar dinheiro fácil? 
                            <br/>
                            O vírus acabou de <span className="text-red-500 font-black">ROUBAR 10%</span> do seu saldo.
                        </p>

                        <div className="bg-red-900/50 border-2 border-red-500 p-4 rounded-xl mb-8">
                            <p className="text-red-200 font-bold text-sm uppercase tracking-widest">Valor Subtraído</p>
                            <p className="text-4xl font-black text-white mt-1">
                                - R$ {punishmentResult.stolen.toFixed(2)}
                            </p>
                        </div>

                        {punishmentResult.bankrupt && (
                            <p className="text-[#FBBF24] font-bold text-lg mb-4 animate-pulse">
                                ⚠️ E OLHA SÓ... VOCÊ FALIU! (Saldo &lt; R$ 10)
                            </p>
                        )}

                        <button 
                            onClick={handleFinalAction}
                            className={`
                                px-8 py-4 font-black text-xl rounded-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-3 w-full
                                ${punishmentResult.bankrupt 
                                    ? 'bg-[#FBBF24] text-[#580011]' 
                                    : 'bg-stone-700 text-white hover:bg-stone-600' 
                                }
                            `}
                        >
                            {punishmentResult.bankrupt ? (
                                <>RESSUSCITAR (DEPOSITAR) <ArrowRight className="w-6 h-6" /></>
                            ) : (
                                "VOLTAR PRO JOGO (MAIS POBRE)"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FakeVirusModal;