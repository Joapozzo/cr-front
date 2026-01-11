'use client';

import { useState } from 'react';
import { useCredenciales, useRevocarCredencial, useReactivarCredencial } from '@/app/hooks/useCredenciales';
import { TarjetaCredencial } from '@/app/components/credenciales/TarjetaCredencial';
import { adaptarCredencialParaComponente } from '@/app/components/credenciales/types';
import { Button } from '@/app/components/ui/Button';
import { Ban, RotateCcw, AlertTriangle, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BaseModal } from '@/app/components/modals/ModalAdmin';
import { CredencialesListSkeleton } from '../../skeletons/CredencialSkeleton';

interface JugadorCredencialesTabProps {
    idJugador: number;
}

export const JugadorCredencialesTab = ({ idJugador }: JugadorCredencialesTabProps) => {
    const [credencialSeleccionada, setCredencialSeleccionada] = useState<{
        id: string;
        estado: string;
    } | null>(null);
    const [isModalRevocarOpen, setIsModalRevocarOpen] = useState(false);
    const [isModalReactivarOpen, setIsModalReactivarOpen] = useState(false);
    const [motivoRevocacion, setMotivoRevocacion] = useState('');

    const { data: credenciales, isLoading, error, refetch } = useCredenciales(
        { id_jugador: idJugador },
        { enabled: !!idJugador }
    );

    const revocarMutation = useRevocarCredencial({
        onSuccess: () => {
            toast.success('Credencial revocada exitosamente');
            setIsModalRevocarOpen(false);
            setCredencialSeleccionada(null);
            setMotivoRevocacion('');
            refetch();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al revocar la credencial');
        }
    });

    const reactivarMutation = useReactivarCredencial({
        onSuccess: () => {
            toast.success('Credencial reactivada exitosamente');
            setIsModalReactivarOpen(false);
            setCredencialSeleccionada(null);
            refetch();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al reactivar la credencial');
        }
    });

    const handleRevocar = (id: string, estado: string) => {
        setCredencialSeleccionada({ id, estado });
        setIsModalRevocarOpen(true);
    };

    const handleReactivar = (id: string, estado: string) => {
        setCredencialSeleccionada({ id, estado });
        setIsModalReactivarOpen(true);
    };

    const confirmarRevocar = async () => {
        if (credencialSeleccionada) {
            await revocarMutation.mutateAsync({
                id_credencial: credencialSeleccionada.id,
                motivo: motivoRevocacion || undefined
            });
        }
    };

    const confirmarReactivar = async () => {
        if (credencialSeleccionada) {
            await reactivarMutation.mutateAsync(credencialSeleccionada.id);
        }
    };

    if (isLoading) {
        return (
            <CredencialesListSkeleton count={1} />
        );
    }

    if (error) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
                <h3 className="text-[var(--red)] font-medium mb-2">Error al cargar las credenciales</h3>
                <p className="text-[var(--red)]/80 text-sm">
                    {error.message || 'No se pudieron cargar las credenciales del jugador'}
                </p>
            </div>
        );
    }

    if (!credenciales || credenciales.length === 0) {
        return (
            <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-4 opacity-50" />
                <p className="text-[var(--gray-100)] text-lg font-medium mb-2">No hay credenciales</p>
                <p className="text-[var(--gray-200)] text-sm">
                    Este jugador no tiene credenciales registradas
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {credenciales.map((credencialBackend, index) => {
                const credencial = adaptarCredencialParaComponente(credencialBackend);
                const isRevocada = credencial.estado === 'REVOCADA';
                const isVencida = credencial.estado === 'VENCIDA';

                return (
                    <div
                        key={credencial.id}
                        className="bg-[var(--gray-500)] rounded-lg p-4 w-full"
                    >
                        <div className="w-full space-y-3">
                            <div className="flex justify-center w-full" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                                <div className="w-full max-w-md">
                                    <TarjetaCredencial
                                        credencial={credencial}
                                        mostrarAcciones={false}
                                        autoFlip={false}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Acciones de administración */}
                            <div className="flex gap-2 pt-4">
                                {isRevocada ? (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleReactivar(credencial.id, credencial.estado)}
                                        className="w-full flex items-center justify-center gap-2"
                                        disabled={reactivarMutation.isPending}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reactivar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRevocar(credencial.id, credencial.estado)}
                                        className="w-full flex items-center justify-center gap-2"
                                        disabled={revocarMutation.isPending || isVencida}
                                    >
                                        <Ban className="w-4 h-4" />
                                        Revocar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal de confirmación para revocar */}
            <BaseModal
                isOpen={isModalRevocarOpen}
                onClose={() => {
                    setIsModalRevocarOpen(false);
                    setCredencialSeleccionada(null);
                    setMotivoRevocacion('');
                }}
                title="Revocar Credencial"
                type="delete"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-[var(--gray-100)] text-sm">
                        ¿Estás seguro de que deseas revocar esta credencial? Esta acción puede revertirse.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-[var(--white)] mb-2">
                            Motivo (opcional)
                        </label>
                        <textarea
                            value={motivoRevocacion}
                            onChange={(e) => setMotivoRevocacion(e.target.value)}
                            placeholder="Ingresa el motivo de la revocación..."
                            className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-[var(--gray-300)]">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsModalRevocarOpen(false);
                                setCredencialSeleccionada(null);
                                setMotivoRevocacion('');
                            }}
                            className="flex-1"
                            disabled={revocarMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmarRevocar}
                            className="flex-1 flex items-center justify-center gap-2"
                            disabled={revocarMutation.isPending}
                        >
                            {revocarMutation.isPending ? 'Revocando...' : 'Confirmar Revocación'}
                        </Button>
                    </div>
                </div>
            </BaseModal>

            {/* Modal de confirmación para reactivar */}
            <BaseModal
                isOpen={isModalReactivarOpen}
                onClose={() => {
                    setIsModalReactivarOpen(false);
                    setCredencialSeleccionada(null);
                }}
                title="Reactivar Credencial"
                type="edit"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-[var(--gray-100)] text-sm">
                        ¿Estás seguro de que deseas reactivar esta credencial? La credencial volverá a estar activa.
                    </p>
                    <div className="flex gap-3 pt-4 border-t border-[var(--gray-300)]">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsModalReactivarOpen(false);
                                setCredencialSeleccionada(null);
                            }}
                            className="flex-1"
                            disabled={reactivarMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            onClick={confirmarReactivar}
                            className="flex-1 flex items-center justify-center gap-2"
                            disabled={reactivarMutation.isPending}
                        >
                            {reactivarMutation.isPending ? 'Reactivando...' : 'Confirmar Reactivación'}
                        </Button>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};

