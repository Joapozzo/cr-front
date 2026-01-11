import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
import { credencialesService } from '../services/credenciales.client';
import {
  Credencial,
  ValidacionResponse,
  GenerarCredencialParams,
  GenerarCredencialesMasivasParams,
  RevocarCredencialParams,
  EstadisticasCredenciales
} from '../services/credenciales.client';

// ============================================
// Query Keys para credenciales
// ============================================

export const credencialesKeys = {
  all: ['credenciales'] as const,
  misCredenciales: () => [...credencialesKeys.all, 'mis-credenciales'] as const,
  byId: (id_credencial: string) => [...credencialesKeys.all, 'id', id_credencial] as const,
  validacion: (id_credencial: string, firma?: string) =>
    [...credencialesKeys.all, 'validacion', id_credencial, firma] as const,
  jugador: (id_jugador: number) => [...credencialesKeys.all, 'jugador', id_jugador] as const,
  equipo: (id_equipo: number, id_categoria_edicion: number) =>
    [...credencialesKeys.all, 'equipo', id_equipo, id_categoria_edicion] as const,
  estadisticas: (id_categoria_edicion: number) =>
    [...credencialesKeys.all, 'estadisticas', id_categoria_edicion] as const,
  admin: () => [...credencialesKeys.all, 'admin'] as const
};

// ============================================
// HOOKS DE QUERY
// ============================================

/**
 * Hook principal para obtener credenciales
 * Soporta diferentes filtros opcionales
 */
export const useCredenciales = (
  filters?: {
    id_credencial?: string;
    id_jugador?: number;
    id_equipo?: number;
    id_categoria_edicion?: number;
  },
  options?: Omit<UseQueryOptions<Credencial[], Error>, 'queryKey' | 'queryFn'>
) => {
  const { id_credencial, id_jugador, id_equipo, id_categoria_edicion } = filters || {};

  return useQuery({
    queryKey: id_credencial
      ? credencialesKeys.byId(id_credencial)
      : id_jugador
      ? credencialesKeys.jugador(id_jugador)
      : id_equipo && id_categoria_edicion
      ? credencialesKeys.equipo(id_equipo, id_categoria_edicion)
      : credencialesKeys.misCredenciales(),
    queryFn: async () => {
      if (id_credencial) {
        const credencial = await credencialesService.obtenerCredencial(id_credencial);
        return [credencial];
      }
      if (id_jugador) {
        return await credencialesService.obtenerCredencialesJugador(id_jugador);
      }
      if (id_equipo && id_categoria_edicion) {
        return await credencialesService.obtenerCredencialesEquipo(id_equipo, id_categoria_edicion);
      }
      // Por defecto, obtener mis credenciales
      return await credencialesService.obtenerMisCredenciales();
    },
    enabled: !!(
      id_credencial ||
      id_jugador ||
      (id_equipo && id_categoria_edicion) ||
      (!id_credencial && !id_jugador && !id_equipo && !id_categoria_edicion) // Mis credenciales
    ),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    ...options
  });
};

/**
 * Hook para obtener mis credenciales (usuario autenticado)
 */
export const useMisCredenciales = (
  options?: Omit<UseQueryOptions<Credencial[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: credencialesKeys.misCredenciales(),
    queryFn: () => credencialesService.obtenerMisCredenciales(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    ...options
  });
};

/**
 * Hook para obtener una credencial por ID
 */
export const useCredencial = (
  id_credencial: string,
  options?: Omit<UseQueryOptions<Credencial, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: credencialesKeys.byId(id_credencial),
    queryFn: () => credencialesService.obtenerCredencial(id_credencial),
    enabled: !!id_credencial,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options
  });
};

/**
 * Hook para validar una credencial (público)
 */
export const useValidarCredencial = (
  id_credencial?: string,
  firma?: string,
  options?: Omit<UseQueryOptions<ValidacionResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: credencialesKeys.validacion(id_credencial || '', firma),
    queryFn: () => {
      if (!id_credencial) {
        throw new Error('ID de credencial es requerido');
      }
      return credencialesService.validarCredencial(id_credencial, firma);
    },
    enabled: !!id_credencial,
    staleTime: 30 * 1000, // 30 segundos - las validaciones cambian frecuentemente
    gcTime: 2 * 60 * 1000, // 2 minutos
    retry: 1, // Menos reintentos para validación
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Siempre validar al montar
    ...options
  });
};

/**
 * Hook para obtener credenciales de un equipo
 */
export const useCredencialesEquipo = (
  id_equipo: number,
  id_categoria_edicion: number,
  options?: Omit<UseQueryOptions<Credencial[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: credencialesKeys.equipo(id_equipo, id_categoria_edicion),
    queryFn: () => credencialesService.obtenerCredencialesEquipo(id_equipo, id_categoria_edicion),
    enabled: !!id_equipo && !!id_categoria_edicion,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    ...options
  });
};

/**
 * Hook para obtener estadísticas de credenciales (admin)
 */
