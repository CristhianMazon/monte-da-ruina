import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react'; // Adicionei um ícone de link externo pra ficar mais "real"

const FAKE_ADS = [
    // --- AS ORIGINAIS (5) ---
    {
        id: 1,
        text: "💸 PRECISANDO DE DINHEIRO? O AGIOTA BILLY COBRA SÓ 50% DE JUROS AO DIA!",
        subtext: "Aceitamos cavalos, dentes de ouro e a escritura da sua casa.",
        bg: "bg-gradient-to-r from-green-900 to-green-600",
        border: "border-green-400"
    },
    {
        id: 2,
        text: "🐴 VENDE-SE CAVALO CEGO. ÓTIMO PARA LASANHA.",
        subtext: "Tratar com o Açougueiro da esquina (não faça perguntas).",
        bg: "bg-gradient-to-r from-red-900 to-red-600",
        border: "border-red-400"
    },
    {
        id: 3,
        text: "🍺 PROMOÇÃO NO SALOON: PAGUE 1 E LEVE UM TIRO DE GRAÇA!",
        subtext: "Oferta válida apenas para forasteiros que olharem torto.",
        bg: "bg-gradient-to-r from-amber-900 to-amber-600",
        border: "border-amber-400"
    },
    {
        id: 4,
        text: "🔮 CARTOMANTE MADAME ZORA: PREVEJO QUE VOCÊ VAI PERDER TUDO HOJE!",
        subtext: "Consultas a partir de R$ 5,00. Traga seu desespero.",
        bg: "bg-gradient-to-r from-purple-900 to-purple-600",
        border: "border-purple-400"
    },
    {
        id: 5,
        text: "⚠️ CUIDADO: O JOGO VICIA (MAS A GENTE ADORA O SEU DINHEIRO).",
        subtext: "Jogue com responsabilidade (ou não, quem liga?).",
        bg: "bg-gradient-to-r from-blue-900 to-blue-600",
        border: "border-blue-400"
    },

    // --- AS NOVAS (15) ---
    {
        id: 6,
        text: "💋 MÃES SOLTEIRAS EM SEU BAIRRO QUEREM CONHECER VOCÊ AGORA!",
        subtext: "Elas odeiam joguinhos... mas adoram quem ganha no Monte da Ruína! Clique aqui.",
        bg: "bg-gradient-to-r from-pink-900 to-pink-600",
        border: "border-pink-400"
    },
    {
        id: 7,
        text: "🧪 ELIXIR DO DR. SNAKE: CURA CALVÍCIE, ESPINHELA CAÍDA E DÍVIDA DE JOGO!",
        subtext: "Feito com 100% de óleo de cobra e querosene. Resultado (ou morte) garantido.",
        bg: "bg-gradient-to-r from-emerald-900 to-emerald-600",
        border: "border-emerald-400"
    },
    {
        id: 8,
        text: "🚂 GANHE R$ 5.000 POR DIA TRABALHANDO DE CASA (ASSALTANDO TREM)!",
        subtext: "Vagas limitadas. Necessário cavalo próprio e falta de amor à vida.",
        bg: "bg-gradient-to-r from-gray-900 to-gray-600",
        border: "border-gray-400"
    },
    {
        id: 9,
        text: "🗺️ VENDE-SE MAPA DO TESOURO (USADO APENAS UMA VEZ).",
        subtext: "O antigo dono não precisou mais (morreu misteriosamente).",
        bg: "bg-gradient-to-r from-yellow-900 to-yellow-600",
        border: "border-yellow-400"
    },
    {
        id: 10,
        text: "🦷 COMPRAMOS DENTADURA DE OURO. PAGAMENTO À VISTA.",
        subtext: "Não nos importamos se ainda estiver na boca do dono.",
        bg: "bg-gradient-to-r from-orange-900 to-orange-600",
        border: "border-orange-400"
    },
    {
        id: 11,
        text: "🚀 URUBU DO PIX DO VELHO OESTE: MANDE 10 E RECEBA 100!",
        subtext: "Confia no pai. O Xerife já investiu (e tá procurando a gente).",
        bg: "bg-gradient-to-r from-cyan-900 to-cyan-600",
        border: "border-cyan-400"
    },
    {
        id: 12,
        text: "📚 CURSO: 'COMO GANHAR NO PÔQUER SEM SABER CONTAR'.",
        subtext: "Arrasta pra cima e aprenda a blefar como um político.",
        bg: "bg-gradient-to-r from-indigo-900 to-indigo-600",
        border: "border-indigo-400"
    },
    {
        id: 13,
        text: "👻 LIMPE SEU NOME NO SPC/SERASA COM MAGIA NEGRA!",
        subtext: "Pacto renovável mensalmente. Aceitamos alma como entrada.",
        bg: "bg-gradient-to-r from-violet-900 to-violet-600",
        border: "border-violet-400"
    },
    {
        id: 14,
        text: "🌵 ALUGAM-SE MULAS RÁPIDAS PARA FUGA IMEDIATA.",
        subtext: "Discretas, não relincham e conhecem os atalhos para o México.",
        bg: "bg-gradient-to-r from-lime-900 to-lime-600",
        border: "border-lime-400"
    },
    {
        id: 15,
        text: "🔫 AULAS DE DUELO: APRENDA A ATIRAR OU SEU DINHEIRO DE VOLTA!",
        subtext: "*Reembolso válido apenas para alunos sobreviventes.",
        bg: "bg-gradient-to-r from-rose-900 to-rose-600",
        border: "border-rose-400"
    },
    {
        id: 16,
        text: "💍 TROCO SOGRA POR DOIS MAÇOS DE CIGARRO E UM UÍSQUE.",
        subtext: "Ela cozinha bem, mas reclama muito. Negócio urgente.",
        bg: "bg-gradient-to-r from-stone-800 to-stone-600",
        border: "border-stone-400"
    },
    {
        id: 17,
        text: "🩺 PROCURA-SE MÉDICO QUE SAIBA TIRAR BALA SEM PERGUNTAS.",
        subtext: "Pago bem. Favor não avisar as autoridades.",
        bg: "bg-gradient-to-r from-teal-900 to-teal-600",
        border: "border-teal-400"
    },
    {
        id: 18,
        text: "🎰 ROLETA VICIADA À VENDA. LUCRO GARANTIDO.",
        subtext: "Ideal para festas de família e depenar os amigos.",
        bg: "bg-gradient-to-r from-fuchsia-900 to-fuchsia-600",
        border: "border-fuchsia-400"
    },
    {
        id: 19,
        text: "💉 VACINA CONTRA AZAR. EFICÁCIA NÃO COMPROVADA.",
        subtext: "Mas a fé é o que vale, né? Apenas R$ 50 a dose.",
        bg: "bg-gradient-to-r from-sky-900 to-sky-600",
        border: "border-sky-400"
    },
    {
        id: 20,
        text: "💩 VENDE-SE ESTRUME DE UNICÓRNIO (É SÓ CAVALO PINTADO).",
        subtext: "Ótimo adubo. Cheiro de arco-íris (mentira, cheira mal mesmo).",
        bg: "bg-gradient-to-r from-amber-800 to-yellow-700",
        border: "border-amber-500"
    }
];

