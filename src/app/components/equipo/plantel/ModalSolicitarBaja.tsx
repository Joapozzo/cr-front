'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { BaseModal } from '@/app/components/modals/ModalAdmin';

interface ModalSolicitarBajaProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (motivo?: string, observaciones?: string) => Promise<void>;
    jugadorNombre: string;
    esPropiaBaja: boolean;
    isLoading?: boolean;
}

export const ModalSolicitarBaja: React.FC<ModalSolicitarBajaProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jugadorNombre,
    esPropiaBaja,
    isLoading = false
}) => {
    const [motivo, setMotivo] = useState('');
    const [observaciones, setObservaciones] = useState('');

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setMotivo('');
            setObservaciones('');
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        await onConfirm(motivo.trim() || undefined, observaciones.trim() || undefined);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={esPropiaBaja ? 'Solicitar darse de baja' : 'Solicitar baja de jugador'}
            type="delete"
            maxWidth="max-w-md"
        >
            <div className="space-y-4">
                {/* Información */}
                <div className="bg-[var(--black-900)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <p className="text-[var(--gray-100)] text-sm mb-2">
                        {esPropiaBaja 
                            ? 'Estás a punto de solicitar darte de baja del equipo. Esta solicitud será revisada por un administrador.'
                            : `Estás a punto de solicitar la baja de ${jugadorNombre}. Esta solicitud será revisada por un administrador.`
                        }
                    </p>
                    <p className="text-[var(--white)] font-medium text-sm">
                        {esPropiaBaja ? 'Jugador:' : 'Jugador a dar de baja:'} <span className="text-[var(--color-secondary)]">{jugadorNombre}</span>
                    </p>
                </div>

                {/* Motivo */}
                <div>
                    <label className="block text-sm font-light text-[var(--white)] mb-2">
                        Motivo <span className="text-[var(--gray-100)] text-xs">(opcional)</span>
                    </label>
                    <Input
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Ej: Cambio de equipo, lesión, etc."
                        maxLength={200}
                    />
                    <p className="text-[var(--gray-100)] text-xs mt-1">
                        {motivo.length}/200 caracteres
                    </p>
                </div>

                {/* Observaciones */}
                <div>
                    <label className="block text-sm font-light text-[var(--white)] mb-2">
                        Observaciones <span className="text-[var(--gray-100)] text-xs">(opcional)</span>
                    </label>
                    <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Información adicional sobre la solicitud..."
                        className="w-full px-4 py-3 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] placeholder-[var(--gray-100)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-[var(--gray-100)] text-xs mt-1">
                        {observaciones.length}/500 caracteres
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
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            'Enviar solicitud'
                        )}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

