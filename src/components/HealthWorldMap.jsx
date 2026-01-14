/**
 * HealthWorldMap - Mapa do Mundo Estilo Plague Inc
 * Com camadas alternáveis (casos, risco, cooperação, hospital)
 */

import { useMemo } from 'react';
import { useHealthStore } from '../store/healthStore';

function HealthWorldMap() {
    const {
        zones,
        selectedZone,
        activeMapLayer,
        selectZone,
        clearSelection,
        climate,
    } = useHealthStore();

    // Calcular cor baseado na camada ativa
    const getZoneColor = (zone) => {
        switch (activeMapLayer) {
            case 'cases':
                const caseRatio = zone.cases / zone.population;
                if (caseRatio === 0) return '#1a472a';
                if (caseRatio < 0.01) return '#2ecc71';
                if (caseRatio < 0.05) return '#f1c40f';
                if (caseRatio < 0.1) return '#e67e22';
                return '#c0392b';

            case 'risk':
                const risk = zone.environmentalRisk;
                if (risk < 0.2) return '#27ae60';
                if (risk < 0.4) return '#f1c40f';
                if (risk < 0.6) return '#e67e22';
                return '#e74c3c';

            case 'cooperation':
                const coop = zone.cooperation;
                if (coop > 0.7) return '#27ae60';
                if (coop > 0.5) return '#3498db';
                if (coop > 0.3) return '#f39c12';
                return '#e74c3c';

            case 'hospital':
                const load = zone.hospitalLoad;
                if (load < 0.3) return '#27ae60';
                if (load < 0.6) return '#f1c40f';
                if (load < 0.8) return '#e67e22';
                return '#e74c3c';

            default:
                return zone.color;
        }
    };

    // Calcular valor para exibir
    const getZoneValue = (zone) => {
        switch (activeMapLayer) {
            case 'cases':
                return zone.cases > 0 ? zone.cases : '';
            case 'risk':
                return `${Math.round(zone.environmentalRisk * 100)}%`;
            case 'cooperation':
                return `${Math.round(zone.cooperation * 100)}%`;
            case 'hospital':
                return `${Math.round(zone.hospitalLoad * 100)}%`;
            default:
                return zone.cases > 0 ? zone.cases : '';
        }
    };

    // Grid do mapa
    const mapGrid = useMemo(() => {
        const grid = [];
        for (let y = -2; y <= 4; y++) {
            for (let x = -4; x <= 4; x++) {
                const zone = zones.find(z => z.position[0] === x && z.position[1] === y);
                if (zone) {
                    grid.push({ ...zone, x, y });
                }
            }
        }
        return grid;
    }, [zones]);

    return (
        <div style={styles.mapContainer} onClick={clearSelection}>
            {/* Efeito de clima */}
            <ClimateEffect rain={climate.rain} />

            {/* Grid de zonas */}
            <svg
                viewBox="-5 -3 11 8"
                style={styles.mapSvg}
            >
                {/* Conexões entre zonas */}
                {zones.map(zone =>
                    zones
                        .filter(z => {
                            const dist = Math.abs(z.position[0] - zone.position[0]) +
                                Math.abs(z.position[1] - zone.position[1]);
                            return dist === 1 || dist === 2;
                        })
                        .map(neighbor => (
                            <line
                                key={`${zone.id}-${neighbor.id}`}
                                x1={zone.position[0]}
                                y1={zone.position[1]}
                                x2={neighbor.position[0]}
                                y2={neighbor.position[1]}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="0.02"
                            />
                        ))
                )}

                {/* Zonas */}
                {mapGrid.map(zone => (
                    <g
                        key={zone.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            selectZone(zone.id);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Círculo da zona */}
                        <circle
                            cx={zone.x}
                            cy={zone.y}
                            r={0.4 + (zone.population / 100000)}
                            fill={getZoneColor(zone)}
                            stroke={selectedZone?.id === zone.id ? '#fff' : 'rgba(255,255,255,0.3)'}
                            strokeWidth={selectedZone?.id === zone.id ? 0.08 : 0.02}
                            style={{
                                transition: 'fill 0.3s, stroke-width 0.2s',
                                filter: zone.cases > 0 ? 'drop-shadow(0 0 0.2px rgba(231, 76, 60, 0.8))' : 'none',
                            }}
                        />

                        {/* Ícone de risco ambiental */}
                        {zone.environmentalRisk > 0.5 && activeMapLayer !== 'risk' && (
                            <text
                                x={zone.x + 0.35}
                                y={zone.y - 0.35}
                                fontSize="0.25"
                                textAnchor="middle"
                            >
                                💧
                            </text>
                        )}

                        {/* Valor da camada */}
                        <text
                            x={zone.x}
                            y={zone.y + 0.08}
                            fontSize="0.22"
                            textAnchor="middle"
                            fill="#fff"
                            fontWeight="bold"
                            style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
                        >
                            {getZoneValue(zone)}
                        </text>

                        {/* Nome da zona */}
                        <text
                            x={zone.x}
                            y={zone.y + 0.65}
                            fontSize="0.12"
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.7)"
                        >
                            {zone.name}
                        </text>

                        {/* Indicador de pulso para casos ativos */}
                        {zone.cases > 0 && (
                            <circle
                                cx={zone.x}
                                cy={zone.y}
                                r={0.4 + (zone.population / 100000)}
                                fill="none"
                                stroke="rgba(231, 76, 60, 0.5)"
                                strokeWidth="0.03"
                                style={{
                                    animation: 'pulse 2s ease-in-out infinite',
                                }}
                            />
                        )}
                    </g>
                ))}
            </svg>

            {/* Legenda */}
            <Legend layer={activeMapLayer} />
        </div>
    );
}

