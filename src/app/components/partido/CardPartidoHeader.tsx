import React from 'react';
import { Shield, Clock, MapPin, Calendar, Volleyball } from 'lucide-react';
import { EstadoPartido, IncidenciaGol, PartidoCompleto } from '@/app/types/partido';
import { formatNombreJugador, formatTime, getEstadoColor, getEstadoTexto, getNombreCategoria } from '@/app/utils/cardPartido.helper';
import { formatDate } from '../ui/utils';
import BotoneraPartido from '../ButtonContainer';
import { useCronometroPartido } from '@/app/hooks/useCronometroPartido';
import { CardPartidoResultSkeleton } from '../skeletons/CardPartidoSkeleton';
import { getEstadoInfo } from '@/app/utils/partido.helper';

interface PartidoHeaderStickyProps {
    partido: PartidoCompleto;
    goles?: IncidenciaGol[];
    esPlanillero?: boolean;
    onEmpezarPartido?: () => void;
    onTerminarPrimerTiempo?: () => void;
    onEmpezarSegundoTiempo?: () => void;
    onTerminarPartido?: () => void;
    onFinalizarPartido?: () => void;
    onSuspenderPartido?: () => void;
    isLoading?: boolean;
    cronometro?: {
        fase: string;
        tiempoFormateado: string;
        shouldShowAdicional: boolean;
        tiempoAdicional: number;
    };
    isLoadingButton?: boolean;
}

const PartidoHeaderSticky: React.FC<PartidoHeaderStickyProps> = ({
    partido,
    goles = [],
    esPlanillero = false,
    onEmpezarPartido,
    onTerminarPrimerTiempo,
    onEmpezarSegundoTiempo,
    onTerminarPartido,
    onFinalizarPartido,
    onSuspenderPartido,
    isLoading,
    isLoadingButton
}) => {

    if (isLoading || !partido) {
        return <CardPartidoResultSkeleton />
    }

    const mostrarResultado = !['P', 'A'].includes(partido.estado);

    const golesLocal = goles.filter(g => g.id_equipo === partido.equipoLocal?.id_equipo);
    const golesVisita = goles.filter(g => g.id_equipo === partido.equipoVisita?.id_equipo);

    const cronometro = useCronometroPartido();

    return (
        <div className="bg-[var(--black-900)] border-b border-t border-[#262626] overflow-hidden rounded-xl">
            {/* Header - Categoría */}
            <div className="bg-[#171717] px-6 py-3 border-b border-[#262626] bg-[var(--black-800)] rounded-t-xl">
                <div className="flex items-center justify-center gap-6 text-xs text-[#737373]">
                    <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>Jornada {partido.jornada}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{formatDate(partido.dia as string)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        <span>Cancha {partido.cancha || 'Por definir'}</span>
                    </div>
                </div>
            </div>

            {/* Info del partido */}
            <div className="px-6 py-4">
                {/* Equipos y Resultado */}
                <div className="flex items-center justify-between gap-6 mb-4">
                    {/* Equipo Local */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-white font-medium text-lg text-right truncate">
                            {partido.equipoLocal?.nombre || 'Local'}
                        </span>
                        <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="text-[#737373]" size={20} />
                        </div>
                    </div>

                    {/* Resultado/Hora y Estado */}
                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                        {['C1', 'E', 'C2'].includes(partido.estado as EstadoPartido) ? (
                            // Mostrar cronómetro si el partido está en curso
                            cronometro && (
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <span className="text-white font-medium">
                                        {cronometro.fase} {cronometro.tiempoFormateado}
                                    </span>
                                    {cronometro.shouldShowAdicional && (
                                        <span className="text-red-500 font-bold">
                                            +{cronometro.tiempoAdicional}'
                                        </span>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getEstadoInfo(partido.estado as EstadoPartido).bg} ${getEstadoInfo(partido.estado as EstadoPartido).color} border border-white/10 backdrop-blur-sm`}>
                                    {getEstadoInfo(partido.estado as EstadoPartido).text}
                                </span>
                            </div>
                        )}

                        {/* Resultado */}
                        <div className="text-3xl font-bold text-white">
                            {mostrarResultado ? (
                                <div className="flex items-center gap-1">
                                    {partido.pen_local !== null && partido.pen_local !== undefined && (
                                        <span className="text-[#737373] text-base">({partido.pen_local})</span>
                                    )}
                                    <span>{partido.goles_local ?? 0}-{partido.goles_visita ?? 0}</span>
                                    {partido.pen_visita !== null && partido.pen_visita !== undefined && (
                                        <span className="text-[#737373] text-base">({partido.pen_visita})</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-xl">{formatTime(partido.hora)}</span>
                            )}
                        </div>
                    </div>

                    {/* Equipo Visita */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="text-[#737373]" size={20} />
                        </div>
                        <span className="text-white font-medium text-lg truncate">
                            {partido.equipoVisita?.nombre || 'Visitante'}
                        </span>
                    </div>
                </div>

                {/* Goleadores - Horizontal y compacto */}
                {mostrarResultado && (golesLocal.length > 0 || golesVisita.length > 0) && (
                    <div className="flex items-center justify-center gap-6 py-3">
                        {/* Goles Local */}
                        <div className="flex flex-wrap gap-2 justify-end flex-1">
                            {golesLocal.map((gol, index) => (
                                <span key={'gol_local_' + index} className="text-xs text-[#d4d4d4]">
                                    {formatNombreJugador(gol.nombre, gol.apellido)} {gol.minuto}'
                                    {gol.penal === 'S' && <span className=""> (P)</span>}
                                    {gol.en_contra === 'S' && <span className=""> (EC)</span>}
                                </span>
                            ))}
                        </div>

                        <Volleyball size={16} className="text-[#525252] flex-shrink-0" />

                        {/* Goles Visita */}
                        <div className="flex flex-wrap gap-2 flex-1">
                            {golesVisita.map((gol, index) => (
                                <span key={'gol_visita_' + index} className="text-xs text-[#d4d4d4]">
                                    {formatNombreJugador(gol.nombre, gol.apellido)} {gol.minuto}'
                                    {gol.penal === 'S' && <span className=""> (P)</span>}
                                    {gol.en_contra === 'S' && <span className=""> (EC)</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {esPlanillero && partido.estado !== 'F' && (
                <BotoneraPartido
                    estado={partido.estado as EstadoPartido}
                    isLoading={isLoadingButton}
                    onEmpezarPartido={onEmpezarPartido}
                    onTerminarPrimerTiempo={onTerminarPrimerTiempo}
                    onEmpezarSegundoTiempo={onEmpezarSegundoTiempo}
                    onTerminarPartido={onTerminarPartido}
                    onFinalizarPartido={onFinalizarPartido}
                    onSuspenderPartido={onSuspenderPartido}
                />
            )}
        </div>
    );
};

export default PartidoHeaderSticky;