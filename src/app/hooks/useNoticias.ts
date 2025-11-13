'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    noticiasService,
} from '../services/noticias.services';
import { Noticia, NoticiasPaginadas, CrearNoticiaInput, ActualizarNoticiaInput, FiltrosNoticias } from '../types/noticia';

// Keys para React Query
export const noticiasKeys = {
    all: ['noticias'] as const,
    lists: () => [...noticiasKeys.all, 'list'] as const,
    list: (filtros: FiltrosNoticias) => [...noticiasKeys.lists(), filtros] as const,
    details: () => [...noticiasKeys.all, 'detail'] as const,
    detail: (id: number) => [...noticiasKeys.details(), id] as const,
    slug: (slug: string) => [...noticiasKeys.all, 'slug', slug] as const,
    destacadas: (limit?: number) => [...noticiasKeys.all, 'destacadas', limit] as const,
    recientes: (limit?: number) => [...noticiasKeys.all, 'recientes', limit] as const,
    tipos: () => [...noticiasKeys.all, 'tipos'] as const,
};

// ============================================
// HOOKS PARA RUTAS PÚBLICAS (Usuario)
// ============================================

/**
 * Hook para obtener noticias publicadas con filtros
 */
export const useNoticiasPublicadas = (filtros: FiltrosNoticias = {}) => {
    return useQuery<NoticiasPaginadas>({
        queryKey: noticiasKeys.list(filtros),
        queryFn: () => noticiasService.obtenerNoticiasPublicadas(filtros),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

/**
 * Hook para obtener noticias destacadas
 */
export const useNoticiasDestacadas = (limit?: number) => {
    return useQuery<Noticia[]>({
        queryKey: noticiasKeys.destacadas(limit),
        queryFn: () => noticiasService.obtenerNoticiasDestacadas(limit),
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook para obtener noticias recientes
 */
export const useNoticiasRecientes = (limit?: number) => {
    return useQuery<Noticia[]>({
        queryKey: noticiasKeys.recientes(limit),
        queryFn: () => noticiasService.obtenerNoticiasRecientes(limit),
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook para obtener noticia por slug
 */
export const useNoticiaPorSlug = (slug: string, enabled: boolean = true) => {
    return useQuery<Noticia>({
        queryKey: noticiasKeys.slug(slug),
        queryFn: () => noticiasService.obtenerNoticiaPorSlug(slug),
        enabled: enabled && !!slug,
        staleTime: 1000 * 60 * 10,
    });
};

/**
 * Hook para obtener detalle de una noticia por ID
 */
export const useNoticiaDetalle = (id_noticia: number, enabled: boolean = true) => {
    return useQuery<Noticia>({
        queryKey: noticiasKeys.detail(id_noticia),
        queryFn: () => noticiasService.obtenerNoticiaDetalle(id_noticia),
        enabled: enabled && !!id_noticia,
        staleTime: 1000 * 60 * 10,
    });
};

// ============================================
// HOOKS PARA RUTAS ADMIN
// ============================================

/**
 * Hook para listar todas las noticias (admin)
 */
export const useListarNoticias = (filtros: FiltrosNoticias = {}) => {
    return useQuery<NoticiasPaginadas>({
        queryKey: noticiasKeys.list(filtros),
        queryFn: () => noticiasService.listarNoticias(filtros),
        staleTime: 1000 * 60 * 2, // 2 minutos para admin
    });
};

/**
 * Hook para crear noticia
 */
export const useCrearNoticia = () => {
    const queryClient = useQueryClient();

    return useMutation<Noticia, Error, CrearNoticiaInput>({
        mutationFn: (data) => noticiasService.crearNoticia(data),
        onSuccess: () => {
            // Invalidar todas las listas de noticias
            queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.destacadas() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.recientes() });
        },
    });
};

/**
 * Hook para actualizar noticia
 */
export const useActualizarNoticia = () => {
    const queryClient = useQueryClient();

    return useMutation<Noticia, Error, { id_noticia: number; data: ActualizarNoticiaInput }>({
        mutationFn: ({ id_noticia, data }) => noticiasService.actualizarNoticia(id_noticia, data),
        onSuccess: (data, variables) => {
            // Invalidar todas las listas de noticias
            queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.destacadas() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.recientes() });

            // Actualizar el detalle de la noticia específica
            queryClient.invalidateQueries({ queryKey: noticiasKeys.detail(variables.id_noticia) });
        },
    });
};

/**
 * Hook para eliminar noticia
 */
export const useEliminarNoticia = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (id_noticia) => noticiasService.eliminarNoticia(id_noticia),
        onSuccess: (_, id_noticia) => {
            // Invalidar todas las listas de noticias
            queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.destacadas() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.recientes() });

            // Remover el detalle de la noticia específica
            queryClient.removeQueries({ queryKey: noticiasKeys.detail(id_noticia) });
        },
    });
};

/**
 * Hook para toggle publicación
 */
export const useTogglePublicacion = () => {
    const queryClient = useQueryClient();

    return useMutation<Noticia, Error, number>({
        mutationFn: (id_noticia) => noticiasService.togglePublicacion(id_noticia),
        onSuccess: (data, id_noticia) => {
            // Invalidar todas las listas de noticias
            queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.destacadas() });
            queryClient.invalidateQueries({ queryKey: noticiasKeys.recientes() });

            // Actualizar el detalle de la noticia específica
            queryClient.setQueryData(noticiasKeys.detail(id_noticia), data);
        },
    });
};

// ============================================
// HOOKS PARA TIPOS DE NOTICIA
// ============================================

/**
 * Hook para obtener tipos de noticia
 */
export const useTiposNoticia = () => {
    return useQuery<Array<{ id_tipo_noticia: number; nombre: string }>>({
        queryKey: noticiasKeys.tipos(),
        queryFn: () => noticiasService.obtenerTiposNoticia(),
        staleTime: 1000 * 60 * 30, // 30 minutos (los tipos cambian poco)
    });
};

/**
 * Hook para crear tipo de noticia
 */
export const useCrearTipoNoticia = () => {
    const queryClient = useQueryClient();

    return useMutation<{ id_tipo_noticia: number; nombre: string }, Error, string>({
        mutationFn: (nombre) => noticiasService.crearTipoNoticia(nombre),
        onSuccess: () => {
            // Invalidar la lista de tipos
            queryClient.invalidateQueries({ queryKey: noticiasKeys.tipos() });
        },
    });
};