function ClimateEffect({ rain }) {
    if (rain < 0.3) return null;

    const dropCount = Math.floor(rain * 50);

    return (
        <div style={styles.rainContainer}>
            {[...Array(dropCount)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        ...styles.rainDrop,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                    }}
                />
            ))}
        </div>
    );
}

function Legend({ layer }) {
    const legends = {
        cases: [
            { color: '#1a472a', label: 'Sem casos' },
            { color: '#2ecc71', label: '< 1%' },
            { color: '#f1c40f', label: '1-5%' },
            { color: '#e67e22', label: '5-10%' },
            { color: '#c0392b', label: '> 10%' },
        ],
        risk: [
            { color: '#27ae60', label: 'Baixo' },
            { color: '#f1c40f', label: 'Médio' },
            { color: '#e67e22', label: 'Alto' },
            { color: '#e74c3c', label: 'Crítico' },
        ],
        cooperation: [
            { color: '#27ae60', label: 'Alta' },
            { color: '#3498db', label: 'Boa' },
            { color: '#f39c12', label: 'Baixa' },
            { color: '#e74c3c', label: 'Resistência' },
        ],
        hospital: [
            { color: '#27ae60', label: 'Normal' },
            { color: '#f1c40f', label: 'Alerta' },
            { color: '#e67e22', label: 'Sobrecarregado' },
            { color: '#e74c3c', label: 'Colapso' },
        ],
    };

    const currentLegend = legends[layer] || legends.cases;
    const titles = {
        cases: '🤒 Casos Ativos',
        risk: '💧 Risco Ambiental',
        cooperation: '🤝 Cooperação',
        hospital: '🏥 Carga Hospitalar',
    };

    return (
        <div style={styles.legend}>
            <div style={styles.legendTitle}>{titles[layer]}</div>
            <div style={styles.legendItems}>
                {currentLegend.map((item, i) => (
                    <div key={i} style={styles.legendItem}>
                        <div style={{ ...styles.legendColor, background: item.color }} />
                        <span style={styles.legendLabel}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    mapContainer: {
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    mapSvg: {
        width: '100%',
        height: '100%',
    },
    rainContainer: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
    },
    rainDrop: {
        position: 'absolute',
        top: '-10px',
        width: '2px',
        height: '15px',
        background: 'linear-gradient(transparent, rgba(100, 150, 255, 0.5))',
        animation: 'fall 1s linear infinite',
    },
    legend: {
        position: 'absolute',
        bottom: '80px',
        right: '20px',
        background: 'rgba(0,0,0,0.85)',
        borderRadius: '10px',
        padding: '0.8rem 1rem',
        pointerEvents: 'none',
    },
    legendTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
    },
    legendItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    legendColor: {
        width: '16px',
        height: '16px',
        borderRadius: '4px',
    },
    legendLabel: {
        color: '#ccc',
        fontSize: '0.8rem',
    },
};

// Animações CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.2; transform: scale(1.3); }
    }
    
    @keyframes fall {
        to { transform: translateY(100vh); }
    }
`;
document.head.appendChild(styleSheet);

export default HealthWorldMap;
