import React, { useState, useMemo } from 'react';
import { Plus, Star } from 'lucide-react';
import { IncidenciaPartido, JugadorPlantel, EstadoPartido, JugadorDestacado } from '@/app/types/partido';
import IncidenciaRow from './Incidents';
import JugadorRow from './JugadorRow';
import { calcularAccionesJugador, esJugadorDestacado } from '@/app/utils/formacion.helper';
import FormacionesCardSkeleton from '../skeletons/FormacionesCardSkeleton';

interface JugadoresTabsProps {
    equipoLocal: {
        id_equipo: number;
        nombre: string;
        jugadores: JugadorPlantel[]
    };
    equipoVisita: {
        id_equipo: number;
        nombre: string;
        jugadores: JugadorPlantel[]
    };
    incidencias: IncidenciaPartido[];
    destacados?: any[];

    // Modo de operación
    mode: 'view' | 'planillero';
    estadoPartido?: EstadoPartido;
    estrellasRotando?: Set<number>;
    jugadorDestacado: JugadorDestacado | null;

    // Callbacks para modo planillero
    onJugadorClick?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    onJugadorAction?: (jugadorId: number, equipoId: number) => void;
    onDeleteDorsal?: (jugadorId: number) => void;
    onToggleDestacado?: (jugadorId: number, equipoId: number) => void;
    onAgregarEventual?: (equipo: 'local' | 'visita') => void;

    // Callbacks para incidencias
    onEditIncidencia?: (incidencia: IncidenciaPartido) => void;
    onDeleteIncidencia?: (incidencia: IncidenciaPartido) => void;

    // Estados
    loading?: boolean;
    jugadorCargando?: number | null;

    // Configuración
    idCategoriaEdicion?: number;
    idPartido?: number;
}

type TabType = 'local' | 'incidencias' | 'visita';

