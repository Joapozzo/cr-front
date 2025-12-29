import React, { useState } from 'react';
import { IncidenciaPartido, JugadorPlantel } from '@/app/types/partido';
import { TbCircleLetterCFilled, TbRectangleVerticalFilled } from "react-icons/tb";
import { GiSoccerKick } from "react-icons/gi";
import { PiSoccerBallFill } from "react-icons/pi";
import { BsStarFill } from 'react-icons/bs';

interface PartidoTabsProps {
    equipoLocal: {
        nombre: string;
        jugadores: JugadorPlantel[];
    };
    equipoVisita: {
        nombre: string;
        jugadores: JugadorPlantel[];
    };
    incidencias: IncidenciaPartido[];
    esPlanillero?: boolean;
    onJugadorClick?: (jugadorId: number, equipo: 'local' | 'visita') => void;
}

// Función auxiliar para calcular acciones de un jugador
const calcularAccionesJugador = (jugador: JugadorPlantel, incidencias: IncidenciaPartido[]) => {
    const acciones = {
        goles: 0,
        amarillas: 0,
        rojas: 0,
        asistencias: 0,
        esDestacado: jugador.destacado
    };

    incidencias.forEach(inc => {
        if (inc.id_jugador === jugador.id_jugador) {
            switch (inc.tipo) {
                case 'gol':
                    if (inc.en_contra !== 'S') acciones.goles++;
                    break;
                case 'amarilla':
                    acciones.amarillas++;
                    break;
                case 'roja':
                case 'doble_amarilla':
                    acciones.rojas++;
                    break;
                case 'asistencia':
                    acciones.asistencias++;
                    break;
            }
        }
    });

    return acciones;
};

