/**
 * ARBOGAME - Store do Gestor de Saúde (Plague Inc Invertido)
 * Você é a Coordenação de Vigilância tentando conter o surto!
 */

import { create } from 'zustand';

// ============================================
// CONFIGURAÇÃO DE DIFICULDADE
// ============================================
const DIFFICULTY_LEVELS = {
    easy: {
        id: 'easy',
        name: 'Estação Seca',
        icon: '☀️',
        description: 'Menos chuvas, mais tempo para se preparar.',
        initialPR: 25,
        spreadMultiplier: 0.4,
        eventFrequency: 0.5,
        initialBudget: 150000,
        initialTrust: 80,
    },
    normal: {
        id: 'normal',
        name: 'Temporada Normal',
        icon: '🌤️',
        description: 'Desafio equilibrado para gestores experientes.',
        initialPR: 18,
        spreadMultiplier: 0.6,
        eventFrequency: 0.7,
        initialBudget: 120000,
        initialTrust: 75,
    },
    hard: {
        id: 'hard',
        name: 'El Niño',
        icon: '🌧️',
        description: 'Chuvas intensas, população desconfiada.',
        initialPR: 12,
        spreadMultiplier: 0.9,
        eventFrequency: 1.0,
        initialBudget: 100000,
        initialTrust: 65,
    },
    brutal: {
        id: 'brutal',
        name: 'Calamidade',
        icon: '🌀',
        description: 'Tudo dá errado. Para masoquistas.',
        initialPR: 8,
        spreadMultiplier: 1.3,
        eventFrequency: 1.3,
        initialBudget: 80000,
        initialTrust: 50,
        locked: true,
    }
};

// ============================================
// ÁRVORE DE UPGRADES - VIGILÂNCIA
// ============================================
const UPGRADE_VIGILANCIA = [
    {
        id: 'notif_basica', name: 'Notificação Compulsória', icon: '📋', cost: 5, tier: 1, requires: [],
        effect: { detectionSpeed: 0.15 }, description: 'Casos reportados 15% mais rápido.'
    },
    {
        id: 'testagem_rapida', name: 'Testagem Rápida', icon: '🧪', cost: 8, tier: 1, requires: [],
        effect: { detectionAccuracy: 0.2 }, description: '+20% precisão na detecção.'
    },
    {
        id: 'laboratorio', name: 'Laboratório Municipal', icon: '🔬', cost: 12, tier: 2, requires: ['testagem_rapida'],
        effect: { detectionSpeed: 0.25, detectionAccuracy: 0.15 }, description: 'Diagnóstico local.'
    },
    {
        id: 'vigilancia_escolas', name: 'Vigilância em Escolas', icon: '🏫', cost: 10, tier: 2, requires: ['notif_basica'],
        effect: { earlyWarning: 0.2 }, description: 'Detecta surtos em escolas antes.'
    },
    {
        id: 'mapa_calor', name: 'Mapa de Calor Digital', icon: '🗺️', cost: 15, tier: 3, requires: ['laboratorio', 'vigilancia_escolas'],
        effect: { detectionSpeed: 0.3, prGain: 0.1 }, description: 'Visualização em tempo real.'
    },
    {
        id: 'ia_epidemio', name: 'IA Epidemiológica', icon: '🤖', cost: 25, tier: 4, requires: ['mapa_calor'],
        effect: { earlyWarning: 0.4, detectionAccuracy: 0.25 }, description: 'Prevê surtos antes de acontecerem.'
    },
];

// ============================================
// ÁRVORE DE UPGRADES - CONTROLE VETORIAL
// ============================================
const UPGRADE_CONTROLE = [
    {
        id: 'mutirao_basico', name: 'Mutirão de Limpeza', icon: '🧹', cost: 5, tier: 1, requires: [],
        effect: { fociReduction: 0.15 }, description: 'Reduz focos em 15%.'
    },
    {
        id: 'larvicida', name: 'Larvicida Biológico', icon: '🐛', cost: 8, tier: 1, requires: [],
        effect: { fociReduction: 0.1, duration: 7 }, description: 'Efeito dura 7 dias.'
    },
    {
        id: 'fumace_eficiente', name: 'Fumacê Otimizado', icon: '💨', cost: 12, tier: 2, requires: ['larvicida'],
        effect: { mosquitoKill: 0.3, publicTrustCost: -0.05 }, description: 'Menos rejeição da população.'
    },
    {
        id: 'inspecao_ampliada', name: 'Inspeção Ampliada', icon: '🔍', cost: 10, tier: 2, requires: ['mutirao_basico'],
        effect: { fociReduction: 0.2, detectionSpeed: 0.1 }, description: 'Cobre mais área.'
    },
    {
        id: 'drones', name: 'Drones de Vistoria', icon: '🚁', cost: 20, tier: 3, requires: ['inspecao_ampliada', 'fumace_eficiente'],
        effect: { fociReduction: 0.35, detectionSpeed: 0.2 }, description: 'Monitoramento aéreo.'
    },
    {
        id: 'mosquito_transgenico', name: 'Mosquito Transgênico', icon: '🧬', cost: 30, tier: 4, requires: ['drones'],
        effect: { spreadReduction: 0.5 }, risk: { publicTrust: -0.15 }, description: 'Polêmico mas eficaz.'
    },
];