const JugadoresTabsUnified: React.FC<JugadoresTabsProps> = ({
    equipoLocal,
    equipoVisita,
    incidencias,
    destacados = [],
    mode = 'view',
    estadoPartido,
    onJugadorClick,
    onJugadorAction,
    onDeleteDorsal,
    onToggleDestacado,
    onAgregarEventual,
    onEditIncidencia,
    onDeleteIncidencia,
    loading = false,
    jugadorCargando = null,
    estrellasRotando = new Set(),
    jugadorDestacado,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('incidencias');
    
    const esPlanillero = mode === 'planillero';
    const permitirAcciones = esPlanillero && ['P', 'C1', 'E', 'C2', 'T'].includes(estadoPartido || '');

    // Procesar incidencias: separar asistencias y asociarlas con goles
    const incidenciasProcesadas = useMemo(() => {
        // Separar asistencias
        const asistencias = incidencias.filter(i => i.tipo === 'asistencia');
        const incidenciasSinAsistencias = incidencias.filter(i => i.tipo !== 'asistencia');

        // Crear map de asistencias por id_gol
        const asistenciasPorGol = new Map<number, IncidenciaPartido>();
        asistencias.forEach(asistencia => {
            if (asistencia.id_gol) {
                asistenciasPorGol.set(asistencia.id_gol, asistencia);
            }
        });

        // Asociar asistencias con goles y ordenar
        return incidenciasSinAsistencias
            .map(incidencia => ({
                incidencia,
                asistenciaRelacionada: incidencia.tipo === 'gol'
                    ? asistenciasPorGol.get(incidencia.id)
                    : undefined
            }))
            .sort((a, b) => (a.incidencia.minuto || 0) - (b.incidencia.minuto || 0));
    }, [incidencias]);

    const renderJugadores = (jugadores: JugadorPlantel[], equipo: 'local' | 'visita') => {
        const equipoId = equipo === 'local' ? equipoLocal.id_equipo : equipoVisita.id_equipo;

        if (jugadores.length === 0) {
            return (
                <div className="text-center py-12 text-[#737373]">
                    No hay jugadores registrados
                </div>
            );
        }

        // Ordenar: titulares primero, eventuales al final
        const jugadoresOrdenados = [...jugadores].sort((a, b) => {
            const aEsEventual = a.eventual === 'S';
            const bEsEventual = b.eventual === 'S';

            if (aEsEventual && !bEsEventual) return 1;
            if (!aEsEventual && bEsEventual) return -1;
            return 0;
        });

        return (
            <div className="space-y-2">
                {jugadoresOrdenados.map((jugador, index) => (
                    <JugadorRow
                        key={`${activeTab}-${jugador.id_jugador}`}
                        jugador={jugador}
                        acciones={calcularAccionesJugador(jugador, incidencias)}
                        equipo={equipo}
                        equipoId={equipoId}
                        esDestacado={esJugadorDestacado(jugador.id_jugador, equipoId, destacados)}
                        index={index}
                        mode={mode}
                        permitirAcciones={permitirAcciones}
                        estaCargando={jugadorCargando === jugador.id_jugador}
                        onJugadorClick={() => onJugadorClick?.(jugador.id_jugador, equipo)}
                        onJugadorAction={() => onJugadorAction?.(jugador.id_jugador, equipoId)}
                        onDeleteDorsal={() => onDeleteDorsal?.(jugador.id_jugador)}
                        onToggleDestacado={() => onToggleDestacado?.(jugador.id_jugador, equipoId)}
                        estaRotando={estrellasRotando.has(jugador.id_jugador)}
                    />
                ))}

                {/* Botón agregar eventual solo en modo planillero */}
                {esPlanillero && permitirAcciones && (
                    <div className="mt-6 pt-4 border-t border-[#262626]">
                        <button
                            onClick={() => onAgregarEventual?.(equipo)}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[#404040] text-[#737373] hover:border-[#525252] hover:text-white transition-all"
                        >
                            <Plus size={18} />
                            <span className="font-medium">Agregar Jugador Eventual</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <FormacionesCardSkeleton />
    }

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

            <div className="w-full bg-[var(--black-900)] flex flex-col rounded-xl">
                {/* Navegación */}
                <div className="flex border-b border-[#262626] bg-[var(--black-800)] rounded-t-xl">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`
              flex-1 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === 'local'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white'
                            }
            `}
                    >
                        {equipoLocal.nombre}
                        <span className="ml-2 text-xs">({equipoLocal.jugadores.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('incidencias')}
                        className={`
              flex-1 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === 'incidencias'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white'
                            }
            `}
                    >
                        Incidencias
                        <span className="ml-2 text-xs">({incidenciasProcesadas.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('visita')}
                        className={`
              flex-1 py-4 text-sm font-semibold transition-all border-b-2
              ${activeTab === 'visita'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white'
                            }
            `}
                    >
                        {equipoVisita.nombre}
                        <span className="ml-2 text-xs">({equipoVisita.jugadores.length})</span>
                    </button>
                </div>

                {/* Contenido */}
                <div className="w-full px-4 py-4">
                    {activeTab === 'local' && renderJugadores(equipoLocal.jugadores, 'local')}

                    {activeTab === 'incidencias' && (
                        <div className="flex flex-col space-y-3">
                            {incidenciasProcesadas.length > 0 ? (
                                <>
                                    {incidenciasProcesadas.map(({ incidencia, asistenciaRelacionada }, index) => (
                                        <IncidenciaRow
                                            key={`${activeTab}-${incidencia.id}`}
                                            incidencia={incidencia}
                                            equipoLocalId={equipoLocal.id_equipo}
                                            index={index}
                                            mode={mode}
                                            permitirAcciones={permitirAcciones}
                                            asistenciaRelacionada={asistenciaRelacionada}
                                            onEdit={() => onEditIncidencia?.(incidencia)}
                                            onDelete={() => onDeleteIncidencia?.(incidencia)}
                                        />
                                    ))}

                                    {/* Mostrar MVP al final si el partido está finalizado */}
                                    {(['T', 'F'].includes(estadoPartido || '')) && jugadorDestacado && (
                                        <div className="mt-6 pt-4 border-t border-[#262626]">
                                            <div className="flex items-center gap-4 py-3">
                                                <div className="flex-1 flex justify-center">
                                                    <div className="text-center">
                                                        <div className="text-xs text-[#737373] mb-1">FIN DEL PARTIDO</div>
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <span className="text-sm font-medium text-white">
                                                                {jugadorDestacado.nombre.charAt(0)}. {jugadorDestacado.apellido.toUpperCase()}
                                                            </span>
                                                            <Star className="text-yellow-500 fill-current" size={15} />
                                                        </div>
                                                        <div className="text-xs text-[#737373] mt-0.5">Mejor Jugador</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay incidencias registradas
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'visita' && renderJugadores(equipoVisita.jugadores, 'visita')}
                </div>
            </div>
        </>
    );
};

export default JugadoresTabsUnified;