const FooterAds = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Roda as propagandas a cada 4 segundos (ficou mais rápido pra dar dinamismo)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FAKE_ADS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const ad = FAKE_ADS[currentIndex];

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-0 pt-0 pointer-events-none flex justify-center">
            {/* Container do Banner */}
            <div className="w-full max-w-[1200px] pointer-events-auto">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={ad.id}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className={`relative w-full ${ad.bg} border-t-4 border-x-4 ${ad.border} rounded-t-xl p-3 sm:p-4 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                        onClick={() => alert("🚨 ALERTA DE VÍRUS 🚨\n\nBrincadeira... mas não clique em links estranhos na vida real!")}
                    >
                        {/* Botão Fake de Fechar */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsVisible(false);
                            }}
                            className="absolute top-2 right-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-1 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-black/40 text-white px-2 py-0.5 rounded uppercase tracking-widest border border-white/10">
                                    Patrocinado
                                </span>
                                <ExternalLink className="w-3 h-3 text-white/70" />
                            </div>
                            
                            <h3 className="text-white font-black text-lg sm:text-2xl uppercase tracking-wide drop-shadow-md font-serif leading-tight">
                                {ad.text}
                            </h3>
                            <p className="text-white/90 text-xs sm:text-sm font-bold italic">
                                {ad.subtext}
                            </p>
                        </div>

                        {/* Brilho passando (Efeito Scanline) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full -skew-x-12 translate-x-[-100%] animate-[shimmer_2.5s_infinite]"></div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
            `}</style>
        </div>
    );
};

export default FooterAds;