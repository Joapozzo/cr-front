import { api } from "../lib/api";

// ============================================
// TIPOS
// ============================================

export type TipoConcepto = 
    | 'CANCHA' 
    | 'INSCRIPCION' 
    | 'PLANILLERO' 
    | 'ARBITRO' 
    | 'MEDICO' 
    | 'FOTOGRAFO' 
    | 'VIDEOGRAFO' 
    | 'CAJERO' 
    | 'ENCARGADO' 
    | 'OTRO';

export type UnidadMedida = 
    | 'POR_PARTIDO' 
    | 'POR_EQUIPO' 
    | 'POR_HORA' 
    | 'POR_DIA' 
    | 'POR_JORNADA';

export interface ConfiguracionPrecio {
    id_config: number;
    id_edicion: number;
    id_categoria_edicion: number | null;
    tipo_concepto: TipoConcepto;
    unidad: UnidadMedida;
    monto: number;
    monto_transferencia: number | null;
    activo: boolean;
    fecha_desde: string;
    fecha_hasta: string | null;
    descripcion: string | null;
    observaciones: string | null;
    creado_por: string;
    creado_en: string;
    editado_por: string | null;
    editado_en: string | null;
    categoriaEdicion?: {
        id_categoria_edicion: number;
        categoria: {
            division: {
                nombre: string;
            } | null;
            nombreCategoria: {
                nombre_categoria: string;
            } | null;
        };
    };
    edicion?: {
        id_edicion: number;
        nombre: string;
        temporada: number | null;
    };
    creador?: {
        uid: string;
        nombre: string;
        apellido: string;
    };
    editor?: {
        uid: string;
        nombre: string;
        apellido: string;
    };
}

export interface CrearPrecioInput {
    id_edicion: number;
    id_categoria_edicion?: number | null;
    tipo_concepto: TipoConcepto;
    unidad: UnidadMedida;
    monto: number;
    monto_transferencia?: number | null;
    fecha_desde: string;
    fecha_hasta?: string | null;
    descripcion?: string;
    observaciones?: string;
}

export interface ActualizarPrecioInput {
    monto?: number;
    monto_transferencia?: number | null;
    unidad?: UnidadMedida;
    activo?: boolean;
    fecha_desde?: string;
    fecha_hasta?: string | null;
    descripcion?: string;
    observaciones?: string;
}

export interface AplicarMasivoInput {
    id_edicion: number;
    tipo_concepto: TipoConcepto;
    unidad: UnidadMedida;
    monto: number;
    id_categorias: number[];
    fecha_desde: string;
    fecha_hasta?: string | null;
    descripcion?: string;
    observaciones?: string;
}

export interface ImportarPreciosInput {
    id_edicion_origen: number;
    id_edicion_destino: number;
    importar_globales: boolean;
    importar_por_categoria: boolean;
    mantener_fechas: boolean;
    ajustar_montos?: boolean;
    porcentaje_ajuste?: number;
}

// ============================================
// SERVICIO
// ============================================

