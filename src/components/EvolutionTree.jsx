/**
 * EvolutionTree - Árvore de Evolução Estilo Plague Inc
 * Interface para comprar mutações e habilidades
 */

import { useState } from 'react';
import { useVirusStore, EVOLUTION_TREE } from '../store/virusStore';

export default function EvolutionTree({ onClose }) {
    const {
        dnaPoints,
        unlockedAbilities,
        buyEvolution,
        infectivity,
        lethality,
        severity,
        insecticideResist,
        cureResist
    } = useVirusStore();

    const [selectedTab, setSelectedTab] = useState('transmission');
    const [hoveredAbility, setHoveredAbility] = useState(null);

    const tabs = [
        { id: 'transmission', name: 'Transmissão', icon: '🦟', color: '#3498db' },
        { id: 'symptoms', name: 'Sintomas', icon: '🤒', color: '#e74c3c' },
        { id: 'abilities', name: 'Habilidades', icon: '🧬', color: '#9b59b6' }
    ];

    const currentAbilities = EVOLUTION_TREE[selectedTab] || [];

    const canBuy = (ability) => {
        if (unlockedAbilities.includes(ability.id)) return false;
        if (dnaPoints < ability.cost) return false;
        if (ability.requires.length > 0) {
            return ability.requires.every(req => unlockedAbilities.includes(req));
        }
        return true;
    };

    const isUnlocked = (abilityId) => unlockedAbilities.includes(abilityId);

    const getAbilityStatus = (ability) => {
        if (isUnlocked(ability.id)) return 'unlocked';
        if (canBuy(ability)) return 'available';
        if (dnaPoints < ability.cost) return 'expensive';
        return 'locked';
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 30px',
                borderBottom: '1px solid #333'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#f8fafc',
                        margin: 0
                    }}>
                        🧬 Árvore de Evolução
                    </h1>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        Evolua seu vírus para aumentar sua letalidade
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* DNA Points */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 149, 0, 0.15)',
                        border: '1px solid #ff9500',
                        borderRadius: '12px',
                        padding: '10px 20px'
                    }}>
                        <span style={{ fontSize: '20px' }}>🧬</span>
                        <span style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#ff9500'
                        }}>
                            {dnaPoints}
                        </span>
                        <span style={{ fontSize: '12px', color: '#ff9500' }}>DNA</span>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid #444',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#888',
                            fontSize: '18px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Stats bar */}
            <div style={{
                display: 'flex',
                gap: '24px',
                padding: '12px 30px',
                background: 'rgba(0,0,0,0.3)',
                borderBottom: '1px solid #222'
            }}>
                <StatItem label="Infectividade" value={infectivity} color="#3498db" />
                <StatItem label="Letalidade" value={lethality} color="#e74c3c" format="percent" />
                <StatItem label="Severidade" value={severity} color="#f1c40f" />
                <StatItem label="Resist. Inseticida" value={insecticideResist} color="#9b59b6" />
                <StatItem label="Resist. Cura" value={cureResist} color="#2ecc71" />
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '16px 30px'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: selectedTab === tab.id ? `2px solid ${tab.color}` : '1px solid #333',
                            background: selectedTab === tab.id ? `${tab.color}22` : 'transparent',
                            color: selectedTab === tab.id ? tab.color : '#666',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Content - Abilities Grid */}
            <div style={{
                flex: 1,
                padding: '20px 30px',
                overflowY: 'auto',
                display: 'flex',
                gap: '40px'
            }}>
                {/* Tiers */}
                {[1, 2, 3, 4].map(tier => {
                    const tierAbilities = currentAbilities.filter(a => a.tier === tier);
                    if (tierAbilities.length === 0) return null;

                    return (
                        <div key={tier} style={{ minWidth: '200px' }}>
                            <div style={{
                                fontSize: '11px',
                                color: '#555',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '16px'
                            }}>
                                Nível {tier}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {tierAbilities.map(ability => {
                                    const status = getAbilityStatus(ability);
                                    const isHovered = hoveredAbility === ability.id;

                                    return (
                                        <button
                                            key={ability.id}
                                            onClick={() => {
                                                if (canBuy(ability)) {
                                                    buyEvolution(ability.id);
                                                }
                                            }}
                                            onMouseEnter={() => setHoveredAbility(ability.id)}
                                            onMouseLeave={() => setHoveredAbility(null)}
                                            style={{
                                                padding: '16px',
                                                borderRadius: '12px',
                                                border: status === 'unlocked'
                                                    ? '2px solid #2ecc71'
                                                    : status === 'available'
                                                        ? '2px solid #ff9500'
                                                        : '1px solid #333',
                                                background: status === 'unlocked'
                                                    ? 'rgba(46, 204, 113, 0.15)'
                                                    : status === 'available' && isHovered
                                                        ? 'rgba(255, 149, 0, 0.15)'
                                                        : 'rgba(255,255,255,0.03)',
                                                cursor: status === 'available' ? 'pointer' : status === 'unlocked' ? 'default' : 'not-allowed',
                                                opacity: status === 'locked' || status === 'expensive' ? 0.5 : 1,
                                                transition: 'all 0.2s ease',
                                                transform: isHovered && status === 'available' ? 'scale(1.02)' : 'scale(1)',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '8px'
                                            }}>
                                                <span style={{ fontSize: '24px' }}>
                                                    {status === 'unlocked' ? '✓' : ability.icon}
                                                </span>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: status === 'unlocked' ? '#2ecc71' : '#f8fafc'
                                                }}>
                                                    {ability.name}
                                                </span>
                                            </div>

                                            <div style={{
                                                fontSize: '11px',
                                                color: '#888',
                                                lineHeight: 1.5,
                                                marginBottom: '8px'
                                            }}>
                                                {ability.description}
                                            </div>

                                            {status !== 'unlocked' && (
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '12px',
                                                    color: dnaPoints >= ability.cost ? '#ff9500' : '#ff4757'
                                                }}>
                                                    <span>🧬</span>
                                                    <span style={{ fontWeight: '700' }}>{ability.cost}</span>
                                                    <span style={{ color: '#666' }}>DNA</span>
                                                </div>
                                            )}

                                            {status === 'locked' && ability.requires.length > 0 && (
                                                <div style={{
                                                    fontSize: '10px',
                                                    color: '#666',
                                                    marginTop: '6px'
                                                }}>
                                                    🔒 Requer: {ability.requires.join(', ')}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer hint */}
            <div style={{
                padding: '16px 30px',
                borderTop: '1px solid #222',
                fontSize: '12px',
                color: '#555',
                textAlign: 'center'
            }}>
                💡 Ganhe DNA infectando pessoas. Mortes dão mais DNA, mas aumentam a consciência do governo.
            </div>
        </div>
    );
}

function StatItem({ label, value, color, format = 'number' }) {
    const displayValue = format === 'percent'
        ? `${(value * 100).toFixed(1)}%`
        : value.toFixed(2);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: color
            }} />
            <span style={{ fontSize: '11px', color: '#666' }}>{label}:</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color }}>{displayValue}</span>
        </div>
    );
}
