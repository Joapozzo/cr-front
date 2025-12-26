import { api } from "../lib/api";

// ============================================
// TIPOS
// ============================================

export interface TipoMovimiento {
    id_tipo_movimiento: number;
    nombre: string;
    categoria: 'INGRESO' | 'EGRESO';
    activo: boolean;
    orden: number;
    descripcion?: string | null;
}

export interface MovimientoCaja {
    id_movimiento: number;
    id_caja: number;
    id_tipo_movimiento: number;
    categoria: 'INGRESO' | 'EGRESO';
    monto: number;
    metodo_pago: string;
    concepto: string;
    observaciones?: string | null;
    fecha_movimiento: string;
    registrado_por: string;
    afecta_saldo_fisico: boolean;
    anulado: boolean;
    motivo_anulacion?: string | null;
    anulado_por?: string | null;
    fecha_anulacion?: string | null;
    id_transaccion_pago?: number | null;
    tipoMovimiento?: TipoMovimiento;
    registrador?: {
        uid: string;
        nombre: string;
        apellido: string;
    };
    anulador?: {
        uid: string;
        nombre: string;
        apellido: string;
    };
    transaccionPago?: {
        id_transaccion: number;
        id_pago: number;
        monto: number;
        metodo_pago: string;
        fecha_transaccion: string;
        pago?: {
            id_pago: number;
            equipo?: {
                nombre: string;
            };
            partido?: {
                id_partido: number;
                dia: string | null;
                equipoLocal?: {
                    nombre: string;
                };
                equipoVisita?: {
                    nombre: string;
                };
            };
        };
    };
}

export interface CrearMovimientoInput {
    id_caja: number;
    id_tipo_movimiento: number;
    categoria: 'INGRESO' | 'EGRESO';
    monto: number;
    metodo_pago: string;
    concepto: string;
    observaciones?: string;
    afecta_saldo_fisico: boolean;
    comprobante_url?: string;
    numero_comprobante?: string;
}

export interface AnularMovimientoInput {
    motivo: string;
}

// ============================================
// SERVICIO
// ============================================

export const movimientoCajaService = {
    /**
     * Obtener movimientos de una caja
     */
    obtenerMovimientos: async (
        id_caja: number,
        categoria?: 'INGRESO' | 'EGRESO',
        limit?: number,
        offset?: number
    ): Promise<{ movimientos: MovimientoCaja[]; pagination: any }> => {
        try {
            const params = new URLSearchParams();
            if (categoria) {
                params.append('categoria', categoria);
            }
            if (limit) {
                params.append('limit', limit.toString());
            }
            if (offset) {
                params.append('offset', offset.toString());
            }

            const queryString = params.toString();
            const endpoint = `/cajero/movimientos/caja/${id_caja}${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: MovimientoCaja[]; pagination: any }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener movimientos');
            }

            return {
                movimientos: response.data,
                pagination: response.pagination
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Crear un movimiento de caja
     */
    crearMovimiento: async (data: CrearMovimientoInput): Promise<MovimientoCaja> => {
        try {
            const response = await api.post<{ success: boolean; data: MovimientoCaja; message: string }>(
                '/cajero/movimientos',
                data
            );

            if (!response.success) {
                throw new Error(response.message || 'Error al crear movimiento');
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al crear movimiento';
            throw new Error(errorMessage);
        }
    },

    /**
     * Anular un movimiento
     */
    anularMovimiento: async (id_movimiento: number, data: AnularMovimientoInput): Promise<MovimientoCaja> => {
        try {
            const response = await api.put<{ success: boolean; data: MovimientoCaja; message: string }>(
                `/cajero/movimientos/anular/${id_movimiento}`,
                data
            );

            if (!response.success) {
                throw new Error(response.message || 'Error al anular movimiento');
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al anular movimiento';
            throw new Error(errorMessage);
        }
    },

    /**
     * Obtener tipos de movimiento
     */
    obtenerTiposMovimiento: async (categoria?: 'INGRESO' | 'EGRESO'): Promise<TipoMovimiento[]> => {
        try {
            const params = new URLSearchParams();
            if (categoria) {
                params.append('categoria', categoria);
            }

            const queryString = params.toString();
            const endpoint = `/cajero/movimientos/tipos${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: TipoMovimiento[] }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener tipos de movimiento');
            }

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
};

