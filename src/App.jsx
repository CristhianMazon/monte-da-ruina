import React from 'react';
import { GameProvider } from './context/GameContext';
import MonteDaRuina from './components/MonteDaRuina';

// Este é o componente raiz que inicializa o Contexto e a Tela Principal do Jogo.
function App() {
  return (
    <GameProvider>
      <MonteDaRuina />
    </GameProvider>
  );
}

export default App;