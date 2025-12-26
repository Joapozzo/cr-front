import { api } from "../lib/api";
import {
    InscripcionEquipo,
    CrearPagoEfectivoInput,
    CrearPagoTransferenciaInput,
    ValidarTransferenciaInput,
    InscripcionesConDeudaResponse,
    TransferenciasPendientesResponse,
    PagoInscripcion
} from "../types/inscripcion";

export const inscripcionService = {
    /**
     * Obtener inscripciones con deuda
     */
    obtenerInscripcionesConDeuda: async (
        id_categoria_edicion?: number,
        limit?: number,
        offset?: number
    ): Promise<InscripcionesConDeudaResponse> => {
        try {
            const params = new URLSearchParams();
            
            if (id_categoria_edicion) {
                params.append('id_categoria_edicion', id_categoria_edicion.toString());
            }
            if (limit) {
                params.append('limit', limit.toString());
            }
            if (offset) {
                params.append('offset', offset.toString());
            }

            const queryString = params.toString();
            const endpoint = `/cajero/inscripciones/con-deuda${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: InscripcionEquipo[]; pagination: any }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener inscripciones con deuda');
            }

            return {
                inscripciones: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error al obtener inscripciones con deuda:', error);
            throw new Error('No se pudieron cargar las inscripciones con deuda');
        }
    },

    /**
     * Obtener inscripción por ID
     */
    obtenerInscripcionPorId: async (id_inscripcion: number): Promise<InscripcionEquipo> => {
        try {
            const response = await api.get<{ success: boolean; data: InscripcionEquipo }>(
                `/cajero/inscripciones/${id_inscripcion}`
            );

            if (!response.success) {
                throw new Error('Error al obtener inscripción');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al obtener inscripción:', error);
            throw new Error(error.message || 'No se pudo cargar la inscripción');
        }
    },

    /**
     * Registrar pago en efectivo
     */
    registrarPagoEfectivo: async (data: CrearPagoEfectivoInput): Promise<{ inscripcion: InscripcionEquipo; pago: PagoInscripcion }> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>(
                '/cajero/inscripciones/pago-efectivo',
                data
            );

            if (!response.success) {
                throw new Error('Error al registrar pago en efectivo');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al registrar pago en efectivo:', error);
            throw new Error(error.message || 'No se pudo registrar el pago en efectivo');
        }
    },

    /**
     * Registrar pago por transferencia
     */
    registrarPagoTransferencia: async (data: CrearPagoTransferenciaInput): Promise<{ inscripcion: InscripcionEquipo; pago: PagoInscripcion }> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>(
                '/cajero/inscripciones/pago-transferencia',
                data
            );

            if (!response.success) {
                throw new Error('Error al registrar pago por transferencia');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al registrar pago por transferencia:', error);
            throw new Error(error.message || 'No se pudo registrar el pago por transferencia');
        }
    },

    /**
     * Validar transferencia
     */
    validarTransferencia: async (id_pago_inscripcion: number, data: ValidarTransferenciaInput): Promise<{ pago: PagoInscripcion; aprobada: boolean }> => {
        try {
            const response = await api.put<{ success: boolean; data: any }>(
                `/cajero/inscripciones/validar-transferencia/${id_pago_inscripcion}`,
                data
            );

            if (!response.success) {
                throw new Error('Error al validar transferencia');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al validar transferencia:', error);
            throw new Error(error.message || 'No se pudo validar la transferencia');
        }
    },

    /**
     * Obtener transferencias pendientes
     */
    obtenerTransferenciasPendientes: async (
        limit?: number,
        offset?: number
    ): Promise<TransferenciasPendientesResponse> => {
        try {
            const params = new URLSearchParams();
            
            if (limit) {
                params.append('limit', limit.toString());
            }
            if (offset) {
                params.append('offset', offset.toString());
            }

            const queryString = params.toString();
            const endpoint = `/cajero/inscripciones/transferencias-pendientes${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: PagoInscripcion[]; pagination: any }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener transferencias pendientes');
            }

            return {
                pagos: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error al obtener transferencias pendientes:', error);
            throw new Error('No se pudieron cargar las transferencias pendientes');
        }
    }
};

