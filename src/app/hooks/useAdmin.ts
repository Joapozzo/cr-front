import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/app/services/admin.service';
import {
    CategoriaActiva,
    ZonaSinTerminar,
    SancionActiva,
    PartidoEnVivo,
    JugadorEventual,
    EstadisticasChart
} from '@/app/types/admin.types';

interface UseAdminReturn {
    // Estados de datos
    categoriasActivas: CategoriaActiva[] | null;
    zonasSinTerminar: ZonaSinTerminar[] | null;
    sancionesActivas: SancionActiva[] | null;
    partidosEnVivo: PartidoEnVivo[] | null;
    jugadoresEventuales: JugadorEventual[] | null;
    estadisticas: EstadisticasChart | null;

    // Estados de carga
    loadingCategorias: boolean;
    loadingZonas: boolean;
    loadingSanciones: boolean;
    loadingPartidos: boolean;
    loadingJugadores: boolean;
    loadingEstadisticas: boolean;

    // Estados de error
    errorCategorias: Error | null;
    errorZonas: Error | null;
    errorSanciones: Error | null;
    errorPartidos: Error | null;
    errorJugadores: Error | null;
    errorEstadisticas: Error | null;

    // Funciones para fetch individual
    fetchCategoriasActivas: () => Promise<void>;
    fetchZonasSinTerminar: () => Promise<void>;
    fetchSancionesActivas: () => Promise<void>;
    fetchPartidosEnVivo: () => Promise<void>;
    fetchJugadoresEventuales: () => Promise<void>;
    fetchEstadisticas: () => Promise<void>;

    // Función para refresh general
    refresh: () => Promise<void>;
}

/**
 * Hook personalizado para consumir endpoints del dashboard de administración
 * 
 * @param autoFetch - Si es true, hace fetch automático de todos los endpoints al montar
 * @returns Objeto con datos, estados de carga, errores y funciones de fetch
 * 
 * @example
 * ```tsx
 * const { 
 *   categoriasActivas, 
 *   loadingCategorias, 
 *   errorCategorias,
 *   fetchCategoriasActivas 
 * } = useAdmin();
 * 
 * useEffect(() => {
 *   fetchCategoriasActivas();
 * }, []);
 * ```
 */
