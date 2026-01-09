import React, { useState } from 'react';
import { Loader2, MoreVertical, Trash2, Plus } from "lucide-react";
import { BaseCard, CardHeader } from './BaseCard';
import { Equipo } from '../types/equipo';
import TabNavigationTeams from './TabNavigationTeams';
import FormacionesCardSkeleton from './skeletons/FormacionesCardSkeleton';
import { JugadorPlantel } from '../types/partido';
import { TbCircleLetterCFilled } from "react-icons/tb";
import { GrStarOutline, GrStar } from 'react-icons/gr';
import JugadorEventualModal from './modals/CrearJugadorEventualModal';
import { useParams } from 'next/navigation';
import { useGestionarJugadorDestacado } from '../hooks/useJugadoresDestacados';
import toast from 'react-hot-toast';

interface FormacionesProps {
    equipoLocal: Equipo;
    equipoVisitante: Equipo;
    jugadoresLocal: JugadorPlantel[];
    jugadoresVisitante: JugadorPlantel[];
    destacados: [];
    estadoPartido: 'P' | 'C' | 'C1' | 'C2' | 'E' | 'T' | 'F' | 'S' | 'A';
    onJugadorAction?: (jugadorId: number, equipoId: number) => void;
    onJugadorClick?: (jugadorId: number, equipoId: number) => void;
    loading?: boolean;
    jugadorCargando?: number | null;
    onDeleteDorsal?: (jugadorId: number) => void;
    onToggleDestacado?: (jugadorId: number, equipoId: number) => void;
    onAgregarEventual?: () => void;
    idCategoriaEdicion: number;
}

