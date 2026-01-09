import { useEstadisticasCategoriaEdicion, useProximosPartidos, useUltimosPartidosJugados } from "./useCategoriaDashboard";
import { EstadisticasCategoriaEdicion, PartidoCategoria } from "@/app/types/categoria";

interface CategoriaResumenData {
    estadisticas: EstadisticasCategoriaEdicion | null;
    proximosPartidos: PartidoCategoria[];
    ultimosPartidos: PartidoCategoria[];
    isLoading: boolean;
    isError: boolean;
}

/**
 * Hook que unifica la obtención de datos para el resumen de categoría.
 * Normaliza las respuestas que pueden venir con wrapper `.data` o sin él.
 */
export const useCategoriaResumenData = (idCategoriaEdicion: number): CategoriaResumenData => {
    const { data: estadisticasRaw, isLoading: estadisticasIsLoading, isError: estadisticasIsError } = 
        useEstadisticasCategoriaEdicion(idCategoriaEdicion);
    
    const { data: proximosPartidosRaw, isLoading: proximosPartidosIsLoading, isError: proximosPartidosIsError } = 
        useProximosPartidos(idCategoriaEdicion);
    
    const { data: ultimosPartidosRaw, isLoading: ultimosPartidosIsLoading, isError: ultimosPartidosIsError } = 
        useUltimosPartidosJugados(idCategoriaEdicion);

    // Normalizar estadísticas (puede venir con wrapper o sin él)
    const estadisticas = estadisticasRaw 
        ? (('data' in estadisticasRaw && estadisticasRaw.data) ? estadisticasRaw.data : (estadisticasRaw as unknown as EstadisticasCategoriaEdicion))
        : null;

    // Normalizar próximos partidos (puede venir con wrapper o sin él)
    const proximosPartidos = proximosPartidosRaw
        ? ((proximosPartidosRaw as { data?: PartidoCategoria[] }).data || (Array.isArray(proximosPartidosRaw) ? proximosPartidosRaw : []))
        : [];

    // Normalizar últimos partidos (puede venir con wrapper o sin él)
    const ultimosPartidos = ultimosPartidosRaw
        ? ((ultimosPartidosRaw as { data?: PartidoCategoria[] }).data || (Array.isArray(ultimosPartidosRaw) ? ultimosPartidosRaw : []))
        : [];

    const isLoading = estadisticasIsLoading || proximosPartidosIsLoading || ultimosPartidosIsLoading;
    const isError = estadisticasIsError || proximosPartidosIsError || ultimosPartidosIsError;

    return {
        estadisticas,
        proximosPartidos,
        ultimosPartidos,
        isLoading,
        isError,
    };
};

