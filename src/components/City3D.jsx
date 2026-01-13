/**
 * City3D - Cidade 3D Profissional (VERSÃO COMPLETA)
 * Com camadas urbanas, tipos de prédios, ruas e microelementos
 */

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// ============================================
// DEFINIÇÕES DE TIPOS DE PRÉDIOS (CORES VIBRANTES)
// ============================================

// Prédios residenciais - tons quentes e acolhedores
const RESIDENTIAL_TYPES = [
    { width: 0.3, depth: 0.3, height: 0.4, color: '#e8d5b7', name: 'casa_pequena' },  // Bege quente
    { width: 0.35, depth: 0.4, height: 0.5, color: '#deb887', name: 'casa_media' },   // Burly wood
    { width: 0.4, depth: 0.35, height: 0.6, color: '#d4a574', name: 'sobrado' },      // Terracota claro
    { width: 0.25, depth: 0.5, height: 0.35, color: '#f5e6d3', name: 'casa_longa' },  // Creme
];

// Prédios comerciais - tons modernos
const COMMERCIAL_TYPES = [
    { width: 0.35, depth: 0.35, height: 1.2, color: '#5a7d9a', name: 'predio_baixo' },  // Azul aço
    { width: 0.3, depth: 0.3, height: 1.8, color: '#4a6d8a', name: 'predio_medio' },   // Azul escuro
    { width: 0.4, depth: 0.4, height: 2.2, color: '#3a5d7a', name: 'predio_alto' },    // Azul profundo
];

// Prédios industriais - menores e proporcionais (sem parecer triângulos)
const INDUSTRIAL_TYPES = [
    { width: 0.4, depth: 0.35, height: 0.5, color: '#6b6b6b', name: 'galpao' },
    { width: 0.35, depth: 0.35, height: 0.6, color: '#5b5b5b', name: 'fabrica' },
];

// Hospital - branco com cruz vermelha
const HOSPITAL_TYPE = { width: 0.8, depth: 0.6, height: 0.7, color: '#ffffff', name: 'hospital' };

// ============================================
// COMPONENTE DE PRÉDIO INDIVIDUAL
// ============================================
function Building({ position, type, rotation = 0, heightVariation = 1, colorVariation = 0 }) {
    const meshRef = useRef();

    // Variação de cor sutil
    const adjustedColor = useMemo(() => {
        const color = new THREE.Color(type.color);
        const hsl = {};
        color.getHSL(hsl);
        hsl.l = Math.max(0.1, Math.min(0.9, hsl.l + colorVariation * 0.1));
        color.setHSL(hsl.h, hsl.s, hsl.l);
        return color;
    }, [type.color, colorVariation]);

    const height = type.height * heightVariation;

    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Corpo principal do prédio */}
            <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[type.width, height, type.depth]} />
                <meshStandardMaterial color={adjustedColor} roughness={0.8} metalness={0.1} />
            </mesh>

            {/* Telhado/Topo */}
            <mesh position={[0, height + 0.02, 0]} castShadow>
                <boxGeometry args={[type.width * 1.02, 0.04, type.depth * 1.02]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Janelas (para prédios altos) */}
            {height > 0.8 && (
                <WindowsGrid height={height} width={type.width} depth={type.depth} />
            )}
        </group>
    );
}

// Grid de janelas para prédios
function WindowsGrid({ height, width, depth }) {
    const rows = Math.floor(height / 0.25);
    const cols = 2;

    return (
        <group>
            {/* Janelas frontais */}
            {Array.from({ length: rows }).map((_, row) => (
                Array.from({ length: cols }).map((_, col) => (
                    <mesh
                        key={`front-${row}-${col}`}
                        position={[
                            (col - 0.5) * 0.12,
                            0.2 + row * 0.25,
                            depth / 2 + 0.01
                        ]}
                    >
                        <planeGeometry args={[0.08, 0.1]} />
                        <meshBasicMaterial color="#87ceeb" transparent opacity={0.7} />
                    </mesh>
                ))
            ))}
        </group>
    );
}

