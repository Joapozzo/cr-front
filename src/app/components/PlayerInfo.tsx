import React from 'react';
import { IncidenciaPartido } from '../types/partido';

interface PlayerInfoProps {
    incidencia: IncidenciaPartido;
    isLocal: boolean;
    isAsistencia?: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
    incidencia,
    isLocal,
    isAsistencia = false
}) => {
    const containerClasses = `flex-1 ${isLocal ? '' : 'text-right'}`;
    const textColor = isAsistencia ? 'text-[#737373]' : 'text-white';

    return (
        <div className={containerClasses}>
            <span className={`font-medium text-xs sm:text-sm ${textColor}`}>
                {incidencia.nombre} {incidencia.apellido}
                {incidencia.tipo === 'gol' && incidencia.en_contra === 'S' && (
                    <span className="text-red-400 ml-1">(e.c)</span>
                )}
                {incidencia.tipo === 'gol' && incidencia.penal === 'S' && (
                    <span className="text-yellow-400 ml-1">(p)</span>
                )}
            </span>
        </div>
    );
};

export default PlayerInfo;