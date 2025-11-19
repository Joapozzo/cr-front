import { api } from '../lib/api';
import { ParticipacionEquipo } from '../types/participacionEquipo';

export const equipoParticipacionesService = {
    /**
     * Obtener participaciones del equipo
     * @param id_equipo - ID del equipo (requerido)
     */
    obtenerParticipacionesEquipo: async (
        id_equipo: number
    ): Promise<ParticipacionEquipo[]> => {
        try {
            return await api.get<ParticipacionEquipo[]>(
                `/user/equipos/${id_equipo}/participaciones`
            );
        } catch (error: any) {
            console.error('Error al obtener participaciones del equipo:', error);
            throw new Error(error.response?.data?.error || 'No se pudieron obtener las participaciones del equipo');
        }
    },
};

