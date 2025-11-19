import { api } from '../lib/api';
import { PlantelEquipo } from '../types/plantelEquipo';

export const equipoPlantelService = {
    /**
     * Obtener plantel del equipo
     * @param id_equipo - ID del equipo (requerido)
     * @param id_categoria_edicion - ID de la categoría edición (opcional). Si no se pasa, se usará la última categoría activa donde participa el equipo
     */
    obtenerPlantelEquipo: async (
        id_equipo: number,
        id_categoria_edicion?: number | null
    ): Promise<PlantelEquipo> => {
        try {
            // Construir URL con query param opcional
            const url = id_categoria_edicion
                ? `/user/equipos/${id_equipo}/plantel?id_categoria_edicion=${id_categoria_edicion}`
                : `/user/equipos/${id_equipo}/plantel`;

            return await api.get<PlantelEquipo>(url);
        } catch (error: any) {
            console.error('Error al obtener plantel del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudo obtener el plantel del equipo');
        }
    },
};

