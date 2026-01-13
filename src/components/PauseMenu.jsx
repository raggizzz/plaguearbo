/**
 * PauseMenu - Menu de pausa
 */

import { useGameStore } from '../store/gameStore';

export default function PauseMenu() {
    const { togglePause, resetGame, stats, totalDays } = useGameStore();

    return (
        <div className="pause-overlay">
            <div className="pause-menu">
                <h2 className="pause-title">⏸️ Jogo Pausado</h2>

                {/* Estatísticas rápidas */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '24px',
                    textAlign: 'left'
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '12px',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Dias Jogados</div>
                        <div style={{ fontSize: '20px', fontWeight: '700' }}>{totalDays}</div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '12px',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Total de Casos</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffa502' }}>{stats.totalInfected}</div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '12px',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Óbitos</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: stats.totalDeaths > 0 ? '#ff4757' : '#2ed573' }}>
                            {stats.totalDeaths}
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '12px',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Investido</div>
                        <div style={{ fontSize: '20px', fontWeight: '700' }}>R$ {(stats.moneySpent / 1000).toFixed(0)}k</div>
                    </div>
                </div>

                <div className="pause-buttons">
                    <button className="pause-btn primary" onClick={togglePause}>
                        ▶️ Continuar
                    </button>
                    <button className="pause-btn secondary" onClick={resetGame}>
                        🔄 Reiniciar
                    </button>
                    <button className="pause-btn secondary" disabled>
                        ⚙️ Configurações
                    </button>
                    <button className="pause-btn secondary" onClick={resetGame}>
                        🚪 Menu Principal
                    </button>
                </div>
            </div>
        </div>
    );
}
