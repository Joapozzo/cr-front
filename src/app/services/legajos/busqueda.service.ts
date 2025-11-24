/**
 * Servicio para búsqueda de jugadores y equipos en legajos
 */
import { api } from '@/app/lib/api';
import { BusquedaJugadoresParams, BusquedaJugadoresResponse, BusquedaEquiposParams, BusquedaEquiposResponse } from '@/app/types/legajos';

/**
 * Helper para construir URLs con query params
 */
const buildUrl = (base: string, params: Record<string, any>): string => {
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value));
        }
    });
    return url.pathname + url.search;
};

export const busquedaLegajosService = {
    /**
     * Buscar jugadores
     */
    buscarJugadores: async (params: BusquedaJugadoresParams): Promise<BusquedaJugadoresResponse> => {
        try {
            const url = buildUrl('/legajos/buscar/jugadores', params);
            const response = await api.get<{ success: boolean; data: BusquedaJugadoresResponse['data']; pagination: BusquedaJugadoresResponse['pagination'] }>(url);
            return {
                data: response.data || [],
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error al buscar jugadores:', error);
            throw new Error('No se pudieron cargar los jugadores');
        }
    },

    /**
     * Buscar equipos
     */
    buscarEquipos: async (params: BusquedaEquiposParams): Promise<BusquedaEquiposResponse> => {
        try {
            const url = buildUrl('/legajos/buscar/equipos', params);
            const response = await api.get<{ success: boolean; data: BusquedaEquiposResponse['data']; pagination: BusquedaEquiposResponse['pagination'] }>(url);
            return {
                data: response.data || [],
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error al buscar equipos:', error);
            throw new Error('No se pudieron cargar los equipos');
        }
    },
};

