import React from "react";
import { useGame, RISK_CARDS, calculateExpectedValue } from "../context/GameContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

const StatsScreen = () => {
    const { bets } = useGame();

    // --- LÓGICA DO GRADIENTE DO GRÁFICO ---
    const dataMax = Math.max(...bets.map((i) => i.balance));
    const dataMin = Math.min(...bets.map((i) => i.balance));

    const gradientOffset = () => {
        if (dataMax <= 100) return 0; 
        if (dataMin >= 100) return 1; 
        return (dataMax - 100) / (dataMax - dataMin);
    };

    const off = gradientOffset();
    // ----------------------------------------

    return (
        <div className="w-full max-w-[1400px] flex flex-col items-center gap-8">
            
            {/* Título Geral */}
            <h2 className="text-5xl font-extrabold text-[#FBBF24] font-serif border-b-4 border-[#FBBF24] pb-2 px-10 tracking-wider drop-shadow-lg">
                Estatísticas de jogador
            </h2>

            <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch justify-center h-[600px]">
                
                {/* 1. ESQUERDA: CARDS DE ESTATÍSTICAS */}
                <div className="w-full lg:w-1/4 border-4 border-[#FBBF24] rounded-[3rem] p-6 flex flex-col bg-black/20 shadow-2xl relative">
                    
                    {/* Container interno flexível para distribuir o espaço */}
                    <div className="flex-1 flex flex-col justify-center gap-12 pb-12 w-full"> 
                        {RISK_CARDS.map(card => {
                            const ev = calculateExpectedValue(card);
                            return (
                                <div key={card.id} className="flex items-center gap-5 px-4">
                                    {/* Ícone Quadrado do Multiplicador */}
                                    <div 
                                        className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border-2 border-white/10"
                                        style={{ backgroundColor: card.color }}
                                    >
                                        <span className="font-black text-white text-2xl drop-shadow-md">{card.multiplier}x</span>
                                    </div>
                                    
                                    {/* Textos */}
                                    <div className="flex flex-col justify-center">
                                        <div className="text-[#FBBF24] font-extrabold text-xl font-serif leading-tight mb-1">
                                            Chance WIN:<br/>
                                            <span className="text-white text-2xl">{(card.winChance * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="text-[#FBBF24] font-extrabold text-lg font-serif">
                                            EV: <span className="text-red-500 text-xl">{ev.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* Texto do Rodapé (Posicionado Absolutamente) */}
                    <div className="absolute bottom-6 left-0 right-0 text-center px-6">
                        <p className="text-[#FBBF24]/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            EV (Valor Esperado) negativo comprova<br/>a inevitabilidade da Ruína.
                        </p>
                    </div>
                </div>

                {/* 2. CENTRO: GRÁFICO (FUNDO 2A1D18) */}
                <div className="flex-1 border-4 border-[#FBBF24] rounded-[3rem] p-6 bg-[#2A1D18] shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bets} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#FBBF24" strokeOpacity={0.2} vertical={false} />
                                <XAxis dataKey="round" hide />
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    stroke="#FBBF24" 
                                    tick={{fill: '#FBBF24', fontSize: 14, fontWeight: 800, fontFamily: 'Abhaya Libre'}} 
                                    tickFormatter={(val) => val.toFixed(0)}
                                    width={40}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#2a0a0a', border: '2px solid #FBBF24', borderRadius: '10px' }}
                                    itemStyle={{ color: '#FBBF24', fontWeight: 'bold', fontFamily: 'Abhaya Libre' }}
                                    labelStyle={{ display: 'none'}}
                                    formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Saldo']}
                                />
                                
                                <defs>
                                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={off} stopColor="#4ade80" stopOpacity={1} /> 
                                        <stop offset={off} stopColor="#ef4444" stopOpacity={1} /> 
                                    </linearGradient>
                                </defs>

                                <ReferenceLine y={100} stroke="#FBBF24" strokeDasharray="5 5" strokeOpacity={0.5} />

                                <Line 
                                    type="monotone" 
                                    dataKey="balance" 
                                    stroke="url(#splitColor)" 
                                    strokeWidth={4}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 8, fill: '#3AFF7A', stroke: '#fff', strokeWidth: 2 }} 
                                    animationDuration={500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. DIREITA: HISTÓRICO */}
                <div className="w-full lg:w-1/4 border-4 border-[#FBBF24] rounded-[3rem] bg-black/20 shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-6 border-b-2 border-[#FBBF24]/30">
                        <h4 className="text-[#FBBF24] text-center font-extrabold text-2xl font-serif underline decoration-2 underline-offset-8 decoration-[#FBBF24]/50">
                            Histórico de Partidas
                        </h4>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        <style>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: #FBBF24; border-radius: 10px; }
                        `}</style>

                        {[...bets].reverse().filter(b => b.round > 0).map((bet, i) => {
                             const prev = bets[bets.length - 1 - i - 1] || {balance: 100}; 
                             const win = bet.balance >= prev.balance;
                             
                             return (
                                <div key={i} className="flex justify-between items-center p-3 border-b border-[#FBBF24]/20 last:border-0 hover:bg-[#FBBF24]/5 transition-colors rounded-lg">
                                    <span className="text-[#FBBF24]/70 font-bold font-serif">Rodada {bet.round}</span>
                                    <span className={`font-black font-serif text-lg ${win ? 'text-green-400' : 'text-red-500'}`}>
                                        R$ {bet.balance.toFixed(2)}
                                    </span>
                                </div>
                             )
                        })}
                        {bets.length <= 1 && (
                            <div className="text-center text-[#FBBF24]/40 mt-10 font-serif italic">
                                Nenhuma partida jogada ainda.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StatsScreen;