// ============================================
// CHAMINÉ INDUSTRIAL
// ============================================
function Chimney({ position, height = 0.6 }) {
    return (
        <group position={position}>
            <mesh position={[0, height / 2, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, height, 8]} />
                <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
            </mesh>
            {/* Fumaça */}
            <mesh position={[0, height + 0.1, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#888888" transparent opacity={0.4} />
            </mesh>
        </group>
    );
}

// ============================================
// CAIXA D'ÁGUA (indicador de risco)
// ============================================
function WaterTank({ position, isOpen = false }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
                <meshStandardMaterial color={isOpen ? "#4a90d9" : "#2a4a6a"} roughness={0.5} />
            </mesh>
            {!isOpen && (
                <mesh position={[0, 0.21, 0]}>
                    <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
                    <meshStandardMaterial color="#3a5a7a" roughness={0.7} />
                </mesh>
            )}
            {isOpen && (
                <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.06, 0.08, 12]} />
                    <meshBasicMaterial color="#6ab4f2" transparent opacity={0.8} />
                </mesh>
            )}
        </group>
    );
}

// ============================================
// LIXO ESPALHADO
// ============================================
function TrashPile({ position, amount = 1 }) {
    const pieces = useMemo(() => {
        return Array.from({ length: Math.floor(amount * 5) }).map((_, i) => ({
            x: (Math.random() - 0.5) * 0.3,
            z: (Math.random() - 0.5) * 0.3,
            scale: 0.02 + Math.random() * 0.03,
            rotation: Math.random() * Math.PI,
            color: ['#6b5b4f', '#5a4a3a', '#4a3a2a', '#7a6a5a'][Math.floor(Math.random() * 4)]
        }));
    }, [amount]);

    return (
        <group position={position}>
            {pieces.map((piece, i) => (
                <mesh key={i} position={[piece.x, piece.scale / 2, piece.z]} rotation={[0, piece.rotation, 0]}>
                    <boxGeometry args={[piece.scale * 2, piece.scale, piece.scale * 1.5]} />
                    <meshStandardMaterial color={piece.color} roughness={1} />
                </mesh>
            ))}
        </group>
    );
}

// ============================================
// ÁRVORE SIMPLES
// ============================================
function Tree({ position, scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* Tronco */}
            <mesh position={[0, 0.15, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.3, 6]} />
                <meshStandardMaterial color="#5d4037" roughness={0.9} />
            </mesh>
            {/* Copa */}
            <mesh position={[0, 0.4, 0]} castShadow>
                <coneGeometry args={[0.15, 0.35, 6]} />
                <meshStandardMaterial color="#2e7d32" roughness={0.8} />
            </mesh>
        </group>
    );
}

