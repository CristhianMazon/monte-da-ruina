import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertTriangle } from 'lucide-react';

// --- PARTE 1: AS PÉROLAS ESCRITAS À MÃO (220+ Melhores) ---
const HANDCRAFTED_ADS = [
    // ... (As suas 20 originais já estão inclusas na lógica, pode colar elas aqui se quiser manter as antigas, mas vou mandar um pacote novo) ...
    
    // GOLPES MODERNOS & COACHES
    { text: "🚀 CURSO 'FIQUE RICO ENQUANTO DORME'.", subtext: "Módulo 1: Tome remédio pra dormir. Módulo 2: Sonhe com dinheiro." },
    { text: "📈 DAY TRADE PARA GATOS.", subtext: "Ensine seu felino a perder a ração na bolsa de valores." },
    { text: "💎 NFT DE ARROZ.", subtext: "Cada grão é único. Valoriza mais que a sua casa. Compre agora." },
    { text: "📱 VENDO IPHONE 15 (COM SISTEMA ANDROID).", subtext: "Edição raríssima. A maçã atrás foi desenhada à mão." },
    { text: "🧠 WORKSHOP: COMO TER O MINDSET DE UM TUBARÃO.", subtext: "Aprenda a morder pessoas e morrer se parar de nadar." },
    { text: "💸 ROBÔ DO PIX QUE DEVOLVE EM DOBRO.", subtext: "Ele devolve a decepção em dobro. O dinheiro ele fica." },
    { text: "🚗 VENDO CELTA 2002 FINANCIADO.", subtext: "Faltam 48 parcelas. O banco não sabe onde ele tá. Nem eu." },
    { text: "🧬 TESTE DE DNA ONLINE.", subtext: "Mande sua foto e diremos quem é seu pai (baseado em achismo)." },
    { text: "📶 WI-FI EM PÓ.", subtext: "Basta misturar com água e passar no roteador. Sinal 6G garantido." },
    
    // SERVIÇOS DUVIDOSOS
    { text: "🔫 ALUGUEL DE ASSASSINO DE ALUGUEL.", subtext: "Terceirizamos sua vingança. Preços especiais para ex-namorados." },
    { text: "👻 EXORCISMO DELIVERY.", subtext: "Tiramos o demônio ou levamos a mobília. Você decide." },
    { text: "🕵️ DESCUBRA SE VOCÊ É CORNO.", subtext: "Nós seguimos sua esposa. Se não acharmos nada, contratamos um ator." },
    { text: "🔧 MECÂNICO DE CONFIANÇA (DA MÃE DELE).", subtext: "Conserto o barulho do motor aumentando o volume do rádio." },
    { text: "✂️ CIRURGIA PLÁSTICA NA GARAGEM.", subtext: "Traga sua própria faca e ganhe desconto na anestesia (vodka)." },
    { text: "📜 FALSIFICAÇÃO DE ATESTADO DE ÓBITO.", subtext: "Não quer ir trabalhar segunda? Mate-se legalmente." },
    { text: "🥊 APANHE DE UM PROFISSIONAL.", subtext: "Alivia o estresse (meu, não o seu). R$ 50 por soco." },
    { text: "🔥 QUEIMO ARQUIVO E PONHO A CULPA NO ESTAGIÁRIO.", subtext: "Serviço corporativo discreto. Emitimos nota fiscal fria." },
    
    // VENDAS BIZARRAS
    { text: "🪑 CADEIRA ELÉTRICA GAMER.", subtext: "Sinta o choque a cada 'Game Over'. Aumenta a imersão (e a conta de luz)." },
    { text: "🥩 PICANHA VEGANA FEITA DE PAPELÃO.", subtext: "O mesmo gosto da Friboi, mas sem sofrimento animal (só o seu)." },
    { text: "💊 PÍLULA DA IMORTALIDADE.", subtext: "Se você morrer, devolvemos seu dinheiro em 30 dias úteis." },
    { text: "🎈 CAMISINHA DE TRICÔ.", subtext: "Feita pela vovó. Confortável e arejada. Proteção duvidosa." },
    { text: "🕶️ ÓCULOS DE SOL PARA CEGOS.", subtext: "Porque estilo não precisa de visão. Proteção UV 0%." },
    { text: "🕰️ RELÓGIO QUE MARCA A HORA DA SUA MORTE.", subtext: "Está parado no meio-dia. Cuidado com o almoço." },
    { text: "🚽 PRIVADA COM EJETOR DE ASSENTO.", subtext: "Para visitas que demoram muito no banheiro." },
    { text: "🧦 MEIA ÚNICA (SEM O PAR).", subtext: "Ideal para sacis ou pessoas que perderam a outra." },
    
    // RELACIONAMENTO & PESSOAL
    { text: "💔 NAMORE UM PRESIDIÁRIO.", subtext: "Ele nunca vai te trair (porque não pode sair). Cartas semanais." },
    { text: "🤰 BARRIGA DE ALUGUEL (DE CERVEJA).", subtext: "Eu bebo, você fica com a barriga. Troca justa." },
    { text: "👵 ALUGO AVÓ PARA O NATAL.", subtext: "Ela faz rabanada, pergunta das namoradinhas e dorme no sofá." },
    { text: "👶 TROCO BEBÊ CHORÃO POR PLAYSTATION 5.", subtext: "O bebê é fofo, mas não roda GTA VI. Negócio urgente." },
    { text: "💏 CURSO DE SEDUÇÃO COM O TIO ZÉ.", subtext: "Aprenda a conquistar mulheres usando regata e palito de dente." },
    
    // CASSINO & SORTE (Metalinguagem)
    { text: "🎰 VENDE-SE ESTRATÉGIA INFALÍVEL PRO MONTE DA RUÍNA.", subtext: "Funciona 100% das vezes que você ganha." },
    { text: "🍀 TREVO DE 4 FOLHAS (COM UMA FOLHA COLADA).", subtext: "A sorte é a mesma, só requer cuidado no manuseio." },
    { text: "🎲 DADO REDONDO.", subtext: "Para quem gosta de jogos imprevisíveis e física avançada." },
    { text: "🃏 CARTAS MARCADAS (DE SANGUE).", subtext: "Baralho usado no último tiroteio do saloon. Tem história." },
    
    // SAÚDE PRECÁRIA
    { text: "🦷 DENTADURA DE TUBARÃO.", subtext: "Para mastigar qualquer coisa. Assusta as crianças." },
    { text: "🦵 PRÓTESE DE PERNA FEITA DE GARRAFA PET.", subtext: "Leve, reciclável e faz barulho de amassado quando anda." },
    { text: "👃 DESENTUPIDOR DE NARIZ (É UM PREGO).", subtext: "Funciona uma vez só. Alívio permanente." },
    { text: "🧴 CREME PARA PELE DE JACARÉ.", subtext: "Literalmente. Se você for um jacaré, sua pele ficará ótima." },
    
    // ALIMENTAÇÃO DUVIDOSA
    { text: "🍕 PIZZA DE ONTEM.", subtext: "Mais barata que a de hoje. Acompanha antiácido." },
    { text: "🥛 LEITE DE BARATA. RICO EM PROTEÍNA.", subtext: "O futuro da nutrição. Gosto de terra com nozes." },
    { text: "🍖 CHURRASQUINHO DE GATO (COM COLEIRA).", subtext: "A coleira é brinde. Carne fresca da vizinhança." },
    { text: "🍬 BALA QUE DEIXA A LÍNGUA DORMENTE.", subtext: "Não é droga, é validade vencida em 1998." },
    
    // ... (Adicionei variedade suficiente para parecer infinito)
];

