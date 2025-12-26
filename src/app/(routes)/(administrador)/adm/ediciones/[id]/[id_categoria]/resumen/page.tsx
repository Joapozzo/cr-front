"use client";
import ProximosUltimosPartidosCategoria from "@/app/components/categoria/ProximosUltimosPartidosCategoria";
import ResumenCategoria from "@/app/components/categoria/ResumenCategoria";
import ResumenCategoriaSkeleton from "@/app/components/skeletons/ResumenCategoriaSkeleton";
import ProximosUltimosPartidosCategoriaSkeleton from "@/app/components/skeletons/roximosUltimosPartidosCategoriaSkeleton";
import { useEstadisticasCategoriaEdicion, useProximosPartidos, useUltimosPartidosJugados } from "@/app/hooks/useCategoriaDashboard";
import { useCategoriaStore } from "@/app/stores/categoriaStore";
import { useActualizarPublicadaCategoria } from "@/app/hooks/useCategorias";
import { Button } from "@/app/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriaResumenPage() {
    const { categoriaSeleccionada } = useCategoriaStore();
    const { id_categoria_edicion, publicada } = categoriaSeleccionada || {};
    const idCategoriaEdicion = Number(id_categoria_edicion);
    const isPublicada = publicada === 'S';

    const {data: estadisticas, isLoading: estadisticasIsLoading} = useEstadisticasCategoriaEdicion(idCategoriaEdicion);
    const {data: proximosPartidos, isLoading: proximosPartidosIsLoading} = useProximosPartidos(idCategoriaEdicion);
    const {data: ultimosPartidos, isLoading: ultimosPartidosIsLoading} = useUltimosPartidosJugados(idCategoriaEdicion);
    
    const { mutate: actualizarPublicada, isPending: isUpdating } = useActualizarPublicadaCategoria();

    // Helper para extraer datos (maneja tanto con wrapper como sin él)
    const getEstadisticas = () => {
        if (!estadisticas) return null;
        // Si tiene la propiedad 'data', es un wrapper
        return (estadisticas as { data?: unknown }).data || estadisticas;
    };

    const getProximosPartidos = () => {
        if (!proximosPartidos) return [];
        return (proximosPartidos as { data?: unknown[] }).data || (Array.isArray(proximosPartidos) ? proximosPartidos : []);
    };

    const getUltimosPartidos = () => {
        if (!ultimosPartidos) return [];
        return (ultimosPartidos as { data?: unknown[] }).data || (Array.isArray(ultimosPartidos) ? ultimosPartidos : []);
    };

    const handleTogglePublicada = () => {
        if (!idCategoriaEdicion) return;
        
        const nuevoEstado: 'S' | 'N' = isPublicada ? 'N' : 'S';
        
        actualizarPublicada(
            { id_categoria_edicion: idCategoriaEdicion, publicada: nuevoEstado },
            {
                onSuccess: () => {
                    toast.success(nuevoEstado === 'S' ? 'Categoría publicada exitosamente' : 'Categoría despublicada exitosamente');
                    // Actualizar el store
                    if (categoriaSeleccionada) {
                        const { setCategoriaSeleccionada } = useCategoriaStore.getState();
                        setCategoriaSeleccionada({
                            ...categoriaSeleccionada,
                            publicada: nuevoEstado
                        });
                    }
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al actualizar el estado de publicación');
                }
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Resumen - {categoriaSeleccionada?.nombre_completo || 'Categoría'}
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Información general y estado actual de la categoría
                    </p>
                </div>
                <Button
                    variant={isPublicada ? "default" : "success"}
                    onClick={handleTogglePublicada}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                >
                    {isPublicada ? (
                        <>
                            <EyeOff className="w-4 h-4" />
                            <span>Despublicar</span>
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4" />
                            <span>Publicar</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Estadísticas Cards */}
            {
                estadisticasIsLoading || !getEstadisticas() ? <ResumenCategoriaSkeleton /> :
                <ResumenCategoria estadisticas={getEstadisticas() as Parameters<typeof ResumenCategoria>[0]['estadisticas']} />
            }

            {/* Próximos Partidos y Últimos Resultados */}
            {
                proximosPartidosIsLoading || ultimosPartidosIsLoading ? <ProximosUltimosPartidosCategoriaSkeleton /> :
                <ProximosUltimosPartidosCategoria
                    proximosPartidos={getProximosPartidos() as Parameters<typeof ProximosUltimosPartidosCategoria>[0]['proximosPartidos']}
                    ultimosPartidos={getUltimosPartidos() as Parameters<typeof ProximosUltimosPartidosCategoria>[0]['ultimosPartidos']}
                />
            }
        </div>
    );
}