// ============================================
// ÁRVORE DE UPGRADES - ENGAJAMENTO
// ============================================
const UPGRADE_ENGAJAMENTO = [
    {
        id: 'campanha_tv', name: 'Campanha na TV', icon: '📺', cost: 6, tier: 1, requires: [],
        effect: { cooperation: 0.1 }, description: '+10% cooperação.'
    },
    {
        id: 'redes_sociais', name: 'Redes Sociais', icon: '📱', cost: 5, tier: 1, requires: [],
        effect: { cooperation: 0.08, rumorResist: 0.1 }, description: 'Combate fake news.'
    },
    {
        id: 'agentes_saude', name: 'Agentes de Saúde', icon: '👷', cost: 12, tier: 2, requires: ['campanha_tv'],
        effect: { cooperation: 0.15, detectionSpeed: 0.1 }, description: 'Visitas domiciliares.'
    },
    {
        id: 'parcerias_locais', name: 'Parcerias Locais', icon: '🤝', cost: 10, tier: 2, requires: ['redes_sociais'],
        effect: { cooperation: 0.12, eventResist: 0.1 }, description: 'Igrejas, escolas, ONGs.'
    },
    {
        id: 'influenciadores', name: 'Influenciadores', icon: '⭐', cost: 18, tier: 3, requires: ['agentes_saude', 'parcerias_locais'],
        effect: { cooperation: 0.25, rumorResist: 0.2 }, description: 'Celebridades locais ajudam.'
    },
    {
        id: 'quintal_limpo', name: 'Programa Quintal Limpo', icon: '🏡', cost: 25, tier: 4, requires: ['influenciadores'],
        effect: { cooperation: 0.3, fociReduction: 0.2 }, description: 'Comunidade se auto-fiscaliza.'
    },
];

// ============================================
// ÁRVORE DE UPGRADES - SAÚDE
// ============================================
const UPGRADE_SAUDE = [
    {
        id: 'leitos_temp', name: 'Leitos Temporários', icon: '🛏️', cost: 8, tier: 1, requires: [],
        effect: { hospitalCapacity: 0.15 }, description: '+15% capacidade.'
    },
    {
        id: 'triagem_rapida', name: 'Triagem Rápida', icon: '⚡', cost: 6, tier: 1, requires: [],
        effect: { treatmentSpeed: 0.1 }, description: 'Atendimento 10% mais rápido.'
    },
    {
        id: 'treino_medicos', name: 'Treino de Médicos', icon: '👨‍⚕️', cost: 12, tier: 2, requires: ['triagem_rapida'],
        effect: { deathReduction: 0.15, treatmentSpeed: 0.1 }, description: 'Menos óbitos.'
    },
    {
        id: 'upa_24h', name: 'UPA 24h', icon: '🏥', cost: 15, tier: 2, requires: ['leitos_temp'],
        effect: { hospitalCapacity: 0.2, treatmentSpeed: 0.15 }, description: 'Atendimento noturno.'
    },
    {
        id: 'hospital_campanha', name: 'Hospital de Campanha', icon: '⛺', cost: 25, tier: 3, requires: ['upa_24h', 'treino_medicos'],
        effect: { hospitalCapacity: 0.4 }, description: 'Capacidade de emergência.'
    },
    {
        id: 'protocolo_dengue', name: 'Protocolo Dengue Grave', icon: '💉', cost: 30, tier: 4, requires: ['hospital_campanha'],
        effect: { deathReduction: 0.35, treatmentSpeed: 0.2 }, description: 'Expertise em casos graves.'
    },
];

// Exportar todas as árvores
export const UPGRADE_TREES = {
    vigilancia: UPGRADE_VIGILANCIA,
    controle: UPGRADE_CONTROLE,
    engajamento: UPGRADE_ENGAJAMENTO,
    saude: UPGRADE_SAUDE,
};

