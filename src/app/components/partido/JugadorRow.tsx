import React from 'react';
import { JugadorPlantel } from "@/app/types/partido";
import { Loader2, MoreVertical, Trash2 } from 'lucide-react';
import { TbCircleLetterCFilled } from "react-icons/tb";
import { GrStarOutline, GrStar } from 'react-icons/gr';
import { IncidentsIcon } from '../IncidentIcon';
import { calcularAccionesJugador } from '@/app/utils/formacion.helper';


interface JugadorRowProps {
    jugador: JugadorPlantel;
    acciones: ReturnType<typeof calcularAccionesJugador>;
    equipo: 'local' | 'visita';
    equipoId: number;
    esDestacado: boolean;
    estaRotando: boolean;
    index: number;

    // Modo planillero
    mode: 'view' | 'planillero';
    permitirAcciones: boolean;
    estaCargando: boolean;

    // Callbacks
    onJugadorClick?: () => void;
    onJugadorAction?: () => void;
    onDeleteDorsal?: () => void;
    onToggleDestacado?: () => void;
}

const JugadorRow: React.FC<JugadorRowProps> = ({
    jugador,
    acciones,
    esDestacado,
    estaRotando,
    index,
    mode,
    permitirAcciones,
    estaCargando,
    onJugadorClick,
    onJugadorAction,
    onDeleteDorsal,
    onToggleDestacado
}) => {
    const { goles, amarillas, rojas, asistencias } = acciones;
    const tieneAcciones = goles > 0 || amarillas > 0 || rojas > 0 || asistencias > 0;
    const esPlanillero = mode === 'planillero';
    const esInhabilitado = jugador.sancionado === 'S';
    const esEventual = jugador.eventual === 'S';

    return (
        <>
            <style jsx>{`
                @keyframes rotateStar {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div
                className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#262626] 
                    transition-colors
                    ${esInhabilitado ? 'opacity-50 bg-[#1a1a1a] pointer-events-none' : 'hover:border-[#404040]'}
                    ${esPlanillero && permitirAcciones && !esInhabilitado ? 'cursor-pointer' : ''}
                    opacity-0 translate-y-4
                `}
                style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards` }}
                onClick={() => esPlanillero && permitirAcciones && !esInhabilitado && onJugadorClick?.()}
            >
                {/* Dorsal */}
                <div
                    className={`
                        flex items-center justify-center w-8 h-10 font-bold text-sm rounded
                        ${jugador.dorsal ? 'bg-[var(--green)] text-black' : 'bg-[#404040] text-[#737373]'}
                    `}
                >
                    {estaCargando ? <Loader2 size={16} className="animate-spin" /> : jugador.dorsal || '-'}
                </div>

                {/* Nombre y acciones */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white truncate">
                            {jugador.apellido.toUpperCase()}, {jugador.nombre}
                        </span>
                        {jugador.capitan && (
                            <TbCircleLetterCFilled className='w-5 h-5 text-yellow-500 flex-shrink-0' />
                        )}

                        {/* Tags sutiles tipo glass */}
                        {esEventual && (
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 backdrop-blur-sm">
                                EVENTUAL
                            </span>
                        )}
                        {esInhabilitado && (
                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-sm">
                                SANCIONADO
                            </span>
                        )}
                    </div>

                    {/* Acciones del jugador (vista pública) */}
                    {tieneAcciones && (
                        <div className="flex items-center gap-2 mt-1">
                            {goles > 0 && <IncidentsIcon tipo="gol" cantidad={goles} />}
                            {asistencias > 0 && <IncidentsIcon tipo="asistencia" cantidad={asistencias} />}
                            {amarillas > 0 && <IncidentsIcon tipo="amarilla" cantidad={amarillas} />}
                            {rojas > 0 && <IncidentsIcon tipo="roja" cantidad={rojas} />}
                        </div>
                    )}
                </div>

                {/* Acciones planillero */}
                {esPlanillero && permitirAcciones && (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Botón más opciones */}
                        <button
                            onClick={onJugadorAction}
                            className="w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={estaCargando || esInhabilitado || !jugador.dorsal}
                        >
                            {estaCargando ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#737373]" />
                            ) : (
                                <MoreVertical className="w-4 h-4 text-[#737373]" />
                            )}
                        </button>

                        {/* Estrella destacado con animación */}
                        <button
                            onClick={onToggleDestacado}
                            className="w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={esInhabilitado || !jugador.dorsal}
                            style={{
                                animation: estaRotando ? 'rotateStar 0.6s ease-in-out' : 'none'
                            }}
                        >
                            {esDestacado ? (
                                <GrStar size={18} className="text-yellow-400" />
                            ) : (
                                <GrStarOutline size={18} className="text-[#737373]" />
                            )}
                        </button>

                        {/* Eliminar dorsal */}
                        <button
                            onClick={onDeleteDorsal}
                            className="w-8 h-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={esInhabilitado}
                        >
                            <Trash2 size={16} className="text-[var(--red)]" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default JugadorRow;