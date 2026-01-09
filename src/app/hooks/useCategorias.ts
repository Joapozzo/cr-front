import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { categoriasService } from '../services/categorias.services';
import { CategoriaActual, CategoriaEdicionDto } from '../types/categoria';

export const categoriasKeys = {
    all: ['categorias'] as const,
    porEdicion: (id_edicion: number) => [...categoriasKeys.all, 'edicion', id_edicion] as const,
    porId: (id_categoria_edicion: number) => [...categoriasKeys.all, 'categoria', id_categoria_edicion] as const,
    datosCrear: () => [...categoriasKeys.all, 'datos-crear'] as const,
    edicionesActivas: () => [...categoriasKeys.all, 'ediciones-activas'] as const,
};

export const useCategoriasPorEdicion = (
    id_edicion: number,
    options?: Omit<UseQueryOptions<CategoriaEdicionDto[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: categoriasKeys.porEdicion(id_edicion),
        queryFn: () => categoriasService.obtenerCategoriasPorEdicion(id_edicion),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_edicion, // Solo ejecutar si hay un id_edicion válido
        ...options,
    });
};

export const useCategoriasPorEdicionActivas = (
    options?: Omit<UseQueryOptions<CategoriaActual[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: categoriasKeys.edicionesActivas(),
        queryFn: () => categoriasService.obtenerCategoriasPorEdicionActivas(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};


export const useCategoriaEdicionPorId = (
    id_categoria_edicion: number,
    options?: Omit<UseQueryOptions<CategoriaEdicionDto, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: categoriasKeys.porId(id_categoria_edicion),
        queryFn: () => categoriasService.obtenerCategoriaEdicionPorId(id_categoria_edicion),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id_categoria_edicion, // Solo ejecutar si hay un id válido
        ...options,
    });
};

// Hook genérico para diferentes tipos de consultas de categorías
type CategoriasQueryType = 'porEdicion' | 'porId';

export const useCategorias = <T extends CategoriasQueryType>(
    type: T,
    id: number,
    options?: Omit<
        UseQueryOptions<
            T extends 'porEdicion' ? CategoriaEdicionDto[] : CategoriaEdicionDto,
            Error
        >,
        'queryKey' | 'queryFn'
    >
) => {
    const queryConfig = {
        porEdicion: {
            queryKey: categoriasKeys.porEdicion(id),
            queryFn: () => categoriasService.obtenerCategoriasPorEdicion(id),
        },
        porId: {
            queryKey: categoriasKeys.porId(id),
            queryFn: () => categoriasService.obtenerCategoriaEdicionPorId(id),
        },
    };

    return useQuery({
        ...queryConfig[type],
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!id,
        ...options,
    } as any);
};

export const useDatosParaCrearCategoria = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: categoriasKeys.datosCrear(),
        queryFn: () => categoriasService.obtenerDatosParaCrearCategoria(),
        staleTime: 10 * 60 * 1000, // 10 minutos (datos más estables)
        gcTime: 15 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useCrearCategoriaEdicion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_edicion, data }: { id_edicion: number; data: any }) =>
            categoriasService.crearCategoriaEdicion(id_edicion, data),
        onSuccess: (_, { id_edicion }) => {
            // Invalidar las queries relacionadas
            queryClient.invalidateQueries({ queryKey: categoriasKeys.all });
            queryClient.invalidateQueries({ queryKey: categoriasKeys.porEdicion(id_edicion) });
        },
        onError: (error) => {
            console.error('Error al crear categoría edición:', error);
        },
    });
};

export const useActualizarCategoriaEdicion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_categoria_edicion, data }: { id_categoria_edicion: number; data: any }) =>
            categoriasService.actualizarCategoriaEdicion(id_categoria_edicion, data),
        onSuccess: (_, { id_categoria_edicion }) => {
            // Invalidar las queries relacionadas
            queryClient.invalidateQueries({ queryKey: categoriasKeys.all });
            queryClient.invalidateQueries({ queryKey: categoriasKeys.porId(id_categoria_edicion) });
        },
        onError: (error) => {
            console.error('Error al actualizar categoría edición:', error);
        },
    });
};

export const useActualizarPublicadaCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_categoria_edicion, publicada }: { id_categoria_edicion: number; publicada: 'S' | 'N' }) =>
            categoriasService.actualizarPublicadaCategoria(id_categoria_edicion, publicada),
        onSuccess: (_, { id_categoria_edicion }) => {
            // Invalidar las queries relacionadas
            queryClient.invalidateQueries({ queryKey: categoriasKeys.all });
            queryClient.invalidateQueries({ queryKey: categoriasKeys.porId(id_categoria_edicion) });
        },
        onError: (error) => {
            console.error('Error al actualizar estado de publicación:', error);
        },
    });
};

export const useCrearNombreCategoria = (options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ nombre, descripcion }: { nombre: string; descripcion?: string }) =>
            categoriasService.crearNombreCategoria(nombre, descripcion),
        onSuccess: () => {
            // Invalidar las queries relacionadas para refrescar los datos disponibles
            queryClient.invalidateQueries({ queryKey: categoriasKeys.datosCrear() });
            options?.onSuccess?.();
        },
        onError: (error: Error) => {
            console.error('Error al crear nombre de categoría:', error);
            options?.onError?.(error);
        },
    });
};

export const useCrearDivision = (options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ nombre, descripcion, genero }: { nombre: string; descripcion?: string; genero?: 'M' | 'F' | 'X' }) =>
            categoriasService.crearDivision(nombre, descripcion, genero),
        onSuccess: () => {
            // Invalidar las queries relacionadas para refrescar los datos disponibles
            queryClient.invalidateQueries({ queryKey: categoriasKeys.datosCrear() });
            options?.onSuccess?.();
        },
        onError: (error: Error) => {
            console.error('Error al crear división:', error);
            options?.onError?.(error);
        },
    });
};