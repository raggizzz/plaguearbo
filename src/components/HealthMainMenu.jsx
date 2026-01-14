/**
 * HealthMainMenu - Menu Principal do Gestor de Saúde
 * Estilo Plague Inc com seleção de dificuldade e Loja completa
 */

import { useState } from 'react';
import { useHealthStore, DIFFICULTY_LEVELS } from '../store/healthStore';

// ============================================
// ITENS DA LOJA - Modificam o gameplay!
// ============================================
const STORE_CATEGORIES = {
    boosters: {
        name: '⚡ Boosters de Início',
        items: [
            { id: 'extra_pr', name: 'PR Extra', icon: '💰', description: '+10 Pontos de Resposta iniciais', effect: { initialPR: 10 }, owned: false },
            { id: 'extra_budget', name: 'Orçamento Reforçado', icon: '💵', description: '+R$50.000 de orçamento inicial', effect: { initialBudget: 50000 }, owned: false },
            { id: 'trust_boost', name: 'Boa Reputação', icon: '👍', description: '+15% confiança inicial', effect: { initialTrust: 15 }, owned: false },
            { id: 'hospital_boost', name: 'Leitos Extras', icon: '🛏️', description: '+30 leitos hospitalares', effect: { hospitalBonus: 30 }, owned: false },
        ]
    },
    genes: {
        name: '🧬 Genes Especiais',
        items: [
            { id: 'gene_detection', name: 'Gene: Olho Clínico', icon: '👁️', description: 'Detecta casos 20% mais rápido', effect: { detectionBonus: 0.2 }, owned: false },
            { id: 'gene_economy', name: 'Gene: Economista', icon: '📊', description: 'Ações custam 15% menos orçamento', effect: { budgetDiscount: 0.15 }, owned: false },
            { id: 'gene_speaker', name: 'Gene: Comunicador', icon: '📢', description: 'Eventos de boato causam 50% menos dano', effect: { rumorResist: 0.5 }, owned: false },
            { id: 'gene_healer', name: 'Gene: Curandeiro', icon: '💊', description: 'Recuperação 25% mais rápida', effect: { recoveryBonus: 0.25 }, owned: false },
            { id: 'gene_efficiency', name: 'Gene: Eficiência', icon: '⚙️', description: 'Upgrades custam 20% menos PR', effect: { upgradeDiscount: 0.2 }, owned: false },
        ]
    },
    scenarios: {
        name: '🗺️ Cenários Especiais',
        items: [
            { id: 'scenario_rich', name: 'Cidade Rica', icon: '🏙️', description: 'Todas as zonas começam com +20% saneamento', effect: { sanitationBonus: 0.2 }, owned: false },
            { id: 'scenario_coop', name: 'População Unida', icon: '🤝', description: 'Cooperação inicial +25% em todas as zonas', effect: { cooperationBonus: 0.25 }, owned: false },
            { id: 'scenario_dry', name: 'Estiagem', icon: '☀️', description: 'Risco ambiental inicial -30%', effect: { riskReduction: 0.3 }, owned: false },
            { id: 'scenario_slow', name: 'Surto Lento', icon: '🐌', description: 'Doença se espalha 30% mais devagar', effect: { spreadReduction: 0.3 }, owned: false },
        ]
    },
    challenges: {
        name: '🏆 Desafios',
        items: [
            { id: 'challenge_speedrun', name: 'Speedrun', icon: '⏱️', description: 'Termine em 6 semanas (recompensa: 2x PR)', effect: { targetWeeks: 6, prMultiplier: 2 }, locked: true, unlockCondition: 'Vença com rank A' },
            { id: 'challenge_nobudget', name: 'Orçamento Zero', icon: '🚫', description: 'Sem orçamento, só PR', effect: { noBudget: true }, locked: true, unlockCondition: 'Vença 3 vezes' },
            { id: 'challenge_nocure', name: 'Anti-Vacina', icon: '💉', description: 'Recuperação 50% mais lenta', effect: { recoveryPenalty: 0.5 }, locked: true, unlockCondition: 'Vença no Hard' },
        ]
    }
};

