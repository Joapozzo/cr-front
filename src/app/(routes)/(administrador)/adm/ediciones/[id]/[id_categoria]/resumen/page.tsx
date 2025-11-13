"use client";
import ProximosUltimosPartidosCategoria from "@/app/components/categoria/ProximosUltimosPartidosCategoria";
import ResumenCategoria from "@/app/components/categoria/ResumenCategoria";
import ResumenCategoriaSkeleton from "@/app/components/skeletons/ResumenCategoriaSkeleton";
import ProximosUltimosPartidosCategoriaSkeleton from "@/app/components/skeletons/roximosUltimosPartidosCategoriaSkeleton";
import { useEstadisticasCategoriaEdicion, useProximosPartidos, useUltimosPartidosJugados } from "@/app/hooks/useCategoriaDashboard";
import { useCategoriaStore } from "@/app/stores/categoriaStore";

export default function CategoriaResumenPage() {
    const { categoriaSeleccionada } = useCategoriaStore();
    const { id_categoria_edicion } = categoriaSeleccionada || {};
    const idCategoriaEdicion = Number(id_categoria_edicion);

    const {data: estadisticas, isLoading: estadisticasIsLoading} = useEstadisticasCategoriaEdicion(idCategoriaEdicion);
    const {data: proximosPartidos, isLoading: proximosPartidosIsLoading} = useProximosPartidos(idCategoriaEdicion);
    const {data: ultimosPartidos, isLoading: ultimosPartidosIsLoading} = useUltimosPartidosJugados(idCategoriaEdicion);

    // Helper para extraer datos (maneja tanto con wrapper como sin él)
    const getEstadisticas = () => {
        if (!estadisticas) return null;
        // Si tiene la propiedad 'data', es un wrapper
        return (estadisticas as any).data || estadisticas;
    };

    const getProximosPartidos = () => {
        if (!proximosPartidos) return [];
        return (proximosPartidos as any).data || proximosPartidos;
    };

    const getUltimosPartidos = () => {
        if (!ultimosPartidos) return [];
        return (ultimosPartidos as any).data || ultimosPartidos;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Resumen - Serie A Libre
                </h1>
                <p className="text-[var(--gray-100)]">
                    Información general y estado actual de la categoría
                </p>
            </div>

            {/* Estadísticas Cards */}
            {
                estadisticasIsLoading || !getEstadisticas() ? <ResumenCategoriaSkeleton /> :
                <ResumenCategoria estadisticas={getEstadisticas()!} />
            }

            {/* Próximos Partidos y Últimos Resultados */}
            {
                proximosPartidosIsLoading || ultimosPartidosIsLoading ? <ProximosUltimosPartidosCategoriaSkeleton /> :
                <ProximosUltimosPartidosCategoria
                    proximosPartidos={getProximosPartidos()}
                    ultimosPartidos={getUltimosPartidos()}
                />
            }
        </div>
    );
}