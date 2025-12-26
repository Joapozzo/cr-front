import { api } from "../lib/api";

// ============================================
// TIPOS
// ============================================

export interface CajaDiaria {
    id_caja: number;
    cajero_uid: string;
    fecha: string;
    turno?: string | null;
    saldo_inicial: number;
    saldo_final?: number | null;
    cerrada: boolean;
    creado_en: string;
    actualizado_en?: string | null;
    cerrado_en?: string | null;
    observaciones?: string | null;
    aprobada_por?: string | null;
    fecha_aprobacion?: string | null;
    cajero?: {
        uid: string;
        nombre: string;
        apellido: string;
        email: string;
    };
    saldo_fisico?: number;
    saldo_digital?: number;
    saldo_actual?: number; // Saldo físico (para cierre de caja)
    saldo_total?: number; // Saldo físico + digital
    total_ingresos_fisico?: number;
    total_egresos_fisico?: number;
    total_ingresos_digital?: number;
    total_egresos_digital?: number;
    total_ingresos?: number;
    total_egresos?: number;
}

export interface AbrirCajaInput {
    fecha: Date;
    turno?: string;
    saldo_inicial: number;
    observaciones?: string;
}

export interface CerrarCajaInput {
    saldo_fisico: number;
    observaciones?: string;
}

export interface ResumenDia {
    caja_abierta: boolean;
    caja_id?: number;
    saldo_inicial?: number;
    total_ingresos_fisico?: number;
    total_egresos_fisico?: number;
    total_ingresos_digital?: number;
    total_egresos_digital?: number;
    total_ingresos: number;
    total_egresos: number;
    saldo_fisico?: number;
    saldo_digital?: number;
    saldo_actual: number; // Saldo físico (para cierre)
    saldo_total?: number; // Saldo físico + digital
    cantidad_movimientos: number;
    fecha_apertura?: string;
}

// ============================================
// SERVICIO
// ============================================

export const cajaService = {
    /**
     * Obtener caja actual del cajero
     */
    obtenerCajaActual: async (): Promise<CajaDiaria | null> => {
        try {
            const response = await api.get<{ success: boolean; data: CajaDiaria | null; message?: string }>('/cajero/caja/actual');
            
            if (!response.success) {
                throw new Error(response.message || 'Error al obtener caja actual');
            }

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404 || error.response?.data?.message === 'No hay caja abierta') {
                return null;
            }
            throw error;
        }
    },

    /**
     * Abrir una nueva caja
     */
    abrirCaja: async (data: AbrirCajaInput): Promise<CajaDiaria> => {
        try {
            const response = await api.post<{ success: boolean; data: CajaDiaria; message: string }>('/cajero/caja/abrir', {
                fecha: data.fecha.toISOString().split('T')[0],
                turno: data.turno,
                saldo_inicial: data.saldo_inicial,
                observaciones: data.observaciones
            });

            if (!response.success) {
                throw new Error(response.message || 'Error al abrir caja');
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al abrir caja';
            throw new Error(errorMessage);
        }
    },

    /**
     * Cerrar una caja
     */
    cerrarCaja: async (id_caja: number, data: CerrarCajaInput): Promise<any> => {
        try {
            const response = await api.put<{ success: boolean; data: any; message: string }>(`/cajero/caja/cerrar/${id_caja}`, data);

            if (!response.success) {
                throw new Error(response.message || 'Error al cerrar caja');
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Error al cerrar caja';
            throw new Error(errorMessage);
        }
    },

    /**
     * Obtener historial de cajas
     */
    obtenerHistorial: async (
        fechaDesde?: Date,
        fechaHasta?: Date,
        limit?: number,
        offset?: number
    ): Promise<{ cajas: CajaDiaria[]; pagination: any }> => {
        try {
            const params = new URLSearchParams();
            if (fechaDesde) {
                params.append('fechaDesde', fechaDesde.toISOString().split('T')[0]);
            }
            if (fechaHasta) {
                params.append('fechaHasta', fechaHasta.toISOString().split('T')[0]);
            }
            if (limit) {
                params.append('limit', limit.toString());
            }
            if (offset) {
                params.append('offset', offset.toString());
            }

            const queryString = params.toString();
            const endpoint = `/cajero/caja/historial${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: CajaDiaria[]; pagination: any }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener historial de cajas');
            }

            return {
                cajas: response.data,
                pagination: response.pagination
            };
        } catch (error: any) {
            throw error;
        }
    },

    /**
     * Obtener caja por ID
     */
    obtenerCajaPorId: async (id_caja: number): Promise<CajaDiaria> => {
        try {
            const response = await api.get<{ success: boolean; data: CajaDiaria }>(`/cajero/caja/${id_caja}`);

            if (!response.success) {
                throw new Error('Error al obtener caja');
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al obtener caja';
            throw new Error(errorMessage);
        }
    },

    /**
     * Obtener resumen del día
     */
    obtenerResumenDia: async (fecha?: Date): Promise<ResumenDia> => {
        try {
            const params = new URLSearchParams();
            if (fecha) {
                params.append('fecha', fecha.toISOString().split('T')[0]);
            }

            const queryString = params.toString();
            const endpoint = `/cajero/caja/resumen${queryString ? `?${queryString}` : ''}`;

            const response = await api.get<{ success: boolean; data: ResumenDia }>(endpoint);

            if (!response.success) {
                throw new Error('Error al obtener resumen del día');
            }

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
};

