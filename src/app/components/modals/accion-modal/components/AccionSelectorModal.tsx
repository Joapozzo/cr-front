import BaseModal from "../../ModalPlanillero";
import { Save } from "lucide-react";
import { Button } from "../../../ui/Button";
import { AccionStepIndicator } from "./AccionStepIndicator";
import { AccionList } from "./AccionList";
import { ActionItem, ActionType, JugadorInfo } from "../types";

interface AccionSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: JugadorInfo;
    minutoActual: number;
    actions: readonly ActionItem[];
    selectedAction: ActionType | null;
    onSelectAction: (action: ActionType) => void;
    onNext: () => void;
}

export const AccionSelectorModal = ({
    isOpen,
    onClose,
    jugador,
    minutoActual,
    actions,
    selectedAction,
    onSelectAction,
    onNext
}: AccionSelectorModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center justify-between w-full">
                    <span>Registrar acción</span>
                    <AccionStepIndicator />
                </div>
            }
            actions={
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="default"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={!selectedAction}
                        variant="success"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        <Save size={16} />
                        Siguiente
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Jugador: {jugador.apellido.toUpperCase()}, {jugador.nombre}
                        {jugador.dorsal && ` (#${jugador.dorsal})`}
                    </label>
                    <div className="text-xs text-[#737373] mb-4">
                        Minuto del partido: {minutoActual}&apos;
                    </div>
                    <label className="block text-sm font-medium text-[#737373] mb-3">
                        Selecciona una acción:
                    </label>
                    <AccionList
                        actions={actions}
                        selectedAction={selectedAction}
                        onSelect={onSelectAction}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