function HealthMainMenu() {
    const {
        gameState,
        selectDifficulty,
        setPlayerName,
        startGame,
        difficulty,
        applyStoreItems,
    } = useHealthStore();

    const [playerNameInput, setPlayerNameInput] = useState('');
    const [showStore, setShowStore] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Tela de seleção de dificuldade
    if (gameState === 'menu') {
        return (
            <div style={styles.container}>
                {/* Background estilo Plague Inc */}
                <div style={styles.background}>
                    <div style={styles.gridOverlay} />
                    <div style={styles.virusParticles}>
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    ...styles.particle,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${3 + Math.random() * 4}s`,
                                }}
                            >
                                🦟
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logo */}
                <div style={styles.logoContainer}>
                    <h1 style={styles.logo}>
                        <span style={styles.logoIcon}>🏥</span>
                        ARBOCONTROL
                    </h1>
                    <p style={styles.subtitle}>Vigilância Epidemiológica Simulator</p>
                    <p style={styles.tagline}>Você é o gestor. Contenha o surto.</p>
                </div>

                {/* Menu de dificuldade */}
                <div style={styles.menuContainer}>
                    <h2 style={styles.menuTitle}>Escolha o Cenário</h2>

                    <div style={styles.difficultyGrid}>
                        {Object.values(DIFFICULTY_LEVELS).map(diff => (
                            <button
                                key={diff.id}
                                style={{
                                    ...styles.difficultyButton,
                                    ...(diff.locked ? styles.lockedButton : {}),
                                    borderColor: diff.locked ? '#333' : getDifficultyColor(diff.id),
                                }}
                                onClick={() => !diff.locked && selectDifficulty(diff.id)}
                                disabled={diff.locked}
                            >
                                <span style={styles.diffIcon}>{diff.icon}</span>
                                <span style={styles.diffName}>{diff.name}</span>
                                <span style={styles.diffDesc}>{diff.description}</span>
                                {diff.locked && <span style={styles.lockIcon}>🔒</span>}
                            </button>
                        ))}
                    </div>

                    {/* Botões extras */}
                    <div style={styles.extraButtons}>
                        <button
                            style={styles.storeButton}
                            onClick={() => setShowStore(true)}
                        >
                            🛒 LOJA
                        </button>
                        <button style={styles.statsButton}>
                            📊 ESTATÍSTICAS
                        </button>
                    </div>

                    {/* Itens selecionados */}
                    {selectedItems.length > 0 && (
                        <div style={styles.selectedItemsBar}>
                            <span style={styles.selectedLabel}>Itens ativos:</span>
                            {selectedItems.map(itemId => {
                                const item = getAllItems().find(i => i.id === itemId);
                                return item ? <span key={itemId} style={styles.selectedItemBadge}>{item.icon}</span> : null;
                            })}
                        </div>
                    )}
                </div>

                {/* Store Modal */}
                {showStore && (
                    <StoreModal
                        onClose={() => setShowStore(false)}
                        selectedItems={selectedItems}
                        toggleItem={toggleItem}
                    />
                )}
            </div>
        );
    }

    // Tela de nome do jogador
    if (gameState === 'naming') {
        return (
            <div style={styles.container}>
                <div style={styles.background}>
                    <div style={styles.gridOverlay} />
                </div>

                <div style={styles.namingContainer}>
                    <h1 style={styles.namingTitle}>
                        <span style={styles.diffIcon}>{difficulty?.icon}</span>
                        {difficulty?.name}
                    </h1>

                    <div style={styles.namingCard}>
                        <label style={styles.label}>Nome do Gestor:</label>
                        <input
                            type="text"
                            value={playerNameInput}
                            onChange={(e) => setPlayerNameInput(e.target.value)}
                            placeholder="Dr.(a) Fulano"
                            style={styles.input}
                            maxLength={30}
                            autoFocus
                        />

                        <div style={styles.scenarioInfo}>
                            <h3>📋 Briefing:</h3>
                            <p>Você assume a Coordenação de Vigilância Epidemiológica.</p>
                            <p>Sua missão: atravessar a temporada de chuvas (12 semanas) sem:</p>
                            <ul>
                                <li>❌ Colapsar o sistema de saúde</li>
                                <li>❌ Perder a confiança da população</li>
                                <li>❌ Deixar o surto explodir</li>
                            </ul>

                            {selectedItems.length > 0 && (
                                <div style={styles.activeItemsInfo}>
                                    <strong>🛒 Itens da Loja ativos:</strong>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                        {selectedItems.map(itemId => {
                                            const item = getAllItems().find(i => i.id === itemId);
                                            return item ? (
                                                <span key={itemId} style={styles.activeItemChip}>
                                                    {item.icon} {item.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            style={styles.startButton}
                            onClick={() => {
                                setPlayerName(playerNameInput);
                                // Aplicar itens da loja
                                if (selectedItems.length > 0) {
                                    const items = selectedItems.map(id => getAllItems().find(i => i.id === id)).filter(Boolean);
                                    applyStoreItems(items);
                                }
                                startGame();
                            }}
                        >
                            ▶️ INICIAR MISSÃO
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

// Função para pegar todos os itens
function getAllItems() {
    return Object.values(STORE_CATEGORIES).flatMap(cat => cat.items);
}

// Componente da Loja Expandida
function StoreModal({ onClose, selectedItems, toggleItem }) {
    const [activeCategory, setActiveCategory] = useState('boosters');

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.storeModalLarge} onClick={e => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>✕</button>

                <h2 style={styles.storeTitle}>🛒 LOJA</h2>
                <p style={styles.storeSubtitle}>Selecione itens para modificar sua próxima run!</p>

                {/* Abas de categorias */}
                <div style={styles.categoryTabs}>
                    {Object.entries(STORE_CATEGORIES).map(([key, cat]) => (
                        <button
                            key={key}
                            style={{
                                ...styles.categoryTab,
                                ...(activeCategory === key ? styles.categoryTabActive : {}),
                            }}
                            onClick={() => setActiveCategory(key)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid de itens */}
                <div style={styles.storeGridLarge}>
                    {STORE_CATEGORIES[activeCategory].items.map(item => (
                        <div
                            key={item.id}
                            style={{
                                ...styles.storeItemLarge,
                                borderColor: selectedItems.includes(item.id) ? '#27ae60' : item.locked ? '#333' : '#f39c12',
                                opacity: item.locked ? 0.5 : 1,
                                background: selectedItems.includes(item.id) ? 'rgba(39, 174, 96, 0.2)' : 'rgba(255,255,255,0.05)',
                            }}
                            onClick={() => !item.locked && toggleItem(item.id)}
                        >
                            <span style={styles.itemIconLarge}>{item.icon}</span>
                            <span style={styles.itemNameLarge}>{item.name}</span>
                            <span style={styles.itemDescLarge}>{item.description}</span>
                            {item.locked ? (
                                <span style={styles.itemLocked}>🔒 {item.unlockCondition}</span>
                            ) : selectedItems.includes(item.id) ? (
                                <span style={styles.itemSelected}>✓ SELECIONADO</span>
                            ) : (
                                <span style={styles.itemAvailable}>Clique para selecionar</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Resumo */}
                <div style={styles.storeSummary}>
                    <span>{selectedItems.length} item(s) selecionado(s)</span>
                    <button style={styles.confirmButton} onClick={onClose}>
                        ✓ CONFIRMAR
                    </button>
                </div>
            </div>
        </div>
    );
}

function getDifficultyColor(id) {
    const colors = {
        easy: '#27ae60',
        normal: '#f39c12',
        hard: '#e74c3c',
        brutal: '#8e44ad',
    };
    return colors[id] || '#666';
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    background: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
    },
    gridOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            linear-gradient(rgba(0,200,100,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,100,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
    },
    virusParticles: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
        fontSize: '1.5rem',
        opacity: 0.3,
        animation: 'float 5s ease-in-out infinite',
    },
    logoContainer: {
        zIndex: 1,
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logo: {
        fontSize: '4rem',
        fontWeight: 'bold',
        color: '#fff',
        textShadow: '0 0 30px rgba(39, 174, 96, 0.5)',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    logoIcon: {
        fontSize: '3.5rem',
    },
    subtitle: {
        color: '#27ae60',
        fontSize: '1.2rem',
        margin: '0.5rem 0',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
    },
    tagline: {
        color: '#888',
        fontSize: '1rem',
        fontStyle: 'italic',
    },
    menuContainer: {
        zIndex: 1,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(39, 174, 96, 0.3)',
        maxWidth: '800px',
    },
    menuTitle: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.5rem',
    },
    difficultyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
    },
    difficultyButton: {
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid #27ae60',
        borderRadius: '12px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
    },
    lockedButton: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    diffIcon: {
        fontSize: '2.5rem',
    },
    diffName: {
        color: '#fff',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    diffDesc: {
        color: '#888',
        fontSize: '0.85rem',
        textAlign: 'center',
    },
    lockIcon: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '1.2rem',
    },
    extraButtons: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
        justifyContent: 'center',
    },
    storeButton: {
        background: 'linear-gradient(135deg, #f39c12, #e67e22)',
        border: 'none',
        borderRadius: '8px',
        padding: '1rem 2rem',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    statsButton: {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid #666',
        borderRadius: '8px',
        padding: '1rem 2rem',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    selectedItemsBar: {
        marginTop: '1rem',
        padding: '0.8rem',
        background: 'rgba(39, 174, 96, 0.2)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center',
    },
    selectedLabel: {
        color: '#27ae60',
        fontSize: '0.9rem',
    },
    selectedItemBadge: {
        fontSize: '1.5rem',
    },
    // Naming screen
    namingContainer: {
        zIndex: 1,
        textAlign: 'center',
    },
    namingTitle: {
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    namingCard: {
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem 3rem',
        border: '1px solid rgba(39, 174, 96, 0.3)',
        minWidth: '450px',
    },
    label: {
        color: '#27ae60',
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '1rem',
    },
    input: {
        width: '100%',
        padding: '1rem',
        fontSize: '1.2rem',
        background: 'rgba(255,255,255,0.1)',
        border: '2px solid #27ae60',
        borderRadius: '8px',
        color: '#fff',
        outline: 'none',
        textAlign: 'center',
    },
    scenarioInfo: {
        textAlign: 'left',
        background: 'rgba(39, 174, 96, 0.1)',
        borderRadius: '10px',
        padding: '1rem',
        margin: '1.5rem 0',
        color: '#ccc',
        fontSize: '0.9rem',
    },
    activeItemsInfo: {
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    activeItemChip: {
        background: 'rgba(243, 156, 18, 0.3)',
        padding: '0.3rem 0.6rem',
        borderRadius: '15px',
        fontSize: '0.8rem',
        color: '#f39c12',
    },
    startButton: {
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        border: 'none',
        borderRadius: '10px',
        padding: '1rem 3rem',
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 20px rgba(39, 174, 96, 0.4)',
    },
    // Modal
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    storeModalLarge: {
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '20px',
        padding: '2rem',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '85vh',
        overflow: 'auto',
        border: '2px solid #f39c12',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
    storeTitle: {
        color: '#f39c12',
        textAlign: 'center',
        marginBottom: '0.5rem',
        fontSize: '2rem',
    },
    storeSubtitle: {
        color: '#888',
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    categoryTabs: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    categoryTab: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid #333',
        borderRadius: '20px',
        padding: '0.6rem 1.2rem',
        color: '#888',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
    },
    categoryTabActive: {
        background: 'rgba(243, 156, 18, 0.3)',
        borderColor: '#f39c12',
        color: '#f39c12',
    },
    storeGridLarge: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
    },
    storeItemLarge: {
        border: '2px solid #f39c12',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    itemIconLarge: {
        fontSize: '2.5rem',
    },
    itemNameLarge: {
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemDescLarge: {
        color: '#aaa',
        fontSize: '0.8rem',
        textAlign: 'center',
        lineHeight: '1.3',
    },
    itemLocked: {
        color: '#e74c3c',
        fontSize: '0.75rem',
        marginTop: '0.5rem',
    },
    itemSelected: {
        color: '#27ae60',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        marginTop: '0.5rem',
    },
    itemAvailable: {
        color: '#f39c12',
        fontSize: '0.75rem',
        marginTop: '0.5rem',
    },
    storeSummary: {
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#888',
    },
    confirmButton: {
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.8rem 2rem',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

// CSS Animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(10deg); }
    }
    
    button:hover:not(:disabled) {
        transform: scale(1.02);
    }
`;
document.head.appendChild(styleSheet);

export { STORE_CATEGORIES, getAllItems };
export default HealthMainMenu;
