'use client';

import { useState, useCallback } from 'react';
import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import { equiposService } from '@/app/services/equipos.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import PlantelTable from '../PlantelTable';
import PlantelSkeleton from '../skeletons/PlantelSkeleton';
import AgregarJugadorModal from '@/app/components/modals/ModalAgregarJugador';
import { ModalDarBajaJugador } from '@/app/components/modals/ModalDarBajaJugador';
import { ModalExpulsarJugador } from '@/app/components/modals/ModalExpulsarJugador';

interface PlantelContainerProps {
    idEquipo: number;
    idCategoriaEdicion: number;
}

export default function PlantelContainer({
    idEquipo,
    idCategoriaEdicion
}: PlantelContainerProps) {
    const queryClient = useQueryClient();
    const [isAgregarJugadorModalOpen, setIsAgregarJugadorModalOpen] = useState(false);
    const [isDarBajaModalOpen, setIsDarBajaModalOpen] = useState(false);
    const [isExpulsarModalOpen, setIsExpulsarModalOpen] = useState(false);
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<{ id: number; nombre: string } | null>(null);

    const { data: response, isLoading, refetch } = useEquipoConPlantel(idEquipo, idCategoriaEdicion, {
        enabled: !!idEquipo && !!idCategoriaEdicion
    });

    const darBajaMutation = useMutation({
        mutationFn: async ({ id_jugador }: { id_jugador: number }) => {
            return await equiposService.darBajaJugadorPlantel(idEquipo, id_jugador, idCategoriaEdicion);
        },
        onSuccess: async () => {
            toast.success('Jugador dado de baja exitosamente');
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            await refetch();
            setIsDarBajaModalOpen(false);
            setJugadorSeleccionado(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al dar de baja al jugador');
        }
    });

    const expulsarMutation = useMutation({
        mutationFn: async ({ id_jugador, motivo }: { id_jugador: number; motivo?: string }) => {
            return await equiposService.expulsarJugadorTorneo(id_jugador, motivo);
        },
        onSuccess: async () => {
            toast.success('Jugador expulsado exitosamente');
            await queryClient.invalidateQueries({
                queryKey: ['equipos', 'detail', idEquipo, 'plantel', idCategoriaEdicion]
            });
            await refetch();
            setIsExpulsarModalOpen(false);
            setJugadorSeleccionado(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al expulsar al jugador');
        }
    });

    const handleDarBaja = useCallback(
        (id_jugador: number, nombre: string) => {
            setJugadorSeleccionado({ id: id_jugador, nombre });
            setIsDarBajaModalOpen(true);
        },
        []
    );

    const handleExpulsar = useCallback(
        (id_jugador: number, nombre: string) => {
            setJugadorSeleccionado({ id: id_jugador, nombre });
            setIsExpulsarModalOpen(true);
        },
        []
    );

    if (isLoading || !response?.data) {
        return <PlantelSkeleton />;
    }

    const { equipo, plantel, estadisticas } = response.data;

    return (
        <>
            <PlantelTable
                plantel={plantel}
                totalJugadores={estadisticas.total_jugadores}
                onAddJugador={() => setIsAgregarJugadorModalOpen(true)}
                onDarBaja={handleDarBaja}
                onExpulsar={handleExpulsar}
            />

            <AgregarJugadorModal
                isOpen={isAgregarJugadorModalOpen}
                onClose={() => setIsAgregarJugadorModalOpen(false)}
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
                equipoNombre={equipo.nombre}
            />

            <ModalDarBajaJugador
                isOpen={isDarBajaModalOpen}
                onClose={() => {
                    setIsDarBajaModalOpen(false);
                    setJugadorSeleccionado(null);
                }}
                onConfirm={async () => {
                    if (jugadorSeleccionado) {
                        await darBajaMutation.mutateAsync({ id_jugador: jugadorSeleccionado.id });
                    }
                }}
                jugadorNombre={jugadorSeleccionado?.nombre || ''}
                isLoading={darBajaMutation.isPending}
            />

            <ModalExpulsarJugador
                isOpen={isExpulsarModalOpen}
                onClose={() => {
                    setIsExpulsarModalOpen(false);
                    setJugadorSeleccionado(null);
                }}
                onConfirm={async (motivo) => {
                    if (jugadorSeleccionado) {
                        await expulsarMutation.mutateAsync({ id_jugador: jugadorSeleccionado.id, motivo });
                    }
                }}
                jugadorNombre={jugadorSeleccionado?.nombre || ''}
                isLoading={expulsarMutation.isPending}
                esExpulsado={false}
            />
        </>
    );
}

