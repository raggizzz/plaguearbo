/**
 * ARBOVIRUS - Store Principal do Vírus (Estilo Plague Inc)
 * Você controla o vírus, não a cidade!
 */

import { create } from 'zustand';

// ============================================
// CONFIGURAÇÃO DOS TIPOS DE VÍRUS
// ============================================
const VIRUS_TYPES = {
    dengue: {
        id: 'dengue',
        name: 'Dengue',
        icon: '🦟',
        description: 'Arbovírus clássico. Equilibrado entre transmissão e severidade.',
        color: '#ff4757',
        baseInfectivity: 1.0,
        baseLethality: 0.02,
        baseSeverity: 0.3,
    },
    zika: {
        id: 'zika',
        name: 'Zika',
        icon: '🧬',
        description: 'Alta transmissão, baixa letalidade. Foco em complicações neurológicas.',
        color: '#9b59b6',
        baseInfectivity: 1.3,
        baseLethality: 0.005,
        baseSeverity: 0.2,
    },
    chikungunya: {
        id: 'chikungunya',
        name: 'Chikungunya',
        icon: '💢',
        description: 'Causa dor articular severa. Alta visibilidade, mas baixa mortalidade.',
        color: '#e67e22',
        baseInfectivity: 0.9,
        baseLethality: 0.01,
        baseSeverity: 0.5,
    },
    mutante: {
        id: 'mutante',
        name: 'Cepa X',
        icon: '☣️',
        description: '??? - Desbloqueie completando o jogo.',
        color: '#2ecc71',
        baseInfectivity: 1.5,
        baseLethality: 0.08,
        baseSeverity: 0.4,
        locked: true,
    }
};

