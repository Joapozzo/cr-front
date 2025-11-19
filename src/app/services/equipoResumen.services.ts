import { api } from '../lib/api';
import { EquipoResumen } from '../types/equipoResumen';

export const equipoResumenService = {
    /**
     * Obtener resumen del equipo
     * @param id_equipo - ID del equipo (requerido)
     * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
     */
    obtenerResumenEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<EquipoResumen> => {
        try {
            // Construir URL con query param opcional
            const url = id_categoria_edicion
                ? `/user/equipos/${id_equipo}/resumen?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/equipos/${id_equipo}/resumen`;

            return await api.get<EquipoResumen>(url);
        } catch (error: any) {
            console.error('Error al obtener resumen del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudo obtener el resumen del equipo');
        }
    },
};

