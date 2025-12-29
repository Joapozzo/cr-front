"use client";

import AccionModal from "@/app/components/modals/ActionsPlayerModal";
import DorsalModal from "@/app/components/modals/DorsalModal";
import ConfirmDeleteModal from "@/app/components/modals/ConfirmDeleteModal";
import { usePartidoModals } from "@/app/hooks/usePartidoModals";

interface PartidoModalsProps {
    modals: ReturnType<typeof usePartidoModals>;
    datosPartido: any; // Tipear según tu interface
    onLoadingChange: (isLoading: boolean, jugadorId: number) => void;
    onConfirmDelete: (jugadorId: number) => void;
    isDeleting: boolean;
}

const PartidoModals = ({
    modals,
    datosPartido,
    onLoadingChange,
    onConfirmDelete,
    isDeleting
}: PartidoModalsProps) => {
    if (!modals.selectedJugador) return null;

    return (
        <>
            <DorsalModal
                isOpen={modals.dorsalModalOpen}
                onClose={modals.closeAllModals}
                jugador={modals.selectedJugador}
                idPartido={Number(datosPartido?.partido.id_partido)}
                idCategoriaEdicion={Number(datosPartido?.partido.id_categoria_edicion)}
                onLoadingChange={onLoadingChange}
            />

            <AccionModal
                isOpen={modals.accionModalOpen}
                onClose={modals.closeAllModals}
                jugador={{
                    id: modals.selectedJugador.id_jugador,
                    nombre: modals.selectedJugador.nombre,
                    apellido: modals.selectedJugador.apellido,
                    dorsal: modals.selectedJugador.dorsal
                }}
                idPartido={Number(datosPartido?.partido.id_partido)}
                idCategoriaEdicion={Number(datosPartido?.partido.id_categoria_edicion)}
                idEquipo={modals.selectedJugador.id_equipo}
                accionToEdit={modals.accionToEdit || undefined}
                isEditing={modals.isEditingAction}
            />

            <ConfirmDeleteModal
                isOpen={modals.confirmDeleteModalOpen}
                onClose={modals.closeAllModals}
                jugador={modals.selectedJugador}
                onConfirm={onConfirmDelete}
                isLoading={isDeleting}
            />
        </>
    );
};

export default PartidoModals;