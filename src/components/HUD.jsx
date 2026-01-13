/**
 * HUD - Interface (VERSÃO VISCERAL)
 * Contador que mete medo, ameaças pessoais, fim de capítulo
 */

import { useGameStore } from '../store/gameStore';

// ============================================
// O CONTADOR QUE METE MEDO
// ============================================
function PublicTrustMeter() {
    const { publicTrust, totalDeaths, chapter, focusMode } = useGameStore();

    if (focusMode) return null;

    const trendIcons = {
        rising: '↗️',
        stable: '→',
        falling: '↘️',
        crashing: '⚠️'
    };

    const trendColors = {
        rising: '#2ed573',
        stable: '#94a3b8',
        falling: '#ffa502',
        crashing: '#ff4757'
    };

    const progressPercent = (chapter.currentDay / chapter.duration) * 100;

    return (
        <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(10, 14, 23, 0.92)',
            backdropFilter: 'blur(10px)',
            border: publicTrust.value < 30 ? '2px solid #ff4757' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '14px 18px',
            fontFamily: 'Inter, sans-serif',
            minWidth: '180px',
            boxShadow: publicTrust.value < 30 ? '0 0 20px rgba(255, 71, 87, 0.3)' : 'none'
        }}>
            {/* Progresso do capítulo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Temporada de Chuvas</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                    Dia {chapter.currentDay}/{chapter.duration}
                </span>
            </div>

            {/* Barra de progresso do capítulo */}
            <div style={{
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                marginBottom: '14px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: progressPercent > 80 ? '#ffa502' : '#00d4aa',
                    transition: 'width 0.5s ease'
                }} />
            </div>

            {/* CONFIANÇA PÚBLICA - O número que importa */}
            <div style={{ marginBottom: '10px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                }}>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Confiança Pública
                    </span>
                    <span style={{
                        fontSize: '10px',
                        color: trendColors[publicTrust.trend]
                    }}>
                        {trendIcons[publicTrust.trend]}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px'
                }}>
                    <span style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: publicTrust.value < 25 ? '#ff4757' : publicTrust.value < 50 ? '#ffa502' : '#f8fafc',
                        lineHeight: 1
                    }}>
                        {Math.round(publicTrust.value)}
                    </span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>%</span>
                </div>

                {/* Barra de confiança */}
                <div style={{
                    height: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    marginTop: '8px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${publicTrust.value}%`,
                        height: '100%',
                        background: publicTrust.value < 25
                            ? 'linear-gradient(90deg, #ff4757, #ff6b6b)'
                            : publicTrust.value < 50
                                ? 'linear-gradient(90deg, #ffa502, #ffbe3d)'
                                : 'linear-gradient(90deg, #2ed573, #7bed9f)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>

                {/* Alerta de queda */}
                {publicTrust.trend === 'crashing' && (
                    <div style={{
                        marginTop: '8px',
                        padding: '6px 8px',
                        background: 'rgba(255, 71, 87, 0.15)',
                        borderRadius: '6px',
                        fontSize: '10px',
                        color: '#ff4757'
                    }}>
                        ⚠️ {publicTrust.lastDrop || 'Confiança despencando'}
                    </div>
                )}
            </div>

            {/* Mortes - sempre visível como lembrete */}
            {totalDeaths > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Mortes</span>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#ff4757'
                    }}>
                        {totalDeaths}
                    </span>
                </div>
            )}
        </div>
    );
}

