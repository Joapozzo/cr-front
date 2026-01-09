'use client';

import PanelSolicitudesAdmin from '@/app/components/PanelSolicitudesAdmin';
import { SolicitudResponse, InvitacionEnviadaResponse } from '@/app/services/solicitudes.services';

interface Equipo {
    id_equipo: number;
    nombre: string;
    [key: string]: unknown;
}

interface SolicitudesBlockProps {
    solicitudes: SolicitudResponse[];
    invitaciones: InvitacionEnviadaResponse[];
    isLoadingSolicitudes: boolean;
    isLoadingInvitaciones: boolean;
    onAceptarSolicitud: (id_solicitud: number, id_jugador: number) => Promise<void>;
    onRechazarSolicitud: (id: number) => Promise<void>;
    onAceptarInvitacion: (id_solicitud: number, id_jugador: number) => Promise<void>;
    onRechazarInvitacion: (id: number) => Promise<void>;
    isAccepting: number | null;
    isRejecting: number | null;
    equipo: Equipo;
}

export default function SolicitudesBlock({
    solicitudes,
    invitaciones,
    isLoadingSolicitudes,
    isLoadingInvitaciones,
    onAceptarSolicitud,
    onRechazarSolicitud,
    onAceptarInvitacion,
    onRechazarInvitacion,
    isAccepting,
    isRejecting,
    equipo
}: SolicitudesBlockProps) {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <PanelSolicitudesAdmin
                solicitudes={solicitudes}
                invitaciones={invitaciones}
                isLoadingSolicitudes={isLoadingSolicitudes}
                isLoadingInvitaciones={isLoadingInvitaciones}
                onAceptarSolicitud={onAceptarSolicitud}
                onRechazarSolicitud={onRechazarSolicitud}
                onAceptarInvitacion={onAceptarInvitacion}
                onRechazarInvitacion={onRechazarInvitacion}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
                equipo={equipo}
            />
        </div>
    );
}

