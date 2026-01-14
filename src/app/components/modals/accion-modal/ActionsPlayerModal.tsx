"use client";

import { PiSoccerBall } from "react-icons/pi";
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { useAccionModalState } from "./hooks/useAccionModalState";
import { useAccionModalEffects } from "./hooks/useAccionModalEffects";
import { useAccionModalHandlers } from "./hooks/useAccionModalHandlers";
import { useAccionModalHelpers } from "./hooks/useAccionModalHelpers";
import { AccionSelectorModal } from "./components/AccionSelectorModal";
import { AccionModalsFlow } from "./components/AccionModalsFlow";
import { AccionModalProps, ActionItem } from "./types";

const AccionModal: React.FC<AccionModalProps> = ({
    isOpen,
    onClose,
    jugador,
    idPartido,
    idCategoriaEdicion,
    idEquipo,
    accionToEdit,
    isEditing = false,
}) => {
    const {
        currentStep,
        setCurrentStep,
        selectedAction,
        setSelectedAction,
        golData,
        setGolData,
        motivoExpulsion,
        setMotivoExpulsion,
        resetModal
    } = useAccionModalState();

    const helpers = useAccionModalHelpers({ jugador, accionToEdit });

    useAccionModalEffects({
        isOpen,
        isEditing,
        accionToEdit,
        setCurrentStep,
        setSelectedAction,
        setGolData,
        setMotivoExpulsion,
        resetModal
    });

    const {
        handleActionSelect,
        handleGolOptionsSubmit,
        handleExpulsionOptionsSubmit,
        handleMinutoSubmit,
        handleClose,
        handleBackToAction,
        isPending
    } = useAccionModalHandlers({
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
        getActionLabel: helpers.getActionLabel
    });

    const actions: readonly ActionItem[] = [
        {
            id: 'gol',
            label: 'Gol',
            icon: <PiSoccerBall className="w-5 h-5 text-[var(--color-primary)]" />
        },
        {
            id: 'amarilla',
            label: 'Tarjeta amarilla',
            icon: <TbRectangleVerticalFilled className="w-5 h-5 text-yellow-400" />
        },
        {
            id: 'roja',
            label: 'Tarjeta roja',
            icon: <TbRectangleVerticalFilled className="w-5 h-5 text-red-400" />
        }
    ] as const;

    return (
        <>
            <AccionSelectorModal
                isOpen={isOpen && currentStep === 'accion' && !isEditing}
                onClose={handleClose}
                jugador={helpers.getCurrentJugador()}
                minutoActual={helpers.getMinutoActual()}
                actions={actions}
                selectedAction={selectedAction}
                onSelectAction={setSelectedAction}
                onNext={handleActionSelect}
            />
            <AccionModalsFlow
                currentStep={currentStep}
                selectedAction={selectedAction}
                jugador={helpers.getCurrentJugador()}
                idEquipo={idEquipo}
                accionToEdit={accionToEdit}
                isEditing={isEditing}
                minutoActual={helpers.getMinutoActual()}
                isPending={isPending}
                onGolOptionsSubmit={handleGolOptionsSubmit}
                onExpulsionOptionsSubmit={handleExpulsionOptionsSubmit}
                onMinutoSubmit={handleMinutoSubmit}
                onBack={handleBackToAction}
                onClose={onClose}
            />
        </>
    );
};

export default AccionModal;

