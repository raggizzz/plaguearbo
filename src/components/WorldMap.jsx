/**
 * WorldMap - Mapa da Cidade Estilo Plague Inc
 * Visualização 2D das zonas de infecção
 */

import { useMemo } from 'react';
import { useVirusStore } from '../store/virusStore';

export default function WorldMap() {
    const {
        zones,
        selectedZone,
        selectZone,
        clearSelection,
        totalInfected,
        totalDead,
        gameState
    } = useVirusStore();

    if (gameState !== 'playing') return null;

    // Calcular bounds do mapa
    const bounds = useMemo(() => {
        const xs = zones.map(z => z.position[0]);
        const ys = zones.map(z => z.position[1]);
        return {
            minX: Math.min(...xs) - 1,
            maxX: Math.max(...xs) + 1,
            minY: Math.min(...ys) - 1,
            maxY: Math.max(...ys) + 1
        };
    }, [zones]);

    const mapWidth = (bounds.maxX - bounds.minX) * 80;
    const mapHeight = (bounds.maxY - bounds.minY) * 80;

    return (
        <div style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d0d 100%)',
            overflow: 'hidden'
        }}>
            {/* Background grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
            }} />

            {/* Map container */}
            <div style={{
                position: 'relative',
                width: `${mapWidth}px`,
                height: `${mapHeight}px`
            }}>
                {/* Connections between zones */}
                <svg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                >
                    {zones.map(zone => {
                        // Draw connections to nearby zones
                        const nearbyZones = zones.filter(z => {
                            if (z.id === zone.id) return false;
                            const dist = Math.abs(z.position[0] - zone.position[0]) + Math.abs(z.position[1] - zone.position[1]);
                            return dist <= 2;
                        });

                        return nearbyZones.map(nearby => {
                            const x1 = ((zone.position[0] - bounds.minX) / (bounds.maxX - bounds.minX)) * mapWidth;
                            const y1 = ((zone.position[1] - bounds.minY) / (bounds.maxY - bounds.minY)) * mapHeight;
                            const x2 = ((nearby.position[0] - bounds.minX) / (bounds.maxX - bounds.minX)) * mapWidth;
                            const y2 = ((nearby.position[1] - bounds.minY) / (bounds.maxY - bounds.minY)) * mapHeight;

                            const hasInfection = zone.infected > 0 || nearby.infected > 0;

                            return (
                                <line
                                    key={`${zone.id}-${nearby.id}`}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={hasInfection ? '#ff475755' : '#33333388'}
                                    strokeWidth={hasInfection ? 2 : 1}
                                    strokeDasharray={hasInfection ? '0' : '4,4'}
                                />
                            );
                        });
                    })}
                </svg>

                {/* Zones */}
                {zones.map(zone => {
                    const x = ((zone.position[0] - bounds.minX) / (bounds.maxX - bounds.minX)) * 100;
                    const y = ((zone.position[1] - bounds.minY) / (bounds.maxY - bounds.minY)) * 100;

                    const infectionRate = zone.infected / zone.population;
                    const deathRate = zone.dead / zone.population;

                    const isSelected = selectedZone?.id === zone.id;
                    const isInfected = zone.infected > 0;
                    const isCritical = infectionRate > 0.3;
                    const isQuarantined = zone.quarantine;

                    // Tamanho baseado na população
                    const size = 50 + (zone.population / 30000) * 30;

                    return (
                        <div
                            key={zone.id}
                            onClick={() => isSelected ? clearSelection() : selectZone(zone.id)}
                            style={{
                                position: 'absolute',
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)',
                                cursor: 'pointer'
                            }}
                        >
                            {/* Pulse effect for infected zones */}
                            {isInfected && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: `${size * 1.5}px`,
                                    height: `${size * 1.5}px`,
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, ${isCritical ? '#ff4757' : '#ff9500'}44, transparent)`,
                                    animation: 'pulse 2s infinite'
                                }} />
                            )}

                            {/* Quarantine ring */}
                            {isQuarantined && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: `${size * 1.3}px`,
                                    height: `${size * 1.3}px`,
                                    borderRadius: '50%',
                                    border: '3px dashed #ff4757',
                                    animation: 'rotate 10s linear infinite'
                                }} />
                            )}

                            {/* Main zone circle */}
                            <div style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                borderRadius: '50%',
                                background: isInfected
                                    ? `radial-gradient(circle, 
                                        ${isCritical ? '#ff4757' : '#ff9500'} 0%, 
                                        ${isCritical ? '#c0392b' : '#e67e22'} 100%)`
                                    : `radial-gradient(circle, ${zone.color}, ${zone.color}88)`,
                                border: isSelected
                                    ? '3px solid #fff'
                                    : isQuarantined
                                        ? '2px solid #ff4757'
                                        : '2px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: isInfected
                                    ? `0 0 ${20 + infectionRate * 40}px ${isCritical ? '#ff4757' : '#ff9500'}88`
                                    : 'none'
                            }}>
                                {/* Zone name */}
                                <div style={{
                                    fontSize: '9px',
                                    fontWeight: '700',
                                    color: '#fff',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                    textAlign: 'center',
                                    lineHeight: 1.2
                                }}>
                                    {zone.name.split(' ').slice(0, 2).join(' ')}
                                </div>

                                {/* Infected count */}
                                {isInfected && (
                                    <div style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: '#fff',
                                        marginTop: '2px'
                                    }}>
                                        {zone.infected > 1000
                                            ? `${(zone.infected / 1000).toFixed(1)}k`
                                            : zone.infected
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Death indicator */}
                            {zone.dead > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '10px',
                                    background: 'rgba(0,0,0,0.8)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    color: '#ff4757'
                                }}>
                                    💀 {zone.dead}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Zone Panel */}
            {selectedZone && (
                <div style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(10, 10, 15, 0.95)',
                    border: '1px solid #333',
                    borderRadius: '16px',
                    padding: '20px',
                    width: '240px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#f8fafc',
                            margin: 0
                        }}>
                            {selectedZone.name}
                        </h3>
                        <button
                            onClick={clearSelection}
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                border: '1px solid #444',
                                background: 'transparent',
                                color: '#888',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {selectedZone.quarantine && (
                        <div style={{
                            padding: '8px 12px',
                            background: 'rgba(255, 71, 87, 0.15)',
                            border: '1px solid #ff4757',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            fontSize: '11px',
                            color: '#ff6b7a'
                        }}>
                            🚫 EM QUARENTENA
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginBottom: '12px'
                    }}>
                        <ZoneStat label="População" value={selectedZone.population.toLocaleString()} />
                        <ZoneStat
                            label="Infectados"
                            value={selectedZone.infected.toLocaleString()}
                            color={selectedZone.infected > 0 ? '#ff9500' : '#2ecc71'}
                        />
                        <ZoneStat
                            label="Mortos"
                            value={selectedZone.dead.toLocaleString()}
                            color={selectedZone.dead > 0 ? '#ff4757' : undefined}
                        />
                        <ZoneStat
                            label="Imunes"
                            value={selectedZone.immune.toLocaleString()}
                            color="#3498db"
                        />
                    </div>

                    <div style={{
                        paddingTop: '12px',
                        borderTop: '1px solid #333'
                    }}>
                        <ZoneStat
                            label="Saneamento"
                            value={`${(selectedZone.sanitation * 100).toFixed(0)}%`}
                            color={selectedZone.sanitation > 0.7 ? '#2ecc71' : selectedZone.sanitation > 0.5 ? '#f1c40f' : '#e74c3c'}
                        />
                        <ZoneStat
                            label="Densidade"
                            value={`${(selectedZone.density * 100).toFixed(0)}%`}
                        />
                        <ZoneStat
                            label="Renda"
                            value={selectedZone.wealth === 'high' ? '💎 Alta' : selectedZone.wealth === 'medium' ? '🏠 Média' : '🏚️ Baixa'}
                        />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { 
                        transform: translate(-50%, -50%) scale(1); 
                        opacity: 0.8;
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(1.3); 
                        opacity: 0.3;
                    }
                }
                @keyframes rotate {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

function ZoneStat({ label, value, color = '#888' }) {
    return (
        <div style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '10px', color: '#555' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color }}>{value}</div>
        </div>
    );
}
