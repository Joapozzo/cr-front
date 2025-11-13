import { Shield, MapPin, Calendar, Clock, Volleyball } from 'lucide-react';
import { formatTime, formatDate, getEstadoTexto, getEstadoColor } from '../utils/cardPartido.helper';
import { EstadoPartido, PartidoEquipo } from '../types/partido';

interface MatchCardProps {
    partido: PartidoEquipo;
    misEquiposIds?: number[]; // IDs de los equipos del usuario
}

const deberMostrarResultado = (estado: EstadoPartido): boolean => {
    return ['C1', 'E', 'C2', 'T', 'F'].includes(estado);
};

const estaEnVivo = (estado: EstadoPartido): boolean => {
    return ['C1', 'E', 'C2'].includes(estado); 
};

export default function MatchCard({ partido, misEquiposIds = [] }: MatchCardProps) {
    const debeMostrarResultado = deberMostrarResultado(partido.estado as EstadoPartido);
    const enVivo = estaEnVivo(partido.estado as EstadoPartido);
    const estadoColor = getEstadoColor(partido.estado as EstadoPartido);
    const estadoTexto = getEstadoTexto(partido.estado as EstadoPartido);
    
    const nombreLocal = partido.equipoLocal.nombre || 'Equipo Local';
    const nombreVisita = partido.equipoVisita?.nombre || 'Equipo Visita';
    
    // Verificar si los equipos pertenecen al usuario
    const esEquipoLocalMio = misEquiposIds.includes(partido.id_equipolocal);
    const esEquipoVisitaMio = misEquiposIds.includes(partido.id_equipovisita);
    
    const incidencias = partido.incidencias || { goles: [], expulsiones: [] };
    
    const golesLocal = incidencias.goles.filter(i => i.id_equipo === partido.id_equipolocal);
    const golesVisita = incidencias.goles.filter(i => i.id_equipo === partido.id_equipovisita);
    const rojasLocal = incidencias.expulsiones.filter((i: any) => i.id_equipo === partido.id_equipolocal);
    const rojasVisita = incidencias.expulsiones.filter((i: any) => i.id_equipo === partido.id_equipovisita);

    const hayIncidencias = golesLocal.length > 0 || golesVisita.length > 0 || rojasLocal.length > 0 || rojasVisita.length > 0;

    return (
        <div className="w-full max-w-full bg-transparent rounded-lg p-2 sm:p-4 space-y-2 sm:space-y-3">
            {/* Header: Jornada y Hora/Estado */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-[#737373]">Jornada {partido.jornada}</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="text-[#737373] w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className={estadoColor}>
                        {debeMostrarResultado ? estadoTexto : formatTime(partido.hora)}
                    </span>
                </div>
            </div>

            {/* Reloj en vivo */}
            {enVivo && (
                <div className="flex justify-center">
                    <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#262626]">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-2 h-2 bg-[var(--green)] rounded-full animate-ping opacity-75" />
                            <div className="relative w-2 h-2 bg-[var(--green)] rounded-full" />
                        </div>
                        <span className="text-[var(--green)] text-[10px] font-semibold uppercase">En Vivo</span>
                    </div>
                </div>
            )}

            {/* Partido: Equipos y Resultado */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Equipo Local */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="text-[#737373] w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium truncate ${
                        esEquipoLocalMio ? 'text-[var(--green)]' : 'text-white'
                    }`}>
                        {nombreLocal}
                    </span>
                </div>

                {/* Tarjetas Rojas Local */}
                {rojasLocal.length > 0 && (
                    <div className="flex flex-col gap-1">
                        {rojasLocal.map((roja: any, index: number) => (
                            <div key={roja.id || index} className="w-3 h-4 bg-red-700 rounded-sm"></div>
                        ))}
                    </div>
                )}

                {/* Resultado o VS */}
                <div className="flex items-center justify-center min-w-[50px] sm:min-w-[60px]">
                    {debeMostrarResultado ? (
                        <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-white font-bold text-lg sm:text-xl">
                                {partido.goles_local ?? 0}
                            </span>
                            <span className="text-[#525252]">-</span>
                            <span className="text-white font-bold text-lg sm:text-xl">
                                {partido.goles_visita ?? 0}
                            </span>
                        </div>
                    ) : (
                        <span className="text-[#525252] text-xs sm:text-sm font-medium">VS</span>
                    )}
                </div>

                {/* Tarjetas Rojas Visita */}
                {rojasVisita.length > 0 && (
                    <div className="flex flex-col gap-1">
                        {rojasVisita.map((roja: any, index: number) => (
                            <div key={roja.id || index} className="w-3 h-4 bg-red-700 rounded-sm"></div>
                        ))}
                    </div>
                )}

                {/* Equipo Visita */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 justify-end">
                    <span className={`text-xs sm:text-sm font-medium truncate text-right ${
                        esEquipoVisitaMio ? 'text-[var(--green)]' : 'text-white'
                    }`}>
                        {nombreVisita}
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="text-[#737373] w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                    </div>
                </div>
            </div>

            {/* Goles */}
            {debeMostrarResultado && hayIncidencias && (golesLocal.length > 0 || golesVisita.length > 0) && (
                <div className="flex items-start gap-2">
                    {/* Goles Local */}
                    <div className="flex-1 flex flex-wrap gap-x-2 gap-y-0.5">
                        {golesLocal.map((gol, index) => (
                            <span key={'gol_local_' + index} className="text-[#d4d4d4] text-xs whitespace-nowrap">
                                {gol.minuto}&apos; {gol.nombre} {gol.apellido}
                                {gol.penal === 'S' && ' (P)'}
                                {gol.en_contra === 'S' && ' (EC)'}
                            </span>
                        ))}
                    </div>

                    {/* Icono Pelota */}
                    <div className="flex-shrink-0">
                        <Volleyball size={14} className="text-[#737373]" />
                    </div>

                    {/* Goles Visita */}
                    <div className="flex-1 flex flex-wrap gap-x-2 gap-y-0.5 justify-end">
                        {golesVisita.map((gol, index) => (
                            <span key={'gol_visita_' + index} className="text-[#d4d4d4] text-xs whitespace-nowrap">
                                {gol.minuto}&apos; {gol.nombre} {gol.apellido}
                                {gol.penal === 'S' && ' (P)'}
                                {gol.en_contra === 'S' && ' (EC)'}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer: Cancha y Fecha */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#737373]">
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">Cancha {partido.cancha || 'Por confirmar'}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{formatDate(partido.dia)}</span>
                </div>
            </div>
        </div>
    );
}