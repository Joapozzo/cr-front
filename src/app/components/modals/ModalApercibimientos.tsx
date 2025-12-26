'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'react-hot-toast';
import { equiposService } from '@/app/services/equipos.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { BaseModal } from './ModalAdmin';

interface ModalApercibimientosProps {
    isOpen: boolean;
    onClose: () => void;
    idEquipo: number;
    idCategoriaEdicion: number;
    idZona: number;
    apercibimientosActuales: number;
    equipoNombre: string;
}

export default function ModalApercibimientos({
    isOpen,
    onClose,
    idEquipo,
    idCategoriaEdicion,
    idZona,
    apercibimientosActuales,
    equipoNombre
}: ModalApercibimientosProps) {
    const [apercibimientos, setApercibimientos] = useState(apercibimientosActuales);
    const [apercibimientosUmbral, setApercibimientosUmbral] = useState(5);
    const [puntosDescuento, setPuntosDescuento] = useState(1);
    const queryClient = useQueryClient();
    const { categoriaSeleccionada } = useCategoriaStore();

    // Obtener configuración de la edición
    useEffect(() => {
        if (categoriaSeleccionada?.edicion) {
            setApercibimientosUmbral(categoriaSeleccionada.edicion.apercibimientos || 5);
            setPuntosDescuento(categoriaSeleccionada.edicion.puntos_descuento || 1);
        }
    }, [categoriaSeleccionada]);

    // Resetear cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setApercibimientos(apercibimientosActuales);
        }
    }, [isOpen, apercibimientosActuales]);

    // Calcular puntos a descontar
    const puntosADescontar = Math.floor(apercibimientos / apercibimientosUmbral) * puntosDescuento;

    // Mutación para actualizar apercibimientos
    const updateApercibimientosMutation = useMutation({
        mutationFn: async (apercibimientos: number) => {
            return await equiposService.updateApercibimientos(
                idEquipo,
                idCategoriaEdicion,
                idZona,
                apercibimientos
            );
        },
        onSuccess: async () => {
            toast.success('Apercibimientos actualizados exitosamente');
            // Invalidar queries relacionadas
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            await queryClient.invalidateQueries({
                queryKey: ['tablas', 'posiciones']
            });
            handleClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar apercibimientos');
        }
    });

    const handleIncrement = () => {
        setApercibimientos(prev => prev + 1);
    };

    const handleDecrement = () => {
        setApercibimientos(prev => Math.max(0, prev - 1));
    };

    const handleSave = async () => {
        if (apercibimientos < 0) {
            toast.error('Los apercibimientos no pueden ser negativos');
            return;
        }

        await updateApercibimientosMutation.mutateAsync(apercibimientos);
    };

    const handleClose = () => {
        setApercibimientos(apercibimientosActuales);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Apercibimientos"
            type="edit"
            maxWidth="max-w-sm"
        >
            <div className="space-y-4">
                {/* Info compacta */}
                <div className="text-center space-y-2">
                    <p className="text-xs text-[var(--gray-100)]">
                        {equipoNombre}
                    </p>
                    <p className="text-xs text-[var(--gray-200)]">
                        Cada {apercibimientosUmbral} apercibimientos = -{puntosDescuento} punto{puntosDescuento !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Contador compacto */}
                <div className="flex items-center gap-3 justify-center">
                    <Button
                        onClick={handleDecrement}
                        disabled={apercibimientos === 0 || updateApercibimientosMutation.isPending}
                        variant="danger"
                        className="w-10 h-10 p-0 flex items-center justify-center"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <div className="text-center min-w-[80px]">
                        <div className="text-3xl font-bold text-[var(--white)]">
                            {apercibimientos}
                        </div>
                    </div>
                    <Button
                        onClick={handleIncrement}
                        disabled={updateApercibimientosMutation.isPending}
                        variant="success"
                        className="w-10 h-10 p-0 flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Puntos a descontar compacto */}
                <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-[var(--yellow)]/80 mb-1">Puntos a descontar</p>
                    <p className="text-xl font-bold text-[var(--yellow)]">
                        -{puntosADescontar}
                    </p>
                </div>
            </div>

            {/* Footer compacto */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--gray-300)]">
                <Button
                    onClick={handleClose}
                    disabled={updateApercibimientosMutation.isPending}
                    className="text-sm px-4 py-2"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={apercibimientos === apercibimientosActuales || updateApercibimientosMutation.isPending}
                    variant="success"
                    className="flex items-center gap-2 text-sm px-4 py-2"
                >
                    {updateApercibimientosMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        'Guardar'
                    )}
                </Button>
            </div>
        </BaseModal>
    );
}