// ============================================
// BARRA SUPERIOR MINIMALISTA
// ============================================
function TopBar() {
    const { resources, weather, day, month, isPaused, togglePause, gameSpeed, setGameSpeed, focusMode } = useGameStore();

    if (focusMode) return null;

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    return (
        <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(10, 14, 23, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '10px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Orçamento */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>💰</span>
                <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: resources.budget < 20000 ? '#ff4757' : '#f8fafc'
                }}>
                    R$ {(resources.budget / 1000).toFixed(0)}k
                </span>
            </div>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />

            {/* Clima */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>{weather.icon}</span>
                {weather.threat && (
                    <span style={{ fontSize: '10px', color: '#ffa502' }}>⚠️</span>
                )}
            </div>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />

            {/* Controles de tempo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {day} {months[month - 1]}
                </span>

                <button
                    onClick={togglePause}
                    style={{
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        borderRadius: '8px',
                        background: isPaused ? '#ffa502' : 'rgba(255,255,255,0.1)',
                        color: isPaused ? '#0a0e17' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                    }}
                >
                    {isPaused ? '▶' : '⏸'}
                </button>

                {[1, 2, 3].map(speed => (
                    <button
                        key={speed}
                        onClick={() => setGameSpeed(speed)}
                        style={{
                            width: '26px',
                            height: '26px',
                            border: 'none',
                            borderRadius: '6px',
                            background: gameSpeed === speed ? '#00d4aa' : 'transparent',
                            color: gameSpeed === speed ? '#0a0e17' : '#64748b',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: '600'
                        }}
                    >
                        {speed}x
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============================================
// PAINEL DE DECISÃO URGENTE
// ============================================
function DecisionPanel() {
    const { pendingDecision, makeDecision, focusMode } = useGameStore();

    if (!pendingDecision || !focusMode) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100
        }}>
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: -1
            }} />

            <div style={{
                background: 'linear-gradient(180deg, rgba(30, 20, 20, 0.98), rgba(10, 10, 15, 0.98))',
                border: pendingDecision.urgent ? '2px solid #ff4757' : '2px solid #ffa502',
                borderRadius: '20px',
                padding: '28px 32px',
                minWidth: '400px',
                maxWidth: '480px',
                boxShadow: pendingDecision.urgent
                    ? '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 60px rgba(255, 71, 87, 0.2)'
                    : '0 20px 60px rgba(0, 0, 0, 0.6)',
                fontFamily: 'Inter, sans-serif'
            }}>
                {/* Header de urgência */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px'
                }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: pendingDecision.urgent ? '#ff4757' : '#ffa502',
                        animation: 'pulse 1s infinite'
                    }} />
                    <span style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: pendingDecision.urgent ? '#ff4757' : '#ffa502',
                        fontWeight: '600'
                    }}>
                        {pendingDecision.urgent ? 'CRISE URGENTE' : 'Decisão Necessária'}
                    </span>
                </div>

                {/* Ameaça pessoal */}
                {pendingDecision.threat && (
                    <div style={{
                        background: 'rgba(255, 71, 87, 0.1)',
                        border: '1px solid rgba(255, 71, 87, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                        fontSize: '12px',
                        color: '#ff6b6b',
                        fontStyle: 'italic'
                    }}>
                        ⚠️ {pendingDecision.threat}
                    </div>
                )}

                {/* Pergunta */}
                <h2 style={{
                    fontSize: '17px',
                    fontWeight: '600',
                    color: '#f8fafc',
                    lineHeight: 1.6,
                    marginBottom: '24px'
                }}>
                    {pendingDecision.question}
                </h2>

                {/* Opções com sacrifício visível */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pendingDecision.options.map((option, i) => (
                        <button
                            key={option.id}
                            onClick={() => !option.disabled && makeDecision(option.id)}
                            disabled={option.disabled}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '6px',
                                padding: '14px 18px',
                                border: option.sacrifice?.includes('Mortes') || option.sacrifice?.includes('nunca')
                                    ? '2px solid #ff4757'
                                    : i === 0
                                        ? '2px solid #00d4aa'
                                        : '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                background: option.disabled
                                    ? 'rgba(255,255,255,0.02)'
                                    : i === 0
                                        ? 'rgba(0, 212, 170, 0.08)'
                                        : 'rgba(255,255,255,0.03)',
                                cursor: option.disabled ? 'not-allowed' : 'pointer',
                                textAlign: 'left',
                                opacity: option.disabled ? 0.4 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: option.disabled ? '#64748b' : '#f8fafc'
                            }}>
                                {option.label}
                            </span>
                            <span style={{
                                fontSize: '12px',
                                color: '#94a3b8',
                                lineHeight: 1.4
                            }}>
                                {option.sublabel}
                            </span>
                            {/* O SACRIFÍCIO - sempre visível */}
                            {option.sacrifice && (
                                <span style={{
                                    fontSize: '11px',
                                    color: option.sacrifice.includes('nunca') || option.sacrifice.includes('Mort') ? '#ff4757' : '#ffa502',
                                    marginTop: '4px'
                                }}>
                                    💀 {option.sacrifice}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <p style={{
                    fontSize: '10px',
                    color: '#475569',
                    marginTop: '20px',
                    textAlign: 'center',
                    fontStyle: 'italic'
                }}>
                    Não existe resposta perfeita. Apenas consequências.
                </p>
            </div>
        </div>
    );
}

// ============================================
// FEEDBACK EMOCIONAL
// ============================================
function OutcomeMessage() {
    const { outcomeMessage } = useGameStore();

    if (!outcomeMessage) return null;

    const colors = {
        action: { bg: 'rgba(0, 212, 170, 0.15)', border: 'rgba(0, 212, 170, 0.4)', text: '#00d4aa' },
        neutral: { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.3)', text: '#94a3b8' },
        sacrifice: { bg: 'rgba(255, 165, 2, 0.15)', border: 'rgba(255, 165, 2, 0.4)', text: '#ffa502' },
        scar: { bg: 'rgba(255, 71, 87, 0.15)', border: 'rgba(255, 71, 87, 0.4)', text: '#ff4757' }
    };

    const style = colors[outcomeMessage.type] || colors.neutral;

    return (
        <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: style.bg,
            border: `1px solid ${style.border}`,
            borderRadius: '16px',
            padding: '14px 24px',
            fontFamily: 'Inter, sans-serif',
            maxWidth: '450px',
            textAlign: 'center',
            animation: 'fadeInUp 0.5s ease'
        }}>
            <div style={{
                fontSize: '13px',
                color: style.text,
                fontStyle: outcomeMessage.type !== 'scar' ? 'italic' : 'normal',
                fontWeight: outcomeMessage.type === 'scar' ? '600' : '400',
                lineHeight: 1.5
            }}>
                {outcomeMessage.text}
            </div>
        </div>
    );
}

