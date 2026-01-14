/**
 * HealthHUD - Interface Principal do Jogo
 * Estilo Plague Inc para o gestor de saúde
 */

import { useState } from 'react';
import { useHealthStore, UPGRADE_TREES } from '../store/healthStore';

function HealthHUD() {
    const state = useHealthStore();
    const {
        gameState,
        day,
        week,
        targetWeeks,
        responsePoints,
        budget,
        publicTrust,
        totalCases,
        totalDeaths,
        totalRecovered,
        r0,
        hospitalCapacity,
        hospitalUsed,
        climate,
        speed,
        isPaused,
        newsQueue,
        pendingEvent,
        selectedZone,
        activeMapLayer,
        zones,
        togglePause,
        setSpeed,
        setMapLayer,
        dismissNews,
        resolveEvent,
        resetGame,
    } = state;

    const [showUpgrades, setShowUpgrades] = useState(false);
    const [upgradeTab, setUpgradeTab] = useState('vigilancia');

    // Tela de vitória/derrota
    if (gameState === 'victory' || gameState === 'defeat') {
        return <EndScreen isVictory={gameState === 'victory'} state={state} onRestart={resetGame} />;
    }

    // Modal de evento pendente
    if (pendingEvent) {
        return (
            <>
                <EventModal event={pendingEvent} onResolve={resolveEvent} pr={responsePoints} />
                <div style={styles.hudContainer}>
                    <TopBar {...{ day, week, targetWeeks, responsePoints, budget, publicTrust, climate }} />
                </div>
            </>
        );
    }

    const hospitalLoad = hospitalCapacity > 0 ? (hospitalUsed / hospitalCapacity) * 100 : 0;

    return (
        <div style={styles.hudContainer}>
            {/* Barra superior */}
            <TopBar {...{ day, week, targetWeeks, responsePoints, budget, publicTrust, climate }} />

            {/* Estatísticas centrais */}
            <div style={styles.statsRow}>
                <StatCard label="Casos Ativos" value={totalCases} icon="🤒" color="#e74c3c" />
                <StatCard label="Óbitos" value={totalDeaths} icon="💀" color="#8e44ad" />
                <StatCard label="Recuperados" value={totalRecovered} icon="💚" color="#27ae60" />
                <StatCard label="R₀" value={r0.toFixed(2)} icon="📈" color={r0 > 1.5 ? '#e74c3c' : '#27ae60'} />
                <StatCard
                    label="Hospital"
                    value={`${Math.round(hospitalLoad)}%`}
                    icon="🏥"
                    color={hospitalLoad > 80 ? '#e74c3c' : hospitalLoad > 50 ? '#f39c12' : '#27ae60'}
                />
            </div>

            {/* Controles de velocidade */}
            <div style={styles.speedControls}>
                <button
                    style={{ ...styles.speedBtn, ...(isPaused ? styles.speedActive : {}) }}
                    onClick={togglePause}
                >
                    {isPaused ? '▶️' : '⏸️'}
                </button>
                {[1, 2, 3].map(s => (
                    <button
                        key={s}
                        style={{ ...styles.speedBtn, ...(speed === s && !isPaused ? styles.speedActive : {}) }}
                        onClick={() => setSpeed(s)}
                    >
                        {'▶'.repeat(s)}
                    </button>
                ))}
            </div>

            {/* Camadas do mapa */}
            <div style={styles.layerControls}>
                <span style={styles.layerLabel}>Camada:</span>
                {[
                    { id: 'cases', icon: '🤒', name: 'Casos' },
                    { id: 'risk', icon: '💧', name: 'Risco' },
                    { id: 'cooperation', icon: '🤝', name: 'Cooperação' },
                    { id: 'hospital', icon: '🏥', name: 'Hospital' },
                ].map(layer => (
                    <button
                        key={layer.id}
                        style={{
                            ...styles.layerBtn,
                            ...(activeMapLayer === layer.id ? styles.layerActive : {})
                        }}
                        onClick={() => setMapLayer(layer.id)}
                        title={layer.name}
                    >
                        {layer.icon}
                    </button>
                ))}
            </div>

            {/* Botão de Upgrades */}
            <button
                style={styles.upgradeButton}
                onClick={() => setShowUpgrades(true)}
            >
                <span style={styles.upgradeIcon}>🧬</span>
                <span>MELHORIAS</span>
                <span style={styles.prBadge}>{responsePoints} PR</span>
            </button>

            {/* Painel de zona selecionada */}
            {selectedZone && (
                <ZonePanel zone={selectedZone} onAction={state.executeAction} budget={budget} />
            )}

            {/* Feed de notícias */}
            <div style={styles.newsFeed}>
                {newsQueue.slice(-5).map(news => (
                    <div
                        key={news.id}
                        style={{
                            ...styles.newsItem,
                            borderLeftColor: getNewsColor(news.type)
                        }}
                        onClick={() => dismissNews(news.id)}
                    >
                        <span style={styles.newsDay}>Dia {news.day}</span>
                        <span>{news.text}</span>
                    </div>
                ))}
            </div>

            {/* Modal de Upgrades */}
            {showUpgrades && (
                <UpgradeModal
                    tab={upgradeTab}
                    setTab={setUpgradeTab}
                    onClose={() => setShowUpgrades(false)}
                    pr={responsePoints}
                    unlocked={state.unlockedUpgrades}
                    onBuy={state.buyUpgrade}
                />
            )}
        </div>
    );
}

