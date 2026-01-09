import { DreamTeamFieldLayout } from './components/DreamTeamFieldLayout';
import { DreamTeamHeader } from './components/DreamTeamHeader';
import { DreamTeamModals } from './components/DreamTeamModals';
import InstruccionesDreamTeam from '../InstruccionesDreamTeam';
import { DreamTeam } from '@/app/types/dreamteam';
import { JugadorDestacadoDt } from '@/app/types/jugador';

interface DreamTeamViewProps {
    // Data
    dreamteam: DreamTeam | null | undefined;
    formacionActual: number[];
    formacionNombre: string;
    categoriaNombre?: string;
    jornada: number;

    // Estados
    isPublished: boolean;

    // Handlers
    onSlotClick: (posicionIndex: number) => void;
    onFormationChange: (formacion: string) => void;
    onPublicar: () => void;
    onVaciar: () => void;
    onSeleccionarJugador: (jugador: JugadorDestacadoDt) => Promise<void>;
    onConfirmarEliminar: (idDreamteam: number, idPartido: number, idJugador: number) => Promise<void>;

    // Modales
    modalJugador: {
        isOpen: boolean;
        posicionIndex: string;
        posicionesIds: number[];
        posicionNombre: string;
    };
    modalEliminar: {
        isOpen: boolean;
        jugador: {
            id_jugador: number;
            id_partido: number;
            nombre: string;
            apellido: string;
            equipo?: string;
        } | null;
    };
    onCloseModalJugador: () => void;
    onCloseModalEliminar: () => void;

    // Estados de carga
    isPublicando: boolean;
    isVaciando: boolean;
    isAgregando: boolean;
    isEliminando: boolean;
    errorEliminar: any;
}

/**
 * Componente presentacional puro que solo renderiza
 * NO contiene hooks, NO contiene lógica de negocio
 */
export const DreamTeamView = ({
    dreamteam,
    formacionActual,
    formacionNombre,
    categoriaNombre,
    jornada,
    isPublished,
    onSlotClick,
    onFormationChange,
    onPublicar,
    onVaciar,
    onSeleccionarJugador,
    onConfirmarEliminar,
    modalJugador,
    modalEliminar,
    onCloseModalJugador,
    onCloseModalEliminar,
    isPublicando,
    isVaciando,
    isAgregando,
    isEliminando,
    errorEliminar,
}: DreamTeamViewProps) => {
    const jugadores = dreamteam?.jugadores || [];
    const dreamteamId = dreamteam?.id_dreamteam || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campo de juego - 2/3 del espacio */}
            <div className="lg:col-span-2">
                <DreamTeamHeader
                    categoriaNombre={categoriaNombre}
                    isPublished={isPublished}
                    isPublicando={isPublicando}
                    isVaciando={isVaciando}
                    onPublicar={onPublicar}
                    onVaciar={onVaciar}
                />

                <DreamTeamFieldLayout
                    formacionActual={formacionActual}
                    formacionNombre={formacionNombre}
                    jugadores={jugadores}
                    isPublished={isPublished}
                    onSlotClick={onSlotClick}
                    onFormationChange={onFormationChange}
                />
            </div>

            {/* Instrucciones - 1/3 del espacio */}
            <div className="lg:col-span-1">
                <InstruccionesDreamTeam />
            </div>

            <DreamTeamModals
                modalJugador={modalJugador}
                onCloseModalJugador={onCloseModalJugador}
                onSeleccionarJugador={onSeleccionarJugador}
                jornada={jornada}
                isAgregando={isAgregando}
                modalEliminar={modalEliminar}
                onCloseModalEliminar={onCloseModalEliminar}
                onConfirmarEliminar={onConfirmarEliminar}
                dreamteamId={dreamteamId}
                isEliminando={isEliminando}
                errorEliminar={errorEliminar}
            />
        </div>
    );
};

