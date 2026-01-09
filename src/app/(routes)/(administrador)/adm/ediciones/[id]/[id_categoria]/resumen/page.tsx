"use client";

import { useParams } from "next/navigation";
import { useCategoriaStore } from "@/app/stores/categoriaStore";
import { useCategoriaResumenData } from "@/app/hooks/useCategoriaResumenData";
import { useCategoriaPublicacion } from "@/app/hooks/useCategoriaPublicacion";
import { CategoriaResumenHeader } from "@/app/components/categoria/CategoriaResumenHeader";
import { CategoriaResumenContent } from "@/app/components/categoria/CategoriaResumenContent";
import { CategoriaResumenSkeleton } from "@/app/components/skeletons/CategoriaResumenSkeleton";

/**
 * Page component para el resumen de categoría.
 * Actúa como orquestador: solo compone componentes y pasa props.
 * Toda la lógica está en hooks y componentes separados.
 */
export default function CategoriaResumenPage() {
    const params = useParams();
    const { categoriaSeleccionada } = useCategoriaStore();
    
    // Obtener id_categoria_edicion del store o de los params como fallback
    const idCategoriaEdicion = Number(
        categoriaSeleccionada?.id_categoria_edicion || 
        params?.id_categoria || 
        0
    );

    const { estadisticas, proximosPartidos, ultimosPartidos, isLoading } = 
        useCategoriaResumenData(idCategoriaEdicion);
    
    const { isPublicada, togglePublicada, isUpdating } = 
        useCategoriaPublicacion(idCategoriaEdicion);

    // Renderizar skeleton mientras carga o si no hay datos listos
    if (isLoading || !estadisticas) {
        return (
            <div className="space-y-6">
                <CategoriaResumenHeader
                    nombreCategoria={categoriaSeleccionada?.nombre_completo || 'Categoría'}
                    isPublicada={isPublicada}
                    onTogglePublicada={togglePublicada}
                    isUpdating={isUpdating}
                />
                <CategoriaResumenSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CategoriaResumenHeader
                nombreCategoria={categoriaSeleccionada?.nombre_completo || 'Categoría'}
                isPublicada={isPublicada}
                onTogglePublicada={togglePublicada}
                isUpdating={isUpdating}
            />
            <CategoriaResumenContent
                estadisticas={estadisticas}
                proximosPartidos={proximosPartidos}
                ultimosPartidos={ultimosPartidos}
            />
        </div>
    );
}