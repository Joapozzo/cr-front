import { useState, useEffect, useCallback, useRef } from 'react';
import { jugadorService, BuscarJugadoreResponse } from '../services/jugador.services';

interface UseBuscarJugadoresOptions {
    debounceMs?: number;
    minLength?: number;
    enabled?: boolean;
    limit?: number;
}

export const useBuscarJugadores = (
    query: string,
    options: UseBuscarJugadoresOptions = {}
) => {
    const {
        debounceMs = 300,
        minLength = 2,
        enabled = true,
        limit = 10
    } = options;

    const [data, setData] = useState<BuscarJugadoreResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Cache en memoria
    const cacheRef = useRef<Map<string, BuscarJugadoreResponse>>(new Map());

    // Referencia para el timeout del debounce
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Función para buscar con cache
    const buscarJugadores = useCallback(async (searchQuery: string, searchLimit: number) => {
        // Generar key del cache
        const cacheKey = `${searchQuery}-${searchLimit}`;

        // Verificar si está en cache
        if (cacheRef.current.has(cacheKey)) {
            setData(cacheRef.current.get(cacheKey)!);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await jugadorService.buscarJugadoresPorNombre({
                query: searchQuery,
                limit: searchLimit
            });

            // Guardar en cache
            cacheRef.current.set(cacheKey, response);
            setData(response);
        } catch (err) {
            const error = err as Error;
            setError(error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect con debounce
    useEffect(() => {
        // Limpiar timeout anterior
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Resetear si no está habilitado o no cumple longitud mínima
        if (!enabled || query.length < minLength) {
            setData(null);
            setIsLoading(false);
            return;
        }

        // Aplicar debounce
        setIsLoading(true);
        debounceTimerRef.current = setTimeout(() => {
            buscarJugadores(query, limit);
        }, debounceMs);

        // Cleanup
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [query, enabled, minLength, debounceMs, limit, buscarJugadores]);

    // Función para limpiar cache
    const clearCache = useCallback(() => {
        cacheRef.current.clear();
    }, []);

    return {
        jugadores: data?.jugadores || [],
        total: data?.total || 0,
        isLoading,
        error,
        clearCache
    };
};