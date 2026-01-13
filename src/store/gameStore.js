/**
 * ARBOGAME - Store Principal (VERSÃO EXPANDIDA)
 * Mais bairros, mais eventos, mais ação
 */

import { create } from 'zustand';

// ============================================
// CONFIGURAÇÃO DO CAPÍTULO
// ============================================
const CHAPTER_CONFIG = {
    name: 'Temporada de Chuvas',
    duration: 180, // 180 dias - temporada mais longa
    warningDay: 150,
};

// ============================================
// 16 DISTRITOS - CIDADE GRANDE
// ============================================
const INITIAL_DISTRICTS = [
    // ===== ZONA NORTE (Rica) =====
    { id: 'centro', name: 'Centro', position: [0, 0, 0], population: 20000, income: 'high', sanitation: 0.88, density: 0.85, environmentalRisk: 0.25, cooperation: 0.75, infectedCount: 0, waterSpots: 2, trashLevel: 0.08, recentActions: [], visualState: 'calm', trust: 0.8, maxTrust: 0.95, scars: [], color: '#4a90d9' },
    { id: 'jardins', name: 'Jardins', position: [-5, 0, 0], population: 12000, income: 'high', sanitation: 0.92, density: 0.35, environmentalRisk: 0.15, cooperation: 0.85, infectedCount: 0, waterSpots: 1, trashLevel: 0.03, recentActions: [], visualState: 'calm', trust: 0.85, maxTrust: 0.98, scars: [], color: '#27ae60' },
    { id: 'alto_verde', name: 'Alto Verde', position: [5, 0, 0], population: 14000, income: 'high', sanitation: 0.9, density: 0.4, environmentalRisk: 0.18, cooperation: 0.82, infectedCount: 0, waterSpots: 1, trashLevel: 0.05, recentActions: [], visualState: 'calm', trust: 0.82, maxTrust: 0.96, scars: [], color: '#2ecc71' },
    { id: 'lagos', name: 'Lagos', position: [-10, 0, 0], population: 9000, income: 'high', sanitation: 0.88, density: 0.3, environmentalRisk: 0.2, cooperation: 0.8, infectedCount: 0, waterSpots: 3, trashLevel: 0.04, recentActions: [], visualState: 'calm', trust: 0.78, maxTrust: 0.95, scars: [], color: '#3498db' },

    // ===== ZONA LESTE (Industrial/Média) - Começa calma =====
    { id: 'industrial', name: 'Zona Industrial', position: [10, 0, 0], population: 7000, income: 'medium', sanitation: 0.6, density: 0.5, environmentalRisk: 0.5, cooperation: 0.55, infectedCount: 0, waterSpots: 5, trashLevel: 0.25, recentActions: [], visualState: 'calm', trust: 0.6, maxTrust: 0.85, scars: [], color: '#7f8c8d' },
    { id: 'porto', name: 'Porto', position: [10, 0, 5], population: 8500, income: 'medium', sanitation: 0.65, density: 0.55, environmentalRisk: 0.5, cooperation: 0.6, infectedCount: 0, waterSpots: 5, trashLevel: 0.2, recentActions: [], visualState: 'calm', trust: 0.6, maxTrust: 0.88, scars: [], color: '#5d6d7e' },
    { id: 'comercial', name: 'Zona Comercial', position: [5, 0, 5], population: 11000, income: 'medium', sanitation: 0.7, density: 0.75, environmentalRisk: 0.4, cooperation: 0.6, infectedCount: 0, waterSpots: 4, trashLevel: 0.15, recentActions: [], visualState: 'calm', trust: 0.65, maxTrust: 0.9, scars: [], color: '#e67e22' },
    { id: 'ferroviario', name: 'Ferroviário', position: [10, 0, -5], population: 6000, income: 'medium', sanitation: 0.55, density: 0.45, environmentalRisk: 0.55, cooperation: 0.55, infectedCount: 0, waterSpots: 5, trashLevel: 0.3, recentActions: [], visualState: 'calm', trust: 0.55, maxTrust: 0.85, scars: [], color: '#95a5a6' },

    // ===== ZONA SUL (Periférica/Pobre) =====
    { id: 'periferia_sul', name: 'Periferia Sul', position: [0, 0, 10], population: 28000, income: 'low', sanitation: 0.4, density: 0.85, environmentalRisk: 0.65, cooperation: 0.55, infectedCount: 0, waterSpots: 8, trashLevel: 0.35, recentActions: [], visualState: 'calm', trust: 0.55, maxTrust: 0.8, scars: [], color: '#c0392b' },
    { id: 'vila_nova', name: 'Vila Nova', position: [-5, 0, 10], population: 18000, income: 'low', sanitation: 0.45, density: 0.8, environmentalRisk: 0.6, cooperation: 0.58, infectedCount: 0, waterSpots: 7, trashLevel: 0.3, recentActions: [], visualState: 'calm', trust: 0.58, maxTrust: 0.82, scars: [], color: '#e74c3c' },
    { id: 'morro_cruz', name: 'Morro da Cruz', position: [5, 0, 10], population: 25000, income: 'low', sanitation: 0.4, density: 0.85, environmentalRisk: 0.6, cooperation: 0.55, infectedCount: 0, waterSpots: 8, trashLevel: 0.35, recentActions: [], visualState: 'calm', trust: 0.55, maxTrust: 0.8, scars: [], color: '#922b21' },
    { id: 'baixada', name: 'Baixada', position: [-10, 0, 10], population: 22000, income: 'low', sanitation: 0.38, density: 0.85, environmentalRisk: 0.65, cooperation: 0.52, infectedCount: 0, waterSpots: 9, trashLevel: 0.35, recentActions: [], visualState: 'calm', trust: 0.52, maxTrust: 0.8, scars: [], color: '#a93226' },

    // ===== ZONA OESTE (Mista) =====
    { id: 'praia', name: 'Praia', position: [-10, 0, 5], population: 10000, income: 'medium', sanitation: 0.65, density: 0.5, environmentalRisk: 0.5, cooperation: 0.6, infectedCount: 0, waterSpots: 6, trashLevel: 0.25, recentActions: [], visualState: 'calm', trust: 0.6, maxTrust: 0.88, scars: [], color: '#1abc9c' },
    { id: 'universitario', name: 'Universitário', position: [-5, 0, 5], population: 15000, income: 'medium', sanitation: 0.72, density: 0.65, environmentalRisk: 0.35, cooperation: 0.7, infectedCount: 0, waterSpots: 3, trashLevel: 0.15, recentActions: [], visualState: 'calm', trust: 0.7, maxTrust: 0.92, scars: [], color: '#9b59b6' },
    { id: 'hospital_area', name: 'Área Hospitalar', position: [0, 0, 5], population: 8000, income: 'high', sanitation: 0.85, density: 0.6, environmentalRisk: 0.2, cooperation: 0.75, infectedCount: 0, waterSpots: 2, trashLevel: 0.06, recentActions: [], visualState: 'calm', trust: 0.75, maxTrust: 0.95, scars: [], color: '#e91e63' },
    { id: 'rural', name: 'Zona Rural', position: [-10, 0, -5], population: 5000, income: 'low', sanitation: 0.45, density: 0.2, environmentalRisk: 0.55, cooperation: 0.65, infectedCount: 0, waterSpots: 8, trashLevel: 0.3, recentActions: [], visualState: 'calm', trust: 0.6, maxTrust: 0.85, scars: [], color: '#8bc34a' }
];

