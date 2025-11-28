import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

// --- PARTE 1: AS PÉROLAS ESCRITAS À MÃO (AGORA COM +100 NOVAS) ---
const HANDCRAFTED_ADS = [
    // CLÁSSICOS (Originais)
    { id: 1, text: "💸 PRECISANDO DE DINHEIRO? O AGIOTA BILLY COBRA SÓ 50% DE JUROS AO DIA!", subtext: "Aceitamos cavalos, dentes de ouro e a escritura da sua casa.", bg: "bg-gradient-to-r from-green-900 to-green-600", border: "border-green-400" },
    { id: 2, text: "🐴 VENDE-SE CAVALO CEGO. ÓTIMO PARA LASANHA.", subtext: "Tratar com o Açougueiro da esquina (não faça perguntas).", bg: "bg-gradient-to-r from-red-900 to-red-600", border: "border-red-400" },
    { id: 3, text: "🍺 PROMOÇÃO NO SALOON: PAGUE 1 E LEVE UM TIRO DE GRAÇA!", subtext: "Oferta válida apenas para forasteiros que olharem torto.", bg: "bg-gradient-to-r from-amber-900 to-amber-600", border: "border-amber-400" },
    { id: 4, text: "🔮 CARTOMANTE MADAME ZORA: PREVEJO QUE VOCÊ VAI PERDER TUDO HOJE!", subtext: "Consultas a partir de R$ 5,00. Traga seu desespero.", bg: "bg-gradient-to-r from-purple-900 to-purple-600", border: "border-purple-400" },
    { id: 6, text: "💋 MÃES SOLTEIRAS EM [SEU BAIRRO] QUEREM CONHECER VOCÊ AGORA!", subtext: "Elas odeiam joguinhos... mas adoram quem ganha no Monte da Ruína!", bg: "bg-gradient-to-r from-pink-900 to-pink-600", border: "border-pink-400" },

    // SERVIÇOS EXTREMAMENTE DUVIDOSOS
    { text: "🧨 LIMPEZA DE CHAMINÉ COM DINAMITE.", subtext: "Rápido, eficaz e você nunca mais vai precisar limpar (porque não terá chaminé)." },
    { text: "🦷 DENTISTA: ARRANCO DENTE NO LAÇO.", subtext: "Método cowboy. Se o cavalo correr, o dente sai. R$ 5,00." },
    { text: "🥃 PERSONAL TRAINER DE FÍGADO.", subtext: "Prepare-se para o campeonato de quem bebe mais. Treino intensivo." },
    { text: "🚿 BANHO DE GATO (LITERALMENTE).", subtext: "Alugamos gatos para lamber sua cara. Esfoliação natural áspera." },
    { text: "🎻 MÚSICO PARA VELÓRIO: TOCO 'PARABÉNS PRA VOCÊ' EM VERSÃO TRISTE.", subtext: "Para confundir os convidados e criar um clima único." },
    { text: "💈 BARBEIRO CEGO: CORTE SURPRESA.", subtext: "Você nunca sabe como vai sair (ou se vai sair com orelha)." },
    { text: "📜 ESCRITOR DE CARTA DE AMEAÇA.", subtext: "Caligrafia bonita para dizer coisas horríveis. Papel perfumado opcional." },
    { text: "🌵 ACUPUNTURA COM CACTO.", subtext: "Terapia de choque natural. Cura dor nas costas criando dor no corpo todo." },
    { text: "🤡 PALHAÇO DE RODEIO DEPRESSIVO.", subtext: "Ele não salva ninguém, mas chora de um jeito que distrai o touro." },
    { text: "🍳 COZINHEIRA QUE SÓ SABE FAZER OVO.", subtext: "Ovo frito, cozido, mexido ou cru. O cardápio é vasto." },

    // VENDAS DE ITENS INÚTEIS
    { text: "🪨 PEDRA DE ESTIMAÇÃO (TREINADA).", subtext: "Sabe os comandos: 'fica', 'finge de morta' e 'ataca' (se você jogar)." },
    { text: "🕶️ ÓCULOS SEM LENTE.", subtext: "Para quem quer parecer intelectual mas enxerga bem. Armação de arame." },
    { text: "🕳️ BURACO PORTÁTIL (NÃO FUNCIONA).", subtext: "É só um tapete preto redondo. Ótimo para enganar coiotes." },
    { text: "🧴 LOÇÃO PARA CRESCER CABELO NA SOLA DO PÉ.", subtext: "Para andar macio e silencioso como um felino. Efeito colateral: coceira." },
    { text: "🥫 LATA DE AR DO DESERTO.", subtext: "Respire a poeira e o calor onde você estiver. R$ 50 a unidade." },
    { text: "🪑 CADEIRA DE BALANÇO QUE VOMITA.", subtext: "Balança tanto que você passa mal. Diversão para crianças." },
    { text: "🗝️ CHAVE MESTRA QUE NÃO ABRE NADA.", subtext: "Mas serve para coçar o ouvido. Aço inoxidável." },
    { text: "🥩 BIFE DE COURO DE BOTA.", subtext: "Rico em fibras e sabor de chulé. Demora 3 dias para mastigar." },
    { text: "🎺 TROMBETE SILENCIOSO.", subtext: "Sopre com toda força e não faça barulho nenhum. Ótimo para vizinhos." },
    { text: "📦 CAIXA MISTERIOSA (VAZIA).", subtext: "O mistério é: por que você comprou isso? Não aceitamos devolução." },

    // GOLPES FINANCEIROS & COACHING DO VELHO OESTE
    { text: "🚀 CURSO 'COMO FICAR RICO ROUBANDO BANCO'.", subtext: "Módulo 1: Compre uma máscara. Módulo 2: Corra." },
    { text: "💎 PIRÂMIDE DE FENO.", subtext: "Convide 3 cavalos e ganhe alfafa infinita. (Não é golpe, confia)." },
    { text: "📈 INVESTIMENTO EM AÇÕES DE VENTO.", subtext: "O mercado é volátil, mas o vento nunca para. Retorno invisível." },
    { text: "🪙 DOBRADOR DE MOEDAS.", subtext: "Eu dobro sua moeda ao meio com o dente. Serviço artístico." },
    { text: "🏦 SEGURO CONTRA FORCA.", subtext: "Se você for enforcado, pagamos o enterro (caixão de pinho simples)." },
    { text: "📜 VENDO O TÍTULO DE PROPRIEDADE DA LUA.", subtext: "Documento assinado pelo próprio Armstrong (Neil? Não, o Louis)." },
    { text: "💸 COMPRO DÍVIDAS DE JOGO.", subtext: "Pago 1% do valor e assumo a surra por você." },
    { text: "🤝 SÓCIO PARA MINA DE OURO IMAGINÁRIA.", subtext: "Preciso de capital para comprar picaretas reais. Lucro dividido." },
    { text: "🎰 COACH DE ROLETA RUSSA.", subtext: "Te ensino a ganhar 5 de 6 vezes. (Não há reembolso em caso de erro)." },
    { text: "🐔 APOSTE NA RINHA DE FORMIGAS.", subtext: "Alta adrenalina. Traga sua lupa. Campeã atual: 'Esmagadora'." },

    // RELACIONAMENTOS & PESSOAL
    { text: "💔 VENDO CARTA DE AMOR NÃO ENVIADA.", subtext: "Cheia de lágrimas e erros de português. Ideal para quem não sabe escrever." },
    { text: "👰 ALUGO ESPOSA DE MENTIRA PARA JANTAR.", subtext: "Para mostrar pra sua mãe que você não é um fracassado." },
    { text: "👃 PERFUME 'CHEIRO DE RICO'.", subtext: "Fragrância de nota velha e charuto cubano. Atraia interesseiros." },
    { text: "🤰 TESTE DE GRAVIDEZ USADO (POSITIVO).", subtext: "Ótimo para forçar casamentos ou ganhar pensão. R$ 100." },
    { text: "🧔 VENDO MINHA BARBA.", subtext: "Corto na hora e colo na sua cara com piche. Fique másculo instantaneamente." },
    { text: "👵 ALUGO AVÓ QUE FAZ TORTA.", subtext: "Ela é surda, então você pode xingar enquanto come." },
    { text: "👶 TROCO FILHO BAGUNCEIRO POR CACHORRO.", subtext: "O cachorro tem que ser obediente. O filho sabe lavar louça (às vezes)." },
    { text: "💌 SERVIÇO DE TÉRMINO DE NAMORO.", subtext: "Nós terminamos por você. Opção com música triste ou fogos de artifício." },
    { text: "🧹 PROCURO MULHER QUE SAIBA CAVAR.", subtext: "Tenho um... projeto no quintal. Não faça perguntas." },
    { text: "💍 VENDO ALIANÇA DE CASAMENTO AMALDIÇOADA.", subtext: "3 donos anteriores, todos morreram misteriosamente. Ouro 18k." },

    // ABSURDOS GERAIS
    { text: "👻 VENDO FANTASMA DOMESTICADO.", subtext: "Mora num pote de maionese. Não abra, senão ele foge." },
    { text: "🛸 VI UM DISCO VOADOR E TENHO O MAPA.", subtext: "Eles levaram minha vaca. Vendo a localização por uma garrafa de rum." },
    { text: "🦵 ALUGAM-SE PERNAS DE PAU.", subtext: "Para quem quer ver o mundo de cima ou fingir que é alto." },
    { text: "🚽 PRIVADA COM EJETOR DE ASSENTO.", subtext: "Para visitas que demoram muito. Acabe com a fila do banheiro." },
    { text: "👣 VENDO PEGADAS DE PÉ GRANDE (MOLDE EM GESSO).", subtext: "Feitas com o pé do meu tio, que calça 48 e não corta a unha." },
    { text: "🧠 VENDO MEU PRÓPRIO CÉREBRO (QUANDO EU MORRER).", subtext: "Reserva antecipada. Pouco usado, estado de novo." },
    { text: "🕷️ COLEÇÃO DE ARANHAS VENENOSAS.", subtext: "Motivo da venda: elas escaparam da caixa. Boa sorte na busca." },
    { text: "🔥 ÁGUA EM PÓ.", subtext: "Invenção revolucionária. Basta adicionar água." },
    { text: "🤐 VENDO SEGREDO DE ESTADO.", subtext: "O Prefeito usa calcinha. Ops, já falei. Promoção: R$ 0,00." },
    { text: "🧤 LUVAS DE BOXE PARA GATOS.", subtext: "Resolva as diferenças com seu pet no ringue de forma justa." },
    { text: "🍌 BANANA QUE PARECE UMA ARMA.", subtext: "Assalte bancos de forma saudável e rica em potássio." },
    { text: "🧪 ELIXIR DA INVISIBILIDADE.", subtext: "Só funciona se ninguém estiver olhando pra você." },
    { text: "🛌 TRAVESSEIRO DE TIJOLO.", subtext: "Para corrigir a postura ou se defender de ladrões durante o sono." },
    { text: "📢 GRITADOR PROFISSIONAL.", subtext: "Grito com seu vizinho, chefe ou sogra. Pulmão de aço." },
    { text: "🎩 CARTOLA COM COELHO MORTO.", subtext: "O truque deu errado. Vendo barato para limpar a bagunça." },
    { text: "🥪 SANDUÍCHE DE VENTO.", subtext: "Duas fatias de pão e nada no meio. Baixa caloria." },
    { text: "🕰️ MÁQUINA DO TEMPO (APENAS PARA O FUTURO).", subtext: "Funciona na velocidade de 1 segundo por segundo." },
    { text: "🗺️ MAPA PARA O ACRE.", subtext: "Dizem que existe. Descubra por sua conta e risco." },
    { text: "🦷 PALITO DE DENTE REUTILIZÁVEL.", subtext: "Feito de osso de galinha. Ecológico e nojento." },
    { text: "🦟 CRIAÇÃO DE MOSQUITOS.", subtext: "Vendo lote de 1000 mosquitos para soltar na casa do inimigo." },

    // OS 'CLÁSSICOS' DO MUNDO MODERNO ADAPTADOS
    { text: "🚗 VENDO CARROÇA REBAIXADA E COM NEON.", subtext: "Suspensão a ar (bexiga). Chama atenção das éguas." },
    { text: "📱 VENDO TELEGRÁFO COM TELA TOUCH.", subtext: "Tecnologia steampunk. Mande código morse deslizando o dedo." },
    { text: "💻 CURSO DE PROGRAMAÇÃO EM PAPEL.", subtext: "Aprenda Java escrevendo com pena e tinta. Compile na mente." },
    { text: "📸 VENDO NUDE ARTÍSTICO (DESENHADO A CARVÃO).", subtext: "Envio pelo correio. Demora 3 semanas para baixar." },
    { text: "🍕 PIZZA DE ONTEM. MAIS BARATA.", subtext: "Acompanha antiácido e oração." },
    { text: "🏋️ WHEY PROTEIN DE LEITE DE ÉGUA.", subtext: "Para ficar monstro igual um cavalo. Gosto horrível." },
    { text: "🎧 FONE DE OUVIDO FEITO DE CONCHAS.", subtext: "Você só ouve o mar, mas o design é praiano." },
    { text: "🎮 VENDO PLAYSTATION 1 A VAPOR.", subtext: "Roda jogos em 1 FPS. Acompanha caldeira e lenha." },
    { text: "📺 TV DE CAIXOTE COM FANTOCHES DENTRO.", subtext: "Programação ao vivo 24h (enquanto eu aguentar mexer os bonecos)." },
    { text: "🔋 BATERIA INFINITA (É UM HAMSTER NA RODA).", subtext: "Gera energia enquanto o bicho viver. Alimente-o." }
];

