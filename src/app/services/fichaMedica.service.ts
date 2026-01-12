import { api } from '../lib/api';

export interface FichaMedica {
    id_ficha_medica: number;
    id_jugador: number;
    url_ficha?: string; // Solo visible para admin
    fecha_emision: string;
    fecha_vencimiento: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    estado: 'A' | 'V' | 'R' | 'I';
    subida_por?: string;
    observaciones?: string;
    motivo_rechazo?: string;
    valida: boolean;
    motivo?: string;
    jugador?: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
            dni: string;
        };
    };
    subidoPorUsuario?: {
        uid: string;
        nombre: string;
        apellido: string;
    };
}

export interface SubirFichaMedicaInput {
    id_jugador: number;
    archivo: File;
    // Las fechas se calculan automáticamente en el backend
    // fecha_emision: string; // Se calcula como fecha actual
    // fecha_vencimiento: string; // Se calcula como fecha actual + 365 días
    // observaciones?: string; // Eliminado
}

export interface CambiarEstadoFichaMedicaInput {
    id_ficha_medica: number;
    estado: 'A' | 'V' | 'R' | 'I';
    motivo_rechazo?: string;
}

export interface FichaMedicaResponse {
    message: string;
    data: FichaMedica;
}

const fichaMedicaService = {
    /**
     * Obtener ficha médica de un jugador
     */
    obtenerFichaMedicaJugador: async (id_jugador: number): Promise<FichaMedica | null> => {
        try {
            const response = await api.get<{ message: string; data: FichaMedica }>(
                `/fichas-medicas/jugador/${id_jugador}`
            );
            return response.data;
        } catch (error: any) {
            // Si no tiene ficha médica, retornar null en lugar de lanzar error
            if (error?.response?.status === 404) {
                return null;
            }
            console.error('Error al obtener ficha médica:', error);
            throw new Error(error?.response?.data?.error || 'No se pudo obtener la ficha médica');
        }
    },

    /**
     * Subir o actualizar ficha médica
     * Las fechas se calculan automáticamente en el backend:
     * - fecha_emision: fecha actual
     * - fecha_vencimiento: fecha actual + 365 días
     */
    subirFichaMedica: async (input: SubirFichaMedicaInput): Promise<FichaMedica> => {
        try {
            const formData = new FormData();
            formData.append('archivo', input.archivo);
            formData.append('id_jugador', input.id_jugador.toString());
            // Las fechas se calculan automáticamente en el backend

            // Para FormData, usar fetch directamente en lugar de api.post
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const token = await import('../lib/api').then(m => m.getAuthToken());
            
            const response = await fetch(`${baseUrl}/fichas-medicas/subir`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // No establecer Content-Type, el navegador lo hará automáticamente con FormData
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'No se pudo subir la ficha médica');
            }

            const result = await response.json();
            return result.data;
        } catch (error: any) {
            console.error('Error al subir ficha médica:', error);
            throw new Error(error?.message || 'No se pudo subir la ficha médica');
        }
    },

    /**
     * Cambiar estado de ficha médica (admin)
     */
    cambiarEstadoFichaMedica: async (input: CambiarEstadoFichaMedicaInput): Promise<FichaMedica> => {
        try {
            const response = await api.put<FichaMedicaResponse>(
                `/fichas-medicas/${input.id_ficha_medica}/cambiar-estado`,
                {
                    estado: input.estado,
                    motivo_rechazo: input.motivo_rechazo,
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al cambiar estado de ficha médica:', error);
            throw new Error(error?.response?.data?.error || 'No se pudo cambiar el estado de la ficha médica');
        }
    },

    /**
     * Subir ficha médica manualmente (admin)
     * Las fechas se calculan automáticamente en el backend:
     * - fecha_emision: fecha actual
     * - fecha_vencimiento: fecha actual + 365 días
     */
    subirFichaMedicaAdmin: async (input: SubirFichaMedicaInput): Promise<FichaMedica> => {
        try {
            const formData = new FormData();
            formData.append('archivo', input.archivo);
            formData.append('id_jugador', input.id_jugador.toString());
            // Las fechas se calculan automáticamente en el backend

            // Para FormData, usar fetch directamente en lugar de api.post
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const token = await import('../lib/api').then(m => m.getAuthToken());
            
            const response = await fetch(`${baseUrl}/fichas-medicas/admin/subir`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // No establecer Content-Type, el navegador lo hará automáticamente con FormData
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'No se pudo subir la ficha médica');
            }

            const result = await response.json();
            return result.data;
        } catch (error: any) {
            console.error('Error al subir ficha médica (admin):', error);
            throw new Error(error?.message || 'No se pudo subir la ficha médica');
        }
    },

    /**
     * Descargar PDF de ficha médica (admin)
     * Retorna la URL para descargar el PDF
     */
    obtenerUrlDescarga: (id_jugador: number): string => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        return `${baseUrl}/fichas-medicas/${id_jugador}/descargar`;
    },
};

export default fichaMedicaService;

