import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { 
    configuracionPrecioService,
    ConfiguracionPrecio,
    CrearPrecioInput,
    ActualizarPrecioInput,
    AplicarMasivoInput,
    ImportarPreciosInput,
    TipoConcepto
} from '../services/configuracionPrecio.services';

// ============================================
// QUERY KEYS
// ============================================

export const configuracionPreciosKeys = {
    all: ['configuracion-precios'] as const,
    porEdicion: (id_edicion: number, filtros?: any) => 
        [...configuracionPreciosKeys.all, 'edicion', id_edicion, filtros] as const,
    porCategoria: (id_categoria_edicion: number) => 
        [...configuracionPreciosKeys.all, 'categoria', id_categoria_edicion] as const,
    globales: (id_edicion: number) => 
        [...configuracionPreciosKeys.all, 'globales', id_edicion] as const,
    historial: (id_edicion: number, tipo_concepto: TipoConcepto, id_categoria_edicion?: number) =>
        [...configuracionPreciosKeys.all, 'historial', id_edicion, tipo_concepto, id_categoria_edicion] as const,
};

// ============================================
// QUERIES
// ============================================

export const usePreciosPorEdicion = (
    id_edicion: number,
    filtros?: {
        tipo_concepto?: TipoConcepto;
        id_categoria_edicion?: number;
        activo?: boolean;
    },
    options?: UseQueryOptions<ConfiguracionPrecio[], Error>
) => {
    return useQuery<ConfiguracionPrecio[], Error>({
        queryKey: configuracionPreciosKeys.porEdicion(id_edicion, filtros),
        queryFn: () => configuracionPrecioService.obtenerPreciosPorEdicion(id_edicion, filtros),
        enabled: !!id_edicion,
        staleTime: 2 * 60 * 1000, // 2 minutos
        ...options,
    });
};

export const usePreciosPorCategoria = (
    id_categoria_edicion: number,
    options?: UseQueryOptions<ConfiguracionPrecio[], Error>
) => {
    return useQuery<ConfiguracionPrecio[], Error>({
        queryKey: configuracionPreciosKeys.porCategoria(id_categoria_edicion),
        queryFn: () => configuracionPrecioService.obtenerPreciosPorCategoria(id_categoria_edicion),
        enabled: !!id_categoria_edicion,
        ...options,
    });
};

export const usePreciosGlobales = (
    id_edicion: number,
    options?: UseQueryOptions<ConfiguracionPrecio[], Error>
) => {
    return useQuery<ConfiguracionPrecio[], Error>({
        queryKey: configuracionPreciosKeys.globales(id_edicion),
        queryFn: () => configuracionPrecioService.obtenerPreciosGlobales(id_edicion),
        enabled: !!id_edicion,
        ...options,
    });
};

export const useHistorialPrecio = (
    id_edicion: number,
    tipo_concepto: TipoConcepto,
    id_categoria_edicion?: number,
    options?: UseQueryOptions<ConfiguracionPrecio[], Error>
) => {
    return useQuery<ConfiguracionPrecio[], Error>({
        queryKey: configuracionPreciosKeys.historial(id_edicion, tipo_concepto, id_categoria_edicion),
        queryFn: () => configuracionPrecioService.obtenerHistorial(id_edicion, tipo_concepto, id_categoria_edicion),
        enabled: !!id_edicion && !!tipo_concepto,
        ...options,
    });
};

// ============================================
// MUTATIONS
// ============================================

export const useCrearPrecio = (
    options?: UseMutationOptions<ConfiguracionPrecio, Error, CrearPrecioInput>
) => {
    const queryClient = useQueryClient();

    return useMutation<ConfiguracionPrecio, Error, CrearPrecioInput>({
        mutationFn: (data) => configuracionPrecioService.crearPrecio(data),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ 
                queryKey: configuracionPreciosKeys.porEdicion(variables.id_edicion) 
            });
            queryClient.invalidateQueries({ 
                queryKey: configuracionPreciosKeys.globales(variables.id_edicion) 
            });
            if (variables.id_categoria_edicion) {
                queryClient.invalidateQueries({ 
                    queryKey: configuracionPreciosKeys.porCategoria(variables.id_categoria_edicion) 
                });
            }
            queryClient.invalidateQueries({ queryKey: configuracionPreciosKeys.all });
        },
        ...options,
    });
};

export const useActualizarPrecio = (
    options?: UseMutationOptions<ConfiguracionPrecio, Error, { id_config: number; data: ActualizarPrecioInput }>
) => {
    const queryClient = useQueryClient();

    return useMutation<ConfiguracionPrecio, Error, { id_config: number; data: ActualizarPrecioInput }>({
        mutationFn: ({ id_config, data }) => configuracionPrecioService.actualizarPrecio(id_config, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: configuracionPreciosKeys.all });
        },
        ...options,
    });
};

// Alias para compatibilidad
export const useEditarPrecio = useActualizarPrecio;

export const useEliminarPrecio = (
    options?: UseMutationOptions<ConfiguracionPrecio, Error, number>
) => {
    const queryClient = useQueryClient();

    return useMutation<ConfiguracionPrecio, Error, number>({
        mutationFn: (id_config) => configuracionPrecioService.eliminarPrecio(id_config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: configuracionPreciosKeys.all });
        },
        ...options,
    });
};

export const useAplicarPrecioMasivo = (
    options?: UseMutationOptions<ConfiguracionPrecio[], Error, AplicarMasivoInput>
) => {
    const queryClient = useQueryClient();

    return useMutation<ConfiguracionPrecio[], Error, AplicarMasivoInput>({
        mutationFn: (data) => configuracionPrecioService.aplicarPrecioMasivo(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: configuracionPreciosKeys.porEdicion(variables.id_edicion) 
            });
            queryClient.invalidateQueries({ queryKey: configuracionPreciosKeys.all });
        },
        ...options,
    });
};

export const useDuplicarPrecio = (
    options?: UseMutationOptions<ConfiguracionPrecio, Error, { id_config: number; nueva_categoria_edicion: number }>
) => {
    const queryClient = useQueryClient();

    return useMutation<ConfiguracionPrecio, Error, { id_config: number; nueva_categoria_edicion: number }>({
        mutationFn: ({ id_config, nueva_categoria_edicion }) => 
            configuracionPrecioService.duplicarPrecio(id_config, nueva_categoria_edicion),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: configuracionPreciosKeys.all });
        },
        ...options,
    });
};

export const useImportarPrecios = (
    options?: UseMutationOptions<{ total_importados: number; precios: ConfiguracionPrecio[] }, Error, ImportarPreciosInput>
) => {
    const queryClient = useQueryClient();

    return useMutation<{ total_importados: number; precios: ConfiguracionPrecio[] }, Error, ImportarPreciosInput>({
        mutationFn: (data) => configuracionPrecioService.importarPrecios(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: configuracionPreciosKeys.porEdicion(variables.id_edicion_destino) 
            });
            queryClient.invalidateQueries({ queryKey: configuracionPreciosKeys.all });
        },
        ...options,
    });
};