// ============================================
// EVENTOS DO JOGO
// ============================================
const GAME_EVENTS = [
    {
        id: 'heavy_rain', name: 'Chuva Forte (3 dias)', icon: '🌧️', probability: 0.15,
        effect: { environmentalRisk: 0.3 }, duration: 3,
        choices: [
            { id: 'mutirao_emergencia', name: 'Mutirão Emergencial', cost: 8, effect: { environmentalRisk: -0.2 } },
            { id: 'alerta_populacao', name: 'Alerta à População', cost: 3, effect: { cooperation: 0.1 } },
            { id: 'ignorar', name: 'Aguardar', cost: 0, effect: {} },
        ]
    },
    {
        id: 'viral_rumor', name: 'Boato Viral: "Fumacê causa câncer"', icon: '📵', probability: 0.1,
        effect: { publicTrust: -0.15, cooperation: -0.1 },
        choices: [
            { id: 'campanha_verdade', name: 'Campanha da Verdade', cost: 10, effect: { publicTrust: 0.1, cooperation: 0.15 } },
            { id: 'nota_oficial', name: 'Nota Oficial', cost: 2, effect: { publicTrust: 0.05 } },
            { id: 'ignorar', name: 'Ignorar', cost: 0, effect: { publicTrust: -0.1 } },
        ]
    },
    {
        id: 'garbage_strike', name: 'Greve da Coleta de Lixo', icon: '🗑️', probability: 0.08,
        effect: { environmentalRisk: 0.5 }, duration: 5,
        choices: [
            { id: 'negociar', name: 'Negociar Acordo', cost: 15, effect: { environmentalRisk: -0.3 }, endEvent: true },
            { id: 'emergencia', name: 'Coleta Emergencial', cost: 20, effect: { environmentalRisk: -0.4 } },
            { id: 'esperar', name: 'Esperar Resolução', cost: 0, effect: {} },
        ]
    },
    {
        id: 'carnival', name: 'Carnaval / Grande Evento', icon: '🎭', probability: 0.05,
        effect: { spreadRate: 0.4, cooperation: 0.1 }, duration: 4,
        choices: [
            { id: 'cancelar', name: 'Cancelar Evento', cost: 5, effect: { spreadRate: -0.3, publicTrust: -0.2 } },
            { id: 'controlar', name: 'Pontos de Hidratação', cost: 12, effect: { spreadRate: -0.15, publicTrust: 0.1 } },
            { id: 'liberar', name: 'Deixar Acontecer', cost: 0, effect: {} },
        ]
    },
    {
        id: 'school_outbreak', name: 'Surto em Escola', icon: '🏫', probability: 0.12,
        effect: { localCases: 50, publicTrust: -0.05 },
        choices: [
            { id: 'fechar_escola', name: 'Fechar Escola', cost: 8, effect: { spreadRate: -0.2, publicTrust: -0.1 } },
            { id: 'fumace_local', name: 'Fumacê Localizado', cost: 6, effect: { localCases: -30 } },
            { id: 'monitorar', name: 'Apenas Monitorar', cost: 0, effect: { localCases: 20 } },
        ]
    },
    {
        id: 'abandoned_construction', name: 'Obra Abandonada com Água Parada', icon: '🏗️', probability: 0.1,
        effect: { environmentalRisk: 0.25 },
        choices: [
            { id: 'interditar', name: 'Interditar e Limpar', cost: 10, effect: { environmentalRisk: -0.3 } },
            { id: 'multa', name: 'Multar Proprietário', cost: 2, effect: { environmentalRisk: -0.1 }, prGain: 3 },
            { id: 'ignorar', name: 'Ignorar', cost: 0, effect: {} },
        ]
    },
    {
        id: 'hospital_overcrowded', name: 'Hospital Lotando!', icon: '🏥', probability: 0.08,
        effect: { hospitalLoad: 0.3, publicTrust: -0.1 },
        choices: [
            { id: 'leitos_emergencia', name: 'Leitos de Emergência', cost: 15, effect: { hospitalCapacity: 0.2 } },
            { id: 'transferir', name: 'Transferir Pacientes', cost: 8, effect: { hospitalLoad: -0.15 } },
            { id: 'esperar', name: 'Esperar Melhorar', cost: 0, effect: { deathRisk: 0.1 } },
        ]
    },
    {
        id: 'heat_wave', name: 'Onda de Calor', icon: '🔥', probability: 0.1,
        effect: { spreadRate: 0.2, hospitalLoad: 0.1 }, duration: 5,
        choices: [
            { id: 'alerta_hidratacao', name: 'Alerta Hidratação', cost: 3, effect: { hospitalLoad: -0.1, cooperation: 0.05 } },
            { id: 'tendas_sombra', name: 'Tendas de Sombra', cost: 8, effect: { hospitalLoad: -0.15, publicTrust: 0.1 } },
            { id: 'nada', name: 'Continuar Normal', cost: 0, effect: {} },
        ]
    },
];

