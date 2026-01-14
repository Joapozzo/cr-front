import { useCrearGol, useCrearAmonestacion, useCrearExpulsion } from "@/app/hooks/useIncidentsCreate";
import { useEditarGol, useEditarAmonestacion, useEditarExpulsion } from "@/app/hooks/useIncidentsEditDelete";
import { IncidenciaPartido } from "@/app/types/partido";
import { ModalStep, ActionType, GolData, JugadorInfo } from "../types";
import toast from "react-hot-toast";

interface UseAccionModalHandlersProps {
    idPartido: number;
    idCategoriaEdicion: number;
    idEquipo: number;
    jugador?: JugadorInfo;
    accionToEdit?: IncidenciaPartido;
    isEditing: boolean;
    selectedAction: ActionType | null;
    golData: GolData | null;
    motivoExpulsion: string;
    setCurrentStep: (step: ModalStep) => void;
    setSelectedAction: (action: ActionType | null) => void;
    setGolData: (data: GolData | null) => void;
    setMotivoExpulsion: (motivo: string) => void;
    resetModal: () => void;
    onClose: () => void;
    getActionLabel: (action: ActionType) => string;
}

export const useAccionModalHandlers = ({
    idPartido,
    idCategoriaEdicion,
    idEquipo,
    jugador,
    accionToEdit,
    isEditing,
    selectedAction,
    golData,
    motivoExpulsion,
    setCurrentStep,
    setSelectedAction,
    setGolData,
    setMotivoExpulsion,
    resetModal,
    onClose,
    getActionLabel
}: UseAccionModalHandlersProps) => {
    const { mutateAsync: crearGol, isPending: isCreatingGol } = useCrearGol();
    const { mutateAsync: crearAmonestacion, isPending: isCreatingAmonestacion } = useCrearAmonestacion();
    const { mutateAsync: crearExpulsion, isPending: isCreatingExpulsion } = useCrearExpulsion();

    const { mutateAsync: editarGol, isPending: isEditingGol } = useEditarGol();
    const { mutateAsync: editarAmonestacion, isPending: isEditingAmonestacion } = useEditarAmonestacion();
    const { mutateAsync: editarExpulsion, isPending: isEditingExpulsion } = useEditarExpulsion();

    const handleActionSelect = () => {
        if (!selectedAction) return;

        switch (selectedAction) {
            case 'gol':
                setCurrentStep('gol-opciones');
                break;
            case 'roja':
                setCurrentStep('expulsion-opciones');
                break;
            case 'amarilla':
                setCurrentStep('minuto');
                break;
        }
    };

    const handleGolOptionsSubmit = (data: GolData) => {
        setGolData(data);
        setCurrentStep('minuto');
    };

    const handleExpulsionOptionsSubmit = (motivo: string) => {
        setMotivoExpulsion(motivo);
        setCurrentStep('minuto');
    };

    const handleMinutoSubmit = async (minuto: number) => {
        try {
            let response;

            if (isEditing && accionToEdit) {
                switch (selectedAction) {
                    case 'gol':
                        if (!golData) return;
                        response = await editarGol({
                            idGol: accionToEdit.id,
                            idPartido,
                            golData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: accionToEdit.id_equipo || 0,
                                id_jugador: accionToEdit.id_jugador || 0,
                                minuto,
                                ...golData
                            }
                        });
                        break;
                    case 'amarilla':
                        response = await editarAmonestacion({
                            idAmonestacion: accionToEdit.id,
                            idPartido,
                            amonestacionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: accionToEdit.id_equipo || 0,
                                id_jugador: accionToEdit.id_jugador || 0,
                                minuto
                            }
                        });
                        break;
                    case 'roja':
                        response = await editarExpulsion({
                            idExpulsion: accionToEdit.id,
                            idPartido,
                            expulsionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: accionToEdit.id_equipo || 0,
                                id_jugador: accionToEdit.id_jugador || 0,
                                minuto,
                                motivo: motivoExpulsion
                            }
                        });
                        break;
                }

                if (response) {
                    const responseMessage = typeof response === 'object' && response !== null && 'message' in response 
                        ? (response as { message?: string }).message 
                        : undefined;
                    toast.success(responseMessage || `${getActionLabel(selectedAction!)} editado correctamente`);
                }
            } else {
                switch (selectedAction) {
                    case 'gol':
                        if (!golData || !jugador) return;
                        response = await crearGol({
                            idPartido,
                            golData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: idEquipo,
                                id_jugador: jugador.id,
                                minuto,
                                ...golData
                            }
                        });
                        break;

                    case 'amarilla':
                        if (!jugador) return;
                        response = await crearAmonestacion({
                            idPartido,
                            amonestacionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: idEquipo,
                                id_jugador: jugador.id,
                                minuto
                            }
                        });
                        break;

                    case 'roja':
                        if (!jugador) return;
                        response = await crearExpulsion({
                            idPartido,
                            expulsionData: {
                                id_categoria_edicion: idCategoriaEdicion,
                                id_equipo: idEquipo,
                                id_jugador: jugador.id,
                                minuto,
                                motivo: motivoExpulsion
                            }
                        });
                        break;
                }

                if (response) {
                    const responseMessage = typeof response === 'object' && response !== null && 'message' in response 
                        ? (response as { message?: string }).message 
                        : undefined;
                    toast.success(responseMessage || `${getActionLabel(selectedAction!)} registrado correctamente`);
                }
            }

            handleClose();

        } catch (error) {
            const errorObj = error as { response?: { data?: { error?: string } }; message?: string };
            const errorMessage = errorObj?.response?.data?.error || errorObj?.message || 'Error al procesar la acción';
            toast.error(errorMessage);
        }
    };

    const computedIsPending = isCreatingGol || isCreatingAmonestacion || isCreatingExpulsion ||
        isEditingGol || isEditingAmonestacion || isEditingExpulsion;

    const handleClose = () => {
        if (computedIsPending) return;
        resetModal();
        onClose();
    };

    const handleBackToAction = () => {
        if (isEditing) {
            handleClose();
        } else {
            setCurrentStep('accion');
            setSelectedAction('gol');
            setGolData(null);
            setMotivoExpulsion('');
        }
    };

    return {
        handleActionSelect,
        handleGolOptionsSubmit,
        handleExpulsionOptionsSubmit,
        handleMinutoSubmit,
        handleClose,
        handleBackToAction,
        isPending: computedIsPending
    };
};

