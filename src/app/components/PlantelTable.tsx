import { useEffect, useState } from 'react';
import { XCircle, UserMinus, AlertCircle, Volleyball, Star, User2 } from 'lucide-react';
import { useEstadisticasJugadoresPlantel } from '../hooks/useEstadisticasJugadoresPlantel';
import { EstadisticasJugador } from '../types/plantel';
import SquadTableSkeleton from './skeletons/SquadTableSkeleton';
import { useSolicitarBaja } from '../hooks/useSolicitudesBaja';
import { usePlayerStore } from '../stores/playerStore';
import SolicitarBajaModal from './modals/SolicitarBajaModal';

interface SquadTableProps {
    id_categoria_edicion: number;
    id_equipo: number;
    esCapitan: boolean;
    esEdicionActual: boolean;
}

export default function SquadTable({ id_categoria_edicion, esCapitan, esEdicionActual, id_equipo }: SquadTableProps) {
    const {
        data: plantelStats,
        isLoading,
        isError,
        error,
    } = useEstadisticasJugadoresPlantel(id_equipo, id_categoria_edicion);

    const { jugador } = usePlayerStore();

    // const {
    //     data: solicitudesBaja,
    //     isLoading: isLoadingSolicitudesBaja,
    //     isError: isErrorSolicitudesBaja,
    //     error: errorSolicitudesBaja,
    // } = useSolicitudesBajaEquipo(
    //     id_equipo,
    //     jugador?.id_jugador || 0,
    //     id_categoria_edicion
    // );
    const { mutate: solicitarBaja, isPending: isLoadingSolicitud } = useSolicitarBaja();

    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<{ id: number; nombre: string } | null>(null);
    const [vistaActiva, setVistaActiva] = useState<'datos' | 'acciones'>('datos');
    const [plantel, setPlantel] = useState<EstadisticasJugador[]>([]);

    useEffect(() => {
        if (plantelStats?.jugadores) {
            setPlantel(plantelStats.jugadores);
        }
    }, [plantelStats]);

    // Verificar si un jugador tiene solicitud pendiente
    const tieneSolicitudPendiente = (id_jugador: number): boolean => {
        // TODO: Implementar cuando se reactive useSolicitudesBajaEquipo
        return false;
    };

    const handleSolicitarBaja = (id_jugador: number, nombre: string, apellido: string) => {
        // No hacer nada si tiene solicitud pendiente
        if (tieneSolicitudPendiente(id_jugador)) return;

        setJugadorSeleccionado({
            id: id_jugador,
            nombre: `${nombre} ${apellido}`
        });
    };

    const handleConfirmarBaja = (motivo: string, observaciones: string) => {
        // ('🚀 handleConfirmarBaja', motivo, observaciones);
        
        if (!jugadorSeleccionado || !jugador?.id_jugador) return;

        solicitarBaja({
            id_equipo,
            id_jugador_capitan: jugador.id_jugador,
            id_categoria_edicion,
            id_jugador_baja: jugadorSeleccionado.id,
            motivo,
            observaciones
        }, {
            onSuccess: () => {
                setJugadorSeleccionado(null);
            }
        });
    };

    if (isLoading) {
        return (
            <SquadTableSkeleton />
        );
    }

    if (isError) {
        return (
            <div className="py-12 text-center text-red-400">
                Error al cargar estadísticas: {error?.message}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Tabla Principal */}
            <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden">
                {/* Header con Solapas */}
                {esCapitan && esEdicionActual && (
                    <div className="flex items-center gap-2 p-1 bg-[#0a0a0a] border-b border-[#262626]">
                        <button
                            onClick={() => setVistaActiva('datos')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${vistaActiva === 'datos'
                                ? 'bg-[#171717] text-white'
                                : 'text-[#737373] hover:text-white'
                                }`}
                        >
                            Datos del Plantel
                        </button>
                        <button
                            onClick={() => setVistaActiva('acciones')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${vistaActiva === 'acciones'
                                ? 'bg-[#171717] text-white'
                                : 'text-[#737373] hover:text-white'
                                }`}
                        >
                            Acciones
                        </button>
                    </div>
                )}

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#0a0a0a] border-b border-[#262626]">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                    Jugador
                                </th>
                                {vistaActiva === 'datos' ? (
                                    <>
                                        <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <span>PJ</span>
                                            </div>
                                        </th>
                                        <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <Volleyball size={14} />
                                            </div>
                                        </th>
                                        <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <div className="w-3 h-4 bg-yellow-400 rounded-sm" />
                                            </div>
                                        </th>
                                        <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <div className="w-3 h-4 bg-red-500 rounded-sm" />
                                            </div>
                                        </th>
                                        <th className="text-center py-3 px-2 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star size={14} />
                                            </div>
                                        </th>
                                    </>
                                ) : (
                                    <th className="text-center py-3 px-4 text-xs font-medium text-[#737373] uppercase tracking-wider">
                                        Acciones
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#262626]">
                            {plantel?.map((jugador) => {
                                const tienePendiente = tieneSolicitudPendiente(jugador.id_jugador);

                                return (
                                    <tr key={`plantel-${jugador.id_jugador}`} className="hover:bg-[#0a0a0a] transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User2 className="text-[#737373]" size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm font-medium">
                                                        {jugador.nombre} {jugador.apellido}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {jugador.eventual === 'S' && (
                                                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                                                                Eventual
                                                            </span>
                                                        )}
                                                        {jugador.sancionado === 'S' && (
                                                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded flex items-center gap-1">
                                                                <XCircle size={10} />
                                                                Sancionado
                                                            </span>
                                                        )}
                                                        {tienePendiente && (
                                                            <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded flex items-center gap-1">
                                                                <AlertCircle size={10} />
                                                                Baja Pendiente
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {vistaActiva === 'datos' ? (
                                            <>
                                                <td className="text-center py-3 px-2 text-white text-sm">
                                                    {jugador.partidos_jugados}
                                                </td>
                                                <td className="text-center py-3 px-2 text-white text-sm font-medium">
                                                    {jugador.goles}
                                                </td>
                                                <td className="text-center py-3 px-2">
                                                    <span className="inline-flex items-center justify-center w-6 h-6  text-xs font-medium rounded">
                                                        {jugador.amarillas}
                                                    </span>
                                                </td>
                                                <td className="text-center py-3 px-2">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded">
                                                        {jugador.rojas}
                                                    </span>
                                                </td>
                                                <td className="text-center py-3 px-2">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded">
                                                        {jugador.mvp}
                                                    </span>
                                                </td>
                                            </>
                                        ) : (
                                            <td className="text-center py-3 px-4">
                                                <button
                                                    onClick={() => handleSolicitarBaja(jugador.id_jugador, jugador.nombre, jugador.apellido)}
                                                    disabled={tienePendiente}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${tienePendiente
                                                        ? 'bg-[#262626] text-[#737373] cursor-not-allowed'
                                                        : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                                                        }`}
                                                >
                                                    <UserMinus size={16} />
                                                    {tienePendiente ? 'Solicitud Pendiente' : 'Solicitar Baja'}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {plantel.length === 0 && (
                    <div className="py-12 text-center text-[#737373]">
                        No hay jugadores en el plantel
                    </div>
                )}
            </div>

            {/* Solicitudes de Baja */}
            {false && esCapitan && esEdicionActual && (
                <div className="bg-[#171717] rounded-xl border border-[#262626] overflow-hidden">
                    <div className="flex items-center gap-2 p-4 bg-[#0a0a0a] border-b border-[#262626]">
                        <AlertCircle size={18} className="text-[#737373]" />
                        <h3 className="text-white font-medium text-sm">
                            Solicitudes de Baja
                        </h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {[].map((solicitud: any, index: number) => {
                            const estilosEstado: Record<string, { bg: string; border: string; text: string; label: string }> = {
                                'P': {
                                    bg: 'bg-yellow-500/10',
                                    border: 'border-yellow-500/30',
                                    text: 'text-yellow-400',
                                    label: 'Pendiente'
                                },
                                'A': {
                                    bg: 'bg-[var(--color-primary)]/10',
                                    border: 'border-[var(--color-primary)]/30',
                                    text: 'text-[var(--color-primary)]',
                                    label: 'Aceptada'
                                },
                                'R': {
                                    bg: 'bg-[#262626]',
                                    border: 'border-[#404040]',
                                    text: 'text-[#737373]',
                                    label: 'Rechazada'
                                }
                            };
                            const estiloEstado = estilosEstado[solicitud.estado] || estilosEstado['P'];

                            return (
                                <div
                                    key={`solicitud-${solicitud.jugador.id_jugador}-${index}`}
                                    className={`flex items-center gap-3 p-3 rounded-lg border ${estiloEstado.bg} ${estiloEstado.border}`}
                                >
                                    <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                                        <User2 className="text-[#737373]" size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white text-sm font-medium">
                                            {solicitud.jugador.nombre} {solicitud.jugador.apellido}
                                        </div>
                                        <div className={`text-xs ${estiloEstado.text}`}>
                                            {estiloEstado.label}
                                            {solicitud.estado === 'P' && ' - Esperando aprobación del administrador'}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${estiloEstado.bg} ${estiloEstado.text}`}>
                                        {estiloEstado.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <SolicitarBajaModal
                isOpen={jugadorSeleccionado !== null}
                onClose={() => setJugadorSeleccionado(null)}
                onConfirm={handleConfirmarBaja}
                jugadorNombre={jugadorSeleccionado?.nombre || ''}
                isLoading={isLoadingSolicitud}
            />
        </div>
    );
}