import { Plus, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import CardCanchaFutbol from './CardCanchaFutbol';
import ModalSeleccionarJugador from './modals/ModalSeleccionarJugador';
import { usePosiciones } from '../hooks/usePosiciones';
import { useCategoriaStore } from '../stores/categoriaStore';
import { useAgregarJugadorDreamteam } from '../hooks/useDreamteam';
import toast from 'react-hot-toast';
import { JugadorDestacadoDt } from '../types/jugador';
import ModalDeletePlayerDt from './modals/ModalDeletePlayerDt';
import { useEliminarJugadorDreamteam } from '../hooks/useDreamteam';
import { FORMACIONES_DISPONIBLES, MAPEO_POSICIONES_CODIGOS } from '../utils/formacionesDT';
import { DreamTeam, JugadorDreamTeam } from '../types/dreamteam';

interface DreamTeamFieldProps {
    dreamteam?: DreamTeam;
    onAgregarJugador?: (posicion: string) => void;
    onEliminarJugador?: (jugador: unknown) => void;
    jornada: number;
    refetchDreamteam?: () => void;
    onFormacionChange?: (formacion: string) => void;
}

const DreamTeamField = ({
    dreamteam,
    jornada,
    refetchDreamteam,
    onFormacionChange
}: DreamTeamFieldProps) => {
    const { data: posiciones = [] } = usePosiciones();
    const { categoriaSeleccionada } = useCategoriaStore();

    const { mutateAsync: agregarJugador, isPending: isAgregando } = useAgregarJugadorDreamteam({
        onSuccess: () => {
            toast.success('Jugador agregado al DreamTeam');
            refetchDreamteam?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { mutateAsync: eliminarJugador, isPending: isEliminando, error: errorEliminar } = useEliminarJugadorDreamteam({
        onSuccess: () => {
            toast.success('Jugador eliminado del DreamTeam');
            // Refetch manual como respaldo
            refetchDreamteam?.();
            setModalEliminar({ isOpen: false, jugador: null });
        },
        onError: (error) => {
            toast.error(error.message || 'Error al eliminar el jugador');
        }
    });

    const [modalEliminar, setModalEliminar] = useState<{
        isOpen: boolean;
        jugador: {
            id_jugador: number;
            id_partido: number;
            nombre: string;
            apellido: string;
            equipo?: string;
        } | null;
    }>({
        isOpen: false,
        jugador: null
    });

    const [formacionActual, setFormacionActual] = useState<number[]>([1, 2, 3, 1]);
    const [formacionNombre, setFormacionNombre] = useState<string>('1-2-3-1');
    const [modalJugador, setModalJugador] = useState<{
        isOpen: boolean;
        posicionIndex: string;
        posicionesIds: number[];
        posicionNombre: string;
    }>({
        isOpen: false,
        posicionIndex: '',
        posicionesIds: [],
        posicionNombre: ''
    });

    const handleAgregarJugador = (posicionIndex: string) => {
        const mapeo = MAPEO_POSICIONES_CODIGOS[formacionNombre];
        const posicionInfo = mapeo[posicionIndex];

        if (posicionInfo && posiciones.length > 0) {
            const posicionesIds = posiciones
                .filter(pos => posicionInfo.codigos.includes(pos.codigo))
                .map(pos => pos.id_posicion);

            setModalJugador({
                isOpen: true,
                posicionIndex,
                posicionesIds,
                posicionNombre: posicionInfo.nombre
            });
        }
    };

    const handleSeleccionarJugador = async (jugador: JugadorDestacadoDt) => {
        if (!categoriaSeleccionada) return;

        try {
            // Obtener información de la posición específica seleccionada
            const mapeo = MAPEO_POSICIONES_CODIGOS[formacionNombre];
            const posicionInfo = mapeo[modalJugador.posicionIndex];
            
            await agregarJugador({
                id_categoria_edicion: categoriaSeleccionada.id_categoria_edicion,
                jornada,
                id_partido: jugador.id_partido,
                id_jugador: jugador.id_jugador,
                id_equipo: jugador.id_equipo,
                formacion: formacionNombre,
                posicionIndex: parseInt(modalJugador.posicionIndex),
                posicionCodigo: posicionInfo?.codigos[0] // Usar el primer código de posición
            });
        } catch (error) {
            console.error('Error al agregar jugador:', error);
        }
    };

    const getJugadorPorPosicion = (posicionIndex: number) => {
        return dreamteam?.jugadores.find(j => j.posicion_index === posicionIndex);
    };

    const cambiarFormacion = (nombre: string, nuevaFormacion: number[]) => {
        setFormacionActual(nuevaFormacion);
        setFormacionNombre(nombre);
        onFormacionChange?.(nombre);
    };

    // Notificar cambio de formación inicial
    useEffect(() => {
        onFormacionChange?.(formacionNombre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAbrirModalEliminar = (jugador: JugadorDreamTeam) => {
        setModalEliminar({
            isOpen: true,
            jugador: {
                id_jugador: jugador.id_jugador,
                id_partido: jugador.id_partido,
                nombre: jugador.nombre,
                apellido: jugador.apellido,
                equipo: jugador.equipo?.nombre
            }
        });
    };

    const handleConfirmarEliminar = async (id_dreamteam: number, id_partido: number, id_jugador: number) => {
        try {
            await eliminarJugador({
                id_dreamteam,
                id_partido,
                id_jugador
            });
        } catch (error) {
            console.error('Error al eliminar jugador:', error);
            throw error;
        }
    };

    return (
        <div className="relative w-full max-w-full">
            {/* Campo de fútbol - con más altura y arquero abajo */}
            <div className="relative bg-transparent border-2 border-[var(--gray-200)] rounded-xl overflow-hidden w-full"
                style={{ aspectRatio: '1.4/1', minHeight: '700px' }}>

                <CardCanchaFutbol />

                {/* Jugadores */}
                <div className="absolute inset-0 p-6 z-10 flex flex-col justify-center">
                    {formacionActual.map((cantidad, filaIndex) => {
                        const posicionesInicio = formacionActual.slice(0, filaIndex).reduce((acc, num) => acc + num, 0);

                        // Calcular espaciado vertical - arquero abajo, delanteros arriba
                        const filaInvertida = formacionActual.length - 1 - filaIndex;
                        const espacioVertical = 0.2 + (filaInvertida / (formacionActual.length - 1)) * 0.6;

                        return (
                            <div
                                key={filaIndex}
                                className="absolute flex justify-center items-center w-full"
                                style={{
                                    top: `${espacioVertical * 100}%`,
                                    transform: 'translateY(-50%)',
                                    left: '50%',
                                    marginLeft: '-50%'
                                }}
                            >
                                <div className="flex justify-center items-center gap-30" style={{ width: '90%' }}>
                                    {Array.from({ length: cantidad }).map((_, jugadorIndex) => {
                                        const posicionIndex = posicionesInicio + jugadorIndex + 1;
                                        const posicionInfo = MAPEO_POSICIONES_CODIGOS[formacionNombre]?.[String(posicionIndex)];

                                        // Buscar jugador por índice de posición específica
                                        const jugador = getJugadorPorPosicion(posicionIndex);
                                        return (
                                            <div
                                                key={jugadorIndex}
                                                className="flex flex-col items-center relative"
                                            >
                                                <div
                                                    className={`relative group ${dreamteam?.publicado ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        if (dreamteam?.publicado) return;
                                                        if (jugador) {
                                                            handleAbrirModalEliminar(jugador);
                                                        } else {
                                                            handleAgregarJugador(String(posicionIndex));
                                                        }
                                                    }}
                                                >
                                                    {/* Avatar del jugador */}
                                                    <div className="w-14 h-14 rounded-full border-2 border-[var(--gray-200)] shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 bg-[var(--gray-400)]">
                                                        {jugador ? (
                                                            <div className="w-full h-full bg-[var(--green)] flex items-center justify-center">
                                                                <User className="w-7 h-7 text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full bg-[var(--gray-300)] flex items-center justify-center border-2 border-dashed border-[var(--gray-200)]">
                                                                <User className="w-6 h-6 text-[var(--gray-200)]" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Escudo del equipo - arriba a la izquierda */}
                                                    {jugador?.equipo?.img && (
                                                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-white rounded-full border border-[var(--gray-300)] shadow-md flex items-center justify-center z-10">
                                                            <img
                                                                src={jugador.equipo.img}
                                                                alt={jugador.equipo.nombre}
                                                                className="w-4 h-4 object-contain"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Badge de posición */}
                                                    <div className="absolute -bottom-1 -right-1 w-auto min-w-[24px] px-1.5 h-6 bg-[var(--gray-100)] text-[var(--gray-500)] rounded-full text-xs font-bold flex items-center justify-center shadow-md">
                                                        {posicionInfo?.nombre || posicionIndex}
                                                    </div>

                                                    {/* Indicador visual de acción */}
                                                    {!dreamteam?.publicado && (
                                                        jugador ? (
                                                            <div className="absolute -top-2 -right-2 bg-[var(--red)] text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 pointer-events-none flex items-center justify-center">
                                                                <X className="w-3 h-3" />
                                                            </div>
                                                        ) : (
                                                            <div className="absolute -top-1 -left-1 w-6 h-6 bg-[var(--green)] hover:bg-[var(--green-win)] text-white rounded-full transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center">
                                                                <Plus className="w-3 h-3" />
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                {jugador && (
                                                    <div className="mt-3 text-center">
                                                        <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] text-[var(--white)] text-xs font-medium px-3 py-1 rounded shadow-lg">
                                                            {jugador.nombre} {jugador.apellido}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Indicador de formación */}
                <div className="absolute top-4 left-4 bg-[var(--gray-400)] border border-[var(--gray-300)] text-[var(--white)] px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                    {formacionActual.join('-')}
                </div>

                {/* Estadísticas rápidas */}
                <div className="absolute top-4 right-4 bg-[var(--gray-400)] border border-[var(--gray-300)] text-[var(--white)] px-3 py-2 rounded-lg text-sm shadow-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--green)] text-lg">●</span>
                        <span>{dreamteam?.jugadores?.length || 0}/{formacionActual.reduce((a, b) => a + b, 0)}</span>
                    </div>
                </div>
            </div>

            {/* Selector de formaciones */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {Object.entries(FORMACIONES_DISPONIBLES).map(([nombre, formacion]) => (
                    <button
                        key={nombre}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            dreamteam?.publicado
                                ? 'bg-[var(--gray-300)] text-[var(--gray-100)] cursor-not-allowed opacity-50'
                                : formacionNombre === nombre
                                    ? 'bg-[var(--green)] text-white shadow-lg'
                                    : 'bg-[var(--gray-300)] text-[var(--gray-100)] hover:bg-[var(--gray-200)] border border-[var(--gray-200)]'
                        }`}
                        onClick={() => !dreamteam?.publicado && cambiarFormacion(nombre, formacion)}
                        disabled={dreamteam?.publicado}
                    >
                        {nombre}
                    </button>
                ))}
            </div>

            <ModalSeleccionarJugador
                isOpen={modalJugador.isOpen}
                onClose={() => setModalJugador({
                    isOpen: false,
                    posicionIndex: '',
                    posicionesIds: [],
                    posicionNombre: ''
                })}
                posicion={modalJugador.posicionNombre}
                posicionesIds={modalJugador.posicionesIds}
                onSeleccionar={handleSeleccionarJugador}
                jornada={jornada}
                isPending={isAgregando}
            />

            <ModalDeletePlayerDt
                isOpen={modalEliminar.isOpen}
                onClose={() => setModalEliminar({ isOpen: false, jugador: null })}
                jugador={modalEliminar.jugador}
                dreamteamId={dreamteam?.id_dreamteam || 0}
                onConfirm={handleConfirmarEliminar}
                isPending={isEliminando}
                error={errorEliminar}
            />
        </div>
    );
};

export default DreamTeamField;