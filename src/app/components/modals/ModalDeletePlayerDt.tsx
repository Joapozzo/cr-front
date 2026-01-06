import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { BaseModal } from "./ModalAdmin";

interface DeleteDreamTeamPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: {
        id_jugador: number;
        id_partido: number;
        nombre: string;
        apellido: string;
        equipo?: string;
    } | null;
    dreamteamId: number;
    onConfirm: (idDreamteam: number, idPartido: number, idJugador: number) => Promise<void>;
    isPending: boolean;
    error: any;
}

const ModalDeletePlayerDt = ({ 
    isOpen, 
    onClose, 
    jugador, 
    dreamteamId,
    onConfirm, 
    isPending,
    error 
}: DeleteDreamTeamPlayerModalProps) => {
    const handleConfirm = async () => {
        if (!jugador) return;
        
        try {
            await onConfirm(dreamteamId, jugador.id_partido, jugador.id_jugador);
            onClose();
        } catch (error) {
            console.error('Error al eliminar jugador del DreamTeam:', error);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Eliminar Jugador del DreamTeam" type="delete">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-[var(--color-secondary)] flex-shrink-0" />
                    <div>
                        <p className="text-[var(--white)] font-medium">
                            ¿Estás seguro de eliminar este jugador del DreamTeam?
                        </p>
                        {jugador && (
                            <div className="text-[var(--gray-100)] text-sm mt-2 space-y-1">
                                <p>Jugador: <span className="font-medium">{jugador.nombre} {jugador.apellido}</span></p>
                                {jugador.equipo && (
                                    <p>Equipo: <span className="font-medium">{jugador.equipo}</span></p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mostrar error si existe */}
                {error && (
                    <div className="mb-4">
                        <div className="bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0" />
                                <p className="text-[var(--color-secondary)] text-sm">
                                    {error.message || 'Error al eliminar el jugador'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-[var(--gray-100)] text-sm">
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--gray-300)] text-[var(--white)] rounded-lg hover:bg-[var(--gray-200)] transition-colors"
                    disabled={isPending}
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isPending || !jugador}
                    className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin"/>
                            Eliminando...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </>
                    )}
                </button>
            </div>
        </BaseModal>
    );
};

export default ModalDeletePlayerDt;