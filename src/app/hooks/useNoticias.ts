import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { noticiasService } from '../services/noticias.services';
import { Noticia } from '../types/noticia';

// Tipos para respuesta de noticias
export interface NoticiasPublicadasResponse {
    noticias: Noticia[];
    total: number;
    limit: number | null;
    offset: number;
}

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
};

/**
 * Hook para obtener noticias publicadas
 * @param limit - Cantidad máxima de noticias
 * @param page - Número de página para paginación
 * @param busqueda - Búsqueda en título y contenido
 * @param destacada - Filtrar por destacadas
 * @param id_tipo_noticia - Filtrar por tipo de noticia
 * @param id_categoria_edicion - Filtrar por categoría edición
 * @param options - Opciones adicionales de useQuery
 */
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
        refetchOnMount: true,
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