// Hospital maior para cidade de 16 bairros
const INITIAL_HEALTH_SYSTEM = {
    totalBeds: 300, occupiedBeds: 30, doctors: 50,
    status: 'normal',
    permanentDamage: 0,
    collapseCount: 0
};

const INITIAL_RESOURCES = {
    budget: 600000, monthlyIncome: 60000, agents: 15,
    debtPenalty: 0
};

// Confiança inicial maior para dar tempo de aprender
const INITIAL_PUBLIC_TRUST = {
    value: 85,
    trend: 'stable',
    lastDrop: null,
    allTimeLow: 85,
};

const WEATHER_TYPES = {
    sunny: { name: 'Ensolarado', icon: '☀️', temp: 32, riskMultiplier: 1.0, threat: null },
    cloudy: { name: 'Nublado', icon: '☁️', temp: 26, riskMultiplier: 0.9, threat: null },
    rainy: { name: 'Chuvoso', icon: '🌧️', temp: 24, riskMultiplier: 1.6, threat: 'Focos multiplicam' },
    stormy: { name: 'Tempestade', icon: '⛈️', temp: 22, riskMultiplier: 2.0, threat: 'Alagamentos' },
    hot: { name: 'Calor Intenso', icon: '🔥', temp: 38, riskMultiplier: 1.5, threat: 'Ciclo acelerado' }
};

const ACTIONS = {
    cleanup: { id: 'cleanup', name: 'Mutirão', icon: '🧹', cost: 5000, duration: 2 },
    fumigation: { id: 'fumigation', name: 'Fumacê', icon: '🚛', cost: 15000, duration: 1 },
    campaign: { id: 'campaign', name: 'Campanha', icon: '📢', cost: 8000, duration: 5 },
    inspection: { id: 'inspection', name: 'Inspeção', icon: '🔍', cost: 3000, duration: 1 },
    hospital: { id: 'hospital', name: 'Reforço', icon: '🏥', cost: 30000, duration: 0 },
};

// ============================================
// TIPOS DE EVENTOS (mais variedade)
// ============================================
const EVENT_TYPES = [
    'outbreak', 'water_crisis', 'trash_emergency', 'trust_drop',
    'hospital_pressure', 'multiple_crisis', 'weather_emergency', 'spread_risk'
];

