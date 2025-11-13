import { Partido } from "@/app/types/partido";
import { Button } from "../ui/Button";
import { BaseModal } from "./ModalAdmin";

interface DescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    partido: Partido | null;
}

const DescriptionModal = ({ isOpen, onClose, partido }: DescriptionModalProps) => {
    if (!partido) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Descripción del Partido"
            type="info"
            maxWidth="max-w-lg"
        >
            <div className="space-y-4">
                {/* Info del partido */}
                <div className="bg-[var(--gray-500)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[var(--white)] font-medium">
                            {partido.equipoLocal?.nombre} vs {partido.equipoVisita?.nombre}
                        </span>
                        <span className="text-[var(--gray-100)] text-sm">
                            Fecha {partido.jornada}
                        </span>
                    </div>
                    <p className="text-[var(--gray-100)] text-sm">
                        {new Date(partido.dia).toLocaleDateString("es-ES")} - {partido.hora}
                    </p>
                </div>

                {/* Descripción */}
                <div>
                    <h3 className="text-[var(--white)] font-medium mb-3">Descripción</h3>
                    {partido.descripcion ? (
                        <div className="rounded-lg py-4 text-center">
                            <p className="text-[var(--gray-100)] italic">
                                {partido.descripcion}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg py-4 text-center">
                            <p className="text-[var(--gray-100)] italic">
                                No hay descripción disponible para este partido
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-[var(--gray-300)]">
                <Button onClick={onClose} variant="default">
                    Cerrar
                </Button>
            </div>
        </BaseModal>
    );
};

export default DescriptionModal;