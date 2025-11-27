import React from 'react';
import { motion } from 'framer-motion';
import { Skull, Gem, Star } from 'lucide-react'; 

const CardMonte = ({ positionId, isSelected, isRevealed, isValete, onClick }) => {
    
    const borderClass = isSelected 
        ? "border-lime-500 shadow-[0_0_30px_rgba(132,204,22,0.8)] scale-105" 
        : "border-[#8B4513] hover:border-[#A0522D] shadow-2xl";

    return (
        <motion.div
            onClick={onClick}
            // Aumentei de w-36 para w-48 e h-56 para h-72 nas telas maiores
            className={`w-32 sm:w-48 h-48 sm:h-72 rounded-xl border-[6px] transition-all duration-300 cursor-pointer bg-[#2a1810] ${borderClass} relative`}
            whileHover={{ scale: isRevealed ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
             <motion.div 
                className="w-full h-full relative"
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Verso da Carta */}
                <div 
                    className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg bg-[#3E2723]"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="border-4 border-[#8B4513] w-[88%] h-[92%] flex items-center justify-center rounded-lg relative">
                        <Star className="w-24 h-24 text-[#8B4513] fill-[#8B4513]/20" />
                        
                        <Star className="w-5 h-5 text-[#8B4513] absolute top-3 left-3 fill-[#8B4513]" />
                        <Star className="w-5 h-5 text-[#8B4513] absolute top-3 right-3 fill-[#8B4513]" />
                        <Star className="w-5 h-5 text-[#8B4513] absolute bottom-3 left-3 fill-[#8B4513]" />
                        <Star className="w-5 h-5 text-[#8B4513] absolute bottom-3 right-3 fill-[#8B4513]" />
                    </div>
                </div>

                {/* Frente da Carta (Resultado) */}
                <div 
                    className="absolute w-full h-full backface-hidden bg-[#F5F5DC] flex items-center justify-center rounded-lg"
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: "rotateY(180deg)" 
                    }}
                >
                     <div className="border-4 border-[#8B4513] w-[88%] h-[92%] flex items-center justify-center rounded-lg">
                        {isValete ? (
                            <Gem className="w-24 h-24 text-[#FBBF24] fill-[#FBBF24]/50 stroke-[1.5]" />
                        ) : (
                            <Skull className="w-24 h-24 text-[#dc2626] fill-[#dc2626]/20 stroke-[1.5]" />
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CardMonte;