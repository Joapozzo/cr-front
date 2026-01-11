'use client';

import { useMemo, useCallback } from 'react';
import {
    useSolicitudesEquipo,
    useInvitacionesEnviadas,
    useConfirmarSolicitud,
    useRechazarSolicitud,
    useConfirmarInvitacion,
    useRechazarInvitacion,
    useSolicitudesBajaEquipo,
    useConfirmarBajaJugador,
    useRechazarBajaJugador
} from '@/app/hooks/useSolicitudesAdmin';
import { useEquipoConPlantel } from '@/app/hooks/useEquipos';
import SolicitudesBlock from '../SolicitudesBlock';
import SolicitudesSkeleton from '../skeletons/SolicitudesSkeleton';

interface SolicitudesContainerProps {
    idEquipo: number;
    idCategoriaEdicion: number;
}

export default function SolicitudesContainer({
    idEquipo,
    idCategoriaEdicion
}: SolicitudesContainerProps) {
    const { data: response, isLoading: isLoadingEquipo } = useEquipoConPlantel(idEquipo, idCategoriaEdicion, {
        enabled: !!idEquipo && !!idCategoriaEdicion
    });

    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useSolicitudesEquipo(
        idEquipo,
        idCategoriaEdicion,
        {
            enabled: !!idEquipo && !!idCategoriaEdicion
        }
    );
    const { data: invitaciones, isLoading: isLoadingInvitaciones } = useInvitacionesEnviadas(
        idEquipo,
        idCategoriaEdicion,
        {
            enabled: !!idEquipo && !!idCategoriaEdicion
        }
    );
    const { data: solicitudesBaja, isLoading: isLoadingSolicitudesBaja } = useSolicitudesBajaEquipo(
        idEquipo,
        idCategoriaEdicion,
        {
            enabled: !!idEquipo && !!idCategoriaEdicion
        }
    );

    const confirmarSolicitudMutation = useConfirmarSolicitud();
    const rechazarSolicitudMutation = useRechazarSolicitud();
    const confirmarInvitacionMutation = useConfirmarInvitacion();
    const rechazarInvitacionMutation = useRechazarInvitacion();
    const confirmarBajaMutation = useConfirmarBajaJugador();
    const rechazarBajaMutation = useRechazarBajaJugador();

    const solicitudesCombinadas = useMemo(
        () => [...(solicitudes || []), ...(solicitudesBaja || [])],
        [solicitudes, solicitudesBaja]
    );

    const handleAceptarSolicitud = useCallback(
        async (id_solicitud: number, id_jugador: number) => {
            const solicitudBaja = solicitudesBaja?.find((s) => s.id_solicitud === id_solicitud);
            if (solicitudBaja && solicitudBaja.tipo_solicitud === 'B') {
                await confirmarBajaMutation.mutateAsync(id_solicitud);
            } else {
                await confirmarSolicitudMutation.mutateAsync({ id_solicitud, id_jugador });
            }
        },
        [solicitudesBaja, confirmarBajaMutation, confirmarSolicitudMutation]
    );

    const handleRechazarSolicitud = useCallback(
        async (id: number) => {
            const solicitudBaja = solicitudesBaja?.find((s) => s.id_solicitud === id);
            if (solicitudBaja && solicitudBaja.tipo_solicitud === 'B') {
                await rechazarBajaMutation.mutateAsync({ id_solicitud: id });
            } else {
                await rechazarSolicitudMutation.mutateAsync(id);
            }
        },
        [solicitudesBaja, rechazarBajaMutation, rechazarSolicitudMutation]
    );

    const handleAceptarInvitacion = useCallback(
        async (id_solicitud: number, id_jugador: number) => {
            await confirmarInvitacionMutation.mutateAsync({ id_solicitud, id_jugador });
        },
        [confirmarInvitacionMutation]
    );

    const handleRechazarInvitacion = useCallback(
        async (id: number) => {
            await rechazarInvitacionMutation.mutateAsync(id);
        },
        [rechazarInvitacionMutation]
    );

    const isAccepting = useMemo(() => {
        if (confirmarSolicitudMutation.isPending && confirmarSolicitudMutation.variables)
            return confirmarSolicitudMutation.variables.id_solicitud;
        if (confirmarInvitacionMutation.isPending && confirmarInvitacionMutation.variables)
            return confirmarInvitacionMutation.variables.id_solicitud;
        if (confirmarBajaMutation.isPending && confirmarBajaMutation.variables)
            return confirmarBajaMutation.variables;
        return null;
    }, [
        confirmarSolicitudMutation.isPending,
        confirmarSolicitudMutation.variables,
        confirmarInvitacionMutation.isPending,
        confirmarInvitacionMutation.variables,
        confirmarBajaMutation.isPending,
        confirmarBajaMutation.variables
    ]);

    const isRejecting = useMemo(() => {
        if (rechazarSolicitudMutation.isPending) return rechazarSolicitudMutation.variables;
        if (rechazarInvitacionMutation.isPending) return rechazarInvitacionMutation.variables;
        if (rechazarBajaMutation.isPending && rechazarBajaMutation.variables)
            return rechazarBajaMutation.variables.id_solicitud;
        return null;
    }, [
        rechazarSolicitudMutation.isPending,
        rechazarSolicitudMutation.variables,
        rechazarInvitacionMutation.isPending,
        rechazarInvitacionMutation.variables,
        rechazarBajaMutation.isPending,
        rechazarBajaMutation.variables
    ]);

    // Check if equipo data is loading
    if (isLoadingEquipo || isLoadingSolicitudes || isLoadingInvitaciones || isLoadingSolicitudesBaja || !response?.data) {
        return <SolicitudesSkeleton />;
    }

    const { equipo } = response.data;

    return (
        <SolicitudesBlock
            solicitudes={solicitudesCombinadas}
            invitaciones={invitaciones || []}
            isLoadingSolicitudes={isLoadingSolicitudes || isLoadingSolicitudesBaja}
            isLoadingInvitaciones={isLoadingInvitaciones}
            onAceptarSolicitud={handleAceptarSolicitud}
            onRechazarSolicitud={handleRechazarSolicitud}
            onAceptarInvitacion={handleAceptarInvitacion}
            onRechazarInvitacion={handleRechazarInvitacion}
            isAccepting={isAccepting}
            isRejecting={isRejecting}
            equipo={equipo}
        />
    );
}