// ============================================
// STORE PRINCIPAL
// ============================================
export const useGameStore = create((set, get) => ({
    isPlaying: false,
    isPaused: true,
    gameSpeed: 1,
    gameOver: false,
    gameOverReason: null,
    victory: false,

    chapter: { ...CHAPTER_CONFIG, currentDay: 0 },
    publicTrust: { ...INITIAL_PUBLIC_TRUST },

    pendingDecision: null,
    focusMode: false,
    focusTarget: null,
    outcomeMessage: null,

    totalDeaths: 0,
    permanentScars: [],
    lastEventDay: 0, // Controle de frequência de eventos

    day: 1, month: 1, year: 2024, totalDays: 0,
    weather: WEATHER_TYPES.rainy, // Começa chuvoso para ação imediata

    districts: JSON.parse(JSON.stringify(INITIAL_DISTRICTS)),
    selectedDistrict: null,
    healthSystem: { ...INITIAL_HEALTH_SYSTEM },
    resources: { ...INITIAL_RESOURCES },
    activeActions: [],

    startGame: () => set({
        isPlaying: true,
        isPaused: false,
        gameOver: false,
        victory: false,
        lastEventDay: 0,
        chapter: { ...CHAPTER_CONFIG, currentDay: 0 }
    }),

    togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
    setGameSpeed: (speed) => set({ gameSpeed: speed }),

    // ========== LOOP PRINCIPAL ==========

    advanceTime: () => {
        const state = get();
        if (state.isPaused || state.pendingDecision || state.gameOver) return;

        let { day, month, year, totalDays } = state;
        day++; totalDays++;

        const newChapterDay = state.chapter.currentDay + 1;
        set({ chapter: { ...state.chapter, currentDay: newChapterDay } });

        if (newChapterDay >= CHAPTER_CONFIG.duration) {
            get().endChapter();
            return;
        }

        if (day > 30) {
            day = 1; month++;
            const income = state.resources.monthlyIncome - state.resources.debtPenalty;
            set((s) => ({ resources: { ...s.resources, budget: s.resources.budget + Math.max(0, income) } }));
        }
        if (month > 12) { month = 1; year++; }

        set({ day, month, year, totalDays });

        get().updateWeather();
        get().updateDistricts();
        get().updateHealthSystem();
        get().updatePublicTrust();
        get().processActiveActions();
        get().tryCreateEvent(); // Eventos mais frequentes
        get().checkGameOver();
        get().clearOldOutcome();
    },

    // ========== EVENTOS FREQUENTES ==========

    tryCreateEvent: () => {
        const state = get();
        if (state.pendingDecision) return;

        const daysSinceLastEvent = state.chapter.currentDay - state.lastEventDay;

        // Primeiro evento só depois do dia 15 (dar tempo de explorar), depois a cada 8-12 dias
        const minDays = state.lastEventDay === 0 ? 15 : 8;
        const chancePerDay = 0.15; // 15% de chance por dia após período mínimo

        if (daysSinceLastEvent < minDays) return;
        if (Math.random() > chancePerDay) return;

        // Escolher tipo de evento baseado na situação
        const criticalDistricts = state.districts.filter(d => d.visualState === 'critical');
        const warningDistricts = state.districts.filter(d => d.visualState === 'warning');
        const hospitalRate = state.healthSystem.occupiedBeds / (state.healthSystem.totalBeds - state.healthSystem.permanentDamage);

        let eventType;

        // Priorizar crises reais
        if (hospitalRate > 0.8) {
            eventType = 'hospital_pressure';
        } else if (criticalDistricts.length >= 2) {
            eventType = 'multiple_crisis';
        } else if (criticalDistricts.length === 1) {
            eventType = 'outbreak';
        } else if (state.publicTrust.value < 50) {
            eventType = 'trust_drop';
        } else if (state.weather.riskMultiplier > 1.5) {
            eventType = 'weather_emergency';
        } else if (warningDistricts.length >= 3) {
            eventType = 'spread_risk';
        } else {
            // Evento aleatório
            const worstDistrict = [...state.districts].sort((a, b) =>
                (b.waterSpots + b.trashLevel * 10 + b.infectedCount) - (a.waterSpots + a.trashLevel * 10 + a.infectedCount)
            )[0];

            if (worstDistrict.waterSpots > 10) eventType = 'water_crisis';
            else if (worstDistrict.trashLevel > 0.5) eventType = 'trash_emergency';
            else eventType = 'outbreak';
        }

        get().createEvent(eventType);
        set({ lastEventDay: state.chapter.currentDay });
    },

    createEvent: (type) => {
        const state = get();
        const canAfford = (cost) => state.resources.budget >= cost;

        // Encontrar bairros relevantes
        const worstDistrict = [...state.districts].sort((a, b) =>
            (b.waterSpots + b.trashLevel * 10 + b.infectedCount * 2) - (a.waterSpots + a.trashLevel * 10 + a.infectedCount * 2)
        )[0];

        const criticalDistricts = state.districts.filter(d => d.visualState === 'critical');

        let question = '';
        let threat = '';
        let options = [];
        let districtId = worstDistrict.id;
        let districtName = worstDistrict.name;

        switch (type) {
            case 'outbreak':
                threat = `O mosquito se instalou em ${worstDistrict.name}. Casos vão explodir.`;
                question = `Surto confirmado em ${worstDistrict.name}. Como responder?`;
                options = [
                    { id: 'full', label: 'Contenção agressiva', sublabel: 'R$ 20k • Fumacê + Inspeção', action: 'full_containment', cost: 20000, sacrifice: 'Confiança cai 15%', districtId, disabled: !canAfford(20000) },
                    { id: 'soft', label: 'Abordagem comunitária', sublabel: 'R$ 10k • Campanha + Mutirão', action: 'soft_containment', cost: 10000, sacrifice: 'Mais lento, pode espalhar', districtId, disabled: !canAfford(10000) },
                    { id: 'wait', label: 'Priorizar outros bairros', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: `${worstDistrict.name} piora muito` }
                ];
                break;

            case 'water_crisis':
                threat = `${worstDistrict.waterSpots} focos de água parada detectados.`;
                question = `Crise hídrica em ${worstDistrict.name}. Focos se multiplicam.`;
                options = [
                    { id: 'inspect', label: 'Força-tarefa de inspeção', sublabel: 'R$ 8k • Elimina focos rápido', action: 'mass_inspection', cost: 8000, sacrifice: 'Moradores reclamam de invasão', districtId, disabled: !canAfford(8000) },
                    { id: 'educate', label: 'Campanha educativa', sublabel: 'R$ 6k • Prevenção a longo prazo', action: 'campaign', cost: 6000, sacrifice: 'Não resolve imediato', districtId, disabled: !canAfford(6000) },
                    { id: 'wait', label: 'Apenas monitorar', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: 'Focos vão triplicar' }
                ];
                break;

            case 'trash_emergency':
                threat = `Lixo acumulado atrai ratos e mosquitos.`;
                question = `Emergência sanitária em ${worstDistrict.name}. Condições críticas.`;
                options = [
                    { id: 'blitz', label: 'Mutirão de emergência', sublabel: 'R$ 7k • Limpeza completa', action: 'emergency_cleanup', cost: 7000, sacrifice: 'Recursos drenados', districtId, disabled: !canAfford(7000) },
                    { id: 'partial', label: 'Limpeza parcial', sublabel: 'R$ 3k • Só áreas críticas', action: 'partial_cleanup', cost: 3000, sacrifice: 'Problema retorna em dias', districtId, disabled: !canAfford(3000) },
                    { id: 'wait', label: 'Esperar coleta normal', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: 'Surto quase garantido' }
                ];
                break;

            case 'hospital_pressure':
                const rate = Math.round((state.healthSystem.occupiedBeds / state.healthSystem.totalBeds) * 100);
                threat = `Hospital com ${rate}% de ocupação. Médicos exaustos.`;
                question = 'Sistema de saúde à beira do colapso. Pessoas podem morrer.';
                districtName = 'Sistema de Saúde';
                districtId = null;
                options = [
                    { id: 'expand', label: 'Expansão emergencial', sublabel: 'R$ 40k • +30 leitos', action: 'hospital_expand', cost: 40000, sacrifice: 'Orçamento comprometido', disabled: !canAfford(40000) },
                    { id: 'transfer', label: 'Transferir pacientes', sublabel: 'R$ 15k • Adia o problema', action: 'hospital_transfer', cost: 15000, sacrifice: 'Solução temporária', disabled: !canAfford(15000) },
                    { id: 'wait', label: 'Manter operação', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: 'Mortes são prováveis' }
                ];
                break;

            case 'trust_drop':
                threat = `Confiança pública em ${Math.round(state.publicTrust.value)}%. Cooperação despenca.`;
                question = 'A população não coopera mais. Ações se tornam ineficazes.';
                districtName = 'Cidade';
                districtId = null;
                options = [
                    { id: 'massive', label: 'Campanha massiva', sublabel: 'R$ 25k • Recupera confiança', action: 'trust_campaign', cost: 25000, sacrifice: 'Grande investimento', disabled: !canAfford(25000) },
                    { id: 'local', label: 'Focar em 1 bairro', sublabel: 'R$ 8k • Escolha estratégica', action: 'local_trust', cost: 8000, sacrifice: 'Outros se sentem ignorados', disabled: !canAfford(8000) },
                    { id: 'wait', label: 'Continuar trabalhando', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: 'Desconfiança cresce' }
                ];
                break;

            case 'multiple_crisis':
                const names = criticalDistricts.slice(0, 3).map(d => d.name).join(', ');
                threat = `Múltiplos bairros em crise: ${names}`;
                question = 'Crise em múltiplas frentes. Impossível atender todos.';
                districtName = 'Cidade';
                districtId = criticalDistricts[0]?.id;
                options = [
                    { id: 'triage', label: 'Triagem: salvar o maior', sublabel: 'R$ 15k • Foca no mais populoso', action: 'triage_biggest', cost: 15000, sacrifice: 'Bairros menores abandonados', districtId, disabled: !canAfford(15000) },
                    { id: 'spread', label: 'Dividir recursos', sublabel: 'R$ 20k • Atende todos parcialmente', action: 'spread_thin', cost: 20000, sacrifice: 'Nenhum resolve de fato', disabled: !canAfford(20000) },
                    { id: 'wait', label: 'Focar no hospital', sublabel: 'R$ 10k • Prepara para o pior', action: 'hospital_prep', cost: 10000, sacrifice: 'Surtos vão piorar', disabled: !canAfford(10000) }
                ];
                break;

            case 'weather_emergency':
                threat = `${state.weather.icon} ${state.weather.name}: ${state.weather.threat}`;
                question = `Clima extremo multiplica riscos em toda cidade.`;
                districtName = 'Cidade';
                districtId = null;
                options = [
                    { id: 'preventive', label: 'Ação preventiva geral', sublabel: 'R$ 18k • Inspeção em 3 bairros', action: 'weather_prevention', cost: 18000, sacrifice: 'Alto custo por prevenção', disabled: !canAfford(18000) },
                    { id: 'focus', label: 'Proteger o mais vulnerável', sublabel: 'R$ 8k • Só bairros críticos', action: 'weather_focus', cost: 8000, sacrifice: 'Outros podem piorar', districtId: worstDistrict.id, disabled: !canAfford(8000) },
                    { id: 'wait', label: 'Esperar passar', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: 'Focos vão explodir' }
                ];
                break;

            case 'spread_risk':
                threat = `Situação se deteriora em ${warningDistricts.length} bairros.`;
                question = 'Múltiplos bairros em alerta. Se não agir, viram críticos.';
                districtName = 'Cidade';
                districtId = null;
                options = [
                    { id: 'blitz', label: 'Blitz preventiva', sublabel: 'R$ 22k • Mutirão em 4 bairros', action: 'preventive_blitz', cost: 22000, sacrifice: 'Esvazia cofres', disabled: !canAfford(22000) },
                    { id: 'worst', label: 'Atacar o pior caso', sublabel: 'R$ 10k • Impede 1 crise', action: 'attack_worst', cost: 10000, sacrifice: 'Outros bairros pioram', districtId: worstDistrict.id, disabled: !canAfford(10000) },
                    { id: 'wait', label: 'Aguardar evolução', sublabel: 'Sem custo', action: null, cost: 0, sacrifice: 'Crises simultâneas prováveis' }
                ];
                break;
        }

        if (!question) return;

        set({
            pendingDecision: {
                id: Date.now(),
                type,
                districtId,
                districtName,
                question,
                threat,
                options,
                urgent: type === 'hospital_pressure' || type === 'multiple_crisis'
            },
            focusMode: true,
            focusTarget: districtId || 'centro',
            isPaused: true
        });
    },

    makeDecision: (optionId) => {
        const state = get();
        const decision = state.pendingDecision;
        if (!decision) return;

        const option = decision.options.find(o => o.id === optionId);
        if (!option || option.disabled) return;

        // Custo
        if (option.cost > 0) {
            set((s) => ({ resources: { ...s.resources, budget: s.resources.budget - option.cost } }));
        }

        // Aplicar ações
        const districtId = option.districtId || decision.districtId;

        switch (option.action) {
            case 'full_containment':
                get().applyAction('fumigation', districtId);
                get().applyAction('inspection', districtId);
                set((s) => ({
                    districts: s.districts.map(d => d.id === districtId ? { ...d, trust: Math.max(0.2, d.trust - 0.15) } : d)
                }));
                get().setOutcome('Contenção agressiva aplicada. Comunidade ressentida, mas casos controlados.', 'sacrifice');
                break;

            case 'soft_containment':
                get().applyAction('campaign', districtId);
                get().applyAction('cleanup', districtId);
                get().setOutcome('Abordagem comunitária iniciada. Leva tempo, mas constrói confiança.', 'action');
                break;

            case 'mass_inspection':
                set((s) => ({
                    districts: s.districts.map(d => d.id === districtId ? { ...d, waterSpots: Math.max(0, d.waterSpots - 10), trust: Math.max(0.2, d.trust - 0.08) } : d)
                }));
                get().setOutcome('Força-tarefa eliminou focos. Alguns moradores não gostaram.', 'sacrifice');
                break;

            case 'emergency_cleanup':
                set((s) => ({
                    districts: s.districts.map(d => d.id === districtId ? { ...d, trashLevel: Math.max(0, d.trashLevel - 0.5), waterSpots: Math.max(0, d.waterSpots - 5) } : d)
                }));
                get().setOutcome('Mutirão de emergência concluído. Bairro respira.', 'action');
                break;

            case 'partial_cleanup':
                set((s) => ({
                    districts: s.districts.map(d => d.id === districtId ? { ...d, trashLevel: Math.max(0, d.trashLevel - 0.2) } : d)
                }));
                get().setOutcome('Limpeza parcial feita. O problema vai voltar.', 'neutral');
                break;

            case 'hospital_expand':
                set((s) => ({ healthSystem: { ...s.healthSystem, totalBeds: s.healthSystem.totalBeds + 30 } }));
                get().setOutcome('Hospital ampliado. Investimento pesado, mas vidas serão salvas.', 'action');
                break;

            case 'hospital_transfer':
                set((s) => ({ healthSystem: { ...s.healthSystem, occupiedBeds: Math.max(0, s.healthSystem.occupiedBeds - 15) } }));
                get().setOutcome('Pacientes transferidos. Solução temporária.', 'neutral');
                break;

            case 'hospital_prep':
                set((s) => ({ healthSystem: { ...s.healthSystem, totalBeds: s.healthSystem.totalBeds + 10 } }));
                get().setOutcome('Hospital reforçado minimamente. Bairros seguem sem atenção.', 'neutral');
                break;

            case 'trust_campaign':
                set((s) => ({ publicTrust: { ...s.publicTrust, value: Math.min(100, s.publicTrust.value + 20), trend: 'rising' } }));
                get().setOutcome('Campanha massiva iniciada. Confiança em recuperação.', 'action');
                break;

            case 'local_trust':
                const lowestTrust = [...state.districts].sort((a, b) => a.trust - b.trust)[0];
                set((s) => ({
                    districts: s.districts.map(d => d.id === lowestTrust.id ? { ...d, trust: Math.min(d.maxTrust, d.trust + 0.25) } : { ...d, trust: Math.max(0.2, d.trust - 0.05) })
                }));
                get().setOutcome(`${lowestTrust.name} recebeu atenção. Outros bairros se sentem esquecidos.`, 'sacrifice');
                break;

            case 'triage_biggest':
                const biggest = [...state.districts].sort((a, b) => b.population - a.population)[0];
                get().applyAction('fumigation', biggest.id);
                get().applyAction('cleanup', biggest.id);
                set((s) => ({
                    districts: s.districts.map(d => d.id !== biggest.id && d.visualState === 'critical' ? { ...d, trust: Math.max(0.1, d.trust - 0.2), maxTrust: Math.max(0.5, d.maxTrust - 0.1) } : d)
                }));
                get().setOutcome(`${biggest.name} foi priorizado. Outros bairros se sentem abandonados.`, 'sacrifice');
                break;

            case 'spread_thin':
                state.districts.filter(d => d.visualState === 'critical' || d.visualState === 'warning').slice(0, 4).forEach(d => {
                    set((s) => ({
                        districts: s.districts.map(dist => dist.id === d.id ? { ...dist, waterSpots: Math.max(0, dist.waterSpots - 3), trashLevel: Math.max(0, dist.trashLevel - 0.1) } : dist)
                    }));
                });
                get().setOutcome('Recursos divididos. Nenhum problema resolvido por completo.', 'neutral');
                break;

            case 'weather_prevention':
                state.districts.slice(0, 3).forEach(d => {
                    get().applyAction('inspection', d.id);
                });
                get().setOutcome('Ação preventiva em múltiplos bairros. Alto custo por prevenção.', 'action');
                break;

            case 'weather_focus':
                get().applyAction('cleanup', districtId);
                get().applyAction('inspection', districtId);
                get().setOutcome('Proteção focada no mais vulnerável. Outros estão expostos.', 'sacrifice');
                break;

            case 'preventive_blitz':
                state.districts.filter(d => d.visualState === 'warning').slice(0, 4).forEach(d => {
                    get().applyAction('cleanup', d.id);
                });
                get().setOutcome('Blitz preventiva lançada. Cofres vazios, mas crises evitadas.', 'action');
                break;

            case 'attack_worst':
                get().applyAction('fumigation', districtId);
                get().applyAction('cleanup', districtId);
                get().setOutcome('Pior caso atacado. Outros continuam se deteriorando.', 'sacrifice');
                break;

            case 'campaign':
                get().applyAction('campaign', districtId);
                get().setOutcome('Campanha educativa iniciada. Resultados levam tempo.', 'action');
                break;

            case null:
                // Não fez nada
                if (decision.type === 'hospital_pressure') {
                    set((s) => ({ totalDeaths: s.totalDeaths + Math.floor(Math.random() * 5) + 3 }));
                    set((s) => ({ publicTrust: { ...s.publicTrust, value: Math.max(0, s.publicTrust.value - 12) } }));
                    get().setOutcome('Pessoas morreram esperando atendimento. A cidade não esquece.', 'scar');
                } else if (decision.type === 'outbreak') {
                    set((s) => ({
                        districts: s.districts.map(d => d.id === districtId ? { ...d, infectedCount: d.infectedCount + Math.floor(Math.random() * 8) + 5 } : d)
                    }));
                    get().setOutcome('O surto explodiu. Sem intervenção, o vírus se espalhou.', 'scar');
                } else {
                    get().setOutcome('Você escolheu não agir. As consequências estão por vir.', 'neutral');
                }
                break;
        }

        set({
            pendingDecision: null,
            focusMode: false,
            focusTarget: null,
            isPaused: false
        });
    },

    setOutcome: (text, type) => {
        set((s) => ({ outcomeMessage: { text, type, districtName: '', createdAt: s.totalDays } }));
    },

    clearOldOutcome: () => {
        const state = get();
        if (state.outcomeMessage && state.totalDays - state.outcomeMessage.createdAt > 4) {
            set({ outcomeMessage: null });
        }
    },

    // ========== UPDATES ==========

    updateWeather: () => {
        const state = get();
        if (state.totalDays % 4 === 0) { // Clima muda mais frequente
            const keys = Object.keys(WEATHER_TYPES);
            // Tendência para tempo ruim na temporada de chuvas
            const badWeatherChance = state.chapter.currentDay < 60 ? 0.6 : 0.4;
            const weather = Math.random() < badWeatherChance
                ? WEATHER_TYPES[['rainy', 'stormy', 'hot'][Math.floor(Math.random() * 3)]]
                : WEATHER_TYPES[keys[Math.floor(Math.random() * keys.length)]];
            set({ weather });
        }
    },

    updateDistricts: () => {
        const state = get();
        const wr = state.weather.riskMultiplier;

        const updated = state.districts.map(d => {
            const risk = ((1 - d.sanitation) * 0.3 + d.density * 0.25 + d.environmentalRisk * 0.25 + d.trashLevel * 0.25 + (d.waterSpots / 20) * 0.2) * wr;
            const trustEffect = 1 - (d.trust * 0.35);

            // Menos casos no início
            const newCases = Math.random() < risk * trustEffect * 0.4 ? Math.floor(Math.random() * 4 * risk) : 0;
            const recoveries = Math.floor(d.infectedCount * 0.12);

            // Thresholds mais altos para visual - jogo começa mais calmo
            let visualState = 'calm';
            if (d.infectedCount > 20 || risk > 1.3) visualState = 'critical';
            else if (d.infectedCount > 8 || risk > 0.9) visualState = 'warning';

            const recentActions = d.recentActions.filter(a => state.totalDays - a.day < 8);
            if (recentActions.length > 0 && d.infectedCount < 12) visualState = 'recovering';

            // Degradação mais rápida
            const trashIncrease = (1 - d.sanitation) * 0.02;
            const waterIncrease = state.weather.name.includes('Chuv') || state.weather.name.includes('Temp') ? 0.6 : 0.1;

            const hasRecentAction = recentActions.length > 0;
            const trustChange = hasRecentAction ? 0.01 : -0.01;
            const newTrust = Math.max(0.1, Math.min(d.maxTrust, d.trust + trustChange));

            return {
                ...d,
                infectedCount: Math.max(0, d.infectedCount + newCases - recoveries),
                trashLevel: Math.min(1, d.trashLevel + trashIncrease),
                waterSpots: Math.min(25, d.waterSpots + waterIncrease),
                trust: newTrust,
                visualState,
                recentActions
            };
        });

        set({ districts: updated });
    },

    updateHealthSystem: () => {
        const state = get();
        const total = state.districts.reduce((s, d) => s + d.infectedCount, 0);
        const effectiveBeds = state.healthSystem.totalBeds - state.healthSystem.permanentDamage;
        const hosp = Math.floor(total * 0.35);
        const occ = Math.min(effectiveBeds, hosp + 25);
        const rate = occ / effectiveBeds;

        let status = 'normal';
        if (rate > 0.95) status = 'collapsed';
        else if (rate > 0.8) status = 'critical';
        else if (rate > 0.6) status = 'stressed';

        let newDeaths = 0;
        if (status === 'collapsed') {
            newDeaths = Math.floor((hosp - effectiveBeds) * 0.25);
            if (state.healthSystem.collapseCount === 0) {
                get().addPermanentScar('hospital_collapse', 'Sistema de saúde nunca mais será o mesmo');
            }
        }

        if (newDeaths > 0) {
            set((s) => ({ totalDeaths: s.totalDeaths + newDeaths }));
        }

        set({
            healthSystem: {
                ...state.healthSystem,
                occupiedBeds: occ,
                status,
                collapseCount: status === 'collapsed' ? state.healthSystem.collapseCount + 1 : state.healthSystem.collapseCount
            }
        });
    },

    updatePublicTrust: () => {
        const state = get();
        let trustChange = 0;
        let trend = 'stable';
        let dropReason = null;

        const totalCases = state.districts.reduce((s, d) => s + d.infectedCount, 0);
        const criticalDistricts = state.districts.filter(d => d.visualState === 'critical').length;
        const hospitalCollapsed = state.healthSystem.status === 'collapsed';

        // Penalidades MENORES para ser jogável
        if (hospitalCollapsed) { trustChange -= 1.5; dropReason = 'Hospital colapsado'; trend = 'crashing'; }
        if (state.totalDeaths > 0 && state.totalDays % 5 === 0) { trustChange -= 0.5; dropReason = 'Mortes'; trend = 'falling'; }
        if (criticalDistricts >= 5) { trustChange -= 0.5; dropReason = 'Múltiplas crises'; trend = 'falling'; }
        else if (criticalDistricts >= 3) { trustChange -= 0.2; trend = trend === 'stable' ? 'falling' : trend; }
        if (totalCases > 100) { trustChange -= 0.3; }

        // Recuperação MAIOR para balancear
        const recoveringDistricts = state.districts.filter(d => d.visualState === 'recovering').length;
        const calmDistricts = state.districts.filter(d => d.visualState === 'calm').length;

        if (recoveringDistricts > 0 && state.healthSystem.status !== 'collapsed') {
            trustChange += 0.3 * recoveringDistricts;
            trend = trustChange > 0 ? 'rising' : trend;
        }

        // Bônus por bairros calmos (estabilidade)
        if (calmDistricts >= 8) {
            trustChange += 0.5;
            trend = trustChange > 0 ? 'rising' : trend;
        }

        const newValue = Math.max(0, Math.min(100, state.publicTrust.value + trustChange));
        const newLow = Math.min(state.publicTrust.allTimeLow, newValue);

        set({
            publicTrust: { ...state.publicTrust, value: newValue, trend, lastDrop: dropReason || state.publicTrust.lastDrop, allTimeLow: newLow }
        });
    },

    addPermanentScar: (id, description) => {
        const state = get();
        if (state.permanentScars.find(s => s.id === id)) return;
        set({
            permanentScars: [...state.permanentScars, { id, description, day: state.totalDays }],
            outcomeMessage: { text: `⚠️ CICATRIZ: ${description}`, type: 'scar', districtName: '', createdAt: state.totalDays }
        });
        if (id === 'hospital_collapse') {
            set((s) => ({ healthSystem: { ...s.healthSystem, permanentDamage: s.healthSystem.permanentDamage + 15 } }));
        }
    },

    applyAction: (actionId, districtId) => {
        const action = ACTIONS[actionId];
        if (!action) return;
        set((s) => ({
            activeActions: [...s.activeActions, { actionId, districtId, daysRemaining: action.duration }],
            districts: s.districts.map(d => d.id === districtId ? { ...d, recentActions: [...d.recentActions, { actionId, day: s.totalDays }], visualState: 'recovering' } : d)
        }));
    },

    processActiveActions: () => {
        const state = get();
        let updated = [...state.districts];
        const still = state.activeActions.filter(a => {
            a.daysRemaining--;
            if (a.daysRemaining <= 0) {
                const idx = updated.findIndex(d => d.id === a.districtId);
                if (idx !== -1) {
                    const d = updated[idx];
                    if (a.actionId === 'cleanup') updated[idx] = { ...d, trashLevel: Math.max(0, d.trashLevel - 0.4), waterSpots: Math.max(0, d.waterSpots - 5) };
                    else if (a.actionId === 'fumigation') updated[idx] = { ...d, infectedCount: Math.floor(d.infectedCount * 0.25) };
                    else if (a.actionId === 'campaign') updated[idx] = { ...d, trust: Math.min(d.maxTrust, d.trust + 0.18) };
                    else if (a.actionId === 'inspection') updated[idx] = { ...d, waterSpots: Math.max(0, d.waterSpots - 8) };
                }
                return false;
            }
            return true;
        });
        set({ districts: updated, activeActions: still });
    },

    checkGameOver: () => {
        const state = get();
        if (state.publicTrust.value <= 0) {
            set({ gameOver: true, gameOverReason: 'Confiança pública zerou. Você foi removido.', isPaused: true });
        }
        if (state.totalDeaths >= 100) {
            set({ gameOver: true, gameOverReason: 'Número de mortes inaceitável. Investigação aberta.', isPaused: true });
        }
    },

    endChapter: () => {
        const state = get();
        const survived = state.publicTrust.value > 0 && state.totalDeaths < 100;
        set({ victory: survived, gameOver: !survived, gameOverReason: survived ? null : 'Temporada terminou em desastre.', isPaused: true });
    },

    selectDistrict: (id) => set((s) => {
        if (s.focusMode && s.focusTarget && s.focusTarget !== id) return s;
        return { selectedDistrict: s.districts.find(d => d.id === id) || null };
    }),

    clearSelection: () => set({ selectedDistrict: null }),

    getCityRiskLevel: () => {
        const s = get();
        const trust = s.publicTrust.value;
        if (trust < 25) return { level: 'critical', label: 'Colapso', color: '#ff4757' };
        if (trust < 50) return { level: 'high', label: 'Crise', color: '#ffa502' };
        if (trust < 70) return { level: 'medium', label: 'Tenso', color: '#f1c40f' };
        return { level: 'low', label: 'Estável', color: '#2ed573' };
    },

    resetGame: () => set({
        isPlaying: false, isPaused: true, gameSpeed: 1, gameOver: false, victory: false, gameOverReason: null,
        chapter: { ...CHAPTER_CONFIG, currentDay: 0 }, publicTrust: { ...INITIAL_PUBLIC_TRUST },
        pendingDecision: null, focusMode: false, focusTarget: null, outcomeMessage: null,
        totalDeaths: 0, permanentScars: [], lastEventDay: 0,
        day: 1, month: 1, year: 2024, totalDays: 0, weather: WEATHER_TYPES.rainy,
        districts: JSON.parse(JSON.stringify(INITIAL_DISTRICTS)), selectedDistrict: null,
        healthSystem: { ...INITIAL_HEALTH_SYSTEM }, resources: { ...INITIAL_RESOURCES }, activeActions: []
    })
}));

export default useGameStore;