// --- PARTE 2: GERADOR PROCEDURAL (O CAOS INFINITO) ---
const GENERATOR = {
    actions: ["VENDE-SE", "ALUGA-SE", "PROCURO", "TROCO", "LEILÃO DE", "DOA-SE", "ROUBO", "COMPRO", "FINANCIO"],
    items: [
        "SOGRA", "RIM", "FÍGADO", "CORAÇÃO DE EX", "CAPIVARA", "ANÃO DE JARDIM", 
        "OPALA 76", "MONZA TUBARÃO", "UNHAS ROÍDAS", "DÍVIDA NO SERASA", 
        "NOME SUJO", "ESPÍRITO OBSESSOR", "LOTE NO CÉU", "TERRENO NO INFERNO",
        "VOTO", "DIPLOMA", "TESTE DE GRAVIDEZ POSITIVO", "FITA K7 DO CHAVES",
        "PIRULITO DE ESTRUME", "KIT GAY", "ET DE VARGINHA", "GRÁVIDA DE TAUBATÉ",
        "CALCINHA DE VÓ", "CUECA FURADA", "LÁGRIMAS DE CROCODILO", "SORRISO DE MONALISA",
        "DENTADURA", "PERNA DE PAU", "OLHO DE VIDRO", "GATO MORTO", "GALINHA PRETA"
    ],
    conditions: [
        "SEMI-NOVO.", "COM DEFEITO.", "POSSUÍDO PELO DEMÔNIO.", "ROUBADO ONTEM.", 
        "COM CHEIRO DE ENXOFRE.", "SEM DOCUMENTO.", "ACEITO VALE-REFEIÇÃO.",
        "PAGAMENTO EM BALA.", "SÓ ACEITO OURO.", "URGENTE (POLÍCIA CHEGANDO).",
        "MOTIVO: VÍCIO EM JOGO.", "USADO POR FAMOSO (MENTIRA).", "COM MARCAS DE TIRO.",
        "NUNCA USADO.", "QUASE NOVO.", "PRECISA DE REPAROS.", "NÃO FUNCIONA.",
        "COM BABÁ DE BRINDE.", "MORDIDO POR ZUMBI.", "RADIOATIVO."
    ],
    extras: [
        "Tratar com o Baixinho.", "Não chame a polícia.", "Dispenso curiosos.", 
        "Acompanha manual (em russo).", "Se morrer não reclame.", "Garantia 'Soy Yo'.",
        "Troco por cigarro.", "Aceito a alma como entrada.", "Entrega via pombo.",
        "Fale com o Tonhão.", "Só no pix.", "Entrega em 24h (úteis).", "Não aceito devolução.",
        "Troco por cachaça.", "Vem buscar (tô com medo).", "Motivo: Divórcio."
    ]
};