// ============================================
// RUA
// ============================================
function Street({ start, end, width = 0.3 }) {
    const length = Math.sqrt(
        Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
    );
    const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
    const midX = (start[0] + end[0]) / 2;
    const midZ = (start[2] + end[2]) / 2;

    return (
        <group position={[midX, 0.01, midZ]} rotation={[0, -angle, 0]}>
            {/* Asfalto */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[length, width]} />
                <meshStandardMaterial color="#2d3436" roughness={0.9} />
            </mesh>
            {/* Linhas brancas */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
                <planeGeometry args={[length * 0.8, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
        </group>
    );
}

// ============================================
// ZONA DO BAIRRO (hexágono com conteúdo)
// ============================================
function DistrictZone({ district, isSelected, onClick }) {
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { weather, focusMode, focusTarget } = useGameStore();

    // Visual baseado no estado emocional do bairro
    const visualConfig = useMemo(() => {
        switch (district.visualState) {
            case 'critical':
                return {
                    groundColor: '#3f1a1a',
                    emissive: '#ff4757',
                    emissiveIntensity: 0.15,
                    fogDensity: 0.3
                };
            case 'warning':
                return {
                    groundColor: '#2f2a1a',
                    emissive: '#ffa502',
                    emissiveIntensity: 0.08,
                    fogDensity: 0.15
                };
            case 'recovering':
                return {
                    groundColor: '#1a2f2a',
                    emissive: '#00d4aa',
                    emissiveIntensity: 0.12,
                    fogDensity: 0
                };
            default: // calm
                return {
                    groundColor: '#1a2f1a',
                    emissive: '#2ed573',
                    emissiveIntensity: 0.03,
                    fogDensity: 0
                };
        }
    }, [district.visualState]);

    // Calcular risco para elementos secundários
    const riskLevel = useMemo(() => {
        return (1 - district.sanitation) + district.trashLevel + (district.waterSpots / 15);
    }, [district]);

    // Tamanho baseado na população
    const size = 2 + Math.sqrt(district.population / 10000);

    // Gerar prédios com base no tipo de bairro
    const buildings = useMemo(() => {
        const result = [];
        const count = Math.floor(district.density * 12) + 5;

        // Determinar tipos de prédios baseado na renda
        let buildingTypes;
        if (district.income === 'high') {
            buildingTypes = [...COMMERCIAL_TYPES, ...RESIDENTIAL_TYPES.slice(2)];
        } else if (district.income === 'medium') {
            buildingTypes = [...INDUSTRIAL_TYPES, ...RESIDENTIAL_TYPES];
        } else {
            buildingTypes = [...RESIDENTIAL_TYPES, RESIDENTIAL_TYPES[0], RESIDENTIAL_TYPES[1]];
        }

        // Distribuir em grid irregular
        const gridSize = Math.ceil(Math.sqrt(count));
        const cellSize = (size * 1.2) / gridSize;

        for (let i = 0; i < count; i++) {
            const gridX = (i % gridSize) - gridSize / 2;
            const gridZ = Math.floor(i / gridSize) - gridSize / 2;

            // Posição com variação
            const x = gridX * cellSize + (Math.random() - 0.5) * cellSize * 0.5;
            const z = gridZ * cellSize + (Math.random() - 0.5) * cellSize * 0.5;

            // Pular se muito longe do centro (manter formato hexagonal)
            const distFromCenter = Math.sqrt(x * x + z * z);
            if (distFromCenter > size * 0.85) continue;

            const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];

            result.push({
                position: [x, 0, z],
                type,
                rotation: Math.random() * Math.PI * 0.1, // Pequena rotação
                heightVariation: 0.7 + Math.random() * 0.6,
                colorVariation: (Math.random() - 0.5) * 2,
                key: `building-${i}`
            });
        }

        return result;
    }, [district.id, district.density, district.income, size]);

    // Gerar caixas d'água (proporcional ao waterSpots)
    const waterTanks = useMemo(() => {
        const count = Math.min(Math.floor(district.waterSpots / 2), 6);
        return Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = size * 0.5 * (0.4 + Math.random() * 0.4);
            return {
                position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
                isOpen: Math.random() > 0.3,
                key: `tank-${i}`
            };
        });
    }, [district.waterSpots, size]);

    // Gerar lixo (proporcional ao trashLevel)
    const trashPiles = useMemo(() => {
        const count = Math.floor(district.trashLevel * 8);
        return Array.from({ length: count }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * size * 1.2,
                0,
                (Math.random() - 0.5) * size * 1.2
            ],
            amount: 0.5 + Math.random() * 0.5,
            key: `trash-${i}`
        }));
    }, [district.trashLevel, size]);

    // Árvores (mais em bairros ricos)
    const trees = useMemo(() => {
        const count = district.income === 'high' ? 8 : district.income === 'medium' ? 4 : 2;
        return Array.from({ length: count }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * size * 1.5,
                0,
                (Math.random() - 0.5) * size * 1.5
            ],
            scale: 0.6 + Math.random() * 0.4,
            key: `tree-${i}`
        }));
    }, [district.income, size]);

    // Hospital (apenas no centro)
    const hasHospital = district.id === 'centro';

    // Animação - mais expressiva baseada no estado
    useFrame((state) => {
        if (groupRef.current) {
            // Pulso sutil baseado no estado
            if (district.visualState === 'critical') {
                const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.03;
                groupRef.current.position.y = pulse;
            } else if (district.visualState === 'recovering') {
                const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
                groupRef.current.position.y = breathe;
            } else {
                groupRef.current.position.y = 0;
            }

            // Dimming se em modo foco e não é o alvo
            if (focusMode && focusTarget && focusTarget !== district.id) {
                groupRef.current.visible = true; // Mantém visível mas escurecido via material
            }
        }
    });

    // Opacidade reduzida se não é o foco
    const isFocused = !focusMode || focusTarget === district.id;

    return (
        <group
            ref={groupRef}
            position={district.position}
            onClick={(e) => { e.stopPropagation(); onClick(district.id); }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
            onPointerOut={() => { document.body.style.cursor = 'default'; setHovered(false); }}
        >
            {/* Base circular do terreno - visual suave */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <cylinderGeometry args={[size, size, 0.1, 32]} />
                <meshStandardMaterial
                    color={visualConfig.groundColor}
                    roughness={0.95}
                    emissive={isSelected ? '#00d4aa' : hovered ? visualConfig.emissive : visualConfig.emissive}
                    emissiveIntensity={isSelected ? 0.4 : hovered ? visualConfig.emissiveIntensity * 2 : visualConfig.emissiveIntensity}
                    transparent={!isFocused}
                    opacity={isFocused ? 1 : 0.4}
                />
            </mesh>

            {/* Borda de seleção */}
            {isSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
                    <ringGeometry args={[size - 0.05, size + 0.1, 32]} />
                    <meshBasicMaterial color="#00d4aa" transparent opacity={0.8} />
                </mesh>
            )}

            {/* Anel de risco (pulsa quando crítico) */}
            {district.visualState === 'critical' && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
                    <ringGeometry args={[size - 0.15, size - 0.05, 32]} />
                    <meshBasicMaterial
                        color="#ff4757"
                        transparent
                        opacity={0.4 + Math.sin(Date.now() * 0.004) * 0.3}
                    />
                </mesh>
            )}

            {/* Anel de recuperação (pulsa verde) */}
            {district.visualState === 'recovering' && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
                    <ringGeometry args={[size - 0.15, size - 0.05, 32]} />
                    <meshBasicMaterial
                        color="#00d4aa"
                        transparent
                        opacity={0.3 + Math.sin(Date.now() * 0.003) * 0.15}
                    />
                </mesh>
            )}

            {/* Calçadas / ruas internas */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
                <ringGeometry args={[size * 0.3, size * 0.35, 32]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Prédios */}
            {buildings.map(b => (
                <Building key={b.key} {...b} />
            ))}

            {/* Hospital (se aplicável) */}
            {hasHospital && (
                <group position={[0, 0, 0]}>
                    <Building
                        position={[0, 0, 0]}
                        type={HOSPITAL_TYPE}
                        heightVariation={1.2}
                        colorVariation={0}
                    />
                    {/* Cruz do hospital */}
                    <mesh position={[0, HOSPITAL_TYPE.height * 1.2 + 0.15, HOSPITAL_TYPE.depth / 2 + 0.01]}>
                        <planeGeometry args={[0.15, 0.25]} />
                        <meshBasicMaterial color="#ff0000" />
                    </mesh>
                    <mesh position={[0, HOSPITAL_TYPE.height * 1.2 + 0.15, HOSPITAL_TYPE.depth / 2 + 0.02]}>
                        <planeGeometry args={[0.25, 0.1]} />
                        <meshBasicMaterial color="#ff0000" />
                    </mesh>
                </group>
            )}

            {/* Chaminés para bairro industrial */}
            {district.id === 'industrial' && (
                <>
                    <Chimney position={[size * 0.3, 0, size * 0.2]} height={0.8} />
                    <Chimney position={[-size * 0.4, 0, -size * 0.1]} height={0.6} />
                </>
            )}

            {/* Caixas d'água */}
            {waterTanks.map(tank => (
                <WaterTank key={tank.key} {...tank} />
            ))}

            {/* Lixo */}
            {trashPiles.map(trash => (
                <TrashPile key={trash.key} {...trash} />
            ))}

            {/* Árvores */}
            {trees.map(tree => (
                <Tree key={tree.key} {...tree} />
            ))}

            {/* Indicador de casos - aparece se tiver casos */}
            {district.infectedCount > 0 && (
                <Html center position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: district.infectedCount > 10 ? 'rgba(255, 71, 87, 0.9)' : 'rgba(255, 165, 2, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Inter, sans-serif',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
                    }}>
                        {district.infectedCount}
                    </div>
                </Html>
            )}

            {/* Nome do bairro - minimalista */}
            <Html center position={[0, 0.3, size + 0.4]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    color: isSelected ? '#00d4aa' : hovered ? '#f8fafc' : 'rgba(100, 116, 139, 0.7)',
                    padding: '2px 8px',
                    fontSize: '10px',
                    fontWeight: '600',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                    transition: 'all 0.2s ease',
                    opacity: isSelected || hovered ? 1 : 0.7
                }}>
                    {district.name}
                </div>
            </Html>
        </group>
    );
}