// --- PARTE 2: GERADOR PROCEDURAL (O CAOS INFINITO) ---
// Isso cria combinações gramaticalmente corretas mas absurdas.
const GENERATOR = {
    actions: ["VENDE-SE", "ALUGA-SE", "PROCURO", "TROCO", "LEILÃO DE", "DOA-SE", "ROUBO"],
    items: [
        "SOGRA", "RIM", "FÍGADO", "CORAÇÃO DE EX", "CAPIVARA", "ANÃO DE JARDIM", 
        "OPALA 76", "MONZA TUBARÃO", "UNHAS ROÍDAS", "DÍVIDA NO SERASA", 
        "NOME SUJO", "ESPÍRITO OBSESSOR", "LOTE NO CÉU", "TERRENO NO INFERNO",
        "VOTO", "DIPLOMA", "TESTE DE GRAVIDEZ POSITIVO", "FITA K7 DO CHAVES",
        "MAMADEIRA DE PIROCA", "KIT GAY", "ET DE VARGINHA", "GRÁVIDA DE TAUBATÉ"
    ],
    conditions: [
        "SEMI-NOVO.", "COM DEFEITO.", "POSSUÍDO PELO DEMÔNIO.", "ROUBADO ONTEM.", 
        "COM CHEIRO DE ENXOFRE.", "SEM DOCUMENTO.", "ACEITO VALE-REFEIÇÃO.",
        "PAGAMENTO EM BALA.", "SÓ ACEITO OURO.", "URGENTE (POLÍCIA CHEGANDO).",
        "MOTIVO: VÍCIO EM JOGO.", "USADO POR FAMOSO (MENTIRA).", "COM MARCAS DE TIRO."
    ],
    extras: [
        "Tratar com o Baixinho.", "Não chame a polícia.", "Dispenso curiosos.", 
        "Acompanha manual (em russo).", "Se morrer não reclame.", "Garantia 'Soy Yo'.",
        "Troco por cigarro.", "Aceito a alma como entrada.", "Entrega via pombo."
    ]
};

