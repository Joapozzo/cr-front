'use client';

import { useState, useEffect } from 'react';
import { Ban, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { BaseModal } from '@/app/components/modals/ModalAdmin';

interface ModalExpulsarJugadorProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (motivo?: string) => Promise<void>;
    jugadorNombre: string;
    isLoading?: boolean;
    esExpulsado?: boolean; // Si es true, muestra opción de reactivar
}

export const ModalExpulsarJugador: React.FC<ModalExpulsarJugadorProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jugadorNombre,
    isLoading = false,
    esExpulsado = false
}) => {
    const [motivo, setMotivo] = useState('');

    // Limpiar formulario cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setMotivo('');
        }
    }, [isOpen]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={esExpulsado ? 'Reactivar jugador en el torneo' : 'Expulsar jugador del torneo'}
            type={esExpulsado ? 'edit' : 'delete'}
            maxWidth="max-w-md"
        >
            <div className="space-y-4">
                {/* Información */}
                <div className="bg-[var(--black-900)] rounded-lg p-4 border border-[var(--gray-300)]">
                    {esExpulsado ? (
                        <>
                            <p className="text-[var(--gray-100)] text-sm mb-2">
                                Estás a punto de reactivar a <span className="text-[var(--white)] font-medium">{jugadorNombre}</span> en el torneo.
                            </p>
                            <p className="text-[var(--gray-100)] text-sm">
                                El jugador podrá volver a recibir invitaciones, enviar solicitudes y ser agregado a equipos.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-[var(--gray-100)] text-sm mb-2">
                                Estás a punto de expulsar permanentemente a <span className="text-[var(--white)] font-medium">{jugadorNombre}</span> del torneo.
                            </p>
                            <p className="text-[var(--red)] text-sm font-medium mb-2">
                                ⚠️ Esta acción es permanente y el jugador no podrá:
                            </p>
                            <ul className="text-[var(--gray-100)] text-sm list-disc list-inside space-y-1">
                                <li>Recibir invitaciones de equipos</li>
                                <li>Enviar solicitudes a equipos</li>
                                <li>Ser agregado a ningún equipo</li>
                            </ul>
                            <p className="text-[var(--gray-100)] text-sm mt-2">
                                Solo un administrador puede revertir esta acción.
                            </p>
                        </>
                    )}
                </div>

                {/* Motivo (solo si no está expulsado) */}
                {!esExpulsado && (
                    <div>
                        <label className="block text-sm font-light text-[var(--white)] mb-2">
                            Motivo de la expulsión <span className="text-[var(--gray-100)] text-xs">(opcional)</span>
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Conducta antideportiva, incumplimiento de reglas, etc."
                            className="w-full px-4 py-3 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] placeholder-[var(--gray-100)] focus:outline-none focus:border-[var(--green)] transition-colors resize-none"
                            rows={3}
                            maxLength={200}
                        />
                        <p className="text-[var(--gray-100)] text-xs mt-1">
                            {motivo.length}/200 caracteres
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-300)]">
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant={esExpulsado ? 'success' : 'danger'}
                        onClick={() => onConfirm(motivo.trim() || undefined)}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Procesando...
                            </>
                        ) : esExpulsado ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Reactivar jugador
                            </>
                        ) : (
                            <>
                                <Ban className="w-4 h-4" />
                                Expulsar permanentemente
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