// Componentes auxiliares
function TopBar({ day, week, targetWeeks, responsePoints, budget, publicTrust, climate }) {
    return (
        <div style={styles.topBar}>
            <div style={styles.topLeft}>
                <div style={styles.dateBlock}>
                    <span style={styles.dayLabel}>DIA {day}</span>
                    <span style={styles.weekLabel}>Semana {week}/{targetWeeks}</span>
                </div>
                <div style={styles.climateBlock}>
                    <span>{climate.rain > 0.5 ? '🌧️' : climate.rain > 0.2 ? '🌤️' : '☀️'}</span>
                    <span>{climate.temperature.toFixed(0)}°C</span>
                </div>
            </div>

            <div style={styles.topCenter}>
                <div style={styles.prDisplay}>
                    <span style={styles.prIcon}>⚡</span>
                    <span style={styles.prValue}>{responsePoints}</span>
                    <span style={styles.prLabel}>PR</span>
                </div>
            </div>

            <div style={styles.topRight}>
                <div style={styles.resourceBlock}>
                    <span>💰</span>
                    <span>R$ {(budget / 1000).toFixed(0)}k</span>
                </div>
                <div style={{
                    ...styles.trustBlock,
                    color: publicTrust > 50 ? '#27ae60' : publicTrust > 25 ? '#f39c12' : '#e74c3c'
                }}>
                    <span>👥</span>
                    <span>{publicTrust.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div style={styles.statCard}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            <span style={{ color, fontSize: '1.3rem', fontWeight: 'bold' }}>{value}</span>
            <span style={{ color: '#888', fontSize: '0.75rem' }}>{label}</span>
        </div>
    );
}

function ZonePanel({ zone, onAction, budget }) {
    return (
        <div style={styles.zonePanel}>
            <h3 style={styles.zoneName}>📍 {zone.name}</h3>
            <div style={styles.zoneStats}>
                <div>🤒 Casos: {zone.cases}</div>
                <div>💀 Óbitos: {zone.deaths}</div>
                <div>💧 Risco: {(zone.environmentalRisk * 100).toFixed(0)}%</div>
                <div>🤝 Cooperação: {(zone.cooperation * 100).toFixed(0)}%</div>
            </div>
            <div style={styles.zoneActions}>
                <button
                    style={styles.actionBtn}
                    onClick={() => onAction('fumace', zone.id)}
                    disabled={budget < 5000}
                >
                    💨 Fumacê (R$5k)
                </button>
                <button
                    style={styles.actionBtn}
                    onClick={() => onAction('mutirao', zone.id)}
                    disabled={budget < 3000}
                >
                    🧹 Mutirão (R$3k)
                </button>
                <button
                    style={styles.actionBtn}
                    onClick={() => onAction('campanha', zone.id)}
                    disabled={budget < 2000}
                >
                    📢 Campanha (R$2k)
                </button>
            </div>
        </div>
    );
}

function EventModal({ event, onResolve, pr }) {
    return (
        <div style={styles.eventOverlay}>
            <div style={styles.eventModal}>
                <div style={styles.eventHeader}>
                    <span style={styles.eventIcon}>{event.icon}</span>
                    <h2 style={styles.eventTitle}>{event.name}</h2>
                </div>

                <p style={styles.eventDesc}>
                    Um evento requer sua decisão imediata!
                </p>

                <div style={styles.choicesGrid}>
                    {event.choices.map(choice => (
                        <button
                            key={choice.id}
                            style={{
                                ...styles.choiceBtn,
                                opacity: pr < choice.cost ? 0.5 : 1,
                            }}
                            onClick={() => onResolve(choice.id)}
                            disabled={pr < choice.cost}
                        >
                            <span style={styles.choiceName}>{choice.name}</span>
                            <span style={styles.choiceCost}>
                                {choice.cost > 0 ? `${choice.cost} PR` : 'Grátis'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function UpgradeModal({ tab, setTab, onClose, pr, unlocked, onBuy }) {
    const tabs = [
        { id: 'vigilancia', name: '🔍 Vigilância', color: '#3498db' },
        { id: 'controle', name: '🦟 Controle', color: '#e74c3c' },
        { id: 'engajamento', name: '👥 Engajamento', color: '#f39c12' },
        { id: 'saude', name: '🏥 Saúde', color: '#27ae60' },
    ];

    const currentTree = UPGRADE_TREES[tab] || [];

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.upgradeModal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>✕</button>

                <h2 style={styles.modalTitle}>🧬 ÁRVORE DE MELHORIAS</h2>
                <div style={styles.prDisplay2}>⚡ {pr} PR disponíveis</div>

                {/* Tabs */}
                <div style={styles.tabRow}>
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            style={{
                                ...styles.tabBtn,
                                borderBottomColor: tab === t.id ? t.color : 'transparent',
                                color: tab === t.id ? t.color : '#888',
                            }}
                            onClick={() => setTab(t.id)}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>

                {/* Grid de upgrades */}
                <div style={styles.upgradeGrid}>
                    {currentTree.map(upgrade => {
                        const isUnlocked = unlocked.includes(upgrade.id);
                        const canBuy = !isUnlocked &&
                            pr >= upgrade.cost &&
                            upgrade.requires.every(r => unlocked.includes(r));

                        return (
                            <div
                                key={upgrade.id}
                                style={{
                                    ...styles.upgradeCard,
                                    opacity: isUnlocked ? 1 : canBuy ? 0.9 : 0.4,
                                    borderColor: isUnlocked ? '#27ae60' : canBuy ? '#f39c12' : '#333',
                                }}
                            >
                                <span style={styles.upgradeIcon2}>{upgrade.icon}</span>
                                <span style={styles.upgradeName}>{upgrade.name}</span>
                                <span style={styles.upgradeDesc}>{upgrade.description}</span>
                                {!isUnlocked && (
                                    <button
                                        style={styles.buyBtn}
                                        onClick={() => onBuy(upgrade.id)}
                                        disabled={!canBuy}
                                    >
                                        {isUnlocked ? '✓' : `${upgrade.cost} PR`}
                                    </button>
                                )}
                                {isUnlocked && <span style={styles.ownedBadge}>✓ ATIVO</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function EndScreen({ isVictory, state, onRestart }) {
    const grade = calculateGrade(state);

    return (
        <div style={styles.endOverlay}>
            <div style={styles.endModal}>
                <h1 style={{ color: isVictory ? '#27ae60' : '#e74c3c', fontSize: '3rem' }}>
                    {isVictory ? '🎉 VITÓRIA!' : '💀 DERROTA'}
                </h1>

                <div style={styles.gradeDisplay}>
                    <span style={styles.gradeLabel}>Avaliação:</span>
                    <span style={{ ...styles.grade, color: getGradeColor(grade) }}>{grade}</span>
                </div>

                <div style={styles.endStats}>
                    <div>📅 Dias sobrevividos: {state.day}</div>
                    <div>🤒 Total de casos: {state.totalCases + state.totalRecovered + state.totalDeaths}</div>
                    <div>💀 Óbitos: {state.totalDeaths}</div>
                    <div>💚 Recuperados: {state.totalRecovered}</div>
                    <div>👥 Confiança final: {state.publicTrust.toFixed(0)}%</div>
                </div>

                <button style={styles.restartBtn} onClick={onRestart}>
                    🔄 JOGAR NOVAMENTE
                </button>
            </div>
        </div>
    );
}

function calculateGrade(state) {
    const { totalDeaths, publicTrust, hospitalUsed, hospitalCapacity, day, targetWeeks } = state;

    if (state.gameState === 'defeat') return 'F';

    let score = 100;
    score -= totalDeaths * 2;
    score -= (100 - publicTrust);
    if (hospitalUsed > hospitalCapacity) score -= 20;
    if (day < targetWeeks * 7) score -= 30;

    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    return 'D';
}

function getGradeColor(grade) {
    const colors = { 'A+': '#ffd700', 'A': '#27ae60', 'B': '#3498db', 'C': '#f39c12', 'D': '#e67e22', 'F': '#e74c3c' };
    return colors[grade] || '#fff';
}

function getNewsColor(type) {
    const colors = { warning: '#f39c12', danger: '#e74c3c', success: '#27ae60', info: '#3498db', victory: '#ffd700', defeat: '#e74c3c' };
    return colors[type] || '#666';
}

const styles = {
    hudContainer: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        zIndex: 10,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1rem',
        pointerEvents: 'auto',
    },
    topLeft: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    topCenter: { display: 'flex', alignItems: 'center' },
    topRight: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
    dateBlock: { display: 'flex', flexDirection: 'column' },
    dayLabel: { color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' },
    weekLabel: { color: '#27ae60', fontSize: '0.8rem' },
    climateBlock: { display: 'flex', gap: '0.5rem', color: '#fff' },
    prDisplay: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(39,174,96,0.3)', padding: '0.5rem 1rem', borderRadius: '20px' },
    prIcon: { fontSize: '1.5rem' },
    prValue: { color: '#27ae60', fontSize: '1.5rem', fontWeight: 'bold' },
    prLabel: { color: '#888' },
    resourceBlock: { display: 'flex', gap: '0.3rem', color: '#f39c12' },
    trustBlock: { display: 'flex', gap: '0.3rem' },
    statsRow: {
        position: 'absolute',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        pointerEvents: 'auto',
    },
    statCard: {
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '10px',
        padding: '0.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '80px',
    },
    speedControls: {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        gap: '0.5rem',
        pointerEvents: 'auto',
    },
    speedBtn: {
        background: 'rgba(0,0,0,0.8)',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    speedActive: { background: '#27ae60', borderColor: '#27ae60' },
    layerControls: {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        pointerEvents: 'auto',
        background: 'rgba(0,0,0,0.8)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
    },
    layerLabel: { color: '#888', marginRight: '0.5rem' },
    layerBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        opacity: 0.5,
        transition: 'opacity 0.2s',
    },
    layerActive: { opacity: 1 },
    upgradeButton: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        border: 'none',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        pointerEvents: 'auto',
        boxShadow: '0 4px 15px rgba(39,174,96,0.4)',
    },
    upgradeIcon: { fontSize: '1.5rem' },
    prBadge: { background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem' },
    zonePanel: {
        position: 'absolute',
        top: '140px',
        right: '20px',
        background: 'rgba(0,0,0,0.9)',
        borderRadius: '12px',
        padding: '1rem',
        minWidth: '200px',
        pointerEvents: 'auto',
        border: '1px solid #333',
    },
    zoneName: { color: '#fff', margin: '0 0 0.5rem 0' },
    zoneStats: { color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' },
    zoneActions: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
    actionBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid #444',
        borderRadius: '6px',
        padding: '0.5rem',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    newsFeed: {
        position: 'absolute',
        top: '140px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        maxWidth: '300px',
        pointerEvents: 'auto',
    },
    newsItem: {
        background: 'rgba(0,0,0,0.85)',
        borderLeft: '3px solid #666',
        padding: '0.5rem 0.8rem',
        borderRadius: '0 8px 8px 0',
        color: '#ccc',
        fontSize: '0.85rem',
        cursor: 'pointer',
    },
    newsDay: { color: '#666', marginRight: '0.5rem', fontSize: '0.75rem' },
    // Modals
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'auto',
    },
    eventOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'auto',
    },
    eventModal: {
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '20px',
        padding: '2rem',
        minWidth: '400px',
        border: '2px solid #f39c12',
        textAlign: 'center',
    },
    eventHeader: { marginBottom: '1rem' },
    eventIcon: { fontSize: '4rem' },
    eventTitle: { color: '#f39c12', margin: '0.5rem 0' },
    eventDesc: { color: '#ccc', marginBottom: '1.5rem' },
    choicesGrid: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    choiceBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: '2px solid #444',
        borderRadius: '10px',
        padding: '1rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.2s',
    },
    choiceName: { color: '#fff', fontWeight: 'bold' },
    choiceCost: { color: '#27ae60' },
    upgradeModal: {
        background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
        borderRadius: '20px',
        padding: '2rem',
        minWidth: '700px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '2px solid #27ae60',
        position: 'relative',
    },
    closeBtn: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
    modalTitle: { color: '#27ae60', textAlign: 'center', margin: '0 0 0.5rem 0' },
    prDisplay2: { color: '#27ae60', textAlign: 'center', marginBottom: '1rem' },
    tabRow: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #333' },
    tabBtn: {
        background: 'transparent',
        border: 'none',
        borderBottom: '3px solid transparent',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    upgradeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' },
    upgradeCard: {
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid #333',
        borderRadius: '10px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.3rem',
    },
    upgradeIcon2: { fontSize: '2rem' },
    upgradeName: { color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' },
    upgradeDesc: { color: '#888', fontSize: '0.75rem', textAlign: 'center' },
    buyBtn: {
        marginTop: '0.5rem',
        background: '#27ae60',
        border: 'none',
        borderRadius: '6px',
        padding: '0.4rem 1rem',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    ownedBadge: { color: '#27ae60', fontSize: '0.8rem', marginTop: '0.5rem' },
    // End screen
    endOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    endModal: {
        textAlign: 'center',
        padding: '3rem',
    },
    gradeDisplay: { marginBottom: '2rem' },
    gradeLabel: { color: '#888', fontSize: '1.5rem', display: 'block' },
    grade: { fontSize: '5rem', fontWeight: 'bold' },
    endStats: { color: '#ccc', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '2' },
    restartBtn: {
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        border: 'none',
        borderRadius: '12px',
        padding: '1rem 3rem',
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

export default HealthHUD;
