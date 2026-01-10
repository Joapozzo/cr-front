"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCategoriaStore } from "@/app/stores/categoriaStore";
import { useCategoriaResumenData } from "@/app/hooks/useCategoriaResumenData";
import { useCategoriaPublicacion } from "@/app/hooks/useCategoriaPublicacion";
import { useCategoriaEdicionPorId } from "@/app/hooks/useCategorias";
import { CategoriaResumenHeader } from "@/app/components/categoria/CategoriaResumenHeader";
import { CategoriaResumenContent } from "@/app/components/categoria/CategoriaResumenContent";
import { CategoriaResumenSkeleton } from "@/app/components/skeletons/CategoriaResumenSkeleton";

/**
 * Page component para el resumen de categoría.
 * Actúa como orquestador: solo compone componentes y pasa props.
 * Toda la lógica está en hooks y componentes separados.
 */
// Componente interno con la lógica
function CategoriaResumenPageContent() {
    const params = useParams();
    const { categoriaSeleccionada, setCategoriaSeleccionada } = useCategoriaStore();
    
    // Priorizar el param de la URL sobre el store
    const idCategoriaEdicion = params?.id_categoria 
        ? Number(params.id_categoria) 
        : (categoriaSeleccionada?.id_categoria_edicion ? Number(categoriaSeleccionada.id_categoria_edicion) : 0);

    // Validar que el ID sea válido antes de hacer las llamadas
    const isValidId = idCategoriaEdicion > 0;

    // Cargar la categoría completa desde la API para sincronizar el store
    const { data: categoriaCompleta } = useCategoriaEdicionPorId(
        idCategoriaEdicion,
        { enabled: isValidId }
    );

    // Sincronizar el store cuando se carga la categoría desde la URL
    useEffect(() => {
        if (categoriaCompleta?.configuracion && idCategoriaEdicion > 0) {
            // Solo actualizar si el ID coincide o si no hay categoría seleccionada en el store
            const shouldUpdate = !categoriaSeleccionada || 
                categoriaSeleccionada.id_categoria_edicion !== idCategoriaEdicion ||
                categoriaSeleccionada.publicada !== categoriaCompleta.configuracion.publicada;
            
            if (shouldUpdate) {
                setCategoriaSeleccionada({
                    id_edicion: categoriaCompleta.edicion.id_edicion,
                    id_categoria_edicion: categoriaCompleta.id_categoria_edicion,
                    nombre_completo: categoriaCompleta.categoria.nombre_completo,
                    tipo_futbol: categoriaCompleta.configuracion.tipo_futbol,
                    duracion_tiempo: categoriaCompleta.configuracion.duracion_tiempo,
                    duracion_entretiempo: categoriaCompleta.configuracion.duracion_entretiempo,
                    publicada: categoriaCompleta.configuracion.publicada,
                    puntos_victoria: categoriaCompleta.configuracion.puntos_victoria,
                    puntos_empate: categoriaCompleta.configuracion.puntos_empate,
                    puntos_derrota: categoriaCompleta.configuracion.puntos_derrota,
                    limite_cambios: categoriaCompleta.configuracion.limite_cambios,
                    recambio: categoriaCompleta.configuracion.recambio,
                    color: categoriaCompleta.configuracion.color,
                    fecha_inicio_mercado: categoriaCompleta.configuracion.fecha_inicio_mercado || undefined,
                    fecha_fin_mercado: categoriaCompleta.configuracion.fecha_fin_mercado || undefined,
                });
            }
        }
    }, [categoriaCompleta, idCategoriaEdicion, categoriaSeleccionada, setCategoriaSeleccionada]);

    const { estadisticas, proximosPartidos, ultimosPartidos, isLoading } = 
        useCategoriaResumenData(idCategoriaEdicion);
    
    const { isPublicada, togglePublicada, isUpdating } = 
        useCategoriaPublicacion(idCategoriaEdicion);
    
    // Mostrar skeleton si el ID no es válido todavía (esperando a que los params estén disponibles)
    if (!isValidId) {
        return (
            <div className="space-y-6">
                <CategoriaResumenHeader
                    nombreCategoria="Cargando..."
                    isPublicada={false}
                    onTogglePublicada={() => {}}
                    isUpdating={false}
                />
                <CategoriaResumenSkeleton />
            </div>
        );
    }

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

// Componente principal que envuelve en Suspense
export default function CategoriaResumenPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <CategoriaResumenHeader
          nombreCategoria="Cargando..."
          isPublicada={false}
          onTogglePublicada={() => {}}
          isUpdating={false}
        />
        <CategoriaResumenSkeleton />
      </div>
    }>
      <CategoriaResumenPageContent />
    </Suspense>
  );
}