const FormacionesCard: React.FC<FormacionesProps> = ({
    equipoLocal,
    equipoVisitante,
    jugadoresLocal,
    jugadoresVisitante,
    estadoPartido,
    onJugadorAction,
    onJugadorClick,
    loading = false,
    jugadorCargando = null,
    onDeleteDorsal,
    idCategoriaEdicion,
    destacados
}) => {
    const params = useParams<{ id_partido: string }>();
    const idPartido = parseInt(params.id_partido, 10);

    const { marcar, desmarcar, isLoading: isLoadingDestacado } = useGestionarJugadorDestacado();

    const [activeTab, setActiveTab] = useState<'local' | 'visitante'>('local');
    const [estrellasRotando, setEstrellasRotando] = useState<Set<number>>(new Set());
    const [showEventualModal, setShowEventualModal] = useState(false);

    const jugadoresActivos = activeTab === 'local' ? jugadoresLocal : jugadoresVisitante;
    const equipoActivo = activeTab === 'local' ? equipoLocal : equipoVisitante;
    const permitirAcciones = ['P', 'C1', 'E', 'C2', 'T'].includes(estadoPartido)

    const handleJugadorAction = (jugadorId: number) => {
        if (permitirAcciones && onJugadorAction) {
            onJugadorAction(jugadorId, equipoActivo.id_equipo);
        }
    };

    const handleJugadorClick = (jugadorId: number) => {
        if (onJugadorClick) {
            onJugadorClick(jugadorId, equipoActivo.id_equipo);
        }
    };

    const handleAgregarEventual = () => {
        setShowEventualModal(true);
    };

    const handleToggleDestacado = async (jugador: JugadorPlantel) => {
        if (jugador.sancionado === 'S' || isLoadingDestacado) {
            return toast.error('No se puede realizar esta acción');
        };

        const jugadorId = jugador.id_jugador;
        const estaDestacado = esJugadorDestacado(jugadorId, equipoActivo.id_equipo, destacados);

        setEstrellasRotando(prev => new Set(prev).add(jugadorId));

        try {
            const jugadorData = {
                id_categoria_edicion: idCategoriaEdicion,
                id_equipo: equipoActivo.id_equipo,
                id_jugador: jugadorId
            };

            if (estaDestacado) {
                // Desmarcar jugador destacado
                await desmarcar({
                    idPartido: idPartido,
                    jugadorData
                });
            } else {
                // Marcar jugador destacado
                await marcar({
                    idPartido: idPartido,
                    jugadorData
                });
            }
        } catch (error) {
            console.error('Error al cambiar estado de jugador destacado:', error);
        } finally {
            setTimeout(() => {
                setEstrellasRotando(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(jugadorId);
                    return newSet;
                });
            }, 600);
        }
    };

    const esJugadorDestacado = (jugadorId: number, equipoId: number, jugadoresDestacados: any[]) => {
        return jugadoresDestacados?.some(destacado =>
            destacado.id_jugador === jugadorId && destacado.id_equipo === equipoId
        ) || false;
    };

    if (loading) {
        return <FormacionesCardSkeleton />;
    }

    return (
        <BaseCard className="mx-auto w-full">
            <CardHeader
                title="Formaciones"
            />

            <div className="p-6">
                <TabNavigationTeams
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    equipoLocal={equipoLocal}
                    equipoVisitante={equipoVisitante}
                    countLocal={jugadoresLocal.length}
                    countVisitante={jugadoresVisitante.length}
                />

                <div className="space-y-2">
                    {jugadoresActivos.map((jugador) => {
                        const estaCargando = jugadorCargando === jugador.id_jugador;
                        const estaRotando = estrellasRotando.has(jugador.id_jugador);
                        const estaDestacado = esJugadorDestacado(jugador.id_jugador, equipoActivo.id_equipo, destacados);

                        return (
                            <div
                                key={jugador.id_jugador}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${jugador.sancionado === 'S'
                                    ? 'border-red-500 bg-red-900/20 opacity-60'
                                    : jugador.eventual === 'S'
                                        ? 'border-yellow-500 bg-yellow-900/20'
                                        : 'border-[#262626] hover:border-[#404040]'
                                    } ${estaCargando ? 'opacity-75' : ''}`}
                            >
                                <div
                                    className={`flex items-center gap-3 flex-1 ${jugador.sancionado === 'S'
                                        ? 'cursor-not-allowed'
                                        : 'cursor-pointer'
                                        }`}
                                    onClick={() => {
                                        if (jugador.sancionado !== 'S' && !estaCargando) {
                                            handleJugadorClick(jugador.id_jugador);
                                        }
                                    }}
                                >
                                    {!jugador.dorsal || jugador.dorsal === 0 ? (
                                        <div className={`flex items-center justify-center w-8 h-10 font-bold text-sm rounded relative ${jugador.sancionado === 'S'
                                            ? 'bg-red-300 text-red-800'
                                            : jugador.eventual === 'S'
                                                ? 'bg-yellow-300 text-yellow-800'
                                                : 'bg-[var(--gray-300)] text-black'
                                            }`}>
                                            {estaCargando && (
                                                <Loader2 size={16} className="animate-spin" />
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`flex items-center justify-center w-8 h-10 font-bold text-sm rounded relative ${jugador.sancionado === 'S'
                                            ? 'bg-red-500 text-white'
                                            : jugador.eventual === 'S'
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-[var(--color-primary)] text-black'
                                            }`}>
                                            {estaCargando ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                jugador.dorsal
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium text-sm ${jugador.sancionado === 'S'
                                            ? 'text-red-300'
                                            : jugador.eventual === 'S'
                                                ? 'text-yellow-300'
                                                : 'text-white'
                                            }`}>
                                            {jugador.apellido.toUpperCase()}, {jugador.nombre}
                                        </span>
                                        {jugador.capitan && (
                                            <TbCircleLetterCFilled
                                                size={25}
                                                className={
                                                    jugador.sancionado === 'S'
                                                        ? 'text-red-400'
                                                        : jugador.eventual === 'S'
                                                            ? 'text-yellow-400'
                                                            : 'text-yellow-500'
                                                }
                                            />
                                        )}
                                        {jugador.sancionado === 'S' && (
                                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                                                SANCIONADO
                                            </span>
                                        )}
                                        {jugador.eventual === 'S' && jugador.sancionado !== 'S' && (
                                            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">
                                                EVENTUAL
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {permitirAcciones && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                if (jugador.sancionado !== 'S' && !estaCargando && jugador.dorsal) {
                                                    handleJugadorAction(jugador.id_jugador);
                                                } else {
                                                    toast.error('No se puede realizar esta acción');
                                                }
                                            }}
                                            className={`w-8 h-8 flex items-center justify-center transition-colors ${jugador.sancionado === 'S'
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                                }`}
                                            disabled={estaCargando || jugador.sancionado === 'S' || !jugador.dorsal}
                                        >
                                            {estaCargando ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-[#737373]" />
                                            ) : (
                                                <MoreVertical className={`w-4 h-4 ${jugador.sancionado === 'S'
                                                    ? 'text-red-400'
                                                    : jugador.eventual === 'S'
                                                        ? 'text-yellow-400'
                                                        : 'text-[#737373]'
                                                    }`} />
                                            )}
                                        </button>

                                        {/* Estrella para jugador destacado */}
                                        <button
                                            onClick={() => handleToggleDestacado(jugador)}
                                            className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${jugador.sancionado === 'S' || isLoadingDestacado
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                                } ${estaRotando ? 'animate-spin' : ''}`}
                                            disabled={jugador.sancionado === 'S' || isLoadingDestacado || !jugador.dorsal}
                                        >
                                            {estaDestacado ? (
                                                <GrStar
                                                    size={18}
                                                    className={`transition-all duration-300 ${jugador.sancionado === 'S'
                                                        ? 'text-red-400'
                                                        : 'text-yellow-400'
                                                        }`}
                                                />
                                            ) : (
                                                <GrStarOutline
                                                    size={18}
                                                    className={`transition-all duration-300 ${jugador.sancionado === 'S'
                                                        ? 'text-red-400'
                                                        : jugador.eventual === 'S'
                                                            ? 'text-yellow-400'
                                                            : 'text-[#737373]'
                                                        }`}
                                                />
                                            )}
                                        </button>
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center ${jugador.sancionado === 'S'
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                                }`}
                                            onClick={() => {
                                                if (jugador.sancionado !== 'S') {
                                                    onDeleteDorsal?.(jugador.id_jugador);
                                                }
                                            }}
                                        >
                                            <Trash2
                                                size={16}
                                                className={`transition-all duration-200 ease-in-out ${jugador.sancionado === 'S'
                                                    ? 'text-red-400'
                                                    : jugador.eventual === 'S'
                                                        ? 'text-yellow-400'
                                                        : 'text-[var(--color-danger)]'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Botón para agregar jugador eventual */}
                <div className="mt-6 pt-4 border-t border-[#262626]">
                    <button
                        onClick={handleAgregarEventual}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-[#404040] text-[#737373] hover:border-[#525252] hover:text-white transition-all duration-200 hover:bg-[#1a1a1a]"
                    >
                        <Plus size={18} />
                        <span className="font-medium">Agregar Jugador Eventual</span>
                    </button>
                </div>
            </div>

            <JugadorEventualModal
                isOpen={showEventualModal}
                onClose={() => setShowEventualModal(false)}
                idPartido={idPartido}
                idCategoriaEdicion={idCategoriaEdicion}
                idEquipo={equipoActivo.id_equipo}
            />
        </BaseCard>
    );
};

export default FormacionesCard;