// Componente de icono de incidencia
const IncidentIcon: React.FC<{ tipo: string; cantidad?: number }> = ({ tipo, cantidad = 1 }) => {
    const renderIcono = () => {
        switch (tipo) {
            case 'gol':
                return <PiSoccerBallFill className="w-4 h-4 text-[var(--green)] fill-current" />;
            case 'amarilla':
                return <TbRectangleVerticalFilled className="w-4 h-4 text-yellow-500" />;
            case 'roja':
                return <TbRectangleVerticalFilled className="w-4 h-4 text-red-500" />;
            case 'doble_amarilla':
                return (
                    <div className="flex gap-0.5">
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                    </div>
                );
            case 'asistencia':
                return <GiSoccerKick className="w-4 h-4 text-[var(--green)]" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center gap-1">
            {renderIcono()}
            {cantidad > 1 && (
                <span className="text-xs font-bold text-white">x{cantidad}</span>
            )}
        </div>
    );
};

// Componente de fila de jugador
const JugadorRow: React.FC<{
    jugador: JugadorPlantel;
    acciones: ReturnType<typeof calcularAccionesJugador>;
    equipo: 'local' | 'visita';
    esPlanillero?: boolean;
    onClick?: () => void;
    index: number;
}> = ({ jugador, acciones, esPlanillero, onClick, index }) => {
    const { goles, amarillas, rojas, asistencias, esDestacado } = acciones;
    const tieneAcciones = goles > 0 || amarillas > 0 || rojas > 0 || asistencias > 0;

    return (
        <div
            className={`
                flex items-center gap-3 p-3 rounded-lg border border-[#262626] 
                hover:border-[#404040] transition-colors
                ${jugador.sancionado === 'S' ? 'opacity-60 border-red-500/30 bg-red-900/10' : ''}
                ${esPlanillero ? 'cursor-pointer' : ''}
                opacity-0 translate-y-4
            `}
            style={{ 
                animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards`
            }}
            onClick={onClick}
        >
            {/* Dorsal */}
            <div
                className={`
                    flex items-center justify-center w-8 h-10 font-bold text-sm rounded
                    ${jugador.sancionado === 'S'
                        ? 'bg-red-500 text-white'
                        : jugador.eventual === 'S'
                            ? 'bg-yellow-500 text-black'
                            : jugador.dorsal
                                ? 'bg-[var(--green)] text-black'
                                : 'bg-[#404040] text-[#737373]'
                    }
                `}
            >
                {jugador.dorsal || '-'}
            </div>

            {/* Nombre y acciones */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">
                        {jugador.apellido.toUpperCase()}, {jugador.nombre}
                    </span>
                    {jugador.capitan && (
                            <TbCircleLetterCFilled className='w-5 h-5 text-yellow-500 rounded-full flex items-center justify-center flex-shrink-0' />
                    )}
                    {esDestacado && (
                        <BsStarFill className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    )}
                </div>

                {/* Acciones del jugador */}
                {tieneAcciones && (
                    <div className="flex items-center gap-2 mt-1">
                        {goles > 0 && <IncidentIcon tipo="gol" cantidad={goles} />}
                        {asistencias > 0 && <IncidentIcon tipo="asistencia" cantidad={asistencias} />}
                        {amarillas > 0 && <IncidentIcon tipo="amarilla" cantidad={amarillas} />}
                        {rojas > 0 && <IncidentIcon tipo="roja" cantidad={rojas} />}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente de incidencia individual
const IncidenciaRow: React.FC<{
    incidencia: IncidenciaPartido;
    equipoLocalId: number;
    index: number;
}> = ({ incidencia, equipoLocalId, index }) => {
    const getIcono = () => {
        switch (incidencia.tipo) {
            case 'gol':
                return <PiSoccerBallFill className="w-5 h-5 text-[var(--green)] fill-current" />;
            case 'amarilla':
                return <TbRectangleVerticalFilled className="w-5 h-5 text-yellow-500" />;
            case 'roja':
                return <TbRectangleVerticalFilled className="w-5 h-5 text-red-500" />;
            case 'doble_amarilla':
                return (
                    <div className="flex gap-0.5">
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                        <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                    </div>
                );
            case 'asistencia':
                return <GiSoccerKick className="w-5 h-5 text-[var(--green)]" />;
            default:
                return null;
        }
    };

    const esLocal = incidencia.id_equipo === equipoLocalId;
    const nombreCompleto = `${incidencia.nombre.charAt(0)}. ${incidencia.apellido.toUpperCase()}`;

    return (
        <div 
            className="flex items-center gap-4 py-3 last:border-0 opacity-0 translate-y-4"
            style={{ 
                animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms forwards`
            }}
        >
            {/* Equipo Local - Alineado a la derecha */}
            <div className="flex-1 flex justify-end">
                {esLocal && (
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-sm font-medium text-white">
                                {nombreCompleto}
                                {incidencia.penal === 'S' && (
                                    <span className="text-[#737373] ml-1">(p)</span>
                                )}
                                {incidencia.en_contra === 'S' && (
                                    <span className="text-[#737373] ml-1">(ec)</span>
                                )}
                            </div>
                        </div>
                        <div className="text-xs font-mono text-[#737373] text-right">
                            {incidencia.minuto}&apos;
                        </div>
                    </div>
                )}
            </div>

            {/* Icono centrado */}
            <div className="flex items-center justify-center w-10 flex-shrink-0">
                {getIcono()}
            </div>

            {/* Equipo Visita - Alineado a la izquierda */}
            <div className="flex-1 flex justify-start">
                {!esLocal && (
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-mono text-[#737373]">
                            {incidencia.minuto}&apos;
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-medium text-white">
                                {nombreCompleto}
                                {incidencia.penal === 'S' && (
                                    <span className="text-yellow-500 ml-1">(P)</span>
                                )}
                                {incidencia.en_contra === 'S' && (
                                    <span className="text-red-400 ml-1">(EC)</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente principal
const PartidoTabs: React.FC<PartidoTabsProps> = ({
    equipoLocal,
    equipoVisita,
    incidencias,
    esPlanillero = false,
    onJugadorClick
}) => {
    const [activeTab, setActiveTab] = useState<'local' | 'incidencias' | 'visita'>('incidencias');

    // Ordenar incidencias por minuto
    const incidenciasOrdenadas = [...incidencias].sort((a, b) => (a.minuto || 0) - (b.minuto || 0));

    return (
        <>
            <style jsx>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            
            <div className="w-full bg-[#0a0a0a]">
                {/* Navegación */}
                <div className="flex border-b border-[#262626] bg-[#171717]">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`
                            flex-1 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${activeTab === 'local'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white hover:border-[#404040]'
                            }
                        `}
                    >
                        {equipoLocal.nombre}
                        <span className="ml-2 text-xs">({equipoLocal.jugadores.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('incidencias')}
                        className={`
                            flex-1 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${activeTab === 'incidencias'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white hover:border-[#404040]'
                            }
                        `}
                    >
                        Incidencias
                        <span className="ml-2 text-xs">({incidencias.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('visita')}
                        className={`
                            flex-1 py-4 text-sm font-semibold transition-all duration-200 border-b-2
                            ${activeTab === 'visita'
                                ? 'border-[var(--green)] text-[var(--green)]'
                                : 'border-transparent text-[#737373] hover:text-white hover:border-[#404040]'
                            }
                        `}
                    >
                        {equipoVisita.nombre}
                        <span className="ml-2 text-xs">({equipoVisita.jugadores.length})</span>
                    </button>
                </div>

                {/* Contenido */} 
                <div className="w-full px-4">
                    {/* Tab: Equipo Local */}
                    {activeTab === 'local' && (
                        <div className="space-y-2">
                            {equipoLocal.jugadores.length > 0 ? (
                                equipoLocal.jugadores.map((jugador, index) => (
                                    <JugadorRow
                                        key={`${activeTab}-${jugador.id_jugador}`}
                                        jugador={jugador}
                                        acciones={calcularAccionesJugador(jugador, incidencias)}
                                        equipo="local"
                                        esPlanillero={esPlanillero}
                                        onClick={() => onJugadorClick?.(jugador.id_jugador, 'local')}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay jugadores registrados
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Incidencias */}
                    {activeTab === 'incidencias' && (
                        <div className="space-y-0">
                            {incidenciasOrdenadas.length > 0 ? (
                                incidenciasOrdenadas.map((incidencia, index) => (
                                    <IncidenciaRow
                                        key={`${activeTab}-${incidencia.tipo}-${incidencia.id}-${index}`}
                                        incidencia={incidencia}
                                        equipoLocalId={equipoLocal.jugadores[0]?.id_equipo || 0}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay incidencias registradas
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Equipo Visita */}
                    {activeTab === 'visita' && (
                        <div className="space-y-2">
                            {equipoVisita.jugadores.length > 0 ? (
                                equipoVisita.jugadores.map((jugador, index) => (
                                    <JugadorRow
                                        key={`${activeTab}-${jugador.id_jugador}`}
                                        jugador={jugador}
                                        acciones={calcularAccionesJugador(jugador, incidencias)}
                                        equipo="visita"
                                        esPlanillero={esPlanillero}
                                        onClick={() => onJugadorClick?.(jugador.id_jugador, 'visita')}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-[#737373]">
                                    No hay jugadores registrados
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PartidoTabs;