// ============================================
// TERRENO DA CIDADE
// ============================================
function CityTerrain() {
    return (
        <group>
            {/* Chão principal - maior para 16 bairros */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 5]} receiveShadow>
                <circleGeometry args={[45, 64]} />
                <meshStandardMaterial color="#0a0e15" roughness={1} />
            </mesh>

            {/* Grid decorativo */}
            <gridHelper args={[90, 90, '#1a2535', '#1a2535']} position={[0, -0.09, 5]} />
        </group>
    );
}

// ============================================
// ESTRADAS PRINCIPAIS
// ============================================
function MainRoads({ districts }) {
    const roads = useMemo(() => {
        const result = [];
        // Conectar bairros - distância maior para cidade grande
        for (let i = 0; i < districts.length; i++) {
            for (let j = i + 1; j < districts.length; j++) {
                const d1 = districts[i];
                const d2 = districts[j];
                const dist = Math.sqrt(
                    Math.pow(d2.position[0] - d1.position[0], 2) +
                    Math.pow(d2.position[2] - d1.position[2], 2)
                );
                // Aumentar distância de conexão para 6
                if (dist < 6) {
                    result.push({
                        start: d1.position,
                        end: d2.position,
                        key: `road-${i}-${j}`
                    });
                }
            }
        }
        return result;
    }, [districts]);

    return (
        <group>
            {roads.map(road => (
                <Street key={road.key} start={road.start} end={road.end} width={0.4} />
            ))}
        </group>
    );
}

