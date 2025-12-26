import { useQuery, UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { edicionesService } from '../services/ediciones.services';
import { Edicion, EdicionAdmin, EdicionConCategorias, CrearEdicion, EdicionResponse } from '../types/edicion';
import { useEdicionStore } from '../stores/edicionStore';

export const edicionesKeys = {
    all: ['ediciones'] as const,
    actuales: () => [...edicionesKeys.all, 'actuales'] as const,
    conCategorias: () => [...edicionesKeys.all, 'con-categorias'] as const,
    todas: () => [...edicionesKeys.all, 'todas'] as const, // ← NUEVA KEY
};

export const useEdicionesConCategorias = (
    options?: Omit<UseQueryOptions<EdicionConCategorias[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: edicionesKeys.conCategorias(),
        queryFn: edicionesService.obtenerEdicionesConCategorias,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useEdicionesActuales = (
    options?: Omit<UseQueryOptions<Edicion[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: edicionesKeys.actuales(),
        queryFn: edicionesService.obtenerEdicionesActuales,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useTodasLasEdiciones = (
    options?: Omit<UseQueryOptions<EdicionAdmin[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: edicionesKeys.todas(),
        queryFn: edicionesService.obtenerTodasLasEdiciones,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useCrearEdicion = () => {
    const queryClient = useQueryClient();

    return useMutation<Edicion, Error, CrearEdicion>({
        mutationFn: edicionesService.crearEdicion,
        onSuccess: (nuevaEdicion) => {
            // Invalidar y refrescar automáticamente todas las queries de ediciones
            queryClient.invalidateQueries({ queryKey: edicionesKeys.all });

            // Actualizar inmediatamente la cache local agregando la nueva edición
            queryClient.setQueryData(edicionesKeys.todas(), (oldData: any) => {
                if (oldData) {
                    return [nuevaEdicion, ...oldData];
                }
                return [nuevaEdicion];
            });
        },
        onError: (error) => {
            console.error('Error al crear edición:', error);
        },
    });
};

type EdicionesType = 'actuales' | 'conCategorias' | 'todas';

export const useEdiciones = <T extends EdicionesType>(
    type: T,
    options?: Omit<
        UseQueryOptions<
            T extends 'conCategorias'
            ? EdicionConCategorias[]
            : T extends 'todas'
            ? EdicionAdmin[]
            : Edicion[],
            Error
        >,
        'queryKey' | 'queryFn'
    >
) => {
    const queryConfig = {
        actuales: {
            queryKey: edicionesKeys.actuales(),
            queryFn: edicionesService.obtenerEdicionesActuales,
        },
        conCategorias: {
            queryKey: edicionesKeys.conCategorias(),
            queryFn: edicionesService.obtenerEdicionesConCategorias,
        },
        todas: { // ← NUEVA CONFIGURACIÓN
            queryKey: edicionesKeys.todas(),
            queryFn: edicionesService.obtenerTodasLasEdiciones,
        },
    };

    return useQuery({
        ...queryConfig[type],
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        ...options,
    } as any);
};

export const useActualizarEdicion = () => {
    const queryClient = useQueryClient();

    return useMutation<EdicionResponse, Error, { id: number; data: Partial<CrearEdicion> }>({
        mutationFn: ({ id, data }) => edicionesService.actualizarEdicion(id, data),
        onSuccess: (response, { id }) => {
            // Invalidar queries
            queryClient.invalidateQueries({ queryKey: edicionesKeys.all });

            // Actualizar store con datos actualizados
            const { setEdicionSeleccionada } = useEdicionStore.getState();
            if (response.data) {
                setEdicionSeleccionada({
                    id_edicion: response.data.id_edicion,
                    nombre: response.data.nombre,
                    temporada: response.data.temporada,
                    cantidad_eventuales: response.data.cantidad_eventuales,
                    partidos_eventuales: response.data.partidos_eventuales,
                    apercibimientos: response.data.apercibimientos,
                    puntos_descuento: response.data.puntos_descuento,
                    img: response?.data?.img || null,
                });
            }
        },
        onError: (error) => {
            console.error('Error al actualizar edición:', error);
        },
    });
};

export const useCambiarEstadoEdicion = () => {
    const queryClient = useQueryClient();

    return useMutation<
        { success: boolean; message: string; data: any },
        Error,
        { id: number; estado: 'I' | 'A' | 'T' }
    >({
        mutationFn: ({ id, estado }) => edicionesService.cambiarEstadoEdicion(id, estado),
        onSuccess: () => {
            // Invalidar queries para refrescar la lista
            queryClient.invalidateQueries({ queryKey: edicionesKeys.all });
        },
    });
};