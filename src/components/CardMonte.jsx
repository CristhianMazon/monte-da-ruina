import React from 'react';
import { motion } from 'framer-motion';
// Ícones: Skull para perda, Gem para Valete (tesouro/baú), Diamond para o verso.
import { Skull, Stamp, Gem, Diamond } from 'lucide-react'; 
// Importação essencial para a animação de entrada sequencial
import { VISUAL_POSITIONS } from '../context/GameContext'; 

// Componente visual de uma única carta no Monte.
const CardMonte = ({ positionId, isSelected, isRevealed, isValete, onClick, riskCard }) => {
    
    const valeteColor = '#FFD700'; // Ouro Velho (Cor interna do Valete)
    const lossColor = '#dc2626'; // Vermelho Sangue/Perigo (Cor interna da Ruína)

    // Animação de entrada sutil (para o monte aparecer ao resetar)
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
    };

    // NOVO: Estilo que aplica o destaque da carta escolhida (anel externo AZUL CLARO)
    // Usamos 'ring-sky' (azul celeste) para o indicador de escolha.
    const selectionHighlightClass = 'ring-4 ring-sky-400/50 border-sky-500';
    
    // --- Lógica de Borda da Face Frontal (Revelada) ---
    // Define a cor da borda da carta (resultado do jogo)
    const resultBorderClass = isValete ? 'border-amber-400' : 'border-red-600';

    // Aplica o anel azul de seleção e a borda do resultado
    const finalBorderClass = isSelected
        ? `border-4 ${selectionHighlightClass}` // Se estiver selecionada, usa o anel azul
        : `border-4 ${resultBorderClass}`; // Senão, usa a borda do resultado (vermelho/amarelo)
    
    // Borda da face traseira (antes do flip) - usa o indicador azul ou o padrão vermelho
    const backBorderClass = isSelected 
        ? `border-4 ${selectionHighlightClass}` 
        : 'border-4 border-red-900';


    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: VISUAL_POSITIONS.findIndex(p => p.id === positionId) * 0.1 }}
            
            onClick={onClick}
            // Animação de hover e tap
            whileHover={{ 
                scale: isRevealed ? 1 : 1.08, 
                rotateZ: isRevealed ? 0 : isSelected ? -2 : Math.random() > 0.5 ? 2 : -2 
            }}
            whileTap={{ scale: isRevealed ? 1 : 0.95 }}

            className={`w-28 h-40 transform perspective-1000 transition-all duration-500 ease-in-out`}
            style={{
                cursor: isRevealed ? 'default' : 'pointer',
                // Destaque visual: Efeito de elevação da carta escolhida (mantido permanentemente)
                transform: isSelected ? 'translateY(-15px) rotateZ(-2deg)' : 'none',
                boxShadow: isSelected ? '0 15px 30px rgba(0,0,0,0.8)' : '0 4px 8px rgba(0,0,0,0.5)',
            }}
        >
            {/* O container interno gira para simular o flip 3D */}
            <motion.div 
                className={`relative w-full h-full transform-style-preserve-3d`}
                animate={{ rotateY: isRevealed ? 0 : 180 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                {/* Face Traseira (Virada) - PADRÃO CLÁSSICO DE CARTA */}
                <div
                    // Aplicação da borda e anel de seleção azul (se isSelected)
                    className={`absolute w-full h-full backface-hidden flex items-center justify-center rounded-xl transition-all shadow-inner shadow-red-950/50 ${backBorderClass} bg-red-900 text-gray-200`}
                    style={{ 
                        transform: 'rotateY(180deg)', 
                        WebkitBackfaceVisibility: 'hidden', 
                        MozBackfaceVisibility: 'hidden',
                        // Padrão de losango/diamante no verso
                        backgroundImage: 'repeating-linear-gradient(45deg, #a00 0, #a00 1px, transparent 0, transparent 8px), repeating-linear-gradient(-45deg, #a00 0, #a00 1px, transparent 0, transparent 8px)',
                        backgroundSize: '16px 16px',
                        backgroundPosition: '0 0, 8px 8px'
                    }}
                >
                    <Diamond className="w-10 h-10 text-amber-400/80 fill-amber-400/20" />
                    <span className="text-sm absolute bottom-2 font-cinzel tracking-widest text-amber-400">MONTE</span>
                </div>
                
                {/* Face Frontal (Revelada) - APENAS SÍMBOLOS */}
                <div
                    // Aplica a borda do resultado (vermelho/amarelo) ou a borda de seleção azul
                    className={`absolute w-full h-full backface-hidden rounded-xl bg-stone-100 text-stone-900 flex flex-col items-center justify-center ${finalBorderClass}`}
                    style={{ 
                        transform: 'rotateY(0deg)', 
                        WebkitBackfaceVisibility: 'hidden', 
                        MozBackfaceVisibility: 'hidden',
                    }}
                >
                    {isRevealed && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-4xl" style={{ color: isValete ? valeteColor : lossColor }}>
                                {isValete ? <Gem className="w-12 h-12 fill-amber-400 stroke-amber-700"/> : <Skull className="w-12 h-12 stroke-red-600"/>}
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CardMonte;