'use client';

import { useState, useEffect } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { BaseModal } from '@/app/components/modals/ModalAdmin';

interface ModalDarBajaJugadorProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    jugadorNombre: string;
    isLoading?: boolean;
}

export const ModalDarBajaJugador: React.FC<ModalDarBajaJugadorProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jugadorNombre,
    isLoading = false
}) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Dar de baja jugador del plantel"
            type="delete"
            maxWidth="max-w-md"
        >
            <div className="space-y-4">
                {/* Información */}
                <div className="bg-[var(--black-900)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <p className="text-[var(--gray-100)] text-sm mb-2">
                        Estás a punto de dar de baja a <span className="text-[var(--white)] font-medium">{jugadorNombre}</span> del plantel.
                    </p>
                    <p className="text-[var(--gray-100)] text-sm">
                        El jugador será removido del equipo pero podrá ser agregado nuevamente en el futuro.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-300)]">
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                Dar de baja
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

