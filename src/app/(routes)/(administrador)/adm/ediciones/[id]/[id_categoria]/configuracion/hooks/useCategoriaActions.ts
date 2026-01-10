/**
 * Hook para manejar las acciones de categoría (actualizar, publicar)
 * Responsabilidad: Lógica de negocio y llamadas a API
 */
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useActualizarCategoriaEdicion, useActualizarPublicadaCategoria } from '@/app/hooks/useCategorias';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { ActualizarConfigPayload } from '../types/configuracion.types';
import { formatConfigForAPI } from '../utils/categoriaUtils';
import { CategoriaEdicionConfig } from '../types/configuracion.types';

interface UseCategoriaActionsReturn {
    actualizarConfig: (
        changedFields: Partial<CategoriaEdicionConfig>,
        currentConfig: CategoriaEdicionConfig,
        originalConfig: CategoriaEdicionConfig
    ) => Promise<void>;
    togglePublicada: () => void;
    isLoading: boolean;
}

/**
 * Hook para manejar acciones de categoría
 * @param idCategoriaEdicion - ID de la categoría edición
 */
export function useCategoriaActions(idCategoriaEdicion: number): UseCategoriaActionsReturn {
    const { mutate: actualizarCategoriaEdicion, isPending: isUpdatingConfig } = 
        useActualizarCategoriaEdicion();
    const { mutate: actualizarPublicada, isPending: isUpdatingPublicada } = 
        useActualizarPublicadaCategoria();
    const { categoriaSeleccionada, setCategoriaSeleccionada } = useCategoriaStore();

    const isPublicada = categoriaSeleccionada?.publicada === 'S';

    /**
     * Actualiza la configuración de la categoría
     */
    const actualizarConfig = useCallback(async (
        changedFields: Partial<CategoriaEdicionConfig>,
        currentConfig: CategoriaEdicionConfig,
        originalConfig: CategoriaEdicionConfig
    ) => {
        if (!idCategoriaEdicion || idCategoriaEdicion === 0) {
            toast.error('No se encontró la categoría a actualizar');
            return;
        }

        // Formatear los campos cambiados para la API
        const payload = formatConfigForAPI(currentConfig, originalConfig);

        if (Object.keys(payload).length === 0) {
            toast.error('No hay cambios para guardar');
            return;
        }

        return new Promise<void>((resolve, reject) => {
            actualizarCategoriaEdicion(
                { id_categoria_edicion: idCategoriaEdicion, data: payload },
                {
                    onSuccess: () => {
                        toast.success('Categoría actualizada exitosamente');
                        // Actualizar el store con los nuevos valores
                        if (categoriaSeleccionada) {
                            setCategoriaSeleccionada({
                                ...categoriaSeleccionada,
                                tipo_futbol: currentConfig.tipo_futbol,
                                duracion_tiempo: currentConfig.duracion_tiempo,
                                duracion_entretiempo: currentConfig.duracion_entretiempo,
                                puntos_victoria: currentConfig.puntos_victoria,
                                puntos_empate: currentConfig.puntos_empate,
                                puntos_derrota: currentConfig.puntos_derrota,
                                fecha_inicio_mercado: currentConfig.fecha_inicio_mercado,
                                fecha_fin_mercado: currentConfig.fecha_fin_mercado,
                                limite_cambios: currentConfig.limite_cambios,
                                recambio: currentConfig.recambio,
                                color: currentConfig.color,
                            });
                        }
                        resolve();
                    },
                    onError: (error: Error) => {
                        toast.error(error.message || 'Error al actualizar la categoría');
                        reject(error);
                    }
                }
            );
        });
    }, [idCategoriaEdicion, actualizarCategoriaEdicion, categoriaSeleccionada, setCategoriaSeleccionada]);

    /**
     * Alterna el estado de publicación de la categoría
     */
    const togglePublicada = useCallback(() => {
        if (!idCategoriaEdicion || idCategoriaEdicion === 0) {
            toast.error('No se encontró la categoría');
            return;
        }

        const nuevoEstado: 'S' | 'N' = isPublicada ? 'N' : 'S';

        actualizarPublicada(
            { id_categoria_edicion: idCategoriaEdicion, publicada: nuevoEstado },
            {
                onSuccess: () => {
                    toast.success(
                        nuevoEstado === 'S' 
                            ? 'Categoría publicada exitosamente' 
                            : 'Categoría despublicada exitosamente'
                    );
                    // Actualizar el store
                    if (categoriaSeleccionada) {
                        setCategoriaSeleccionada({
                            ...categoriaSeleccionada,
                            publicada: nuevoEstado
                        });
                    }
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al actualizar el estado de publicación');
                }
            }
        );
    }, [idCategoriaEdicion, isPublicada, actualizarPublicada, categoriaSeleccionada, setCategoriaSeleccionada]);

    return {
        actualizarConfig,
        togglePublicada,
        isLoading: isUpdatingConfig || isUpdatingPublicada,
    };
}