// ============================================
// PAINEL DO BAIRRO
// ============================================
function DistrictPanel() {
    const { selectedDistrict, clearSelection, districts, focusMode } = useGameStore();

    if (!selectedDistrict) return null;

    const d = districts.find(dist => dist.id === selectedDistrict.id) || selectedDistrict;

    if (focusMode) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '16px',
            background: 'rgba(10, 14, 23, 0.92)',
            backdropFilter: 'blur(10px)',
            border: d.scars.length > 0 ? '2px solid #ff4757' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '18px 22px',
            fontFamily: 'Inter, sans-serif',
            minWidth: '240px',
            animation: 'slideIn 0.3s ease'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px'
            }}>
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                        {d.name}
                    </h3>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {d.population.toLocaleString()} hab
                    </span>
                </div>
                <button
                    onClick={clearSelection}
                    style={{
                        width: '26px',
                        height: '26px',
                        border: 'none',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Cicatrizes do bairro */}
            {d.scars.length > 0 && (
                <div style={{
                    background: 'rgba(255, 71, 87, 0.1)',
                    border: '1px solid rgba(255, 71, 87, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    marginBottom: '12px',
                    fontSize: '10px',
                    color: '#ff6b6b'
                }}>
                    ⚠️ Este bairro carrega cicatrizes permanentes
                </div>
            )}

            {/* Status */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '12px'
            }}>
                <div style={{
                    padding: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Casos</div>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: d.infectedCount > 10 ? '#ff4757' : d.infectedCount > 0 ? '#ffa502' : '#2ed573'
                    }}>
                        {d.infectedCount}
                    </div>
                </div>
                <div style={{
                    padding: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Confiança</div>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: d.trust < 0.3 ? '#ff4757' : d.trust < 0.5 ? '#ffa502' : '#2ed573'
                    }}>
                        {Math.round(d.trust * 100)}%
                    </div>
                </div>
            </div>

            {/* Limite de confiança (se danificado) */}
            {d.maxTrust < 0.9 && (
                <div style={{
                    fontSize: '10px',
                    color: '#64748b',
                    fontStyle: 'italic'
                }}>
                    Máximo de confiança: {Math.round(d.maxTrust * 100)}% (dano permanente)
                </div>
            )}
        </div>
    );
}