// ============================================
// ZONAS DO MAPA (estilo mapa-múndi)
// ============================================
const INITIAL_ZONES = [
    // Zona Norte (Rica)
    {
        id: 'centro', name: 'Centro', position: [0, 0], population: 20000, wealth: 'high',
        baseSanitation: 0.85, density: 0.85, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.1, cooperation: 0.7, hospitalLoad: 0, color: '#4a90d9'
    },
    {
        id: 'jardins', name: 'Jardins', position: [-2, -1], population: 12000, wealth: 'high',
        baseSanitation: 0.9, density: 0.35, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.08, cooperation: 0.75, hospitalLoad: 0, color: '#27ae60'
    },
    {
        id: 'alto_verde', name: 'Alto Verde', position: [2, -1], population: 14000, wealth: 'high',
        baseSanitation: 0.88, density: 0.4, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.1, cooperation: 0.72, hospitalLoad: 0, color: '#2ecc71'
    },
    {
        id: 'lagos', name: 'Lagos', position: [-4, 0], population: 9000, wealth: 'high',
        baseSanitation: 0.85, density: 0.3, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.12, cooperation: 0.7, hospitalLoad: 0, color: '#3498db'
    },
    // Zona Industrial (Média)
    {
        id: 'industrial', name: 'Zona Industrial', position: [4, 0], population: 7000, wealth: 'medium',
        baseSanitation: 0.6, density: 0.5, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.35, cooperation: 0.5, hospitalLoad: 0, color: '#7f8c8d'
    },
    {
        id: 'porto', name: 'Porto', position: [4, 2], population: 8500, wealth: 'medium',
        baseSanitation: 0.62, density: 0.55, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.32, cooperation: 0.52, hospitalLoad: 0, color: '#5d6d7e'
    },
    {
        id: 'comercial', name: 'Zona Comercial', position: [2, 2], population: 11000, wealth: 'medium',
        baseSanitation: 0.68, density: 0.75, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.25, cooperation: 0.6, hospitalLoad: 0, color: '#e67e22'
    },
    {
        id: 'ferroviario', name: 'Ferroviário', position: [4, -2], population: 6000, wealth: 'medium',
        baseSanitation: 0.55, density: 0.45, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.38, cooperation: 0.48, hospitalLoad: 0, color: '#95a5a6'
    },
    // Zona Sul (Pobre - mais vulnerável)
    {
        id: 'periferia_sul', name: 'Periferia Sul', position: [0, 4], population: 28000, wealth: 'low',
        baseSanitation: 0.4, density: 0.85, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.55, cooperation: 0.4, hospitalLoad: 0, color: '#c0392b'
    },
    {
        id: 'vila_nova', name: 'Vila Nova', position: [-2, 4], population: 18000, wealth: 'low',
        baseSanitation: 0.42, density: 0.8, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.52, cooperation: 0.42, hospitalLoad: 0, color: '#e74c3c'
    },
    {
        id: 'morro_cruz', name: 'Morro da Cruz', position: [2, 4], population: 25000, wealth: 'low',
        baseSanitation: 0.38, density: 0.88, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.58, cooperation: 0.38, hospitalLoad: 0, color: '#922b21'
    },
    {
        id: 'baixada', name: 'Baixada', position: [-4, 4], population: 22000, wealth: 'low',
        baseSanitation: 0.35, density: 0.85, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.6, cooperation: 0.35, hospitalLoad: 0, color: '#a93226'
    },
    // Zona Oeste (Mista)
    {
        id: 'praia', name: 'Praia', position: [-4, 2], population: 10000, wealth: 'medium',
        baseSanitation: 0.65, density: 0.5, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.28, cooperation: 0.58, hospitalLoad: 0, color: '#1abc9c'
    },
    {
        id: 'universitario', name: 'Universitário', position: [-2, 2], population: 15000, wealth: 'medium',
        baseSanitation: 0.7, density: 0.65, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.22, cooperation: 0.65, hospitalLoad: 0, color: '#9b59b6'
    },
    {
        id: 'hospital_area', name: 'Área Hospitalar', position: [0, 2], population: 8000, wealth: 'high',
        baseSanitation: 0.82, density: 0.6, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.15, cooperation: 0.68, hospitalLoad: 0, color: '#e91e63'
    },
    {
        id: 'rural', name: 'Zona Rural', position: [-4, -2], population: 5000, wealth: 'low',
        baseSanitation: 0.45, density: 0.2, cases: 0, deaths: 0, recovered: 0,
        environmentalRisk: 0.4, cooperation: 0.5, hospitalLoad: 0, color: '#8bc34a'
    }
];

