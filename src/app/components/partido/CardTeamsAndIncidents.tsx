import React, { useState } from 'react';
import { IncidenciaPartido, JugadorPlantel } from '@/app/types/partido';
import { IncidenciasSkeleton } from '@/app/components/skeletons/IncidenciasSkeleton';
import { calcularAccionesJugador } from '@/app/utils/formacion.helper';
import JugadorRow from './JugadorRow';
import IncidenciaRow from './IncidenciaRow';
import { ordenarJugadoresPorDorsal } from './JugadoresTabs/utils/jugadores.utils';

interface PartidoTabsProps {
    equipoLocal: {
        nombre: string;
        jugadores: JugadorPlantel[];
    };
    equipoVisita: {
        nombre: string;
        jugadores: JugadorPlantel[];
    };
    incidencias: IncidenciaPartido[];
    esPlanillero?: boolean;
    onJugadorClick?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    isLoading?: boolean;
}

// Componente principal
const PartidoTabs: React.FC<PartidoTabsProps> = ({
    equipoLocal,
    equipoVisita,
    incidencias,
    esPlanillero = false,
    onJugadorClick,
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<'local' | 'incidencias' | 'visita'>('incidencias');

    // Ordenar incidencias por minuto
    const incidenciasOrdenadas = [...incidencias].sort((a, b) => (a.minuto || 0) - (b.minuto || 0));

    // Calcular si hay suplentes disponibles para cada equipo
    const haySuplentesLocal = React.useMemo(() => {
        return equipoLocal.jugadores.some(jugador => {
            const tieneDorsal = jugador.dorsal !== null && jugador.dorsal !== undefined && jugador.dorsal !== 0;
            const noEstaEnCancha = !jugador.en_cancha;
            const noEstaInhabilitado = jugador.sancionado !== 'S';
            return tieneDorsal && noEstaEnCancha && noEstaInhabilitado;
        });
    }, [equipoLocal.jugadores]);

    const haySuplentesVisita = React.useMemo(() => {
        return equipoVisita.jugadores.some(jugador => {
            const tieneDorsal = jugador.dorsal !== null && jugador.dorsal !== undefined && jugador.dorsal !== 0;
            const noEstaEnCancha = !jugador.en_cancha;
            const noEstaInhabilitado = jugador.sancionado !== 'S';
            return tieneDorsal && noEstaEnCancha && noEstaInhabilitado;
        });
    }, [equipoVisita.jugadores]);

    return (
        <>
            <style jsx>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            
            <div className="w-full bg-[#0a0a0a]">
                {/* Navegación */}
                <div className="flex border-b border-[#262626] bg-[#171717]">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`
                            flex-1 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${activeTab === 'local'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[#737373] hover:text-white hover:border-[#404040]'
                            }
                        `}
                    >
                        {equipoLocal.nombre}
                        <span className="ml-2 text-xs">({equipoLocal.jugadores.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('incidencias')}
                        className={`
                            flex-1 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${activeTab === 'incidencias'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[#737373] hover:text-white hover:border-[#404040]'
                            }
                        `}
                    >
                        Incidencias
                        <span className="ml-2 text-xs">({incidencias.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('visita')}
                        className={`
                            flex-1 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${activeTab === 'visita'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[#737373] hover:text-white hover:border-[#404040]'
                            }
                        `}
                    >
                        {equipoVisita.nombre}
                        <span className="ml-2 text-xs">({equipoVisita.jugadores.length})</span>
                    </button>
                </div>

                {/* Contenido */} 
                <div className="w-full px-4">
                    {/* Tab: Equipo Local */}
                    {activeTab === 'local' && (
                        <div className="space-y-2">
                            {equipoLocal.jugadores.length > 0 ? (
                                ordenarJugadoresPorDorsal(equipoLocal.jugadores).map((jugador, index) => (
                                    <JugadorRow
                                        key={`${activeTab}-${jugador.id_jugador}`}
                                        jugador={jugador}
                                        acciones={calcularAccionesJugador(jugador, incidencias)}
                                        equipo="local"
                                        equipoId={jugador.id_equipo}
                                        esDestacado={jugador.destacado || false}
                                        estaRotando={false}
                                        index={index}
                                        mode={esPlanillero ? 'planillero' : 'view'}
                                        permitirAcciones={false}
                                        estaCargando={false}
                                        haySuplentesDisponibles={haySuplentesLocal}
                                        onJugadorClick={esPlanillero && onJugadorClick ? () => onJugadorClick(jugador.id_jugador, 'local') : undefined}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay jugadores registrados
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Incidencias */}
                    {activeTab === 'incidencias' && (
                        <div className="space-y-0">
                            {isLoading ? (
                                <IncidenciasSkeleton />
                            ) : incidenciasOrdenadas.length > 0 ? (
                                incidenciasOrdenadas.map((incidencia, index) => (
                                    <IncidenciaRow
                                        key={`${activeTab}-${incidencia.tipo}-${incidencia.id}-${index}`}
                                        incidencia={incidencia}
                                        equipoLocalId={equipoLocal.jugadores[0]?.id_equipo || 0}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay incidencias registradas
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Equipo Visita */}
                    {activeTab === 'visita' && (
                        <div className="space-y-2">
                            {equipoVisita.jugadores.length > 0 ? (
                                ordenarJugadoresPorDorsal(equipoVisita.jugadores).map((jugador, index) => (
                                    <JugadorRow
                                        key={`${activeTab}-${jugador.id_jugador}`}
                                        jugador={jugador}
                                        acciones={calcularAccionesJugador(jugador, incidencias)}
                                        equipo="visita"
                                        equipoId={jugador.id_equipo}
                                        esDestacado={jugador.destacado || false}
                                        estaRotando={false}
                                        index={index}
                                        mode={esPlanillero ? 'planillero' : 'view'}
                                        permitirAcciones={false}
                                        estaCargando={false}
                                        haySuplentesDisponibles={haySuplentesVisita}
                                        onJugadorClick={esPlanillero && onJugadorClick ? () => onJugadorClick(jugador.id_jugador, 'visita') : undefined}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay jugadores registrados
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PartidoTabs;