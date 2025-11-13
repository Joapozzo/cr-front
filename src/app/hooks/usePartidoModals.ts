import { useState } from 'react';
import { JugadorPlantel, IncidenciaPartido } from '@/app/types/partido';

export const usePartidoModals = () => {
    const [dorsalModalOpen, setDorsalModalOpen] = useState(false);
    const [accionModalOpen, setAccionModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [selectedJugador, setSelectedJugador] = useState<JugadorPlantel | null>(null);
    const [accionToEdit, setAccionToEdit] = useState<IncidenciaPartido | null>(null);
    const [isEditingAction, setIsEditingAction] = useState(false);

    const openDorsalModal = (jugador: JugadorPlantel) => {
        setSelectedJugador(jugador);
        setDorsalModalOpen(true);
    };

    const openAccionModal = (jugador: JugadorPlantel, accion?: IncidenciaPartido) => {
        setSelectedJugador(jugador);
        setAccionToEdit(accion || null);
        setIsEditingAction(!!accion);
        setAccionModalOpen(true);
    };

    const openDeleteModal = (jugador: JugadorPlantel) => {
        setSelectedJugador(jugador);
        setConfirmDeleteModalOpen(true);
    };

    const closeAllModals = () => {
        setDorsalModalOpen(false);
        setAccionModalOpen(false);
        setConfirmDeleteModalOpen(false);
        setTimeout(() => {
            setSelectedJugador(null);
            setAccionToEdit(null);
            setIsEditingAction(false);
        }, 200);
    };

    return {
        // Estados
        dorsalModalOpen,
        accionModalOpen,
        confirmDeleteModalOpen,
        selectedJugador,
        accionToEdit,
        isEditingAction,
        // Acciones
        openDorsalModal,
        openAccionModal,
        openDeleteModal,
        closeAllModals,
        setSelectedJugador
    };
};