// ============================================
// STORE PRINCIPAL DO GESTOR DE SAÚDE
// ============================================
export const useHealthStore = create((set, get) => ({
    // Estado do jogo
    gameState: 'menu', // menu, selecting, playing, victory, defeat
    difficulty: null,
    playerName: '',

    // Recursos do jogador
    responsePoints: 0, // PR - moeda principal
    budget: 120000,
    publicTrust: 75, // 0-100

    // Capacidades
    hospitalCapacity: 150, // leitos base - aumentado!
    hospitalUsed: 0,
    staffEfficiency: 1.0,
    detectionSpeed: 1.0,
    detectionAccuracy: 0.7,

    // Bônus da loja
    storeItems: [],
    storeBonus: {},

    // Estatísticas
    totalCases: 0,
    totalDeaths: 0,
    totalRecovered: 0,
    peakCases: 0,
    r0: 1.5, // Taxa de reprodução

    // Upgrades comprados
    unlockedUpgrades: [],

    // Zonas
    zones: JSON.parse(JSON.stringify(INITIAL_ZONES)),
    selectedZone: null,
    activeMapLayer: 'cases', // cases, risk, cooperation, hospital, climate

    // Clima
    climate: {
        rain: 0.3, // 0-1
        temperature: 28, // graus
        season: 'verao',
    },

    // Tempo
    day: 0,
    week: 0,
    targetWeeks: 12, // Duração da campanha
    speed: 1,
    isPaused: true,

    // Eventos
    activeEvents: [],
    pendingEvent: null, // Evento aguardando decisão
    eventHistory: [],

    // Notícias
    newsQueue: [],

    // ============================================
    // GETTERS
    // ============================================
    getTotalPopulation: () => get().zones.reduce((sum, z) => sum + z.population, 0),
    getActiveCases: () => get().zones.reduce((sum, z) => sum + z.cases, 0),
    getHospitalLoad: () => {
        const state = get();
        return (state.hospitalUsed / state.hospitalCapacity) * 100;
    },
    getAverageCooperation: () => {
        const zones = get().zones;
        return zones.reduce((sum, z) => sum + z.cooperation, 0) / zones.length;
    },
    getAverageRisk: () => {
        const zones = get().zones;
        return zones.reduce((sum, z) => sum + z.environmentalRisk, 0) / zones.length;
    },

    // ============================================
    // AÇÕES DO JOGO
    // ============================================
    selectDifficulty: (difficultyId) => {
        const diff = DIFFICULTY_LEVELS[difficultyId];
        if (!diff || diff.locked) return;
        set({
            difficulty: diff,
            gameState: 'naming',
            responsePoints: diff.initialPR,
            budget: diff.initialBudget || 120000,
            publicTrust: diff.initialTrust || 75,
        });
    },

    // Aplicar itens da loja
    applyStoreItems: (items) => {
        if (!items || items.length === 0) return;

        const effects = {};
        items.forEach(item => {
            if (item.effect) {
                Object.keys(item.effect).forEach(key => {
                    effects[key] = (effects[key] || 0) + item.effect[key];
                });
            }
        });

        set((s) => {
            // Aplicar bônus iniciais
            let newPR = s.responsePoints + (effects.initialPR || 0);
            let newBudget = s.budget + (effects.initialBudget || 0);
            let newTrust = Math.min(100, s.publicTrust + (effects.initialTrust || 0));
            let newHospital = s.hospitalCapacity + (effects.hospitalBonus || 0);

            // Aplicar bônus às zonas
            let newZones = s.zones;
            if (effects.sanitationBonus || effects.cooperationBonus || effects.riskReduction) {
                newZones = s.zones.map(z => ({
                    ...z,
                    baseSanitation: Math.min(1, z.baseSanitation + (effects.sanitationBonus || 0)),
                    cooperation: Math.min(1, z.cooperation + (effects.cooperationBonus || 0)),
                    environmentalRisk: Math.max(0, z.environmentalRisk - (effects.riskReduction || 0)),
                }));
            }

            return {
                storeItems: items,
                storeBonus: effects,
                responsePoints: newPR,
                budget: newBudget,
                publicTrust: newTrust,
                hospitalCapacity: newHospital,
                zones: newZones,
            };
        });
    },

    setPlayerName: (name) => {
        set({ playerName: name || 'Gestor Anônimo' });
    },

    startGame: () => {
        const state = get();
        if (!state.difficulty) return;

        // Iniciar surto aleatório em zona vulnerável
        const vulnerableZones = state.zones.filter(z => z.wealth === 'low');
        const startZone = vulnerableZones[Math.floor(Math.random() * vulnerableZones.length)];
        const initialCases = Math.floor(3 + Math.random() * 5);

        set((s) => ({
            gameState: 'playing',
            isPaused: false,
            day: 1,
            week: 1,
            zones: s.zones.map(z =>
                z.id === startZone.id
                    ? { ...z, cases: initialCases }
                    : z
            ),
            totalCases: initialCases,
            newsQueue: [{
                id: Date.now(),
                text: `Primeiros casos suspeitos de dengue detectados em ${startZone.name}`,
                type: 'warning',
                day: 1
            }]
        }));
    },

    // Loop principal
    advanceDay: () => {
        const state = get();
        if (state.isPaused || state.gameState !== 'playing') return;
        if (state.pendingEvent) return; // Bloqueia se tem evento pendente

        const newDay = state.day + 1;
        const newWeek = Math.ceil(newDay / 7);
        let newPR = state.responsePoints;
        let newTrust = state.publicTrust;
        let totalCases = 0;
        let totalDeaths = 0;
        let totalRecovered = 0;
        const newNews = [];

        // Modificadores de dificuldade
        const spreadMod = state.difficulty?.spreadMultiplier || 1.0;

        // Modificadores de clima
        const rainMod = 1 + state.climate.rain * 0.5;
        const tempMod = state.climate.temperature > 30 ? 1.2 : 1.0;

        // Calcular upgrades
        const deathReduction = get().getUpgradeEffect('deathReduction');
        const spreadReduction = get().getUpgradeEffect('spreadReduction');
        const fociReduction = get().getUpgradeEffect('fociReduction');

        // Atualizar cada zona
        const updatedZones = state.zones.map(zone => {
            const { population, cases, deaths, recovered, environmentalRisk, cooperation, density, wealth } = zone;
            const healthy = population - cases - deaths - recovered;

            if (healthy <= 0 && cases <= 0) return zone;

            // Fator de vulnerabilidade baseado em riqueza
            const wealthFactor = wealth === 'high' ? 0.5 : wealth === 'medium' ? 1.0 : 1.5;

            // Novos casos
            let newCases = 0;
            if (cases > 0 && healthy > 0) {
                const effectiveRisk = Math.max(0, environmentalRisk - fociReduction);
                const infectionRate = (
                    (cases / population) *
                    density *
                    effectiveRisk *
                    wealthFactor *
                    (1 - cooperation * 0.3) *
                    rainMod *
                    tempMod *
                    spreadMod *
                    (1 - spreadReduction)
                );
                newCases = Math.floor(healthy * infectionRate * 2 * (0.8 + Math.random() * 0.4));
                newCases = Math.min(newCases, healthy);
            }

            // Propagação de zonas vizinhas
            if (cases === 0 && newCases === 0) {
                const nearbyInfected = state.zones.filter(z => {
                    if (z.cases === 0) return false;
                    const dist = Math.abs(z.position[0] - zone.position[0]) + Math.abs(z.position[1] - zone.position[1]);
                    return dist <= 2;
                });

                if (nearbyInfected.length > 0) {
                    const spreadChance = nearbyInfected.reduce((sum, z) =>
                        sum + (z.cases / z.population) * environmentalRisk, 0) * 0.2 * spreadMod;

                    if (Math.random() < spreadChance) {
                        newCases = Math.max(1, Math.floor(Math.random() * 3));
                    }
                }
            }

            // Mortes (base 1%, reduzido por upgrades)
            let newDeaths = 0;
            if (cases > 0) {
                const baseDeathRate = 0.01 * (1 - deathReduction);
                // Mortes aumentam se hospital lotado
                const hospitalPenalty = state.hospitalUsed > state.hospitalCapacity ? 2.0 : 1.0;
                newDeaths = Math.floor(cases * baseDeathRate * hospitalPenalty * (0.5 + Math.random()));
                newDeaths = Math.min(newDeaths, cases);
            }

            // Recuperados (base 15% por dia - aumentado para facilitar!)
            let newRecovered = 0;
            const recoveryBonus = state.storeBonus?.recoveryBonus || 0;
            if (cases > 0) {
                const baseRecovery = 0.15 * (1 + recoveryBonus); // 15% base + bônus
                newRecovered = Math.floor((cases - newDeaths) * baseRecovery * (0.8 + Math.random() * 0.4));
                newRecovered = Math.min(newRecovered, cases - newDeaths);
            }

            const finalCases = Math.max(0, cases + newCases - newDeaths - newRecovered);

            // Atualizar risco ambiental (decai naturalmente, aumenta com chuva)
            let newRisk = environmentalRisk * 0.98 + state.climate.rain * 0.02;
            newRisk = Math.max(0, Math.min(1, newRisk - fociReduction * 0.01));

            totalCases += finalCases;
            totalDeaths += deaths + newDeaths;
            totalRecovered += recovered + newRecovered;

            return {
                ...zone,
                cases: finalCases,
                deaths: deaths + newDeaths,
                recovered: recovered + newRecovered,
                environmentalRisk: newRisk,
                hospitalLoad: finalCases / 100, // Simplificado
            };
        });

        // Atualizar uso do hospital
        const hospitalUsed = Math.floor(totalCases * 0.2); // 20% dos casos precisam de hospital

        // Calcular R0
        const newR0 = totalCases > 0 && state.totalCases > 0
            ? Math.min(4, Math.max(0.1, (totalCases / state.totalCases) * state.r0))
            : state.r0;

        // Ganhar PR por boas ações (aumentado!)
        if (newDay % 7 === 0) { // Por semana
            const weeklyPR = 8; // Base aumentado!
            const casesBonus = totalCases < state.peakCases * 0.9 ? 5 : 0; // Mais fácil ganhar
            const deathsBonus = totalDeaths === state.totalDeaths ? 8 : 0; // Mais recompensa
            const prMultiplier = state.storeBonus?.prMultiplier || 1;
            newPR += Math.floor((weeklyPR + casesBonus + deathsBonus) * prMultiplier);

            newNews.push({
                id: Date.now(),
                text: `Semana ${newWeek}: +${weeklyPR + casesBonus + deathsBonus} PR`,
                type: 'success',
                day: newDay
            });
        }

        // Atualizar confiança
        if (totalDeaths > state.totalDeaths) {
            newTrust = Math.max(0, newTrust - (totalDeaths - state.totalDeaths) * 0.5);
        }
        if (hospitalUsed > state.hospitalCapacity) {
            newTrust = Math.max(0, newTrust - 1);
        }

        // Checar eventos aleatórios
        if (Math.random() < 0.1 * (state.difficulty?.eventFrequency || 1)) {
            const availableEvents = GAME_EVENTS.filter(e =>
                !state.activeEvents.some(ae => ae.id === e.id) &&
                Math.random() < e.probability
            );

            if (availableEvents.length > 0) {
                const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
                set({ pendingEvent: { ...event, startDay: newDay } });
                return; // Pausar para decisão
            }
        }

        // Checar condições de vitória/derrota
        let newGameState = state.gameState;

        // Vitória: sobreviver 12 semanas
        if (newWeek > state.targetWeeks) {
            newGameState = 'victory';
            newNews.push({
                id: Date.now() + 1,
                text: '🎉 Você sobreviveu à temporada de chuvas!',
                type: 'victory',
                day: newDay
            });
        }

        // Derrota: hospital colapsa por muito tempo
        if (hospitalUsed > state.hospitalCapacity * 1.5 && state.hospitalUsed > state.hospitalCapacity * 1.5) {
            newGameState = 'defeat';
            newNews.push({
                id: Date.now() + 1,
                text: '💀 Sistema de saúde colapsou!',
                type: 'defeat',
                day: newDay
            });
        }

        // Derrota: confiança zerou
        if (newTrust <= 0) {
            newGameState = 'defeat';
            newNews.push({
                id: Date.now() + 1,
                text: '😤 População perdeu confiança total!',
                type: 'defeat',
                day: newDay
            });
        }

        // Atualizar clima periodicamente
        let newClimate = { ...state.climate };
        if (newDay % 3 === 0) {
            newClimate.rain = Math.max(0, Math.min(1, newClimate.rain + (Math.random() - 0.5) * 0.2));
            newClimate.temperature = Math.max(20, Math.min(40, newClimate.temperature + (Math.random() - 0.5) * 3));
        }

        set({
            day: newDay,
            week: newWeek,
            zones: updatedZones,
            totalCases,
            totalDeaths,
            totalRecovered,
            peakCases: Math.max(state.peakCases, totalCases),
            hospitalUsed,
            responsePoints: newPR,
            publicTrust: newTrust,
            r0: newR0,
            climate: newClimate,
            gameState: newGameState,
            newsQueue: [...state.newsQueue.slice(-10), ...newNews]
        });
    },

    // Resolver evento
    resolveEvent: (choiceId) => {
        const state = get();
        const event = state.pendingEvent;
        if (!event) return;

        const choice = event.choices.find(c => c.id === choiceId);
        if (!choice) return;

        // Verificar custo
        if (state.responsePoints < choice.cost) return;

        // Aplicar efeitos
        const effects = { ...event.effect, ...choice.effect };

        set((s) => ({
            responsePoints: s.responsePoints - choice.cost + (choice.prGain || 0),
            publicTrust: Math.max(0, Math.min(100, s.publicTrust + (effects.publicTrust || 0) * 100)),
            pendingEvent: null,
            activeEvents: choice.endEvent ? s.activeEvents : [...s.activeEvents, { ...event, resolvedChoice: choiceId }],
            eventHistory: [...s.eventHistory, { event, choice, day: s.day }],
            newsQueue: [...s.newsQueue, {
                id: Date.now(),
                text: `${event.icon} ${event.name}: ${choice.name}`,
                type: 'info',
                day: s.day
            }]
        }));
    },

    // Comprar upgrade
    buyUpgrade: (upgradeId) => {
        const state = get();
        const allUpgrades = [
            ...UPGRADE_VIGILANCIA,
            ...UPGRADE_CONTROLE,
            ...UPGRADE_ENGAJAMENTO,
            ...UPGRADE_SAUDE,
        ];

        const upgrade = allUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;

        // Verificar se já tem
        if (state.unlockedUpgrades.includes(upgradeId)) return false;

        // Verificar custo
        if (state.responsePoints < upgrade.cost) return false;

        // Verificar pré-requisitos
        if (upgrade.requires.length > 0) {
            const hasAllReqs = upgrade.requires.every(req => state.unlockedUpgrades.includes(req));
            if (!hasAllReqs) return false;
        }

        // Aplicar
        set((s) => ({
            responsePoints: s.responsePoints - upgrade.cost,
            unlockedUpgrades: [...s.unlockedUpgrades, upgradeId],
        }));

        // Aplicar riscos se houver
        if (upgrade.risk) {
            set((s) => ({
                publicTrust: Math.max(0, s.publicTrust + (upgrade.risk.publicTrust || 0) * 100),
            }));
        }

        return true;
    },

    // Calcular efeito total de um tipo de upgrade
    getUpgradeEffect: (effectType) => {
        const state = get();
        const allUpgrades = [
            ...UPGRADE_VIGILANCIA,
            ...UPGRADE_CONTROLE,
            ...UPGRADE_ENGAJAMENTO,
            ...UPGRADE_SAUDE,
        ];

        return state.unlockedUpgrades.reduce((total, upgradeId) => {
            const upgrade = allUpgrades.find(u => u.id === upgradeId);
            if (upgrade?.effect[effectType]) {
                return total + upgrade.effect[effectType];
            }
            return total;
        }, 0);
    },

    // Ações rápidas (custam orçamento, não PR)
    executeAction: (actionType, zoneId) => {
        const state = get();
        const zone = state.zones.find(z => z.id === zoneId);
        if (!zone) return false;

        const actions = {
            fumace: { cost: 5000, effect: { cases: -0.3, cooperation: -0.05 } },
            mutirao: { cost: 3000, effect: { environmentalRisk: -0.2 } },
            campanha: { cost: 2000, effect: { cooperation: 0.1 } },
        };

        const action = actions[actionType];
        if (!action || state.budget < action.cost) return false;

        set((s) => ({
            budget: s.budget - action.cost,
            zones: s.zones.map(z => {
                if (z.id !== zoneId) return z;
                return {
                    ...z,
                    cases: Math.max(0, Math.floor(z.cases * (1 + (action.effect.cases || 0)))),
                    environmentalRisk: Math.max(0, z.environmentalRisk + (action.effect.environmentalRisk || 0)),
                    cooperation: Math.max(0, Math.min(1, z.cooperation + (action.effect.cooperation || 0))),
                };
            }),
            newsQueue: [...s.newsQueue, {
                id: Date.now(),
                text: `Ação: ${actionType} em ${zone.name}`,
                type: 'success',
                day: s.day
            }]
        }));

        return true;
    },

    // Controles
    togglePause: () => set(s => ({ isPaused: !s.isPaused })),
    setSpeed: (speed) => set({ speed }),
    selectZone: (zoneId) => set(s => ({ selectedZone: s.zones.find(z => z.id === zoneId) || null })),
    clearSelection: () => set({ selectedZone: null }),
    setMapLayer: (layer) => set({ activeMapLayer: layer }),

    dismissNews: (newsId) => set(s => ({
        newsQueue: s.newsQueue.filter(n => n.id !== newsId)
    })),

    // Reset
    resetGame: () => set({
        gameState: 'menu',
        difficulty: null,
        playerName: '',
        responsePoints: 0,
        budget: 100000,
        publicTrust: 70,
        hospitalCapacity: 100,
        hospitalUsed: 0,
        staffEfficiency: 1.0,
        detectionSpeed: 1.0,
        detectionAccuracy: 0.7,
        totalCases: 0,
        totalDeaths: 0,
        totalRecovered: 0,
        peakCases: 0,
        r0: 1.5,
        unlockedUpgrades: [],
        zones: JSON.parse(JSON.stringify(INITIAL_ZONES)),
        selectedZone: null,
        activeMapLayer: 'cases',
        climate: { rain: 0.3, temperature: 28, season: 'verao' },
        day: 0,
        week: 0,
        speed: 1,
        isPaused: true,
        activeEvents: [],
        pendingEvent: null,
        eventHistory: [],
        newsQueue: [],
    })
}));

export { GAME_EVENTS, DIFFICULTY_LEVELS };
export default useHealthStore;
