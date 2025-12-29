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
    segundaAmarillaRelacionada?: IncidenciaPartido;
    rojaRelacionada?: IncidenciaPartido;
    esDobleAmarilla?: boolean;
    dobleAmarillaData?: {
        primeraAmarilla: IncidenciaPartido;
        segundaAmarilla: IncidenciaPartido;
        roja: IncidenciaPartido;
    };
    onEdit?: (incidencia: IncidenciaPartido) => void;
    onDelete?: (incidencia: IncidenciaPartido) => void;
}

const SingleIncident: React.FC<SingleIncidentProps> = ({
    incidencia,
    partido,
    isAsistencia = false,
    showActions = false,
    segundaAmarillaRelacionada,
    rojaRelacionada: _rojaRelacionada,
    esDobleAmarilla,
    dobleAmarillaData,
    onEdit,
    onDelete
}) => {
    const isLocal = isLocalTeam(incidencia.id_equipo, partido);
    
    // Detectar si es la segunda amarilla de una doble amarilla
    const esSegundaAmarillaDoble = incidencia.tipo === 'amarilla' && esDobleAmarilla && (segundaAmarillaRelacionada || (dobleAmarillaData && incidencia.id === dobleAmarillaData.segundaAmarilla.id));

    const containerClasses = `flex items-center w-full py-2 px-3 rounded-lg transition-colors ${isLocal ? 'justify-start' : 'justify-end bg-[#171717]'
        } ${isAsistencia ? 'opacity-70' : ''}`;

    return (
        <div className={containerClasses}>
            {isLocal ? (
                // Layout para equipo local (izquierda)
                <>
                    <IncidentMinute minuto={incidencia.minuto} isLocal={true} isAsistencia={isAsistencia} />

                    <div className="flex items-center justify-center mx-3">
                        {esSegundaAmarillaDoble && (segundaAmarillaRelacionada || dobleAmarillaData?.roja) ? (
                            // Mostrar tarjetas superpuestas: amarilla detrás, roja delante
                            <div className="relative" style={{ width: '20px', height: '28px' }}>
                                {/* Tarjeta amarilla (atrás) */}
                                <div className="absolute" style={{ 
                                    left: '2px', 
                                    top: '2px',
                                    width: '16px', 
                                    height: '24px', 
                                    backgroundColor: '#eab308',
                                    borderRadius: '2px',
                                    zIndex: 1
                                }} />
                                {/* Tarjeta roja (delante) */}
                                <div className="absolute" style={{ 
                                    left: '0px', 
                                    top: '0px',
                                    width: '16px', 
                                    height: '24px', 
                                    backgroundColor: '#dc2626',
                                    borderRadius: '2px',
                                    zIndex: 2
                                }} />
                            </div>
                        ) : (
                            <IncidentIcon incidencia={incidencia} />
                        )}
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
                        {esSegundaAmarillaDoble && (segundaAmarillaRelacionada || dobleAmarillaData?.roja) ? (
                            // Mostrar tarjetas superpuestas: amarilla detrás, roja delante
                            <div className="relative" style={{ width: '20px', height: '28px' }}>
                                {/* Tarjeta amarilla (atrás) */}
                                <div className="absolute" style={{ 
                                    left: '2px', 
                                    top: '2px',
                                    width: '16px', 
                                    height: '24px', 
                                    backgroundColor: '#eab308',
                                    borderRadius: '2px',
                                    zIndex: 1
                                }} />
                                {/* Tarjeta roja (delante) */}
                                <div className="absolute" style={{ 
                                    left: '0px', 
                                    top: '0px',
                                    width: '16px', 
                                    height: '24px', 
                                    backgroundColor: '#dc2626',
                                    borderRadius: '2px',
                                    zIndex: 2
                                }} />
                            </div>
                        ) : (
                            <IncidentIcon incidencia={incidencia} />
                        )}
                    </div>

                    <IncidentMinute minuto={incidencia.minuto} isLocal={false} isAsistencia={isAsistencia} />
                </>
            )}
        </div>
    );
};

export default SingleIncident;