const getRandomColorClasses = () => {
    const colorPairs = [
        { bg: "bg-gradient-to-r from-gray-900 to-black", border: "border-gray-500" },
        { bg: "bg-gradient-to-r from-red-900 to-red-800", border: "border-red-500" },
        { bg: "bg-gradient-to-r from-blue-900 to-blue-800", border: "border-blue-500" },
        { bg: "bg-gradient-to-r from-green-900 to-green-800", border: "border-green-500" },
        { bg: "bg-gradient-to-r from-purple-900 to-purple-800", border: "border-purple-500" },
        { bg: "bg-gradient-to-r from-yellow-900 to-yellow-800", border: "border-yellow-500" },
        { bg: "bg-gradient-to-r from-pink-900 to-pink-800", border: "border-pink-500" },
        { bg: "bg-gradient-to-r from-indigo-900 to-indigo-800", border: "border-indigo-500" },
    ];
    return colorPairs[Math.floor(Math.random() * colorPairs.length)];
};

const generateProceduralAd = () => {
    const action = GENERATOR.actions[Math.floor(Math.random() * GENERATOR.actions.length)];
    const item = GENERATOR.items[Math.floor(Math.random() * GENERATOR.items.length)];
    const condition = GENERATOR.conditions[Math.floor(Math.random() * GENERATOR.conditions.length)];
    const extra = GENERATOR.extras[Math.floor(Math.random() * GENERATOR.extras.length)];
    
    const colors = getRandomColorClasses();

    return {
        id: Math.random(), 
        text: `${action} ${item}. ${condition}`,
        subtext: extra,
        ...colors
    };
};

const FooterAds = () => {
    const [currentAd, setCurrentAd] = useState(HANDCRAFTED_ADS[0]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // MUDANÇA: 50% DE CHANCE (Math.random() > 0.5)
            if (Math.random() > 0.5) { 
                const randomIndex = Math.floor(Math.random() * HANDCRAFTED_ADS.length);
                setCurrentAd(HANDCRAFTED_ADS[randomIndex]);
            } else {
                setCurrentAd(generateProceduralAd());
            }
        }, 8000); // Rotação a cada 8 segundos
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
                            {/* Texto maior como você pediu */}
                            <p className="text-white/80 text-sm sm:text-lg font-bold italic font-mono mt-2">
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