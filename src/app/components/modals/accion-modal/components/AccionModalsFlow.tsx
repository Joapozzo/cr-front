import GolModal from "../../GolModal";
import ExpulsionModal from "../../ExpulsionModal";
import MinutoModal from "../../MinutoModal";
import { ModalStep, ActionType, JugadorInfo, GolData } from "../types";
import { IncidenciaPartido } from "@/app/types/partido";

interface AccionModalsFlowProps {
    currentStep: ModalStep;
    selectedAction: ActionType | null;
    jugador: JugadorInfo;
    idEquipo: number;
    accionToEdit?: IncidenciaPartido;
    isEditing: boolean;
    minutoActual: number;
    isPending: boolean;
    onGolOptionsSubmit: (data: GolData) => void;
    onExpulsionOptionsSubmit: (motivo: string) => void;
    onMinutoSubmit: (minuto: number) => Promise<void>;
    onBack: () => void;
    onClose: () => void;
}

export const AccionModalsFlow = ({
    currentStep,
    selectedAction,
    jugador,
    idEquipo,
    accionToEdit,
    isEditing,
    minutoActual,
    isPending,
    onGolOptionsSubmit,
    onExpulsionOptionsSubmit,
    onMinutoSubmit,
    onBack,
    onClose
}: AccionModalsFlowProps) => {
    return (
        <>
            <GolModal
                isOpen={currentStep === 'gol-opciones'}
                onClose={onClose}
                jugador={jugador}
                onSubmit={onGolOptionsSubmit}
                idEquipo={idEquipo}
                onBack={onBack}
            />

            <ExpulsionModal
                isOpen={currentStep === 'expulsion-opciones'}
                onClose={onBack}
                jugador={jugador}
                onSubmit={onExpulsionOptionsSubmit}
                onBack={onBack}
            />

            <MinutoModal
                isOpen={currentStep === 'minuto'}
                onClose={onClose}
                onBack={onBack}
                jugador={jugador}
                tipoAccion={selectedAction!}
                onSubmit={onMinutoSubmit}
                minutoPartido={isEditing ? accionToEdit?.minuto || minutoActual : minutoActual}
                isLoading={isPending}
                isEditing={isEditing}
            />
        </>
    );
};