// ============================================
// GAME OVER / VITÓRIA
// ============================================
function GameOverScreen() {
    const { gameOver, victory, gameOverReason, totalDeaths, publicTrust, permanentScars, chapter, resetGame } = useGameStore();

    if (!gameOver && !victory) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: victory ? 'linear-gradient(180deg, #1a2f1a, #0a0e17)' : 'linear-gradient(180deg, #2f1a1a, #0a0e17)',
                border: `2px solid ${victory ? '#2ed573' : '#ff4757'}`,
                borderRadius: '24px',
                padding: '40px 50px',
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {victory ? '🎖️' : '💔'}
                </div>

                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '8px'
                }}>
                    {victory ? 'Temporada Sobrevivida' : 'Fim da Linha'}
                </h1>

                <p style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    marginBottom: '24px'
                }}>
                    {victory
                        ? `Você chegou ao fim da temporada de chuvas com ${Math.round(publicTrust.value)}% de confiança pública.`
                        : gameOverReason
                    }
                </p>

                {/* Estatísticas finais */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        padding: '14px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Duração</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc' }}>
                            {chapter.currentDay} dias
                        </div>
                    </div>
                    <div style={{
                        padding: '14px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Mortes</div>
                        <div style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: totalDeaths > 0 ? '#ff4757' : '#2ed573'
                        }}>
                            {totalDeaths}
                        </div>
                    </div>
                </div>

                {/* Cicatrizes permanentes */}
                {permanentScars.length > 0 && (
                    <div style={{
                        background: 'rgba(255, 71, 87, 0.1)',
                        border: '1px solid rgba(255, 71, 87, 0.3)',
                        borderRadius: '12px',
                        padding: '14px',
                        marginBottom: '24px',
                        textAlign: 'left'
                    }}>
                        <div style={{ fontSize: '11px', color: '#ff6b6b', marginBottom: '8px', fontWeight: '600' }}>
                            CICATRIZES PERMANENTES
                        </div>
                        {permanentScars.map((scar, i) => (
                            <div key={i} style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                • {scar.description}
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={resetGame}
                    style={{
                        padding: '14px 40px',
                        border: 'none',
                        borderRadius: '12px',
                        background: victory ? '#2ed573' : '#ff4757',
                        color: '#0a0e17',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    );
}

// ============================================
// DICA INICIAL
// ============================================
function InitialHint() {
    const { selectedDistrict, pendingDecision, totalDays, focusMode } = useGameStore();

    if (focusMode || pendingDecision || selectedDistrict || totalDays > 10) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 212, 170, 0.1)',
            border: '1px solid rgba(0, 212, 170, 0.3)',
            borderRadius: '16px',
            padding: '10px 20px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#00d4aa'
        }}>
            💡 Mantenha a confiança pública acima de 0% para sobreviver
        </div>
    );
}

// ============================================
// HUD PRINCIPAL
// ============================================
export default function HUD() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10
        }}>
            <div style={{ pointerEvents: 'auto' }}>
                <PublicTrustMeter />
                <TopBar />
                <DecisionPanel />
                <OutcomeMessage />
                <DistrictPanel />
                <InitialHint />
                <GameOverScreen />
            </div>
        </div>
    );
}