export const useAdmin = (autoFetch: boolean = false): UseAdminReturn => {
    // Estados de datos
    const [categoriasActivas, setCategoriasActivas] = useState<CategoriaActiva[] | null>(null);
    const [zonasSinTerminar, setZonasSinTerminar] = useState<ZonaSinTerminar[] | null>(null);
    const [sancionesActivas, setSancionesActivas] = useState<SancionActiva[] | null>(null);
    const [partidosEnVivo, setPartidosEnVivo] = useState<PartidoEnVivo[] | null>(null);
    const [jugadoresEventuales, setJugadoresEventuales] = useState<JugadorEventual[] | null>(null);
    const [estadisticas, setEstadisticas] = useState<EstadisticasChart | null>(null);

    // Estados de carga
    const [loadingCategorias, setLoadingCategorias] = useState<boolean>(false);
    const [loadingZonas, setLoadingZonas] = useState<boolean>(false);
    const [loadingSanciones, setLoadingSanciones] = useState<boolean>(false);
    const [loadingPartidos, setLoadingPartidos] = useState<boolean>(false);
    const [loadingJugadores, setLoadingJugadores] = useState<boolean>(false);
    const [loadingEstadisticas, setLoadingEstadisticas] = useState<boolean>(false);

    // Estados de error
    const [errorCategorias, setErrorCategorias] = useState<Error | null>(null);
    const [errorZonas, setErrorZonas] = useState<Error | null>(null);
    const [errorSanciones, setErrorSanciones] = useState<Error | null>(null);
    const [errorPartidos, setErrorPartidos] = useState<Error | null>(null);
    const [errorJugadores, setErrorJugadores] = useState<Error | null>(null);
    const [errorEstadisticas, setErrorEstadisticas] = useState<Error | null>(null);

    // Funciones de fetch individuales
    const fetchCategoriasActivas = useCallback(async () => {
        setLoadingCategorias(true);
        setErrorCategorias(null);
        try {
            console.log('[useAdmin] Fetching categorías activas...');
            const data = await adminService.getCategoriasActivas();
            console.log('[useAdmin] Categorías recibidas:', data?.length || 0);
            setCategoriasActivas(data);
        } catch (error: any) {
            console.error('[useAdmin] Error al obtener categorías:', error);
            setErrorCategorias(error instanceof Error ? error : new Error(String(error)));
            setCategoriasActivas(null);
        } finally {
            setLoadingCategorias(false);
        }
    }, []);

    const fetchZonasSinTerminar = useCallback(async () => {
        setLoadingZonas(true);
        setErrorZonas(null);
        try {
            const data = await adminService.getZonasSinTerminar();
            setZonasSinTerminar(data);
        } catch (error: any) {
            setErrorZonas(error instanceof Error ? error : new Error(String(error)));
            setZonasSinTerminar(null);
        } finally {
            setLoadingZonas(false);
        }
    }, []);

    const fetchSancionesActivas = useCallback(async () => {
        setLoadingSanciones(true);
        setErrorSanciones(null);
        try {
            const data = await adminService.getSancionesActivas();
            setSancionesActivas(data);
        } catch (error: any) {
            setErrorSanciones(error instanceof Error ? error : new Error(String(error)));
            setSancionesActivas(null);
        } finally {
            setLoadingSanciones(false);
        }
    }, []);

    const fetchPartidosEnVivo = useCallback(async () => {
        setLoadingPartidos(true);
        setErrorPartidos(null);
        try {
            const data = await adminService.getPartidosEnVivo();
            setPartidosEnVivo(data);
        } catch (error: any) {
            setErrorPartidos(error instanceof Error ? error : new Error(String(error)));
            setPartidosEnVivo(null);
        } finally {
            setLoadingPartidos(false);
        }
    }, []);

    const fetchJugadoresEventuales = useCallback(async () => {
        setLoadingJugadores(true);
        setErrorJugadores(null);
        try {
            const data = await adminService.getJugadoresEventuales();
            setJugadoresEventuales(data);
        } catch (error: any) {
            setErrorJugadores(error instanceof Error ? error : new Error(String(error)));
            setJugadoresEventuales(null);
        } finally {
            setLoadingJugadores(false);
        }
    }, []);

    const fetchEstadisticas = useCallback(async () => {
        setLoadingEstadisticas(true);
        setErrorEstadisticas(null);
        try {
            const data = await adminService.getEstadisticas();
            setEstadisticas(data);
        } catch (error: any) {
            setErrorEstadisticas(error instanceof Error ? error : new Error(String(error)));
            setEstadisticas(null);
        } finally {
            setLoadingEstadisticas(false);
        }
    }, []);

    // Función para refresh general (fetch de todos los endpoints)
    const refresh = useCallback(async () => {
        await Promise.all([
            fetchCategoriasActivas(),
            fetchZonasSinTerminar(),
            fetchSancionesActivas(),
            fetchPartidosEnVivo(),
            fetchJugadoresEventuales(),
            fetchEstadisticas()
        ]);
    }, [
        fetchCategoriasActivas,
        fetchZonasSinTerminar,
        fetchSancionesActivas,
        fetchPartidosEnVivo,
        fetchJugadoresEventuales,
        fetchEstadisticas
    ]);

    // Auto-fetch si está habilitado
    useEffect(() => {
        if (autoFetch) {
            refresh();
        }
    }, [autoFetch, refresh]);

    return {
        // Datos
        categoriasActivas,
        zonasSinTerminar,
        sancionesActivas,
        partidosEnVivo,
        jugadoresEventuales,
        estadisticas,

        // Estados de carga
        loadingCategorias,
        loadingZonas,
        loadingSanciones,
        loadingPartidos,
        loadingJugadores,
        loadingEstadisticas,

        // Errores
        errorCategorias,
        errorZonas,
        errorSanciones,
        errorPartidos,
        errorJugadores,
        errorEstadisticas,

        // Funciones de fetch
        fetchCategoriasActivas,
        fetchZonasSinTerminar,
        fetchSancionesActivas,
        fetchPartidosEnVivo,
        fetchJugadoresEventuales,
        fetchEstadisticas,

        // Función de refresh
        refresh
    };
};

