import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QrCode, ArrowDownCircle, ArrowUpCircle, Wallet, AlertCircle } from 'lucide-react';

const WalletScreen = () => {
    const { balance, deposit, withdraw } = useGame();
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleDeposit = () => {
        const val = parseFloat(depositAmount);
        
        // MUDANÇA 1: Bloqueio de valores absurdos na entrada
        if (!val || val <= 0) {
            setMessage({ type: 'error', text: 'Digite um valor válido para depósito.' });
            return;
        }
        if (val > 50000) {
            setMessage({ type: 'error', text: '🚨 A Receita Federal bloqueou esse valor. Tente menos de 50 mil.' });
            return;
        }

        setMessage({ type: 'info', text: 'Gerando QR Code PIX...' });
        
        setTimeout(() => {
            // MUDANÇA 2: O deposit agora retorna sucesso ou falha
            const result = deposit(val);
            
            if (result.success) {
                setMessage({ type: 'success', text: `Depósito de R$ ${val.toFixed(2)} confirmado!` });
                setDepositAmount('');
            } else {
                setMessage({ type: 'error', text: result.message }); // Mostra "Cofre cheio"
            }
        }, 1500);
    };

    const handleWithdraw = () => {
        const val = parseFloat(withdrawAmount);
        if (!val || val <= 0) {
            setMessage({ type: 'error', text: 'Digite um valor válido para saque.' });
            return;
        }
        if (!pixKey) {
            setMessage({ type: 'error', text: 'Digite sua chave PIX.' });
            return;
        }
        const success = withdraw(val);
        if (success) {
            setMessage({ type: 'success', text: `Saque de R$ ${val.toFixed(2)} solicitado com sucesso!` });
            setWithdrawAmount('');
        } else {
            setMessage({ type: 'error', text: 'Saldo insuficiente para este saque.' });
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            
            <div className="bg-black/30 border-2 border-[#FBBF24] p-8 rounded-3xl flex items-center justify-between relative overflow-hidden shadow-2xl">
                <div className="z-10">
                    <h2 className="text-[#FBBF24] font-extrabold text-4xl mb-2 flex items-center gap-3 font-serif tracking-wide">
                        <Wallet className="w-10 h-10"/> Tesouraria
                    </h2>
                    <p className="text-gray-400 font-bold font-serif">Gerencie seus ganhos e investimentos.</p>
                </div>
                <div className="z-10 text-right">
                    <div className="text-sm text-[#FBBF24]/80 font-bold uppercase tracking-widest mb-1">Saldo Disponível</div>
                    <div className="text-5xl font-black text-[#FBBF24] tracking-tight font-serif">R$ {balance.toFixed(2)}</div>
                </div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border-2 flex items-center gap-3 animate-pulse shadow-lg ${
                    message.type === 'error' ? 'bg-red-900/40 border-red-500 text-red-200' :
                    message.type === 'success' ? 'bg-green-900/40 border-green-500 text-green-200' :
                    'bg-blue-900/40 border-blue-500 text-blue-200'
                }`}>
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-extrabold text-lg">{message.text}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Depósito */}
                <div className="flex-1 bg-[#1a0f0a] border-2 border-[#FBBF24]/30 p-8 rounded-3xl relative group hover:border-[#FBBF24] transition-all duration-300 shadow-xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-green-600/60 group-hover:bg-green-500 transition-colors"></div>
                    <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-3 font-serif">
                        <ArrowDownCircle className="text-green-500 w-8 h-8" /> Depositar
                    </h3>
                    <div className="space-y-6">
                        <div className="bg-black/40 p-4 rounded-xl border border-gray-700">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">Método de Pagamento</label>
                            <div className="flex items-center gap-3 text-[#FBBF24] font-extrabold text-lg">
                                <QrCode className="w-6 h-6" /> PIX (Instantâneo)
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-300 font-bold block mb-2 ml-1">Valor do Depósito (R$)</label>
                            <input 
                                type="number" 
                                placeholder="0.00"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                className="w-full bg-stone-900 border-2 border-gray-700 rounded-xl p-4 text-white text-xl font-bold focus:border-green-500 focus:outline-none transition-colors placeholder-gray-600"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[20, 50, 100].map(val => (
                                <button key={val} onClick={() => setDepositAmount(val)} className="py-2 px-3 rounded-lg border-2 border-gray-700 text-gray-400 font-bold text-sm hover:border-green-500 hover:text-white hover:bg-green-500/10 transition-all">+ R${val}</button>
                            ))}
                        </div>
                        <button onClick={handleDeposit} className="w-full bg-green-700 hover:bg-green-600 text-white font-extrabold py-4 rounded-xl mt-4 shadow-lg border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-lg">GERAR QR CODE</button>
                    </div>
                </div>

                {/* Saque */}
                <div className="flex-1 bg-[#1a0f0a] border-2 border-[#FBBF24]/30 p-8 rounded-3xl relative group hover:border-[#FBBF24] transition-all duration-300 shadow-xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600/60 group-hover:bg-red-500 transition-colors"></div>
                    <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center gap-3 font-serif">
                        <ArrowUpCircle className="text-red-500 w-8 h-8" /> Sacar
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-300 font-bold block mb-2 ml-1">Chave PIX (CPF/Email/Tel)</label>
                            <input type="text" placeholder="Sua chave PIX aqui" value={pixKey} onChange={(e) => setPixKey(e.target.value)} className="w-full bg-stone-900 border-2 border-gray-700 rounded-xl p-4 text-white font-bold focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-300 font-bold block mb-2 ml-1">Valor do Saque (R$)</label>
                            <input type="number" placeholder="0.00" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-stone-900 border-2 border-gray-700 rounded-xl p-4 text-white text-xl font-bold focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"/>
                        </div>
                        <div className="bg-[#FBBF24]/10 border border-[#FBBF24]/30 p-4 rounded-xl text-sm text-[#FBBF24] flex gap-3 items-start">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="font-bold leading-tight">Saques são processados instantaneamente via PIX 24h por dia.</p>
                        </div>
                        <button onClick={handleWithdraw} className="w-full bg-red-800 hover:bg-red-700 text-white font-extrabold py-4 rounded-xl mt-auto shadow-lg border-b-4 border-red-950 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-lg">SOLICITAR SAQUE</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WalletScreen;