import { useMutation, useQueryClient } from '@tanstack/react-query';
import { temporadasService } from '../services/temporadas.services';
import { equiposKeys } from './useEquipos'; 

export const temporadasKeys = {
    all: ['temporadas'] as const,
};

export const zonasKeys = {
    all: ['zonas'] as const,
    porCategoria: (id_categoria_edicion: number) => [...zonasKeys.all, 'categoria', id_categoria_edicion] as const,
    porId: (id_zona: number) => [...zonasKeys.all, 'zona', id_zona] as const,
};

export const useOcuparVacante = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id_zona,
            id_categoria_edicion,
            data
        }: {
            id_zona: number;
            id_categoria_edicion: number;
            data: { vacante: number; id_equipo: number }
        }) =>
            temporadasService.ocuparVacante(id_zona, id_categoria_edicion, data),
        onSuccess: (response, { id_zona, id_categoria_edicion }) => {
                        queryClient.invalidateQueries({ queryKey: equiposKeys.porCategoriaEdicion(id_categoria_edicion) });

            // Invalidar todas las queries de temporadas
            queryClient.invalidateQueries({ queryKey: temporadasKeys.all });

            // Invalidar todas las queries de zonas
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });

            // Invalidar queries específicas de la zona y categoría afectadas
            queryClient.invalidateQueries({ queryKey: zonasKeys.porId(id_zona) });
            queryClient.invalidateQueries({ queryKey: zonasKeys.porCategoria(id_categoria_edicion) });
        },
        onError: (error) => {
            console.error('❌ Error al ocupar vacante:', error);
        },
    });
};

export const useLiberarVacante = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id_zona,
            id_categoria_edicion,
            data
        }: {
            id_zona: number;
            id_categoria_edicion: number;
            data: { vacante: number }
        }) =>
            temporadasService.liberarVacante(id_zona, id_categoria_edicion, data),
        onSuccess: (response, { id_zona, id_categoria_edicion }) => {
            queryClient.invalidateQueries({ queryKey: equiposKeys.porCategoriaEdicion(id_categoria_edicion) });

            // Invalidar todas las queries de temporadas
            queryClient.invalidateQueries({ queryKey: temporadasKeys.all });

            // Invalidar todas las queries de zonas
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });

            // Invalidar queries específicas de la zona y categoría afectadas
            queryClient.invalidateQueries({ queryKey: zonasKeys.porId(id_zona) });
            queryClient.invalidateQueries({ queryKey: zonasKeys.porCategoria(id_categoria_edicion) });
        },
        onError: (error) => {
            console.error('❌ Error al liberar vacante:', error);
        },
    });
};

export const useActualizarVacante = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id_zona,
            id_categoria_edicion,
            data
        }: {
            id_zona: number;
            id_categoria_edicion: number;
            data: { vacante: number; id_equipo: number }
        }) =>
            temporadasService.actualizarVacante(id_zona, id_categoria_edicion, data),
        onSuccess: (response, { id_zona, id_categoria_edicion }) => {
            queryClient.invalidateQueries({ queryKey: equiposKeys.porCategoriaEdicion(id_categoria_edicion) });

            // Invalidar todas las queries de temporadas
            queryClient.invalidateQueries({ queryKey: temporadasKeys.all });

            // Invalidar todas las queries de zonas
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });

            // Invalidar queries específicas de la zona y categoría afectadas
            queryClient.invalidateQueries({ queryKey: zonasKeys.porId(id_zona) });
            queryClient.invalidateQueries({ queryKey: zonasKeys.porCategoria(id_categoria_edicion) });
        },
        onError: (error) => {
            console.error('❌ Error al actualizar vacante:', error);
        },
    });
};

export const useTemporadasMutations = () => {
    const ocuparVacante = useOcuparVacante();
    const liberarVacante = useLiberarVacante();
    const actualizarVacante = useActualizarVacante();

    return {
        ocuparVacante,
        liberarVacante,
        actualizarVacante,
        // Estados combinados para facilitar el manejo en el UI
        isLoading: ocuparVacante.isPending || liberarVacante.isPending || actualizarVacante.isPending,
        isError: ocuparVacante.isError || liberarVacante.isError || actualizarVacante.isError,
        error: ocuparVacante.error || liberarVacante.error || actualizarVacante.error,
    };
};