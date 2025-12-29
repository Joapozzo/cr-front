"use client";
import React from 'react';
import { Sancion } from '@/app/types/sancion';
import { BaseModal } from '../modals/ModalAdmin';
import { Button } from '../ui/Button';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface ModalConfirmarEliminarProps {
    sancion: Sancion | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
}

export default function ModalConfirmarEliminar({
    sancion,
    onClose,
    onConfirm,
    isLoading = false
}: ModalConfirmarEliminarProps) {
    if (!sancion) return null;

    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <BaseModal
            isOpen={!!sancion}
            onClose={onClose}
            title="Revocar Sanción"
            type="delete"
        >
            <div className="space-y-4">
                <p className="text-[var(--gray-100)]">
                    ¿Estás seguro de que deseas revocar esta sanción?
                </p>

                <div className="bg-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-sm text-[var(--gray-100)] mb-2">Jugador</p>
                    <p className="text-[var(--white)] font-semibold">
                        {sancion.jugador?.usuario?.nombre} {sancion.jugador?.usuario?.apellido}
                    </p>
                    <p className="text-xs text-[var(--gray-100)] mt-2">
                        Fechas restantes: {sancion.fechas_restantes || 0}
                    </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-red-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Esta acción revocará la sanción y el jugador quedará habilitado para jugar.</span>
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <Button onClick={onClose} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    variant="danger"
                    className="flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Revocando...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Revocar Sanción
                        </>
                    )}
                </Button>
            </div>
        </BaseModal>
    );
}