export const configuracionPrecioService = {
    // Obtener precios por edición
    obtenerPreciosPorEdicion: async (
        id_edicion: number,
        filtros?: {
            tipo_concepto?: TipoConcepto;
            id_categoria_edicion?: number;
            activo?: boolean;
        }
    ): Promise<ConfiguracionPrecio[]> => {
        try {
            const params = new URLSearchParams();
            if (filtros?.tipo_concepto) params.append('tipo_concepto', filtros.tipo_concepto);
            if (filtros?.id_categoria_edicion) params.append('id_categoria_edicion', filtros.id_categoria_edicion.toString());
            if (filtros?.activo !== undefined) params.append('activo', filtros.activo.toString());

            const queryString = params.toString();
            const url = `/cajero/precios-cancha/edicion/${id_edicion}${queryString ? `?${queryString}` : ''}`;
            
            const response = await api.get<{ success: boolean; data: ConfiguracionPrecio[] }>(url);
            return response.data;
        } catch (error) {
            console.error('Error al obtener precios por edición:', error);
            throw error;
        }
    },

    // Obtener precios por categoría
    obtenerPreciosPorCategoria: async (id_categoria_edicion: number): Promise<ConfiguracionPrecio[]> => {
        try {
            const response = await api.get<{ success: boolean; data: ConfiguracionPrecio[] }>(
                `/cajero/precios-cancha/categoria/${id_categoria_edicion}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener precios por categoría:', error);
            throw error;
        }
    },

    // Obtener precios globales
    obtenerPreciosGlobales: async (id_edicion: number): Promise<ConfiguracionPrecio[]> => {
        try {
            const response = await api.get<{ success: boolean; data: ConfiguracionPrecio[] }>(
                `/cajero/precios-cancha/edicion/${id_edicion}/globales`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener precios globales:', error);
            throw error;
        }
    },

    // Resolver precio
    resolverPrecio: async (
        id_edicion: number,
        tipo_concepto: TipoConcepto,
        id_categoria_edicion?: number
    ): Promise<{ monto: number; tipo_concepto: TipoConcepto; id_categoria_edicion: number | null }> => {
        try {
            const params = id_categoria_edicion ? `?id_categoria_edicion=${id_categoria_edicion}` : '';
            const response = await api.get<{ success: boolean; data: any }>(
                `/cajero/precios-cancha/resolver/${id_edicion}/${tipo_concepto}${params}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al resolver precio:', error);
            throw error;
        }
    },

    // Resolver precios de partido
    resolverPreciosPartido: async (id_categoria_edicion: number): Promise<{
        cancha: number | null;
        planillero: number | null;
        arbitro: number | null;
        medico: number | null;
        fotografo: number | null;
    }> => {
        try {
            const response = await api.get<{ success: boolean; data: any }>(
                `/cajero/precios-cancha/resolver-partido/${id_categoria_edicion}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al resolver precios de partido:', error);
            throw error;
        }
    },

    // Crear precio
    crearPrecio: async (data: CrearPrecioInput): Promise<ConfiguracionPrecio> => {
        try {
            const response = await api.post<{ success: boolean; data: ConfiguracionPrecio; message: string }>(
                `/cajero/precios-cancha`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al crear precio:', error);
            throw error;
        }
    },

    // Actualizar precio
    actualizarPrecio: async (id_config: number, data: ActualizarPrecioInput): Promise<ConfiguracionPrecio> => {
        try {
            const response = await api.put<{ success: boolean; data: ConfiguracionPrecio; message: string }>(
                `/cajero/precios-cancha/${id_config}`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar precio:', error);
            throw error;
        }
    },

    // Eliminar precio
    eliminarPrecio: async (id_config: number): Promise<ConfiguracionPrecio> => {
        try {
            const response = await api.delete<{ success: boolean; data: ConfiguracionPrecio; message: string }>(
                `/cajero/precios-cancha/${id_config}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al eliminar precio:', error);
            throw error;
        }
    },

    // Aplicar precio masivo
    aplicarPrecioMasivo: async (data: AplicarMasivoInput): Promise<ConfiguracionPrecio[]> => {
        try {
            const response = await api.post<{ success: boolean; data: ConfiguracionPrecio[]; message: string }>(
                `/cajero/precios-cancha/aplicar-masivo`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al aplicar precio masivo:', error);
            throw error;
        }
    },

    // Duplicar precio
    duplicarPrecio: async (id_config: number, nueva_categoria_edicion: number): Promise<ConfiguracionPrecio> => {
        try {
            const response = await api.post<{ success: boolean; data: ConfiguracionPrecio; message: string }>(
                `/cajero/precios-cancha/duplicar/${id_config}`,
                { nueva_categoria_edicion }
            );
            return response.data;
        } catch (error) {
            console.error('Error al duplicar precio:', error);
            throw error;
        }
    },

    // Importar precios
    importarPrecios: async (data: ImportarPreciosInput): Promise<{
        total_importados: number;
        precios: ConfiguracionPrecio[];
    }> => {
        try {
            const response = await api.post<{ success: boolean; data: any; message: string }>(
                `/cajero/precios-cancha/importar`,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error al importar precios:', error);
            throw error;
        }
    },

    // Obtener historial
    obtenerHistorial: async (
        id_edicion: number,
        tipo_concepto: TipoConcepto,
        id_categoria_edicion?: number
    ): Promise<ConfiguracionPrecio[]> => {
        try {
            const params = id_categoria_edicion ? `?id_categoria_edicion=${id_categoria_edicion}` : '';
            const response = await api.get<{ success: boolean; data: ConfiguracionPrecio[] }>(
                `/cajero/precios-cancha/historial/${id_edicion}/${tipo_concepto}${params}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener historial:', error);
            throw error;
        }
    }
};

