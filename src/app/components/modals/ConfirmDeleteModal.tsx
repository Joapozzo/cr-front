"use client";
import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { JugadorPlantel } from "@/app/types/partido";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: JugadorPlantel;
    onConfirm: (jugadorId: number) => void;
    isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    jugador,
    onConfirm,
    isLoading = false
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else if (isVisible) {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 200);
        }
    }, [isOpen, isVisible]);

    const handleClose = () => {
        if (isLoading) return; // No cerrar si está cargando
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 200);
    };

    const handleConfirm = () => {
        onConfirm(jugador.id_jugador);
    };

    if (!isVisible) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            handleClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleOverlayClick}
        >
            <div className={`bg-[#0a0a0a] rounded-2xl border border-[#262626] w-full max-w-md transition-all duration-300 ${isAnimating
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--color-secondary-500)]/10 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-secondary-400)]" />
                        </div>
                        <h3 className="text-white font-bold text-lg">Eliminar Dorsal</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-[#262626] rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5 text-[#737373]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-16 h-16 bg-[var(--color-secondary-500)]/10 rounded-full flex items-center justify-center">
                            <Trash2 className="w-8 h-8 text-[var(--color-secondary-400)]" />
                        </div>

                        <div>
                            <p className="text-white font-medium text-base mb-2">
                                ¿Estás seguro que quieres eliminar el dorsal?
                            </p>
                            <div className="bg-[#171717] border border-[#262626] rounded-lg p-3">
                                <p className="text-[#737373] text-sm">
                                    Jugador: <span className="text-white font-medium">
                                        {jugador.apellido.toUpperCase()}, {jugador.nombre}
                                    </span>
                                </p>
                                <p className="text-[#737373] text-sm">
                                    Dorsal: <span className="text-[var(--color-primary)] font-bold">
                                        #{jugador.dorsal}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <p className="text-[#737373] text-sm">
                            Esta acción eliminará la asignación del dorsal. El jugador podrá ser reasignado posteriormente.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-0">
                    <div className="flex gap-3">
                        <Button
                            onClick={handleClose}
                            variant="default"
                            className="flex items-center gap-2 w-full justify-center"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant="danger"
                            className="flex items-center gap-2 w-full justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Eliminar Dorsal
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;