// ============================================
// CENA PRINCIPAL
// ============================================
function CityScene() {
    const { districts, selectedDistrict, selectDistrict, focusMode, focusTarget } = useGameStore();

    const handleDistrictClick = (districtId) => {
        // Em modo foco, só permite clicar no distrito em foco
        if (focusMode && focusTarget && focusTarget !== districtId) return;
        selectDistrict(districtId);
    };

    return (
        <>
            {/* Câmera - bem afastada para ver cidade grande (16 bairros) */}
            <PerspectiveCamera makeDefault position={[25, 28, 25]} fov={55} />
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={15}
                maxDistance={80}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.3}
                target={[0, 0, 5]}
                enableDamping={true}
                dampingFactor={0.05}
            />

            {/* Iluminação - mais intensa para cidade grande */}
            <ambientLight intensity={0.5} color="#c4d6f7" />
            <directionalLight
                position={[25, 35, 15]}
                intensity={1.8}
                color="#fff8e6"
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-near={0.5}
                shadow-camera-far={100}
                shadow-camera-left={-35}
                shadow-camera-right={35}
                shadow-camera-top={35}
                shadow-camera-bottom={-35}
            />
            <pointLight position={[-15, 12, -15]} intensity={0.4} color="#00d4aa" />
            <pointLight position={[15, 8, 15]} intensity={0.3} color="#ffa502" />
            <pointLight position={[0, 10, 0]} intensity={0.2} color="#ffffff" />
            <hemisphereLight args={['#87ceeb', '#1a1a2e', 0.5]} />

            {/* Céu/Fundo - fog mais distante */}
            <fog attach="fog" args={['#0d1117', 50, 100]} />
            <color attach="background" args={['#0a0e15']} />

            {/* Terreno */}
            <CityTerrain />

            {/* Estradas */}
            <MainRoads districts={districts} />

            {/* Bairros */}
            {districts.map((district) => (
                <DistrictZone
                    key={district.id}
                    district={district}
                    isSelected={selectedDistrict?.id === district.id}
                    onClick={handleDistrictClick}
                />
            ))}
        </>
    );
}

// ============================================
// WRAPPER DO CANVAS
// ============================================
export default function City3D() {
    return (
        <div className="game-canvas">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
                camera={{ position: [12, 14, 12], fov: 45 }}
            >
                <CityScene />
            </Canvas>
        </div>
    );
}
