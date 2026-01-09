import React from 'react';
import { Plus } from 'lucide-react';
import { JugadorPlantel, IncidenciaPartido } from '@/app/types/partido';
import JugadorRow from '../../JugadorRow';
import { calcularAccionesJugador, esJugadorDestacado } from '@/app/utils/formacion.helper';
import { ordenarJugadoresPorDorsal } from '../utils/jugadores.utils';

interface EquipoTabProps {
    jugadores: JugadorPlantel[];
    equipo: 'local' | 'visita';
    equipoId: number;
    activeTab: 'local' | 'incidencias' | 'visita';
    mode: 'view' | 'planillero';
    permitirAcciones: boolean;
    incidenciasParaAcciones: IncidenciaPartido[];
    destacados?: Array<{ id_jugador: number; id_equipo: number }>;
    jugadorCargando?: number | null;
    jugadoresCargando: Set<number>;
    tipoFutbol: number;
    jugadoresEnCancha: number;
    estrellasRotando: Set<number>;
    esPlanillero: boolean;
    onToggleEnCancha?: (jugadorId: number, equipoId: number) => Promise<void>;
    onSolicitarCambio?: (jugador: JugadorPlantel) => void;
    onJugadorClick?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    onJugadorAction?: (jugadorId: number, equipoId: number) => void;
    onDeleteDorsal?: (jugadorId: number) => void;
    onToggleDestacado?: (jugadorId: number, equipoId: number) => void;
    onAgregarEventual?: (equipo: 'local' | 'visita') => void;
}

export const EquipoTab: React.FC<EquipoTabProps> = ({
    jugadores,
    equipo,
    equipoId,
    activeTab,
    mode,
    permitirAcciones,
    incidenciasParaAcciones,
    destacados = [],
    jugadorCargando,
    jugadoresCargando,
    tipoFutbol,
    jugadoresEnCancha,
    estrellasRotando,
    esPlanillero,
    onToggleEnCancha,
    onSolicitarCambio,
    onJugadorClick,
    onJugadorAction,
    onDeleteDorsal,
    onToggleDestacado,
    onAgregarEventual
}) => {
    const jugadoresOrdenados = ordenarJugadoresPorDorsal(jugadores);

    // Calcular si hay suplentes disponibles (jugadores con dorsal que NO están en cancha y NO están inhabilitados)
    const haySuplentesDisponibles = React.useMemo(() => {
        return jugadores.some(jugador => {
            const tieneDorsal = jugador.dorsal !== null && jugador.dorsal !== undefined && jugador.dorsal !== 0;
            const noEstaEnCancha = !jugador.en_cancha;
            const noEstaInhabilitado = jugador.sancionado !== 'S';
            return tieneDorsal && noEstaEnCancha && noEstaInhabilitado;
        });
    }, [jugadores]);

    if (jugadores.length === 0) {
        return (
            <div className="text-center py-12 text-[#737373]">
                No hay jugadores registrados
            </div>
        );
    }

    return (
        <div className="space-y-2 pb-2">
            {jugadoresOrdenados.map((jugador, index) => {
                return (
                    <JugadorRow
                        key={`${activeTab}-${jugador.id_jugador}`}
                        jugador={jugador}
                        acciones={calcularAccionesJugador(jugador, incidenciasParaAcciones)}
                        equipo={equipo}
                        equipoId={equipoId}
                        esDestacado={jugador.destacado === true || esJugadorDestacado(jugador.id_jugador, equipoId, destacados)}
                        index={index}
                        mode={mode}
                        permitirAcciones={permitirAcciones}
                        estaCargando={jugadorCargando === jugador.id_jugador || jugadoresCargando.has(jugador.id_jugador)}
                        limiteEnCancha={tipoFutbol}
                        jugadoresEnCanchaActuales={jugadoresEnCancha}
                        haySuplentesDisponibles={haySuplentesDisponibles}
                        onToggleEnCancha={permitirAcciones ? onToggleEnCancha : undefined}
                        onSolicitarCambio={permitirAcciones ? onSolicitarCambio : undefined}
                        onJugadorClick={() => onJugadorClick?.(jugador.id_jugador, equipo)}
                        onJugadorAction={() => onJugadorAction?.(jugador.id_jugador, equipoId)}
                        onDeleteDorsal={() => onDeleteDorsal?.(jugador.id_jugador)}
                        onToggleDestacado={() => onToggleDestacado?.(jugador.id_jugador, equipoId)}
                        estaRotando={estrellasRotando.has(jugador.id_jugador)}
                    />
                );
            })}

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

