import { useEffect, useRef } from "react";
import { IncidenciaPartido } from "@/app/types/partido";
import { ModalStep, ActionType, GolData } from "../types";

interface UseAccionModalEffectsProps {
    isOpen: boolean;
    isEditing: boolean;
    accionToEdit?: IncidenciaPartido;
    setCurrentStep: (step: ModalStep) => void;
    setSelectedAction: (action: ActionType | null) => void;
    setGolData: (data: GolData | null) => void;
    setMotivoExpulsion: (motivo: string) => void;
    resetModal: () => void;
}

export const useAccionModalEffects = ({
    isOpen,
    isEditing,
    accionToEdit,
    setCurrentStep,
    setSelectedAction,
    setGolData,
    setMotivoExpulsion,
    resetModal
}: UseAccionModalEffectsProps) => {
    const prevIsOpenRef = useRef(false);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        const isOpening = isOpen && !prevIsOpenRef.current;
        
        if (isOpening) {
            hasInitializedRef.current = true;
            
            if (isEditing && accionToEdit) {
                const tipoAccion = accionToEdit.tipo === 'doble_amarilla' ? 'roja' : accionToEdit.tipo as ActionType;
                setSelectedAction(tipoAccion);

                switch (accionToEdit.tipo) {
                    case 'gol':
                        setCurrentStep('gol-opciones');
                        setGolData({
                            penal: accionToEdit.penal || "N",
                            en_contra: accionToEdit.en_contra || "N",
                            asistencia: "N",
                            id_jugador_asistencia: undefined
                        });
                        break;
                    case 'roja':
                    case 'doble_amarilla':
                        setCurrentStep('expulsion-opciones');
                        setMotivoExpulsion(accionToEdit.observaciones || accionToEdit.tipo_tarjeta || '');
                        break;
                    case 'amarilla':
                        setCurrentStep('minuto');
                        break;
                }
            } else {
                resetModal();
            }
        }
        
        if (!isOpen) {
            hasInitializedRef.current = false;
        }
        
        prevIsOpenRef.current = isOpen;
    }, [isOpen, isEditing, accionToEdit, resetModal, setCurrentStep, setGolData, setMotivoExpulsion, setSelectedAction]);
};

