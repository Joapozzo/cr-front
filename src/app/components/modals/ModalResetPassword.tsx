'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { UsuarioAdmin } from '@/app/types/user';

interface ModalResetPasswordProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: UsuarioAdmin | null;
    nuevaPassword: string | null;
    onCopyPassword: () => void;
    passwordCopied: boolean;
}

export default function ModalResetPassword({
    isOpen,
    onClose,
    usuario,
    nuevaPassword,
    onCopyPassword,
    passwordCopied,
}: ModalResetPasswordProps) {
    if (!isOpen || !usuario) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] w-full max-w-md z-[10000]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
                    <h2 className="text-xl font-semibold text-white">Contraseña Regenerada</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--gray-200)] hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-[var(--gray-200)]">
                            Se ha generado una nueva contraseña para:
                        </p>
                        <p className="text-base font-medium text-white">
                            {usuario.nombre} {usuario.apellido}
                        </p>
                        <p className="text-sm text-[var(--gray-200)]">
                            {usuario.email}
                        </p>
                    </div>

                    {nuevaPassword && (
                        <div className="space-y-3">
                            <div className="p-4 bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-lg">
                                <p className="text-sm text-[var(--green)] font-medium mb-2">
                                    Nueva Contraseña:
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-base text-[var(--white)] font-mono break-all flex-1">
                                        {nuevaPassword}
                                    </p>
                                    <button
                                        onClick={onCopyPassword}
                                        className="p-2 hover:bg-[var(--gray-300)] rounded transition-colors flex-shrink-0"
                                        title="Copiar contraseña"
                                    >
                                        {passwordCopied ? (
                                            <Check className="w-5 h-5 text-[var(--green)]" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-[var(--gray-200)]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-3">
                                <p className="text-xs text-[var(--yellow)]">
                                    ⚠️ Importante: Copia esta contraseña y compártela de forma segura con el usuario. 
                                    No podrás verla nuevamente.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--gray-300)]">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

