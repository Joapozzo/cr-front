import { api } from "../lib/api"; 

export interface BaseMercadoPase {
    id_solicitud: number;
    id_jugador: number;
    nombre_jugador: string;
    img_jugador: string | null;
    nombre_categoria: string;
    id_categoria_edicion: number;
    edicion: string;
    estado: 'E' | 'A' | 'R' | 'C' | 'P'; // 'P' para Pendiente (solicitudes de baja)
    tipo_solicitud: 'J' | 'E' | 'B'; // 'B' para Baja
    mensaje_jugador?: string | null;
    mensaje_capitan?: string | null;
    motivo?: string | null; // Para solicitudes de baja
    observaciones?: string | null; // Para solicitudes de baja
    motivo_rechazo?: string | null; // Para solicitudes de baja rechazadas
    fecha_solicitud: string;
    fecha_respuesta: string | null;
    agregado_por?: string | null;
    respondido_por_username?: string | null;
}

// Estos ya no dan el error "An interface declaring no members..."
// porque ahora el tipado es consistente con el uso:
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SolicitudResponse extends BaseMercadoPase {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InvitacionEnviadaResponse extends BaseMercadoPase {}

/**
 * Respuesta genérica después de una acción de confirmación/rechazo.
 */
export interface ConfirmacionResponse {
    success: boolean;
    message: string;
}

export type ConfirmarSolicitudResponse = ConfirmacionResponse;
export type ConfirmarInvitacionResponse = ConfirmacionResponse;
export type RechazarResponse = ConfirmacionResponse; // Usamos ConfirmacionResponse como genérico de éxito/error


// ====================================================================
// SERVICIO DE FRONTEND (SOLUCIÓN FINAL Y CONSISTENTE)
// ====================================================================

export const solicitudesService = {
    
    // --- OBTENER DATOS (GET) ---

    obtenerSolicitudesEquipo: async (
        id_equipo: number,
        id_categoria_edicion: number
    ): Promise<SolicitudResponse[]> => {
        try {
            const response = await api.get<{ data: SolicitudResponse[]; message: string; total: number }>(
                `/admin/mercadopases/solicitudes-equipo/${id_equipo}/${id_categoria_edicion}`
            );
            return response.data;
        } catch (error: unknown) {
            console.error('Error al obtener solicitudes de equipo:', error);
            if (error instanceof Error) {
                throw new Error(error.message || 'No se pudieron obtener las solicitudes de jugadores.');
            }
            throw new Error('No se pudieron obtener las solicitudes de jugadores.');
        }
    },

    obtenerInvitacionesEnviadas: async (
        id_equipo: number,
        id_categoria_edicion: number
    ): Promise<InvitacionEnviadaResponse[]> => {
        try {
            const response = await api.get<{ data: InvitacionEnviadaResponse[]; message: string; total: number }>(
                `/admin/mercadopases/invitaciones-equipo/${id_equipo}/${id_categoria_edicion}`
            );
            return response.data;
        } catch (error: unknown) {
            console.error('Error al obtener invitaciones enviadas:', error);
            if (error instanceof Error) {
                throw new Error(error.message || 'No se pudieron obtener las invitaciones enviadas.');
            }
            throw new Error('No se pudieron obtener las invitaciones enviadas.');
        }
    },
    
    // --- GESTIÓN DE ACCIONES (PUT) ---

    confirmarSolicitud: async (
        id_solicitud: number,
        id_jugador: number,
    ): Promise<ConfirmarSolicitudResponse> => {
        try {
            const response = await api.put<ConfirmarSolicitudResponse>(
                `/admin/mercadopases/confirmar-solicitud/${id_solicitud}`,
                { id_jugador }
            );
            return response;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Solicitud no encontrada.');
            }
            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'Conflicto: La solicitud ya fue procesada.');
            }
            console.error('Error al confirmar solicitud:', error);
            throw new Error(error.response?.data?.message || 'No se pudo confirmar la solicitud.');
        }
    },

    confirmarInvitacion: async (
        id_solicitud: number,
        id_jugador: number
    ): Promise<ConfirmarInvitacionResponse> => {
        try {
            const response = await api.put<ConfirmarInvitacionResponse>(
                `/admin/mercadopases/confirmar-invitacion/${id_solicitud}`,
                { id_jugador }
            );
            return response;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Invitación no encontrada.');
            }
            if (error.response?.status === 409) {
                throw new Error(error.response.data.message || 'Conflicto: La invitación ya fue procesada.');
            }
            console.error('Error al confirmar invitación:', error);
            throw new Error(error.response?.data?.message || 'No se pudo confirmar la invitación.');
        }
    },

    rechazarSolicitud: async (
        id_solicitud: number
    ): Promise<RechazarResponse> => {
        try {
            const response = await api.put<RechazarResponse>(
                `/admin/mercadopases/rechazar-solicitud/${id_solicitud}`,
                {}
            );
            return response;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Solicitud no encontrada.');
            }
            console.error('Error al rechazar solicitud:', error);
            throw new Error(error.response?.data?.message || 'No se pudo rechazar la solicitud.');
        }
    },

    rechazarInvitacion: async (
        id_solicitud: number
    ): Promise<RechazarResponse> => {
        try {
            const response = await api.put<RechazarResponse>(
                `/admin/mercadopases/rechazar-invitacion/${id_solicitud}`,
                {}
            );
            return response;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Invitación no encontrada.');
            }
            console.error('Error al rechazar invitación:', error);
            throw new Error(error.response?.data?.message || 'No se pudo rechazar la invitación.');
        }
    },
};