/**
 * ARBOGAME - Simulador de Gestão de Saúde (Plague Inc Invertido)
 * Você é o Gestor de Vigilância tentando conter o surto!
 */

import { useEffect, useCallback } from 'react';
import { useHealthStore } from './store/healthStore';
import HealthMainMenu from './components/HealthMainMenu';
import HealthHUD from './components/HealthHUD';
import HealthWorldMap from './components/HealthWorldMap';
import './index.css';

function App() {
  const {
    gameState,
    isPaused,
    speed,
    advanceDay,
    togglePause
  } = useHealthStore();

  // Loop principal do jogo
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    // Velocidade base: 800ms = 1 dia
    const baseInterval = 800;
    const interval = setInterval(() => {
      advanceDay();
    }, baseInterval / speed);

    return () => clearInterval(interval);
  }, [gameState, isPaused, speed, advanceDay]);

  // Atalhos de teclado
  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return;

    // Espaço para pausar
    if (e.key === ' ') {
      e.preventDefault();
      togglePause();
    }

    // 1, 2, 3 para velocidade
    if (['1', '2', '3'].includes(e.key)) {
      useHealthStore.getState().setSpeed(parseInt(e.key));
    }
  }, [gameState, togglePause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Menu inicial
  if (gameState === 'menu' || gameState === 'naming' || gameState === 'selecting') {
    return <HealthMainMenu />;
  }

  // Jogo ativo
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#0d0d0d'
    }}>
      {/* Mapa do mundo */}
      <HealthWorldMap />

      {/* Interface do usuário */}
      <HealthHUD />
    </div>
  );
}

export default App;
