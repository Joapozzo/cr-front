import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { noticiasService } from '../services/noticias.services';
import { Noticia, NoticiasPaginadas, CrearNoticiaInput, ActualizarNoticiaInput, FiltrosNoticias, NoticiasPublicadasResponse } from '../types/noticia';

// Query Keys para noticias
export const noticiasKeys = {
    all: ['noticias'] as const,
    publicadas: () => [...noticiasKeys.all, 'publicadas'] as const,
    publicadasHome: (limit?: number) => [...noticiasKeys.publicadas(), 'home', limit] as const,
    publicadasCompleta: (
        busqueda?: string,
        destacada?: boolean,
        id_tipo_noticia?: number,
        id_categoria_edicion?: number,
        page?: number
    ) => [...noticiasKeys.publicadas(), 'completa', busqueda, destacada, id_tipo_noticia, id_categoria_edicion, page] as const,
    porSlug: (slug: string) => [...noticiasKeys.all, 'slug', slug] as const,
    // Admin keys
    admin: () => [...noticiasKeys.all, 'admin'] as const,
    adminList: (filtros?: FiltrosNoticias) => [...noticiasKeys.admin(), 'list', filtros] as const,
    adminDetail: (id: number) => [...noticiasKeys.admin(), 'detail', id] as const,
};

export const useNoticiasPublicadas = (
    limit?: number,
    page?: number,
    busqueda?: string,
    destacada?: boolean,
    id_tipo_noticia?: number,
    id_categoria_edicion?: number,
    options?: Omit<UseQueryOptions<NoticiasPublicadasResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: limit === 5 
            ? noticiasKeys.publicadasHome(limit)
            : noticiasKeys.publicadasCompleta(busqueda, destacada, id_tipo_noticia, id_categoria_edicion, page),
        queryFn: () => noticiasService.obtenerNoticiasPublicadas(
            limit,
            page,
            busqueda,
            destacada,
            id_tipo_noticia,
            id_categoria_edicion
        ),
        staleTime: 2 * 60 * 1000, // 2 minutos - las noticias cambian con frecuencia
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Usar cache si los datos están frescos (dentro de staleTime)
        refetchOnReconnect: true,
        ...options,
    });
};

/**
 * Hook para obtener noticia por slug
 * @param slug - Slug de la noticia
 * @param options - Opciones adicionales de useQuery
 */
export const useNoticiaPorSlug = (
    slug: string,
    options?: Omit<UseQueryOptions<Noticia, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: noticiasKeys.porSlug(slug),
        queryFn: () => noticiasService.obtenerNoticiaPorSlug(slug),
        staleTime: 5 * 60 * 1000, // 5 minutos - una noticia individual cambia menos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!slug, // Solo hacer fetch si hay slug
        ...options,
    });
};

// ==================== HOOKS DE ADMINISTRACIÓN ====================

/**
 * Hook para listar todas las noticias (admin) con filtros
 */
export const useListarNoticias = (
    filtros: FiltrosNoticias = {},
    options?: Omit<UseQueryOptions<NoticiasPaginadas, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: noticiasKeys.adminList(filtros),
        queryFn: () => noticiasService.listarNoticias(filtros),
        staleTime: 1 * 60 * 1000, // 1 minuto - las noticias admin cambian frecuentemente
        gcTime: 5 * 60 * 1000, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        ...options,
    });
};

/**
 * Hook para crear una noticia
 */
export const useCrearNoticia = (
    options?: UseMutationOptions<Noticia, Error, CrearNoticiaInput>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearNoticiaInput) => noticiasService.crearNoticia(data),
        onSuccess: () => {
            // Invalidar todas las queries de noticias admin
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.admin(),
                exact: false,
            });
            // Invalidar también las queries públicas por si se publicó
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.publicadas(),
                exact: false,
            });
        },
        ...options,
    });
};

/**
 * Hook para actualizar una noticia
 */
export const useActualizarNoticia = (
    options?: UseMutationOptions<Noticia, Error, { id_noticia: number; data: ActualizarNoticiaInput }>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_noticia, data }: { id_noticia: number; data: ActualizarNoticiaInput }) =>
            noticiasService.actualizarNoticia(id_noticia, data),
        onSuccess: (data, variables) => {
            // Invalidar la query específica de la noticia
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.adminDetail(variables.id_noticia),
            });
            // Invalidar todas las queries de listado admin
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.adminList(),
                exact: false,
            });
            // Invalidar queries públicas por si cambió el estado de publicación
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.publicadas(),
                exact: false,
            });
            // Invalidar query por slug si tiene slug
            if (data.slug) {
                queryClient.invalidateQueries({
                    queryKey: noticiasKeys.porSlug(data.slug),
                });
            }
        },
        ...options,
    });
};

/**
 * Hook para eliminar una noticia
 */
export const useEliminarNoticia = (
    options?: UseMutationOptions<void, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_noticia: number) => noticiasService.eliminarNoticia(id_noticia),
        onSuccess: (_, id_noticia) => {
            // Invalidar todas las queries de noticias admin
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.admin(),
                exact: false,
            });
            // Invalidar queries públicas
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.publicadas(),
                exact: false,
            });
            // Remover la query específica de la noticia del cache
            queryClient.removeQueries({
                queryKey: noticiasKeys.adminDetail(id_noticia),
            });
        },
        ...options,
    });
};

/**
 * Hook para toggle de publicación (publicar/despublicar)
 */
export const useTogglePublicacion = (
    options?: UseMutationOptions<Noticia, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id_noticia: number) => noticiasService.togglePublicacion(id_noticia),
        onSuccess: (data, id_noticia) => {
            // Invalidar la query específica de la noticia
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.adminDetail(id_noticia),
            });
            // Invalidar todas las queries de listado admin
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.adminList(),
                exact: false,
            });
            // Invalidar queries públicas (importante porque cambió el estado de publicación)
            queryClient.invalidateQueries({
                queryKey: noticiasKeys.publicadas(),
                exact: false,
            });
            // Invalidar query por slug si tiene slug
            if (data.slug) {
                queryClient.invalidateQueries({
                    queryKey: noticiasKeys.porSlug(data.slug),
                });
            }
        },
        ...options,
    });
};