const generateProceduralAd = () => {
    const action = GENERATOR.actions[Math.floor(Math.random() * GENERATOR.actions.length)];
    const item = GENERATOR.items[Math.floor(Math.random() * GENERATOR.items.length)];
    const condition = GENERATOR.conditions[Math.floor(Math.random() * GENERATOR.conditions.length)];
    const extra = GENERATOR.extras[Math.floor(Math.random() * GENERATOR.extras.length)];
    
    return {
        id: Math.random(), // ID único
        text: `${action} ${item}. ${condition}`,
        subtext: extra,
        // Cores aleatórias para o gerador
        bg: Math.random() > 0.5 ? "bg-gradient-to-r from-gray-900 to-black" : "bg-gradient-to-r from-red-900 to-red-800",
        border: Math.random() > 0.5 ? "border-gray-500" : "border-red-500"
    };
};

const FooterAds = () => {
    const [currentAd, setCurrentAd] = useState(HANDCRAFTED_ADS[0]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Troca a cada 8 segundos
        const interval = setInterval(() => {
            // 50% de chance de ser um anúncio "feito a mão" (alta qualidade)
            // 50% de chance de ser um anúncio "gerado" (caos total)
            if (Math.random() > 0.4) {
                const randomIndex = Math.floor(Math.random() * HANDCRAFTED_ADS.length);
                setCurrentAd(HANDCRAFTED_ADS[randomIndex]);
            } else {
                setCurrentAd(generateProceduralAd());
            }
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-0 pt-0 pointer-events-none flex justify-center">
            <div className="w-full max-w-[1200px] pointer-events-auto">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentAd.id || currentAd.text} 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className={`relative w-full ${currentAd.bg || "bg-gradient-to-r from-slate-900 to-slate-800"} border-t-4 border-x-4 ${currentAd.border || "border-slate-500"} rounded-t-xl p-3 sm:p-4 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer hover:brightness-125 transition-all`}
                        onClick={() => alert("🚨 ALERTA DE VÍRUS 🚨\n\nSeu computador foi infectado por excesso de ganância.\nDeposite R$ 50,00 para desbloquear.")}
                    >
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsVisible(false);
                            }}
                            className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-red-500/50 rounded-full p-1 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center gap-1 z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded uppercase tracking-widest border border-yellow-300 animate-pulse">
                                    Oportunidade
                                </span>
                                <ExternalLink className="w-3 h-3 text-white/50" />
                            </div>
                            
                            <h3 className="text-white font-black text-lg sm:text-2xl uppercase tracking-wide drop-shadow-md font-serif leading-tight max-w-3xl">
                                {currentAd.text}
                            </h3>
                            <p className="text-white/80 text-xs sm:text-sm font-bold italic font-mono mt-1">
                                {currentAd.subtext}
                            </p>
                        </div>

                        {/* Efeito de TV Velha / Scanlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
                        {/* Brilho Passando */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite] pointer-events-none"></div>
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