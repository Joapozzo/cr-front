import React from 'react';
import { IncidenciaGol } from '@/app/types/partido';
import { formatNombreJugador } from '@/app/utils/cardPartido.helper';
import { PiSoccerBallFill } from 'react-icons/pi';

interface PartidoGoleadoresProps {
    golesLocal: IncidenciaGol[];
    golesVisita: IncidenciaGol[];
}

export const PartidoGoleadores: React.FC<PartidoGoleadoresProps> = ({
    golesLocal,
    golesVisita,
}) => {
    if (golesLocal.length === 0 && golesVisita.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-6 pt-2">
            {/* Goles Local */}
            <div className="flex flex-wrap gap-2 justify-end flex-1">
                {golesLocal.map((gol, index) => (
                    <span key={'gol_local_' + index} className="text-xs text-[#d4d4d4]">
                        {formatNombreJugador(gol.nombre, gol.apellido)} {gol.minuto}&apos;
                        {gol.penal === 'S' && <span className=""> (P)</span>}
                        {gol.en_contra === 'S' && <span className=""> (EC)</span>}
                    </span>
                ))}
            </div>

            <PiSoccerBallFill size={16} className="text-[#525252] flex-shrink-0" />

            {/* Goles Visita */}
            <div className="flex flex-wrap gap-2 flex-1">
                {golesVisita.map((gol, index) => (
                    <span key={'gol_visita_' + index} className="text-xs text-[#d4d4d4]">
                        {formatNombreJugador(gol.nombre, gol.apellido)} {gol.minuto}&apos;
                        {gol.penal === 'S' && <span className=""> (P)</span>}
                        {gol.en_contra === 'S' && <span className=""> (EC)</span>}
                    </span>
                ))}
            </div>
        </div>
    );
};

