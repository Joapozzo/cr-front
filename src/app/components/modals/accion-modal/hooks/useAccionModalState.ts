import { useState } from "react";
import { ModalStep, ActionType, GolData } from "../types";

export const useAccionModalState = () => {
    const [currentStep, setCurrentStep] = useState<ModalStep>('accion');
    const [selectedAction, setSelectedAction] = useState<ActionType | null>('gol');
    const [golData, setGolData] = useState<GolData | null>(null);
    const [motivoExpulsion, setMotivoExpulsion] = useState<string>('');

    const resetModal = () => {
        setCurrentStep('accion');
        setSelectedAction('gol');
        setGolData(null);
        setMotivoExpulsion('');
    };

    return {
        currentStep,
        setCurrentStep,
        selectedAction,
        setSelectedAction,
        golData,
        setGolData,
        motivoExpulsion,
        setMotivoExpulsion,
        resetModal
    };
};