// ============================================
// ÁRVORE DE EVOLUÇÃO
// ============================================
const EVOLUTION_TREE = {
    transmission: [
        // Tier 1
        { id: 'aedes_aegypti', name: 'Aedes Aegypti', icon: '🦟', cost: 3, tier: 1, requires: [], effect: { infectivity: 0.15 }, description: 'Mosquito urbano. +15% infectividade' },
        { id: 'agua_parada', name: 'Água Parada', icon: '💧', cost: 2, tier: 1, requires: [], effect: { infectivity: 0.1 }, description: 'Reprodução em água estagnada. +10% infectividade' },
        // Tier 2
        { id: 'aedes_albopictus', name: 'Aedes Albopictus', icon: '🦟', cost: 8, tier: 2, requires: ['aedes_aegypti'], effect: { infectivity: 0.25, coldResist: 0.2 }, description: 'Mosquito tigre. Sobrevive em climas mais frios.' },
        { id: 'pneus_velhos', name: 'Pneus Velhos', icon: '⚫', cost: 5, tier: 2, requires: ['agua_parada'], effect: { infectivity: 0.15 }, description: 'Criadouros em pneus descartados.' },
        { id: 'caixa_dagua', name: 'Caixas D\'água', icon: '🏠', cost: 6, tier: 2, requires: ['agua_parada'], effect: { infectivity: 0.2 }, description: 'Infesta caixas d\'água mal tampadas.' },
        // Tier 3
        { id: 'transporte_terrestre', name: 'Transporte Terrestre', icon: '🚗', cost: 12, tier: 3, requires: ['aedes_albopictus'], effect: { spreadSpeed: 0.3 }, description: 'Mosquitos viajam em veículos.' },
        { id: 'transporte_aereo', name: 'Transporte Aéreo', icon: '✈️', cost: 20, tier: 3, requires: ['transporte_terrestre'], effect: { spreadSpeed: 0.5, globalSpread: true }, description: 'Aeroportos espalham a doença.' },
        { id: 'reproducao_acelerada', name: 'Reprodução Acelerada', icon: '🔄', cost: 15, tier: 3, requires: ['pneus_velhos', 'caixa_dagua'], effect: { infectivity: 0.35 }, description: 'Ciclo reprodutivo mais rápido.' },
    ],
    symptoms: [
        // Tier 1
        { id: 'febre_leve', name: 'Febre Leve', icon: '🤒', cost: 2, tier: 1, requires: [], effect: { severity: 0.05, awareness: 0.02 }, description: 'Sintoma inicial. Baixa visibilidade.' },
        { id: 'dor_cabeca', name: 'Dor de Cabeça', icon: '🤕', cost: 2, tier: 1, requires: [], effect: { severity: 0.03 }, description: 'Cefaleia comum.' },
        // Tier 2
        { id: 'febre_alta', name: 'Febre Alta', icon: '🔥', cost: 6, tier: 2, requires: ['febre_leve'], effect: { severity: 0.15, lethality: 0.005, awareness: 0.05 }, description: 'Febre acima de 39°C. Mais visível.' },
        { id: 'dor_articular', name: 'Dor Articular', icon: '🦴', cost: 5, tier: 2, requires: ['dor_cabeca'], effect: { severity: 0.1 }, description: 'Artralgia clássica de arbovírus.' },
        { id: 'manchas_pele', name: 'Manchas na Pele', icon: '🔴', cost: 4, tier: 2, requires: [], effect: { severity: 0.08, awareness: 0.03 }, description: 'Exantema visível.' },
        // Tier 3
        { id: 'artralgia_severa', name: 'Artralgia Severa', icon: '💢', cost: 10, tier: 3, requires: ['dor_articular'], effect: { severity: 0.25, lethality: 0.01 }, description: 'Dor incapacitante. Marca registrada.' },
        { id: 'hemorragia', name: 'Hemorragia', icon: '🩸', cost: 15, tier: 3, requires: ['febre_alta', 'manchas_pele'], effect: { severity: 0.4, lethality: 0.05, awareness: 0.15 }, description: 'Dengue hemorrágica. Alta letalidade!' },
        { id: 'sindrome_choque', name: 'Síndrome do Choque', icon: '💀', cost: 25, tier: 4, requires: ['hemorragia'], effect: { lethality: 0.15, awareness: 0.25 }, description: 'Choque circulatório. Muito letal!' },
        { id: 'microcefalia', name: 'Complicações Neurológicas', icon: '🧠', cost: 20, tier: 4, requires: ['artralgia_severa'], effect: { severity: 0.5, awareness: 0.2 }, description: 'Afeta o sistema nervoso.' },
    ],
    abilities: [
        // Resistências
        { id: 'resist_calor', name: 'Resistência ao Calor', icon: '☀️', cost: 8, tier: 1, requires: [], effect: { heatResist: 0.3 }, description: 'Mosquito sobrevive em temperaturas extremas.' },
        { id: 'resist_fumace', name: 'Resistência ao Fumacê', icon: '💨', cost: 15, tier: 2, requires: ['resist_calor'], effect: { insecticideResist: 0.4 }, description: 'Resistência a inseticidas comuns.' },
        { id: 'mutacao_rapida', name: 'Mutação Rápida', icon: '🧬', cost: 20, tier: 3, requires: ['resist_fumace'], effect: { mutationRate: 0.5 }, description: 'Evolução acelerada. Dificulta vacinas.' },
        // Furtividade
        { id: 'incubacao_longa', name: 'Incubação Longa', icon: '⏳', cost: 10, tier: 1, requires: [], effect: { incubation: 0.3, awareness: -0.1 }, description: 'Sintomas demoram a aparecer.' },
        { id: 'assintomatico', name: 'Casos Assintomáticos', icon: '🎭', cost: 18, tier: 2, requires: ['incubacao_longa'], effect: { awareness: -0.2 }, description: 'Muitos infectados não apresentam sintomas.' },
        { id: 'resist_cura', name: 'Resistência à Cura', icon: '🛡️', cost: 25, tier: 3, requires: ['mutacao_rapida'], effect: { cureResist: 0.5 }, description: 'Dificulta desenvolvimento de tratamentos.' },
    ]
};

