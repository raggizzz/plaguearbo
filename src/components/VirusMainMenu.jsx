/**
 * VirusMainMenu - Menu Principal Estilo Plague Inc
 * Seleção de vírus e início do jogo
 */

import { useState } from 'react';
import { useVirusStore, VIRUS_TYPES } from '../store/virusStore';

export default function VirusMainMenu() {
    const { gameState, selectVirus, selectedVirusType, setVirusName, startGame, zones } = useVirusStore();
    const [customName, setCustomName] = useState('');
    const [hoveredVirus, setHoveredVirus] = useState(null);
    const [selectedStartZone, setSelectedStartZone] = useState(null);

    // Tela de seleção de vírus
    if (gameState === 'menu') {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
                overflow: 'hidden'
            }}>
                {/* Partículas de vírus no fundo */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    opacity: 0.3
                }}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${20 + Math.random() * 40}px`,
                            height: `${20 + Math.random() * 40}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${['#ff4757', '#9b59b6', '#e67e22', '#2ecc71'][i % 4]}44, transparent)`,
                            animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`
                        }} />
                    ))}
                </div>

                {/* Logo */}
                <div style={{
                    fontSize: '80px',
                    marginBottom: '10px',
                    animation: 'pulse 2s infinite'
                }}>
                    🦠
                </div>

                <h1 style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    color: '#ff4757',
                    textShadow: '0 0 40px rgba(255, 71, 87, 0.5)',
                    marginBottom: '8px',
                    letterSpacing: '-2px'
                }}>
                    ARBOVÍRUS
                </h1>

                <p style={{
                    fontSize: '16px',
                    color: '#666',
                    marginBottom: '40px',
                    fontStyle: 'italic'
                }}>
                    Infecte a humanidade. Evolua. Domine.
                </p>

                {/* Grade de vírus */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    maxWidth: '900px',
                    padding: '0 20px'
                }}>
                    {Object.values(VIRUS_TYPES).map((virus) => (
                        <button
                            key={virus.id}
                            onClick={() => !virus.locked && selectVirus(virus.id)}
                            onMouseEnter={() => setHoveredVirus(virus.id)}
                            onMouseLeave={() => setHoveredVirus(null)}
                            disabled={virus.locked}
                            style={{
                                background: hoveredVirus === virus.id && !virus.locked
                                    ? `linear-gradient(180deg, ${virus.color}22, ${virus.color}11)`
                                    : 'rgba(255,255,255,0.03)',
                                border: `2px solid ${virus.locked ? '#333' : hoveredVirus === virus.id ? virus.color : '#444'}`,
                                borderRadius: '16px',
                                padding: '24px 20px',
                                cursor: virus.locked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: virus.locked ? 0.4 : 1,
                                transform: hoveredVirus === virus.id && !virus.locked ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                                {virus.locked ? '🔒' : virus.icon}
                            </div>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: virus.locked ? '#555' : virus.color,
                                marginBottom: '8px'
                            }}>
                                {virus.name}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: '#666',
                                lineHeight: 1.5
                            }}>
                                {virus.description}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    fontSize: '12px',
                    color: '#444'
                }}>
                    v1.0.0 • Simulador Educacional de Arboviroses
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-30px) rotate(180deg); }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `}</style>
            </div>
        );
    }

    // Tela de nomear vírus
    if (gameState === 'naming') {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                <div style={{
                    fontSize: '60px',
                    marginBottom: '20px'
                }}>
                    {selectedVirusType?.icon}
                </div>

                <h2 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '8px'
                }}>
                    Nomeie sua criação
                </h2>

                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '30px'
                }}>
                    Baseado em: {selectedVirusType?.name}
                </p>

                <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`${selectedVirusType?.name} Mutante`}
                    maxLength={30}
                    style={{
                        width: '300px',
                        padding: '16px 20px',
                        fontSize: '18px',
                        fontWeight: '600',
                        background: 'rgba(255,255,255,0.05)',
                        border: `2px solid ${selectedVirusType?.color || '#ff4757'}`,
                        borderRadius: '12px',
                        color: '#f8fafc',
                        textAlign: 'center',
                        marginBottom: '30px',
                        outline: 'none'
                    }}
                />

                <button
                    onClick={() => {
                        setVirusName(customName || `${selectedVirusType?.name} Mutante`);
                        useVirusStore.setState({ gameState: 'selecting' });
                    }}
                    style={{
                        padding: '16px 48px',
                        fontSize: '16px',
                        fontWeight: '700',
                        background: `linear-gradient(135deg, ${selectedVirusType?.color}, ${selectedVirusType?.color}aa)`,
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        cursor: 'pointer',
                        boxShadow: `0 4px 20px ${selectedVirusType?.color}66`
                    }}
                >
                    Continuar →
                </button>
            </div>
        );
    }

    // Tela de seleção de zona inicial
    if (gameState === 'selecting') {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
                padding: '40px'
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '8px'
                }}>
                    Escolha o Paciente Zero
                </h2>

                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '30px'
                }}>
                    Onde o primeiro caso será detectado?
                </p>

                {/* Mapa simplificado */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(4, 1fr)',
                    gap: '8px',
                    maxWidth: '600px',
                    width: '100%',
                    marginBottom: '30px'
                }}>
                    {zones.map((zone) => {
                        const gridCol = Math.floor((zone.position[0] + 4) / 2) + 1;
                        const gridRow = Math.floor((zone.position[1] + 2) / 2) + 1;
                        const isSelected = selectedStartZone === zone.id;
                        const isHovered = hoveredVirus === zone.id;

                        return (
                            <button
                                key={zone.id}
                                onClick={() => setSelectedStartZone(zone.id)}
                                onMouseEnter={() => setHoveredVirus(zone.id)}
                                onMouseLeave={() => setHoveredVirus(null)}
                                style={{
                                    gridColumn: gridCol,
                                    gridRow: gridRow,
                                    padding: '12px 8px',
                                    background: isSelected
                                        ? `linear-gradient(135deg, ${selectedVirusType?.color}44, ${selectedVirusType?.color}22)`
                                        : isHovered
                                            ? 'rgba(255,255,255,0.08)'
                                            : 'rgba(255,255,255,0.03)',
                                    border: isSelected
                                        ? `2px solid ${selectedVirusType?.color}`
                                        : '1px solid #333',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: isSelected ? selectedVirusType?.color : '#888',
                                    marginBottom: '4px'
                                }}>
                                    {zone.name}
                                </div>
                                <div style={{
                                    fontSize: '9px',
                                    color: '#555'
                                }}>
                                    {zone.population.toLocaleString()} hab
                                </div>
                                <div style={{
                                    fontSize: '8px',
                                    color: zone.wealth === 'high' ? '#2ecc71' : zone.wealth === 'medium' ? '#f1c40f' : '#e74c3c',
                                    marginTop: '2px'
                                }}>
                                    {zone.wealth === 'high' ? '💎 Rica' : zone.wealth === 'medium' ? '🏠 Média' : '🏚️ Pobre'}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Dica */}
                {selectedStartZone && (
                    <div style={{
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                            💡 <strong style={{ color: '#ffa502' }}>Dica:</strong> Bairros pobres têm menos saneamento,
                            mas o governo monitora mais. Bairros ricos são mais difíceis de infectar.
                        </p>
                    </div>
                )}

                <button
                    onClick={() => selectedStartZone && startGame(selectedStartZone)}
                    disabled={!selectedStartZone}
                    style={{
                        padding: '16px 48px',
                        fontSize: '16px',
                        fontWeight: '700',
                        background: selectedStartZone
                            ? `linear-gradient(135deg, ${selectedVirusType?.color}, ${selectedVirusType?.color}aa)`
                            : '#333',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        cursor: selectedStartZone ? 'pointer' : 'not-allowed',
                        boxShadow: selectedStartZone ? `0 4px 20px ${selectedVirusType?.color}66` : 'none',
                        opacity: selectedStartZone ? 1 : 0.5
                    }}
                >
                    🦠 Liberar o Vírus
                </button>
            </div>
        );
    }

    return null;
}
