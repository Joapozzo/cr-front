import React from 'react';
import Link from 'next/link';
import { PartidoCompleto } from '@/app/types/partido';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { formatTime } from '@/app/utils/cardPartido.helper';

interface PartidoEquiposProps {
    partido: PartidoCompleto;
    mostrarResultado: boolean;
}

export const PartidoEquipos: React.FC<PartidoEquiposProps> = ({
    partido,
    mostrarResultado,
}) => {
    return (
        <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Equipo Local */}
            {partido.equipoLocal?.id_equipo ? (
                <Link 
                    href={`/equipos/${partido.equipoLocal.id_equipo}`}
                    className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0 hover:opacity-80 transition-opacity"
                >
                    <span className="text-white font-medium text-sm sm:text-lg text-right break-words">
                        {partido.equipoLocal.nombre}
                    </span>
                    <EscudoEquipo
                        src={partido.equipoLocal.img}
                        alt={partido.equipoLocal.nombre}
                        size={30}
                        className="flex-shrink-0"
                    />
                </Link>
            ) : (
                <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                    <span className="text-white font-medium text-sm sm:text-lg text-right break-words">
                        Local
                    </span>
                    <EscudoEquipo
                        src={undefined}
                        alt="Local"
                        size={30}
                        className="flex-shrink-0"
                    />
                </div>
            )}

            {/* Resultado/Hora */}
            <div className="flex items-center justify-center min-w-[80px] sm:min-w-[120px] flex-shrink-0">
                <div className="text-xl sm:text-3xl font-bold text-white">
                    {mostrarResultado ? (
                        <div className="flex items-center gap-1">
                            {partido.pen_local !== null && partido.pen_local !== undefined && (
                                <span className="text-[#737373] text-xs sm:text-base">({partido.pen_local})</span>
                            )}
                            <span>{partido.goles_local ?? 0}-{partido.goles_visita ?? 0}</span>
                            {partido.pen_visita !== null && partido.pen_visita !== undefined && (
                                <span className="text-[#737373] text-xs sm:text-base">({partido.pen_visita})</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-lg sm:text-xl">{formatTime(partido.hora)}</span>
                    )}
                </div>
            </div>

            {/* Equipo Visita */}
            {partido.equipoVisita?.id_equipo ? (
                <Link 
                    href={`/equipos/${partido.equipoVisita.id_equipo}`}
                    className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                >
                    <EscudoEquipo
                        src={partido.equipoVisita.img}
                        alt={partido.equipoVisita.nombre}
                        size={30}
                        className="flex-shrink-0"
                    />
                    <span className="text-white font-medium text-sm sm:text-lg break-words">
                        {partido.equipoVisita.nombre}
                    </span>
                </Link>
            ) : (
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <EscudoEquipo
                        src={undefined}
                        alt="Visitante"
                        size={30}
                        className="flex-shrink-0"
                    />
                    <span className="text-white font-medium text-sm sm:text-lg break-words">
                        Visitante
                    </span>
                </div>
            )}
        </div>
    );
};

