import { api } from "../lib/api";

// ============================================
// TIPOS
// ============================================

export interface DashboardResumen {
    movimientos_totales: number;
    ingresos_totales: number;
    egresos_totales: number;
    saldo_neto: number;
    movimientos_hoy: number;
    ingresos_hoy: number;
    egresos_hoy: number;
    saldo_neto_hoy: number;
    deudas_pendientes: number;
    deudas_parciales: number;
    total_deudas: number;
    ingresos_efectivo: number;
    ingresos_transferencia: number;
    ingresos_mercadopago: number;
    egresos_efectivo: number;
    egresos_transferencia: number;
}

export interface DashboardPorFecha {
    fecha: string;
    ingresos: number;
    egresos: number;
    saldo_neto: number;
    movimientos: number;
}

export interface DashboardPorCategoria {
    id_categoria_edicion: number;
    nombre_categoria: string;
    nombre_edicion: string;
    ingresos: number;
    egresos: number;
    deudas_pendientes: number;
    deudas_parciales: number;
    total_deudas: number;
}

export interface DashboardPorTorneo {
    id_edicion: number;
    nombre_edicion: string;
    temporada: number | null;
    ingresos: number;
    egresos: number;
    saldo_neto: number;
    deudas_pendientes: number;
}

export interface DashboardData {
    resumen: DashboardResumen;
    por_fecha: DashboardPorFecha[];
    por_categoria: DashboardPorCategoria[];
    por_torneo: DashboardPorTorneo[];
}

export interface DashboardFilters {
    fecha_desde?: Date;
    fecha_hasta?: Date;
    id_edicion?: number;
    id_categoria_edicion?: number;
}

// ============================================
// SERVICIO
// ============================================

export const dashboardService = {
    /**
     * Obtener datos del dashboard
     */
    obtenerDashboard: async (filtros?: DashboardFilters): Promise<DashboardData> => {
        try {
            const params = new URLSearchParams();
            
            if (filtros?.fecha_desde) {
                params.append('fecha_desde', filtros.fecha_desde.toISOString().split('T')[0]);
            }
            if (filtros?.fecha_hasta) {
                params.append('fecha_hasta', filtros.fecha_hasta.toISOString().split('T')[0]);
            }
            if (filtros?.id_edicion) {
                params.append('id_edicion', filtros.id_edicion.toString());
            }
            if (filtros?.id_categoria_edicion) {
                params.append('id_categoria_edicion', filtros.id_categoria_edicion.toString());
            }
            
            const queryString = params.toString();
            const url = `/cajero/dashboard${queryString ? `?${queryString}` : ''}`;
            
            const response = await api.get<{ success: boolean; data: DashboardData }>(url);
            return response.data;
        } catch (error) {
            console.error('Error al obtener dashboard:', error);
            throw error;
        }
    }
};