// ============================================
// CONFIGURAÇÃO DOS BAIRROS (agora como zonas de infecção)
// ============================================
const INITIAL_ZONES = [
    // Zona Norte (Rica - mais difícil de infectar)
    { id: 'centro', name: 'Centro', position: [0, 0], population: 20000, wealth: 'high', sanitation: 0.88, density: 0.85, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#4a90d9' },
    { id: 'jardins', name: 'Jardins', position: [-2, -1], population: 12000, wealth: 'high', sanitation: 0.92, density: 0.35, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#27ae60' },
    { id: 'alto_verde', name: 'Alto Verde', position: [2, -1], population: 14000, wealth: 'high', sanitation: 0.9, density: 0.4, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#2ecc71' },
    { id: 'lagos', name: 'Lagos', position: [-4, 0], population: 9000, wealth: 'high', sanitation: 0.88, density: 0.3, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#3498db' },

    // Zona Industrial (Média)
    { id: 'industrial', name: 'Zona Industrial', position: [4, 0], population: 7000, wealth: 'medium', sanitation: 0.6, density: 0.5, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#7f8c8d' },
    { id: 'porto', name: 'Porto', position: [4, 2], population: 8500, wealth: 'medium', sanitation: 0.65, density: 0.55, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#5d6d7e' },
    { id: 'comercial', name: 'Zona Comercial', position: [2, 2], population: 11000, wealth: 'medium', sanitation: 0.7, density: 0.75, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#e67e22' },
    { id: 'ferroviario', name: 'Ferroviário', position: [4, -2], population: 6000, wealth: 'medium', sanitation: 0.55, density: 0.45, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#95a5a6' },

    // Zona Sul (Pobre - mais fácil de infectar)
    { id: 'periferia_sul', name: 'Periferia Sul', position: [0, 4], population: 28000, wealth: 'low', sanitation: 0.4, density: 0.85, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#c0392b' },
    { id: 'vila_nova', name: 'Vila Nova', position: [-2, 4], population: 18000, wealth: 'low', sanitation: 0.45, density: 0.8, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#e74c3c' },
    { id: 'morro_cruz', name: 'Morro da Cruz', position: [2, 4], population: 25000, wealth: 'low', sanitation: 0.4, density: 0.85, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#922b21' },
    { id: 'baixada', name: 'Baixada', position: [-4, 4], population: 22000, wealth: 'low', sanitation: 0.38, density: 0.85, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#a93226' },

    // Zona Oeste (Mista)
    { id: 'praia', name: 'Praia', position: [-4, 2], population: 10000, wealth: 'medium', sanitation: 0.65, density: 0.5, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#1abc9c' },
    { id: 'universitario', name: 'Universitário', position: [-2, 2], population: 15000, wealth: 'medium', sanitation: 0.72, density: 0.65, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#9b59b6' },
    { id: 'hospital_area', name: 'Área Hospitalar', position: [0, 2], population: 8000, wealth: 'high', sanitation: 0.85, density: 0.6, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#e91e63' },
    { id: 'rural', name: 'Zona Rural', position: [-4, -2], population: 5000, wealth: 'low', sanitation: 0.45, density: 0.2, infected: 0, dead: 0, immune: 0, aware: false, quarantine: false, color: '#8bc34a' }
];

// ============================================
// STORE PRINCIPAL DO VÍRUS
// ============================================
export const useVirusStore = create((set, get) => ({
    // Estado do jogo
    gameState: 'menu', // menu, selecting, playing, victory, defeat
    selectedVirusType: null,
    virusName: '',

    // Estatísticas do vírus
    dnaPoints: 0,
    totalInfected: 0,
    totalDead: 0,
    totalCured: 0,
    peakInfected: 0,

    // Atributos base (modificados por evoluções)
    infectivity: 1.0,
    lethality: 0.02,
    severity: 0.3,

    // Resistências
    heatResist: 0,
    coldResist: 0,
    insecticideResist: 0,
    cureResist: 0,

    // Evoluções compradas
    unlockedAbilities: [],

    // Zonas da cidade
    zones: JSON.parse(JSON.stringify(INITIAL_ZONES)),
    selectedZone: null,

    // IA do Governo
    governmentAwareness: 0, // 0-100
    cureProgress: 0, // 0-100
    governmentBudget: 500000,
    governmentActions: [], // Ações em andamento

    // Tempo
    day: 0,
    speed: 1,
    isPaused: true,

    // Notícias
    newsQueue: [],

    // Getters
    getTotalPopulation: () => get().zones.reduce((sum, z) => sum + z.population, 0),
    getHealthy: () => {
        const state = get();
        return state.zones.reduce((sum, z) => sum + z.population - z.infected - z.dead - z.immune, 0);
    },
    getInfectedZones: () => get().zones.filter(z => z.infected > 0).length,

    // ============================================
    // AÇÕES DO JOGO
    // ============================================

    selectVirus: (virusId) => {
        const virus = VIRUS_TYPES[virusId];
        if (!virus || virus.locked) return;

        set({
            selectedVirusType: virus,
            infectivity: virus.baseInfectivity,
            lethality: virus.baseLethality,
            severity: virus.baseSeverity,
            gameState: 'naming'
        });
    },

    setVirusName: (name) => {
        set({ virusName: name || get().selectedVirusType?.name || 'Vírus Desconhecido' });
    },

    startGame: (startingZoneId) => {
        const state = get();
        const zone = state.zones.find(z => z.id === startingZoneId);
        if (!zone) return;

        // Infectar paciente zero
        const initialInfected = Math.max(1, Math.floor(zone.population * 0.0001));

        set((s) => ({
            gameState: 'playing',
            isPaused: false,
            day: 1,
            dnaPoints: 5, // Começa com alguns pontos
            zones: s.zones.map(z =>
                z.id === startingZoneId
                    ? { ...z, infected: initialInfected }
                    : z
            ),
            totalInfected: initialInfected,
            newsQueue: [{
                id: Date.now(),
                text: `Primeiro caso de ${state.virusName} detectado em ${zone.name}`,
                type: 'warning',
                day: 1
            }]
        }));
    },

    // Loop principal
    advanceDay: () => {
        const state = get();
        if (state.isPaused || state.gameState !== 'playing') return;

        const newDay = state.day + 1;
        let newDnaPoints = state.dnaPoints;
        let totalInfected = 0;
        let totalDead = 0;
        let totalCured = 0;
        const newNews = [];

        // Calcular modificadores
        const infectMod = state.infectivity;
        const lethalMod = state.lethality;
        const severityMod = state.severity;

        // Atualizar cada zona
        const updatedZones = state.zones.map(zone => {
            const { population, infected, dead, immune, sanitation, density, wealth, quarantine } = zone;
            const healthy = population - infected - dead - immune;

            if (healthy <= 0 && infected <= 0) return zone;

            // Fator de dificuldade baseado em riqueza
            const wealthFactor = wealth === 'high' ? 0.6 : wealth === 'medium' ? 1.0 : 1.4;

            // Quarentena reduz drasticamente a infecção
            const quarantineFactor = quarantine ? 0.1 : 1.0;

            // Novos infectados
            let newInfected = 0;
            if (infected > 0 && healthy > 0) {
                const infectionRate = (
                    infected / population *
                    infectMod *
                    density *
                    (1 - sanitation * 0.5) *
                    wealthFactor *
                    quarantineFactor *
                    (1 - state.insecticideResist * 0.3)
                );
                newInfected = Math.floor(healthy * infectionRate * (0.8 + Math.random() * 0.4));
                newInfected = Math.min(newInfected, healthy);
            }

            // Mortes
            let newDeaths = 0;
            if (infected > 0) {
                const deathRate = lethalMod * (1 + severityMod * 0.5);
                newDeaths = Math.floor(infected * deathRate * (0.5 + Math.random() * 1));
                newDeaths = Math.min(newDeaths, infected);
            }

            // Recuperados (se imunizados)
            let newImmune = 0;
            if (infected > 0) {
                const recoveryRate = 0.05 * (1 - state.cureResist * 0.3);
                newImmune = Math.floor(infected * recoveryRate);
                newImmune = Math.min(newImmune, infected - newDeaths);
            }

            // Ganhar DNA por infectar e matar
            newDnaPoints += Math.floor(newInfected * 0.01);
            newDnaPoints += newDeaths * 2; // Mortes dão mais DNA

            const finalInfected = Math.max(0, infected + newInfected - newDeaths - newImmune);

            totalInfected += finalInfected;
            totalDead += dead + newDeaths;
            totalCured += immune + newImmune;

            return {
                ...zone,
                infected: finalInfected,
                dead: dead + newDeaths,
                immune: immune + newImmune,
                aware: finalInfected > population * 0.01 || zone.aware
            };
        });

        // Propagação entre zonas
        const spreadZones = get().spreadInfection(updatedZones);

        // Atualizar awareness do governo
        const infectedPercent = (totalInfected / state.getTotalPopulation()) * 100;
        const deadPercent = (totalDead / state.getTotalPopulation()) * 100;
        let newAwareness = state.governmentAwareness;

        if (infectedPercent > 0.1) newAwareness += 0.5;
        if (infectedPercent > 1) newAwareness += 1;
        if (infectedPercent > 5) newAwareness += 2;
        if (deadPercent > 0.01) newAwareness += 1;
        if (deadPercent > 0.1) newAwareness += 3;

        // Severidade aumenta awareness
        newAwareness += severityMod * 0.2;

        newAwareness = Math.min(100, newAwareness);

        // Progresso da cura (se aware)
        let newCureProgress = state.cureProgress;
        if (newAwareness > 30) {
            const cureSpeed = (newAwareness / 100) * (1 - state.cureResist) * 0.5;
            newCureProgress += cureSpeed;
        }

        // Ações do governo
        get().governmentTurn(newAwareness, spreadZones);

        // Checar condições de vitória/derrota
        const totalPop = state.getTotalPopulation();
        const infectedRatio = totalInfected / totalPop;
        const deadRatio = totalDead / totalPop;

        let newGameState = state.gameState;

        // Vitória: 70% mortos ou infectados
        if (deadRatio > 0.7 || (deadRatio + infectedRatio) > 0.8) {
            newGameState = 'victory';
            newNews.push({
                id: Date.now(),
                text: `${state.virusName} devastou a cidade. A humanidade perdeu.`,
                type: 'victory',
                day: newDay
            });
        }

        // Derrota: cura completa ou vírus erradicado
        if (newCureProgress >= 100) {
            newGameState = 'defeat';
            newNews.push({
                id: Date.now(),
                text: 'Cientistas desenvolveram uma cura eficaz. O vírus foi derrotado.',
                type: 'defeat',
                day: newDay
            });
        }

        if (totalInfected === 0 && totalDead < totalPop * 0.5) {
            newGameState = 'defeat';
            newNews.push({
                id: Date.now(),
                text: 'O vírus foi completamente erradicado. A humanidade venceu.',
                type: 'defeat',
                day: newDay
            });
        }

        // Notícias aleatórias
        if (newDay % 10 === 0 && infectedPercent > 5) {
            const headlines = [
                'Hospitais relatam superlotação',
                'Governo declara estado de emergência',
                'OMS monitora situação com preocupação',
                'Especialistas alertam para nova onda',
                'Falta de medicamentos em farmácias'
            ];
            newNews.push({
                id: Date.now() + 1,
                text: headlines[Math.floor(Math.random() * headlines.length)],
                type: 'info',
                day: newDay
            });
        }

        set({
            day: newDay,
            zones: spreadZones,
            dnaPoints: newDnaPoints,
            totalInfected,
            totalDead,
            totalCured,
            peakInfected: Math.max(state.peakInfected, totalInfected),
            governmentAwareness: newAwareness,
            cureProgress: Math.min(100, newCureProgress),
            gameState: newGameState,
            newsQueue: [...state.newsQueue.slice(-10), ...newNews]
        });
    },

    // Propagação entre zonas
    spreadInfection: (zones) => {
        const state = get();
        const hasAirTravel = state.unlockedAbilities.includes('transporte_aereo');
        const hasLandTravel = state.unlockedAbilities.includes('transporte_terrestre');

        if (!hasAirTravel && !hasLandTravel) {
            // Propagação básica apenas para zonas adjacentes
            return zones.map(zone => {
                if (zone.infected > 0) return zone;

                // Encontrar zonas infectadas próximas
                const nearbyInfected = zones.filter(z => {
                    if (z.infected === 0) return false;
                    const dist = Math.abs(z.position[0] - zone.position[0]) + Math.abs(z.position[1] - zone.position[1]);
                    return dist <= 2;
                });

                if (nearbyInfected.length === 0) return zone;

                // Chance de espalhar
                const spreadChance = nearbyInfected.reduce((sum, z) => sum + (z.infected / z.population), 0) * 0.1 * state.infectivity;

                if (Math.random() < spreadChance) {
                    const initialInfected = Math.max(1, Math.floor(zone.population * 0.0001));
                    return { ...zone, infected: initialInfected };
                }

                return zone;
            });
        }

        // Com transporte, pode espalhar para qualquer lugar
        return zones.map(zone => {
            if (zone.infected > 0 || zone.quarantine) return zone;

            const infectedZones = zones.filter(z => z.infected > 0);
            if (infectedZones.length === 0) return zone;

            let spreadChance = 0;

            if (hasLandTravel) {
                spreadChance += infectedZones.reduce((sum, z) => sum + (z.infected / z.population), 0) * 0.05;
            }

            if (hasAirTravel) {
                spreadChance += infectedZones.reduce((sum, z) => sum + (z.infected / z.population), 0) * 0.1;
            }

            spreadChance *= state.infectivity;

            if (Math.random() < spreadChance) {
                const initialInfected = Math.max(1, Math.floor(zone.population * 0.0005));
                return { ...zone, infected: initialInfected };
            }

            return zone;
        });
    },

    // Turno do governo
    governmentTurn: (awareness, zones) => {
        const state = get();
        if (awareness < 20) return; // Governo ainda não sabe

        let budget = state.governmentBudget;
        const actions = [...state.governmentActions];
        const newNews = [];

        // Processar ações em andamento
        const completedActions = [];
        const ongoingActions = actions.filter(action => {
            action.daysRemaining--;
            if (action.daysRemaining <= 0) {
                completedActions.push(action);
                return false;
            }
            return true;
        });

        // Aplicar efeitos de ações completadas
        let updatedZones = [...zones];
        completedActions.forEach(action => {
            if (action.type === 'fumace') {
                updatedZones = updatedZones.map(z =>
                    z.id === action.targetZone
                        ? { ...z, infected: Math.floor(z.infected * (0.7 - state.insecticideResist * 0.3)) }
                        : z
                );
            } else if (action.type === 'quarantine') {
                updatedZones = updatedZones.map(z =>
                    z.id === action.targetZone
                        ? { ...z, quarantine: true }
                        : z
                );
            }
        });

        // Decidir novas ações baseado no awareness
        if (awareness > 40 && budget > 15000 && Math.random() < 0.15) {
            // Fumacê em zona mais infectada
            const worstZone = [...zones].sort((a, b) => b.infected - a.infected)[0];
            if (worstZone && worstZone.infected > 0) {
                ongoingActions.push({
                    type: 'fumace',
                    targetZone: worstZone.id,
                    daysRemaining: 3
                });
                budget -= 15000;
                newNews.push({
                    id: Date.now(),
                    text: `Governo inicia fumacê em ${worstZone.name}`,
                    type: 'warning',
                    day: state.day
                });
            }
        }

        if (awareness > 70 && budget > 50000 && Math.random() < 0.1) {
            // Quarentena
            const criticalZone = [...zones].sort((a, b) => (b.infected / b.population) - (a.infected / a.population))[0];
            if (criticalZone && criticalZone.infected > criticalZone.population * 0.1 && !criticalZone.quarantine) {
                ongoingActions.push({
                    type: 'quarantine',
                    targetZone: criticalZone.id,
                    daysRemaining: 1
                });
                budget -= 50000;
                newNews.push({
                    id: Date.now() + 1,
                    text: `⚠️ QUARENTENA declarada em ${criticalZone.name}!`,
                    type: 'danger',
                    day: state.day
                });
            }
        }

        // Recuperar budget mensal
        if (state.day % 30 === 0) {
            budget += 100000;
        }

        set({
            zones: updatedZones,
            governmentBudget: budget,
            governmentActions: ongoingActions,
            newsQueue: [...state.newsQueue, ...newNews]
        });
    },

    // Comprar evolução
    buyEvolution: (abilityId) => {
        const state = get();

        // Encontrar a habilidade
        const allAbilities = [
            ...EVOLUTION_TREE.transmission,
            ...EVOLUTION_TREE.symptoms,
            ...EVOLUTION_TREE.abilities
        ];

        const ability = allAbilities.find(a => a.id === abilityId);
        if (!ability) return false;

        // Verificar se já tem
        if (state.unlockedAbilities.includes(abilityId)) return false;

        // Verificar custo
        if (state.dnaPoints < ability.cost) return false;

        // Verificar pré-requisitos
        if (ability.requires.length > 0) {
            const hasAllReqs = ability.requires.every(req => state.unlockedAbilities.includes(req));
            if (!hasAllReqs) return false;
        }

        // Aplicar efeitos
        const effects = ability.effect;
        set((s) => ({
            dnaPoints: s.dnaPoints - ability.cost,
            unlockedAbilities: [...s.unlockedAbilities, abilityId],
            infectivity: s.infectivity + (effects.infectivity || 0),
            lethality: s.lethality + (effects.lethality || 0),
            severity: s.severity + (effects.severity || 0),
            heatResist: s.heatResist + (effects.heatResist || 0),
            coldResist: s.coldResist + (effects.coldResist || 0),
            insecticideResist: s.insecticideResist + (effects.insecticideResist || 0),
            cureResist: s.cureResist + (effects.cureResist || 0),
            governmentAwareness: Math.max(0, s.governmentAwareness + (effects.awareness || 0) * 100)
        }));

        return true;
    },

    // Controles
    togglePause: () => set(s => ({ isPaused: !s.isPaused })),
    setSpeed: (speed) => set({ speed }),
    selectZone: (zoneId) => set(s => ({ selectedZone: s.zones.find(z => z.id === zoneId) || null })),
    clearSelection: () => set({ selectedZone: null }),

    dismissNews: (newsId) => set(s => ({
        newsQueue: s.newsQueue.filter(n => n.id !== newsId)
    })),

    // Reset
    resetGame: () => set({
        gameState: 'menu',
        selectedVirusType: null,
        virusName: '',
        dnaPoints: 0,
        totalInfected: 0,
        totalDead: 0,
        totalCured: 0,
        peakInfected: 0,
        infectivity: 1.0,
        lethality: 0.02,
        severity: 0.3,
        heatResist: 0,
        coldResist: 0,
        insecticideResist: 0,
        cureResist: 0,
        unlockedAbilities: [],
        zones: JSON.parse(JSON.stringify(INITIAL_ZONES)),
        selectedZone: null,
        governmentAwareness: 0,
        cureProgress: 0,
        governmentBudget: 500000,
        governmentActions: [],
        day: 0,
        speed: 1,
        isPaused: true,
        newsQueue: []
    })
}));

export { VIRUS_TYPES, EVOLUTION_TREE };
export default useVirusStore;
