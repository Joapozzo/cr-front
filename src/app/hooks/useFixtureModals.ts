import { useState } from 'react';
import { PartidoResponse } from '@/app/schemas/partidos.schema';
import { useModals } from '@/app/components/modals/ModalAdmin';

interface UseFixtureModalsReturn {
    modals: ReturnType<typeof useModals>['modals'];
    openModal: ReturnType<typeof useModals>['openModal'];
    closeModal: ReturnType<typeof useModals>['closeModal'];
    partidoAEliminar: PartidoResponse | null;
    partidoAEditar: PartidoResponse | null;
    partidoDescripcion: PartidoResponse | null;
    setPartidoAEliminar: (partido: PartidoResponse | null) => void;
    setPartidoAEditar: (partido: PartidoResponse | null) => void;
    setPartidoDescripcion: (partido: PartidoResponse | null) => void;
    handleEliminarPartido: (partido: PartidoResponse) => void;
    handleEditarPartido: (partido: PartidoResponse) => void;
    handleVerDescripcion: (partido: PartidoResponse) => void;
    closeEditModal: () => void;
    closeDeleteModal: () => void;
    closeInfoModal: () => void;
}

/**
 * Hook para centralizar el estado y manejo de modales del fixture
 */
export const useFixtureModals = (): UseFixtureModalsReturn => {
    const { modals, openModal, closeModal } = useModals();
    const [partidoAEliminar, setPartidoAEliminar] = useState<PartidoResponse | null>(null);
    const [partidoAEditar, setPartidoAEditar] = useState<PartidoResponse | null>(null);
    const [partidoDescripcion, setPartidoDescripcion] = useState<PartidoResponse | null>(null);

    const handleEliminarPartido = (partido: PartidoResponse) => {
        setPartidoAEliminar(partido);
        openModal('delete');
    };

    const handleEditarPartido = (partido: PartidoResponse) => {
        setPartidoAEditar(partido);
        openModal('edit');
    };

    const handleVerDescripcion = (partido: PartidoResponse) => {
        setPartidoDescripcion(partido);
        openModal('info');
    };

    const closeEditModal = () => {
        closeModal('edit');
        setPartidoAEditar(null);
    };

    const closeDeleteModal = () => {
        closeModal('delete');
        setPartidoAEliminar(null);
    };

    const closeInfoModal = () => {
        closeModal('info');
        setPartidoDescripcion(null);
    };

    return {
        modals,
        openModal,
        closeModal,
        partidoAEliminar,
        partidoAEditar,
        partidoDescripcion,
        setPartidoAEliminar,
        setPartidoAEditar,
        setPartidoDescripcion,
        handleEliminarPartido,
        handleEditarPartido,
        handleVerDescripcion,
        closeEditModal,
        closeDeleteModal,
        closeInfoModal,
    };
};

