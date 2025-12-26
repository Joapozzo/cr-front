import { api } from "../lib/api";
import {
    PagoCancha,
    CrearPagoEfectivoInput,
    CrearPagoTransferenciaInput,
    QRResponse,
    PerdonarDeudaInput,
    PagosPendientesResponse
} from "../types/pagoCancha";
import { formatDateToLocalString } from "../utils/dateHelpers";

export const pagoCanchaService = {
    /**
     * Obtener pagos pendientes
     */
    obtenerPagosPendientes: async (
        id_categoria_edicion?: number,
        fecha?: Date,
        limit?: number,
        offset?: number,
        estado_pago?: 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'VENCIDO' | 'TODOS'
    ): Promise<PagosPendientesResponse> => {
        try {
            const params = new URLSearchParams();
            
            if (id_categoria_edicion) {
                params.append('id_categoria_edicion', id_categoria_edicion.toString());
            }
            if (fecha) {
                params.append('fecha', formatDateToLocalString(fecha));
            }
            if (limit) {
                params.append('limit', limit.toString());
            }
            if (offset) {
                params.append('offset', offset.toString());
            }
            if (estado_pago && estado_pago !== 'TODOS') {
                params.append('estado_pago', estado_pago);
            }

            const queryString = params.toString();
            const endpoint = `/cajero/pagos-cancha/pendientes${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: PagoCancha[]; pagination: any }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener pagos pendientes');
            }

            return {
                pagos: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error al obtener pagos pendientes:', error);
            throw new Error('No se pudieron cargar los pagos pendientes');
        }
    },

    /**
     * Obtener pagos por partido
     */
    obtenerPagosPorPartido: async (id_partido: number): Promise<PagoCancha[]> => {
        try {
            const response = await api.get<{ success: boolean; data: PagoCancha[] }>(
                `/cajero/pagos-cancha/partido/${id_partido}`
            );

            if (!response.success) {
                throw new Error('Error al obtener pagos del partido');
            }

            return response.data;
        } catch (error) {
            console.error('Error al obtener pagos por partido:', error);
            throw new Error('No se pudieron cargar los pagos del partido');
        }
    },

    /**
     * Registrar pago en efectivo
     */
    registrarPagoEfectivo: async (data: CrearPagoEfectivoInput): Promise<{ pago: PagoCancha; transaccion: any }> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>(
                '/cajero/pagos-cancha/efectivo',
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
    registrarPagoTransferencia: async (data: CrearPagoTransferenciaInput): Promise<{ pago: PagoCancha; transaccion: any }> => {
        try {
            const response = await api.post<{ success: boolean; data: any }>(
                '/cajero/pagos-cancha/transferencia',
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
     * Generar QR de MercadoPago
     */
    generarQR: async (id_pago: number): Promise<QRResponse> => {
        try {
            const response = await api.post<{ success: boolean; data: QRResponse }>(
                `/cajero/pagos-cancha/generar-qr/${id_pago}`
            );

            if (!response.success) {
                throw new Error('Error al generar QR');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al generar QR:', error);
            throw new Error(error.message || 'No se pudo generar el código QR');
        }
    },

    /**
     * Perdonar deuda (solo Admin)
     */
    perdonarDeuda: async (id_pago: number, data: PerdonarDeudaInput): Promise<PagoCancha> => {
        try {
            const response = await api.post<{ success: boolean; data: PagoCancha }>(
                `/cajero/pagos-cancha/perdonar/${id_pago}`,
                data
            );

            if (!response.success) {
                throw new Error('Error al perdonar deuda');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al perdonar deuda:', error);
            throw new Error(error.message || 'No se pudo perdonar la deuda');
        }
    },

    /**
     * Anular pago de cancha (revierte todo: pago no existió, equipo vuelve a no pagado)
     */
    anularPago: async (id_pago: number, motivo: string): Promise<PagoCancha> => {
        try {
            const response = await api.post<{ success: boolean; data: PagoCancha }>(
                `/cajero/pagos-cancha/anular/${id_pago}`,
                { motivo }
            );

            if (!response.success) {
                throw new Error('Error al anular pago');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error al anular pago:', error);
            throw new Error(error.message || 'No se pudo anular el pago');
        }
    }
};

