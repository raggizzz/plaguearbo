/**
 * MainMenu - Tela inicial do jogo
 */

import { useGameStore } from '../store/gameStore';

export default function MainMenu() {
    const { startGame } = useGameStore();

    return (
        <div className="loading-screen" style={{
            background: 'linear-gradient(135deg, #0a0e17 0%, #1a1f2e 50%, #0a0e17 100%)'
        }}>
            {/* Logo animado */}
            <div className="loading-logo">🦟</div>

            {/* Título */}
            <h1 className="loading-title" style={{
                fontSize: '42px',
                marginBottom: '8px'
            }}>
                ARBOGAME
            </h1>

            {/* Subtítulo */}
            <p className="loading-subtitle" style={{
                fontSize: '16px',
                opacity: 0.8,
                maxWidth: '400px',
                textAlign: 'center',
                lineHeight: 1.6
            }}>
                Simulador de Gestão Urbana e Saúde Pública
            </p>

            {/* Descrição */}
            <p style={{
                fontSize: '14px',
                color: '#64748b',
                maxWidth: '500px',
                textAlign: 'center',
                margin: '24px 0 40px',
                lineHeight: 1.7
            }}>
                Você controla uma cidade viva. Tome decisões estratégicas para prevenir
                surtos de dengue, gerenciar recursos e salvar vidas.
            </p>

            {/* Botões */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
                <button
                    className="pause-btn primary"
                    onClick={startGame}
                    style={{
                        padding: '16px 32px',
                        fontSize: '18px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #00d4aa, #00a885)',
                        boxShadow: '0 4px 20px rgba(0, 212, 170, 0.4)'
                    }}
                >
                    🎮 Iniciar Jogo
                </button>

                <button
                    className="pause-btn secondary"
                    style={{ padding: '12px 24px' }}
                    disabled
                >
                    📋 Tutorial (em breve)
                </button>

                <button
                    className="pause-btn secondary"
                    style={{ padding: '12px 24px' }}
                    disabled
                >
                    ⚙️ Configurações (em breve)
                </button>
            </div>

            {/* Features */}
            <div style={{
                display: 'flex',
                gap: '32px',
                marginTop: '48px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {[
                    { icon: '🏙️', label: 'Cidade 3D' },
                    { icon: '📊', label: 'Sistemas Reais' },
                    { icon: '⏱️', label: 'Tempo Importa' },
                    { icon: '🧠', label: 'Decisões Estratégicas' }
                ].map((feature, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '28px' }}>{feature.icon}</span>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {feature.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Versão */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                fontSize: '12px',
                color: '#475569'
            }}>
                v0.1.0 - Protótipo Educacional
            </div>
        </div>
    );
}
