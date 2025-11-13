import React from 'react';
import { IncidenciaPartido, Partido } from '../types/partido';
import IncidentIcon from './IncidentIcon';
import IncidentActions from './IncidentsActions'; 
import PlayerInfo from './PlayerInfo';
import IncidentMinute from './IncidentMinute';
import { isLocalTeam } from '../utils/incidentsHelpers';

interface SingleIncidentProps {
    incidencia: IncidenciaPartido;
    partido: Partido;
    isAsistencia?: boolean;
    showActions?: boolean;
    onEdit?: (incidencia: IncidenciaPartido) => void;
    onDelete?: (incidencia: IncidenciaPartido) => void;
}

const SingleIncident: React.FC<SingleIncidentProps> = ({
    incidencia,
    partido,
    isAsistencia = false,
    showActions = false,
    onEdit,
    onDelete
}) => {
    const isLocal = isLocalTeam(incidencia.id_equipo, partido);

    const containerClasses = `flex items-center w-full py-2 px-3 rounded-lg transition-colors ${isLocal ? 'justify-start' : 'justify-end bg-[#171717]'
        } ${isAsistencia ? 'opacity-70' : ''}`;

    return (
        <div className={containerClasses}>
            {isLocal ? (
                // Layout para equipo local (izquierda)
                <>
                    <IncidentMinute minuto={incidencia.minuto} isLocal={true} isAsistencia={isAsistencia} />

                    <div className="flex items-center justify-center mx-3">
                        <IncidentIcon incidencia={incidencia} />
                    </div>

                    <PlayerInfo incidencia={incidencia} isLocal={true} isAsistencia={isAsistencia} />

                    {showActions && !isAsistencia && onEdit && onDelete && (
                        <IncidentActions
                            incidencia={incidencia}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isLocal={true}
                        />
                    )}
                </>
            ) : (
                // Layout para equipo visitante (derecha)
                <>
                    {showActions && !isAsistencia && onEdit && onDelete && (
                        <IncidentActions
                            incidencia={incidencia}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isLocal={false}
                        />
                    )}

                    <PlayerInfo incidencia={incidencia} isLocal={false} isAsistencia={isAsistencia} />

                    <div className="flex items-center justify-center mx-3">
                        <IncidentIcon incidencia={incidencia} />
                    </div>

                    <IncidentMinute minuto={incidencia.minuto} isLocal={false} isAsistencia={isAsistencia} />
                </>
            )}
        </div>
    );
};

export default SingleIncident;