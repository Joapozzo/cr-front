import React from 'react';
import { MdOutlineCalendarMonth, MdOutlineWatchLater } from "react-icons/md";
import { GiSoccerField, GiSoccerKick } from "react-icons/gi";
import { PiSoccerBallFill } from "react-icons/pi";
import { Shield } from 'lucide-react';
import { BaseCard, CardHeader } from './BaseCard';
import { CardPartidoResultSkeleton } from './skeletons/CardPartidoSkeleton';
import { IncidenciaPartido, PartidoCompleto } from '../types/partido';
import { useCronometroPartido } from '../hooks/useCronometroPartido';
import { usePartidoData } from '../hooks/usePartidoRenderResult'; 
import { 
    formatTime, 
    formatDate, 
    getEstadoTexto, 
    formatNombreJugador,
    getNombreCategoria 
} from '../utils/cardPartido.helper';

interface PartidoCardProps {
    partido: PartidoCompleto;
    incidencias?: IncidenciaPartido[];
    loading?: boolean;
}

const CardPartidoResult: React.FC<PartidoCardProps> = ({
    partido,
    incidencias = [],
    loading
}) => {
    const cronometro = useCronometroPartido();
    const { golesLocal, golesVisita, esPartidoActivo, mostrarGoleadores } = usePartidoData(partido, incidencias);

    const renderResultado = () => {
        if (partido.estado === 'P') {
            return formatTime(partido.hora);
        }

        return (
            <div className="flex items-center gap-1">
                {partido.pen_local !== null && partido.pen_local !== undefined && (
                    <span className="text-[#737373] text-sm">({partido.pen_local})</span>
                )}
                <span>{partido.goles_local}-{partido.goles_visita}</span>
                {partido.pen_visita !== null && partido.pen_visita !== undefined && (
                    <span className="text-[#737373] text-sm">({partido.pen_visita})</span>
                )}
            </div>
        );
    };

    if (loading) {
        return <CardPartidoResultSkeleton />
    }

    return (
        <BaseCard className="mx-auto w-full">
            <CardHeader title={getNombreCategoria(partido.categoriaEdicion)} />

            {/* Detalles del partido */}
            <div className="flex items-center justify-center gap-6 px-6 py-3 border-b border-[#262626] text-xs text-[#737373]">
                <div className="flex items-center gap-2">
                    <PiSoccerBallFill />
                    <span>Fecha {partido.jornada}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineCalendarMonth />
                    <span>{formatDate(partido.dia)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <GiSoccerField />
                    <span>Cancha {
                        typeof partido.cancha === 'object' && partido.cancha !== null
                            ? (partido.cancha as any).nombre || "Por definir"
                            : partido.cancha || "Por definir"
                    }</span>
                </div>
            </div>

            {/* Equipos y resultado */}
            <div className="flex items-center justify-between px-6 py-5">
                {/* Equipo Local */}
                <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="text-white font-medium text-lg text-right">
                        {partido.equipoLocal?.nombre}
                    </span>
                    <Shield className="text-white" size={40} />
                </div>

                {/* Resultado y estado */}
                <div className="flex flex-col items-center gap-2 mx-8">
                    {/* Cronómetro - Solo mostrar cuando el partido está activo */}
                    {esPartidoActivo && (
                        <div className="flex items-center gap-2 text-sm font-mono">
                            <span className="text-white font-medium">
                                {cronometro.fase} {cronometro.tiempoFormateado}
                            </span>
                            {cronometro.shouldShowAdicional && (
                                <span className="text-red-500 font-bold">
                                    +{cronometro.tiempoAdicional}'
                                </span>
                            )}
                        </div>
                    )}

                    {/* Estado del partido */}
                    <div className="flex items-center gap-2 text-sm">
                        {partido.estado === 'C1' && (
                            <MdOutlineWatchLater className="text-green-500 animate-pulse" />
                        )}
                        {partido.estado === 'C2' && (
                            <MdOutlineWatchLater className="text-green-500 animate-pulse" />
                        )}
                        {partido.estado === 'E' && (
                            <MdOutlineWatchLater className="text-orange-500 animate-pulse" />
                        )}
                        <span className="text-[#737373] font-medium">
                            {getEstadoTexto(partido.estado)}
                        </span>
                    </div>

                    {/* Resultado */}
                    <div className="text-4xl font-bold text-white">
                        {renderResultado()}
                    </div>
                </div>

                {/* Equipo Visitante */}
                <div className="flex items-center gap-3 flex-1">
                    <Shield className="text-white" size={40} />
                    <span className="text-white font-medium text-lg">
                        {partido.equipoVisita?.nombre}
                    </span>
                </div>
            </div>

            {/* Goleadores */}
            {mostrarGoleadores && (
                <div className="flex items-start justify-center gap-8 px-6 py-4 border-t border-[#262626] text-xs text-[#737373]">
                    {/* Goles Local */}
                    <div className="flex flex-col gap-3 flex-1 text-right">
                        {golesLocal.map((gol) => (
                            <div key={`gol-local-${gol.id}`} className="space-y-1">
                                {/* Goleador */}
                                <div className="text-sm text-white">
                                    {formatNombreJugador(gol.nombre, gol.apellido)}
                                    {gol.penal === 'S' && <span className="text-yellow-500 ml-1">(P)</span>}
                                    {gol.en_contra === 'S' && <span className="text-red-400 ml-1">(EC)</span>}
                                </div>

                                {/* Asistencia */}
                                {gol.asistencia && (
                                    <div className="flex items-center justify-end gap-1 text-xs text-[#737373]">
                                        <GiSoccerKick size={15} />
                                        <span>{formatNombreJugador(gol.asistencia.nombre, gol.asistencia.apellido)}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pelota central */}
                    <div className="flex items-start justify-center">
                        <PiSoccerBallFill className="text-[#737373] w-5 h-5" />
                    </div>

                    {/* Goles Visitante */}
                    <div className="flex flex-col gap-3 flex-1 text-left">
                        {golesVisita.map((gol) => (
                            <div key={`gol-visita-${gol.id}`} className="space-y-1">
                                {/* Goleador */}
                                <div className="text-sm text-white">
                                    {formatNombreJugador(gol.nombre, gol.apellido)}
                                    {gol.penal === 'S' && <span className="text-yellow-500 ml-1">(P)</span>}
                                    {gol.en_contra === 'S' && <span className="text-red-500 ml-1">(EC)</span>}
                                </div>

                                {/* Asistencia */}
                                {gol.asistencia && (
                                    <div className="flex items-center gap-1 text-xs text-[#737373]">
                                        <GiSoccerKick size={12} />
                                        <span>{formatNombreJugador(gol.asistencia.nombre, gol.asistencia.apellido)}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Descripción si está suspendido */}
            {partido.estado === 'S' && (
                <div className="px-6 pb-6 text-center">
                    <span className="text-sm text-[#737373]">
                        Partido suspendido
                    </span>
                </div>
            )}
        </BaseCard>
    );
};

export default CardPartidoResult;