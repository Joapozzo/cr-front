import React from 'react';
import JugadoresTabsUnified from '../JugadoresTabsUnified';
import { DatosCompletosPlanillero, EstadoPartido } from '@/app/types/partido';

interface JugadoresSectionProps {
    datosPartido?: DatosCompletosPlanillero;
    estadoPartido: EstadoPartido;
    isLoading: boolean;
    jugadorCargando: number | null;
    estrellasRotando: Set<number>;
    idPartido: number;
    onJugadorClick?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    onJugadorAction?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    onDeleteDorsal?: (jugadorId: number) => void;
    onEditIncidencia?: (incidencia: any) => void;
    onDeleteIncidencia?: (incidencia: any) => void;
    onToggleDestacado?: (jugadorId: number, equipo: 'local' | 'visita') => void;
    onAgregarEventual?: (equipo: 'local' | 'visita') => void;
}

export const JugadoresSection: React.FC<JugadoresSectionProps> = ({
    datosPartido,
    estadoPartido,
    isLoading,
    jugadorCargando,
    estrellasRotando,
    idPartido,
    onJugadorClick,
    onJugadorAction,
    onDeleteDorsal,
    onEditIncidencia,
    onDeleteIncidencia,
    onToggleDestacado,
    onAgregarEventual
}) => {
    return (
        <JugadoresTabsUnified
            mode="planillero"
            estadoPartido={estadoPartido}
            equipoLocal={{
                id_equipo: datosPartido?.partido.equipoLocal?.id_equipo || 0,
                nombre: datosPartido?.partido.equipoLocal?.nombre || '',
                jugadores: datosPartido?.plantel_local || []
            }}
            equipoVisita={{
                id_equipo: datosPartido?.partido.equipoVisita?.id_equipo || 0,
                nombre: datosPartido?.partido.equipoVisita?.nombre || '',
                jugadores: datosPartido?.plantel_visita || []
            }}
            incidencias={datosPartido?.incidencias || []}
            destacados={datosPartido?.jugadores_destacados || []}
            onJugadorClick={onJugadorClick}
            onJugadorAction={(jugadorId, equipoId) => {
                // JugadoresTabsUnified pasa equipoId, convertir a equipo para el handler
                const equipo = equipoId === (datosPartido?.partido.equipoLocal?.id_equipo || 0) 
                    ? 'local' 
                    : 'visita';
                onJugadorAction?.(jugadorId, equipo);
            }}
            onDeleteDorsal={onDeleteDorsal}
            onEditIncidencia={onEditIncidencia}
            onDeleteIncidencia={onDeleteIncidencia}
            onToggleDestacado={(jugadorId, equipoId) => {
                // JugadoresTabsUnified pasa equipoId, convertir a equipo para el handler
                const equipo = equipoId === (datosPartido?.partido.equipoLocal?.id_equipo || 0) 
                    ? 'local' 
                    : 'visita';
                onToggleDestacado?.(jugadorId, equipo);
            }}
            onAgregarEventual={onAgregarEventual}
            loading={isLoading || !datosPartido?.partido.equipoLocal?.id_equipo || !datosPartido?.partido.equipoVisita?.id_equipo}
            jugadorCargando={jugadorCargando}
            estrellasRotando={estrellasRotando}
            idCategoriaEdicion={datosPartido?.partido.id_categoria_edicion}
            idPartido={idPartido}
            jugadorDestacado={datosPartido?.partido.jugador_destacado || null}
            tipoFutbol={datosPartido?.partido.canchaData?.tipo_futbol || 11}
        />
    );
};

