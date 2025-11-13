import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { zonasService } from '../services/zonas.services';
import { Zona, DatosCrearZonaResponse, CrearZonaInput, EditarZonaInput, ZonasList2Response } from '../types/zonas';

export const zonasKeys = {
    all: ['zonas'] as const,
    porFase: (id_categoria_edicion: number, numero_fase: number) => [...zonasKeys.all, 'fase', id_categoria_edicion, numero_fase] as const,
    datosCrear: () => [...zonasKeys.all, 'datos-crear'] as const,
};

export const useZonasPorFase = (
    id_categoria_edicion: number,
    numero_fase: number,
    options?: Omit<UseQueryOptions<Zona[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: zonasKeys.porFase(id_categoria_edicion, numero_fase),
        queryFn: () => zonasService.obtenerZonasPorFase(id_categoria_edicion, numero_fase),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion && !!numero_fase, // Solo ejecutar si hay valores válidos
        ...options,
    });
};

export const useDatosParaCrearZona = (
    options?: Omit<UseQueryOptions<DatosCrearZonaResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: zonasKeys.datosCrear(),
        queryFn: () => zonasService.obtenerDatosParaCrearZona(),
        staleTime: 10 * 60 * 1000, // 10 minutos (datos más estables)
        gcTime: 15 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useCrearZona = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id_categoria_edicion,
            numero_fase,
            data
        }: {
            id_categoria_edicion: number;
            numero_fase: number;
            data: CrearZonaInput;
        }) =>
            zonasService.crearZona(id_categoria_edicion, numero_fase, data),
        onSuccess: (_, { id_categoria_edicion, numero_fase }) => {
            // Invalidar las queries relacionadas
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });
            queryClient.invalidateQueries({
                queryKey: zonasKeys.porFase(id_categoria_edicion, numero_fase)
            });
        },
        onError: (error) => {
            console.error('Error al crear zona:', error);
        },
    });
};

export const useEditarZona = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id_zona,
            id_categoria_edicion,
            data
        }: {
            id_zona: number;
            id_categoria_edicion: number;
            data: EditarZonaInput;
        }) =>
            zonasService.editarZona(id_zona, id_categoria_edicion, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });
        },
        onError: (error) => {
            console.error('Error al editar zona:', error);
        },
    });
};

export const useEliminarZona = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_zona: number) => zonasService.eliminarZona(id_zona),
        onSuccess: (data, id_zona) => {
            // Solo invalidar queries, NO mostrar toast
            queryClient.invalidateQueries({ queryKey: zonasKeys.all });
        },
        onError: (error: any, id_zona) => {
            // Solo log, NO mostrar toast
            console.error('Error al eliminar zona:', error);
        },
    });
};

export const useObtenerTodasLasZonas = (
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<ZonasList2Response[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: [...zonasKeys.all, 'todas', id_categoria_edicion] as const,
        queryFn: () => zonasService.obtenerTodasLasZonas(id_categoria_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion, // Solo ejecutar si hay valor válido
        ...options,
    });
};