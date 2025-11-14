import React from 'react';
import { motion } from 'framer-motion';

// Componente visual de uma única carta no Monte.
const CardMonte = ({ positionId, isSelected, isRevealed, isValete, onClick, riskCard }) => {
    const themeColor = isValete && riskCard ? riskCard.color : '#333';

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: isRevealed ? 1 : 1.05 }}
            className={`w-28 h-40 transform perspective-1000 transition-all duration-500 ease-in-out`}
            style={{
                cursor: isRevealed ? 'default' : 'pointer',
                transform: isSelected && !isRevealed ? 'translateY(-10px)' : 'none',
                boxShadow: isSelected && !isRevealed ? '0 10px 20px rgba(0,0,0,0.5)' : 'none',
            }}
        >
            <div className={`relative w-full h-full transform-style-preserve-3d ${isRevealed ? 'rotate-y-0' : 'rotate-y-180'}`}>
                {/* Face Traseira (Virada) */}
                <div
                    className={`absolute w-full h-full backface-hidden flex items-center justify-center rounded-xl border-4 ${
                        isSelected && !isRevealed ? 'border-blue-500' : 'border-red-600'
                    } bg-red-800 text-white`}
                    style={{ transform: 'rotateY(180deg)', WebkitBackfaceVisibility: 'hidden', MozBackfaceVisibility: 'hidden' }}
                >
                    <span className="text-4xl text-gray-200">?</span>
                </div>
                {/* Face Frontal (Revelada) */}
                <div
                    className={`absolute w-full h-full backface-hidden rounded-xl border-4 ${
                        isValete ? 'border-yellow-500' : 'border-gray-500'
                    } bg-white text-gray-800 flex flex-col items-center justify-center`}
                    style={{ transform: 'rotateY(0deg)', WebkitBackfaceVisibility: 'hidden', MozBackfaceVisibility: 'hidden' }}
                >
                    {isRevealed && (
                        <>
                            <span className="text-4xl" style={{ color: isValete ? themeColor : 'red' }}>
                                {isValete ? '👑' : '❌'} {/* Ícone do Valete/Coroa */}
                            </span>
                            <span className="text-xs mt-1">
                                {isValete ? riskCard.name : 'PERDEU'}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CardMonte;