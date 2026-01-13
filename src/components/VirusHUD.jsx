/**
 * VirusHUD - Interface do Jogo Estilo Plague Inc
 * Estatísticas globais, notícias, controles
 */

import { useState } from 'react';
import { useVirusStore } from '../store/virusStore';
import EvolutionTree from './EvolutionTree';

export default function VirusHUD() {
    const {
        gameState,
        virusName,
        selectedVirusType,
        dnaPoints,
        day,
        speed,
        isPaused,
        togglePause,
        setSpeed,
        zones,
        totalInfected,
        totalDead,
        totalCured,
        governmentAwareness,
        cureProgress,
        newsQueue,
        dismissNews,
        resetGame,
        getTotalPopulation,
        getHealthy,
        getInfectedZones
    } = useVirusStore();

    const [showEvolution, setShowEvolution] = useState(false);

    if (gameState !== 'playing' && gameState !== 'victory' && gameState !== 'defeat') {
        return null;
    }

    const totalPop = getTotalPopulation();
    const healthy = getHealthy();
    const infectedZones = getInfectedZones();
    const percentInfected = ((totalInfected / totalPop) * 100).toFixed(1);
    const percentDead = ((totalDead / totalPop) * 100).toFixed(2);

    // Tela de vitória/derrota
    if (gameState === 'victory' || gameState === 'defeat') {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                <div style={{
                    background: gameState === 'victory'
                        ? 'linear-gradient(180deg, #1a2f1a, #0d0d0d)'
                        : 'linear-gradient(180deg, #2f1a1a, #0d0d0d)',
                    border: `2px solid ${gameState === 'victory' ? '#ff4757' : '#3498db'}`,
                    borderRadius: '24px',
                    padding: '48px 64px',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                        {gameState === 'victory' ? '💀' : '💉'}
                    </div>

                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: gameState === 'victory' ? '#ff4757' : '#3498db',
                        marginBottom: '12px'
                    }}>
                        {gameState === 'victory' ? 'HUMANIDADE ERRADICADA' : 'VÍRUS DERROTADO'}
                    </h1>

                    <p style={{
                        fontSize: '16px',
                        color: '#888',
                        marginBottom: '32px'
                    }}>
                        {gameState === 'victory'
                            ? `${virusName} devastou a cidade em ${day} dias.`
                            : `A humanidade conseguiu derrotar ${virusName}.`
                        }
                    </p>

                    {/* Estatísticas finais */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        marginBottom: '32px'
                    }}>
                        <StatBox label="Dias" value={day} color="#f1c40f" />
                        <StatBox label="Mortos" value={totalDead.toLocaleString()} color="#ff4757" />
                        <StatBox label="Curados" value={totalCured.toLocaleString()} color="#2ecc71" />
                    </div>

                    <button
                        onClick={resetGame}
                        style={{
                            padding: '16px 48px',
                            fontSize: '16px',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #ff4757, #ff6b7a)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        🦠 Jogar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Evolution Tree Modal */}
            {showEvolution && <EvolutionTree onClose={() => setShowEvolution(false)} />}

            <div style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 10,
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                {/* Top Bar - Estatísticas Globais */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'stretch',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.8))',
                    borderBottom: '1px solid #333',
                    pointerEvents: 'auto'
                }}>
                    {/* Virus Info */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        borderRight: '1px solid #333'
                    }}>
                        <span style={{ fontSize: '28px' }}>{selectedVirusType?.icon}</span>
                        <div>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: selectedVirusType?.color || '#ff4757'
                            }}>
                                {virusName}
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>
                                Dia {day}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        padding: '12px 24px',
                        flex: 1
                    }}>
                        <GlobalStat
                            icon="❤️"
                            label="Saudáveis"
                            value={healthy.toLocaleString()}
                            color="#2ecc71"
                        />
                        <GlobalStat
                            icon="🦠"
                            label="Infectados"
                            value={`${totalInfected.toLocaleString()} (${percentInfected}%)`}
                            color="#ff9500"
                        />
                        <GlobalStat
                            icon="💀"
                            label="Mortos"
                            value={`${totalDead.toLocaleString()} (${percentDead}%)`}
                            color="#ff4757"
                        />
                        <GlobalStat
                            icon="💉"
                            label="Imunes"
                            value={totalCured.toLocaleString()}
                            color="#3498db"
                        />
                        <GlobalStat
                            icon="🏘️"
                            label="Zonas Infectadas"
                            value={`${infectedZones}/${zones.length}`}
                            color="#9b59b6"
                        />
                    </div>

                    {/* DNA Points & Evolution Button */}
                    <button
                        onClick={() => setShowEvolution(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 24px',
                            background: 'rgba(255, 149, 0, 0.15)',
                            border: 'none',
                            borderLeft: '1px solid #333',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 149, 0, 0.25)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 149, 0, 0.15)'}
                    >
                        <span style={{ fontSize: '24px' }}>🧬</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#ff9500'
                            }}>
                                {dnaPoints}
                            </div>
                            <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase' }}>
                                DNA Points
                            </div>
                        </div>
                    </button>

                    {/* Time Controls */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        borderLeft: '1px solid #333'
                    }}>
                        <button
                            onClick={togglePause}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: isPaused ? '2px solid #ffa502' : '1px solid #444',
                                background: isPaused ? 'rgba(255, 165, 2, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: isPaused ? '#ffa502' : '#888',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            {isPaused ? '▶' : '⏸'}
                        </button>

                        {[1, 2, 3].map(s => (
                            <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    border: speed === s ? '2px solid #00d4aa' : '1px solid #333',
                                    background: speed === s ? 'rgba(0, 212, 170, 0.2)' : 'transparent',
                                    color: speed === s ? '#00d4aa' : '#666',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar - Government Info & Cure Progress */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.95), rgba(0,0,0,0.8))',
                    borderTop: '1px solid #333',
                    pointerEvents: 'auto'
                }}>
                    {/* Government Awareness */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>🏛️</span>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>
                                    Consciência do Governo
                                </div>
                                <div style={{
                                    width: '150px',
                                    height: '8px',
                                    background: '#222',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${governmentAwareness}%`,
                                        height: '100%',
                                        background: governmentAwareness > 70
                                            ? 'linear-gradient(90deg, #ff4757, #ff6b7a)'
                                            : governmentAwareness > 40
                                                ? 'linear-gradient(90deg, #ffa502, #ffc048)'
                                                : 'linear-gradient(90deg, #2ecc71, #58d68d)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: governmentAwareness > 70 ? '#ff4757' : '#888'
                            }}>
                                {governmentAwareness.toFixed(0)}%
                            </span>
                        </div>

                        {/* Cure Progress */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>💉</span>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>
                                    Progresso da Cura
                                </div>
                                <div style={{
                                    width: '150px',
                                    height: '8px',
                                    background: '#222',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${cureProgress}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #3498db, #5dade2)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: cureProgress > 70 ? '#ff4757' : '#3498db'
                            }}>
                                {cureProgress.toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    {/* News Ticker */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: 1,
                        justifyContent: 'flex-end',
                        overflow: 'hidden'
                    }}>
                        {newsQueue.slice(-3).map(news => (
                            <div
                                key={news.id}
                                onClick={() => dismissNews(news.id)}
                                style={{
                                    padding: '8px 16px',
                                    background: news.type === 'danger'
                                        ? 'rgba(255, 71, 87, 0.2)'
                                        : news.type === 'warning'
                                            ? 'rgba(255, 165, 2, 0.2)'
                                            : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${news.type === 'danger' ? '#ff4757' :
                                            news.type === 'warning' ? '#ffa502' : '#333'
                                        }`,
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    color: '#ccc',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    animation: 'slideIn 0.3s ease'
                                }}
                            >
                                📰 {news.text}
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
                    @keyframes slideIn {
                        from { 
                            opacity: 0; 
                            transform: translateX(20px); 
                        }
                        to { 
                            opacity: 1; 
                            transform: translateX(0); 
                        }
                    }
                `}</style>
            </div>
        </>
    );
}

function GlobalStat({ icon, label, value, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <div>
                <div style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase' }}>
                    {label}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, color }) {
    return (
        <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                {label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color }}>
                {value}
            </div>
        </div>
    );
}
