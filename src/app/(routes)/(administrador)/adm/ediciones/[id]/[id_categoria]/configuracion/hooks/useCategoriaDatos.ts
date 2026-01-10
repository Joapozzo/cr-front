/**
 * Hook para manejar la obtención y sincronización de datos de categoría
 * Responsabilidad: Decidir la fuente de verdad (URL params vs store) y sincronizar con el store
 */
import { useMemo, useEffect } from 'react';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useCategoriaEdicionPorId } from '@/app/hooks/useCategorias';
import { CategoriaEdicionDto } from '@/app/types/categoria';
import { formatConfigFromAPI } from '../utils/categoriaUtils';
import { CategoriaEdicionConfig } from '../types/configuracion.types';

interface UseCategoriaDatosReturn {
    categoria: CategoriaEdicionDto | null;
    configuracion: CategoriaEdicionConfig | null;
    isLoading: boolean;
    error: Error | null;
    idCategoriaEdicion: number;
    nombreCompleto: string;
    isPublicada: boolean;
}

export function useCategoriaDatos(idFromParams?: string | number): UseCategoriaDatosReturn {
    const { categoriaSeleccionada, setCategoriaSeleccionada } = useCategoriaStore();
    
    // Priorizar el param de la URL sobre el store
    const idCategoriaEdicion = useMemo(() => {
        if (idFromParams) {
            return Number(idFromParams);
        }
        return categoriaSeleccionada?.id_categoria_edicion 
            ? Number(categoriaSeleccionada.id_categoria_edicion) 
            : 0;
    }, [idFromParams, categoriaSeleccionada?.id_categoria_edicion]);

    // Obtener datos completos de la categoría desde React Query
    const { data: categoriaCompleta, isLoading, error } = useCategoriaEdicionPorId(
        idCategoriaEdicion,
        { enabled: idCategoriaEdicion > 0 }
    );

    // Transformar la configuración de la API al formato del formulario
    const configuracion = useMemo(() => {
        if (categoriaCompleta?.configuracion) {
            return formatConfigFromAPI(categoriaCompleta.configuracion);
        }
        return null;
    }, [categoriaCompleta?.configuracion]);

    // Sincronizar el store cuando se obtengan los datos completos
    // Solo actualizar si realmente hay diferencias para evitar loops
    useEffect(() => {
        if (categoriaCompleta?.configuracion && categoriaSeleccionada) {
            const configuracionApi = categoriaCompleta.configuracion;
            const needsUpdate = 
                categoriaSeleccionada.tipo_futbol !== configuracionApi.tipo_futbol ||
                categoriaSeleccionada.duracion_tiempo !== configuracionApi.duracion_tiempo ||
                categoriaSeleccionada.duracion_entretiempo !== configuracionApi.duracion_entretiempo ||
                categoriaSeleccionada.puntos_victoria !== configuracionApi.puntos_victoria ||
                categoriaSeleccionada.puntos_empate !== configuracionApi.puntos_empate ||
                categoriaSeleccionada.puntos_derrota !== configuracionApi.puntos_derrota ||
                categoriaSeleccionada.fecha_inicio_mercado !== (configuracionApi.fecha_inicio_mercado ?? undefined) ||
                categoriaSeleccionada.fecha_fin_mercado !== (configuracionApi.fecha_fin_mercado ?? undefined) ||
                categoriaSeleccionada.limite_cambios !== (configuracionApi.limite_cambios ?? null) ||
                categoriaSeleccionada.recambio !== (configuracionApi.recambio ?? null) ||
                categoriaSeleccionada.color !== (configuracionApi.color ?? null) ||
                categoriaSeleccionada.publicada !== configuracionApi.publicada ||
                categoriaSeleccionada.id_categoria_edicion !== categoriaCompleta.id_categoria_edicion ||
                categoriaSeleccionada.nombre_completo !== categoriaCompleta.categoria.nombre_completo;

            if (needsUpdate) {
                setCategoriaSeleccionada({
                    ...categoriaSeleccionada,
                    id_categoria_edicion: categoriaCompleta.id_categoria_edicion,
                    nombre_completo: categoriaCompleta.categoria.nombre_completo,
                    tipo_futbol: configuracionApi.tipo_futbol,
                    duracion_tiempo: configuracionApi.duracion_tiempo,
                    duracion_entretiempo: configuracionApi.duracion_entretiempo,
                    puntos_victoria: configuracionApi.puntos_victoria,
                    puntos_empate: configuracionApi.puntos_empate,
                    puntos_derrota: configuracionApi.puntos_derrota,
                    fecha_inicio_mercado: configuracionApi.fecha_inicio_mercado ?? undefined,
                    fecha_fin_mercado: configuracionApi.fecha_fin_mercado ?? undefined,
                    limite_cambios: configuracionApi.limite_cambios ?? null,
                    recambio: configuracionApi.recambio ?? null,
                    color: configuracionApi.color ?? null,
                    publicada: configuracionApi.publicada,
                });
            }
        }
    }, [categoriaCompleta, categoriaSeleccionada, setCategoriaSeleccionada]);

    const nombreCompleto = categoriaCompleta?.categoria.nombre_completo || categoriaSeleccionada?.nombre_completo || '';
    const isPublicada = categoriaCompleta?.configuracion.publicada === 'S' || categoriaSeleccionada?.publicada === 'S';

    return {
        categoria: categoriaCompleta ?? null,
        configuracion,
        isLoading,
        error: error as Error | null,
        idCategoriaEdicion,
        nombreCompleto,
        isPublicada,
    };
}

