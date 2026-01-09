import ModalSeleccionarJugador from '../../modals/ModalSeleccionarJugador';
import ModalDeletePlayerDt from '../../modals/ModalDeletePlayerDt';
import { JugadorDestacadoDt } from '@/app/types/jugador';

interface DreamTeamModalsProps {
    // Modal seleccionar jugador
    modalJugador: {
        isOpen: boolean;
        posicionIndex: string;
        posicionesIds: number[];
        posicionNombre: string;
    };
    onCloseModalJugador: () => void;
    onSeleccionarJugador: (jugador: JugadorDestacadoDt) => Promise<void>;
    jornada: number;
    isAgregando: boolean;

    // Modal eliminar jugador
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
    onCloseModalEliminar: () => void;
    onConfirmarEliminar: (idDreamteam: number, idPartido: number, idJugador: number) => Promise<void>;
    dreamteamId: number;
    isEliminando: boolean;
    errorEliminar: any;
}

/**
 * Componente presentacional que agrupa todos los modales
 */
export const DreamTeamModals = ({
    modalJugador,
    onCloseModalJugador,
    onSeleccionarJugador,
    jornada,
    isAgregando,
    modalEliminar,
    onCloseModalEliminar,
    onConfirmarEliminar,
    dreamteamId,
    isEliminando,
    errorEliminar,
}: DreamTeamModalsProps) => {
    return (
        <>
            <ModalSeleccionarJugador
                isOpen={modalJugador.isOpen}
                onClose={onCloseModalJugador}
                posicion={modalJugador.posicionNombre}
                posicionesIds={modalJugador.posicionesIds}
                onSeleccionar={onSeleccionarJugador}
                jornada={jornada}
                isPending={isAgregando}
            />

            <ModalDeletePlayerDt
                isOpen={modalEliminar.isOpen}
                onClose={onCloseModalEliminar}
                jugador={modalEliminar.jugador}
                dreamteamId={dreamteamId}
                onConfirm={onConfirmarEliminar}
                isPending={isEliminando}
                error={errorEliminar}
            />
        </>
    );
};