export const useEstadisticasCredenciales = (
  id_categoria_edicion: number,
  options?: Omit<UseQueryOptions<EstadisticasCredenciales, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: credencialesKeys.estadisticas(id_categoria_edicion),
    queryFn: () => credencialesService.obtenerEstadisticas(id_categoria_edicion),
    enabled: !!id_categoria_edicion,
    staleTime: 1 * 60 * 1000, // 1 minuto - las estadísticas cambian frecuentemente
    gcTime: 3 * 60 * 1000, // 3 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options
  });
};

// ============================================
// HOOKS DE MUTATION
// ============================================

/**
 * Hook para generar una credencial individual (admin/capitán)
 */
export const useGenerarCredencial = (
  options?: UseMutationOptions<Credencial, Error, GenerarCredencialParams>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GenerarCredencialParams) => credencialesService.generarCredencial(params),
    onSuccess: (data, variables) => {
      // Invalidar mis credenciales
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.misCredenciales()
      });
      // Invalidar credenciales del equipo
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.equipo(variables.id_equipo, variables.id_categoria_edicion)
      });
      // Invalidar estadísticas
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.estadisticas(variables.id_categoria_edicion)
      });
      // Actualizar cache de la credencial específica
      queryClient.setQueryData(credencialesKeys.byId(data.id_credencial), data);
    },
    ...options
  });
};

/**
 * Hook para generar credenciales masivas (admin)
 */
export const useGenerarCredencialesMasivas = (
  options?: UseMutationOptions<any, Error, GenerarCredencialesMasivasParams>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GenerarCredencialesMasivasParams) =>
      credencialesService.generarCredencialesMasivas(params),
    onSuccess: (data, variables) => {
      // Invalidar todas las queries de credenciales admin
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.admin(),
        exact: false
      });
      // Invalidar estadísticas
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.estadisticas(variables.id_categoria_edicion)
      });
      // Invalidar mis credenciales por si algún usuario tiene credenciales en esta categoría
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.misCredenciales()
      });
    },
    ...options
  });
};

/**
 * Hook para revocar una credencial (admin)
 */
export const useRevocarCredencial = (
  options?: UseMutationOptions<Credencial, Error, { id_credencial: string; motivo?: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id_credencial, motivo }: { id_credencial: string; motivo?: string }) =>
      credencialesService.revocarCredencial(id_credencial, motivo ? { motivo } : undefined),
    onSuccess: (data, variables) => {
      // Invalidar la credencial específica
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.byId(variables.id_credencial)
      });
      // Invalidar mis credenciales
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.misCredenciales()
      });
      // Invalidar validación
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.validacion(variables.id_credencial)
      });
      // Actualizar cache con la credencial revocada
      queryClient.setQueryData(credencialesKeys.byId(variables.id_credencial), data);
    },
    ...options
  });
};

/**
 * Hook para reactivar una credencial (admin)
 */
export const useReactivarCredencial = (
  options?: UseMutationOptions<Credencial, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_credencial: string) => credencialesService.reactivarCredencial(id_credencial),
    onSuccess: (data, id_credencial) => {
      // Invalidar la credencial específica
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.byId(id_credencial)
      });
      // Invalidar mis credenciales
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.misCredenciales()
      });
      // Invalidar validación
      queryClient.invalidateQueries({
        queryKey: credencialesKeys.validacion(id_credencial)
      });
      // Actualizar cache con la credencial reactivada
      queryClient.setQueryData(credencialesKeys.byId(id_credencial), data);
    },
    ...options
  });
};

// ============================================
// HOOKS COMPUESTOS (Admin)
// ============================================

/**
 * Hook combinado para acciones administrativas de credenciales
 */
export const useCredencialesAdmin = (id_categoria_edicion?: number) => {
  const estadisticas = useEstadisticasCredenciales(id_categoria_edicion || 0, {
    enabled: !!id_categoria_edicion
  });

  const generarCredencial = useGenerarCredencial();
  const generarMasivas = useGenerarCredencialesMasivas();
  const revocarCredencial = useRevocarCredencial();
  const reactivarCredencial = useReactivarCredencial();

  return {
    // Estadísticas
    estadisticas: estadisticas.data,
    isLoadingEstadisticas: estadisticas.isLoading,
    isErrorEstadisticas: estadisticas.isError,
    errorEstadisticas: estadisticas.error,
    refetchEstadisticas: estadisticas.refetch,

    // Mutations
    generarCredencial: generarCredencial.mutate,
    generarCredencialAsync: generarCredencial.mutateAsync,
    isGenerandoCredencial: generarCredencial.isPending,

    generarMasivas: generarMasivas.mutate,
    generarMasivasAsync: generarMasivas.mutateAsync,
    isGenerandoMasivas: generarMasivas.isPending,

    revocarCredencial: revocarCredencial.mutate,
    revocarCredencialAsync: revocarCredencial.mutateAsync,
    isRevocandoCredencial: revocarCredencial.isPending,

    reactivarCredencial: reactivarCredencial.mutate,
    reactivarCredencialAsync: reactivarCredencial.mutateAsync,
    isReactivandoCredencial: reactivarCredencial.isPending
  };
};

