import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { planilleroKeys } from './usePartidoPlanillero';
import { useAuthStore } from '../stores/authStore';
import { DatosCompletosPlanillero } from '../types/partido';

interface MutationError {
    message: string;
    error?: string;
}

interface PartidoTimeResponse {
    estado?: string;
    hora_inicio?: string;
    hora_inicio_segundo_tiempo?: string;
    observaciones?: string;
}

export const useComenzarPartido = (
    options?: Omit<UseMutationOptions<PartidoTimeResponse, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: async (idPartido: number): Promise<PartidoTimeResponse> => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.comenzarPartido(idPartido) as Promise<PartidoTimeResponse>;
        },
        onSuccess: (data, idPartido) => {
            // Actualizar cache directamente sin refetch - MUCHO MÁS RÁPIDO
            queryClient.setQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        partido: {
                            ...oldData.partido,
                            estado: data?.estado || 'C1',
                            hora_inicio: data?.hora_inicio || oldData.partido.hora_inicio
                        }
                    };
                }
            );
            
            // Invalidar otras queries pero sin refetch automático
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes(),
                refetchType: 'none'
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados(),
                refetchType: 'none'
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al comenzar partido:', error);
        },
        ...options,
    });
};

export const useTerminarPrimerTiempo = (
    options?: Omit<UseMutationOptions<PartidoTimeResponse, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: async (idPartido: number): Promise<PartidoTimeResponse> => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.terminarPrimerTiempo(idPartido) as Promise<PartidoTimeResponse>;
        },
        onSuccess: (data, idPartido) => {
            // Actualizar cache directamente sin refetch - MUCHO MÁS RÁPIDO
            queryClient.setQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        partido: {
                            ...oldData.partido,
                            estado: data?.estado || 'E'
                        }
                    };
                }
            );
            
            // Invalidar otras queries pero sin refetch automático
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes(),
                refetchType: 'none'
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados(),
                refetchType: 'none'
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al terminar primer tiempo:', error);
        },
        ...options,
    });
};

export const useComenzarSegundoTiempo = (
    options?: Omit<UseMutationOptions<PartidoTimeResponse, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: async (idPartido: number): Promise<PartidoTimeResponse> => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.comenzarSegundoTiempo(idPartido) as Promise<PartidoTimeResponse>;
        },
        onSuccess: (data, idPartido) => {
            // Actualizar cache directamente sin refetch - MUCHO MÁS RÁPIDO
            queryClient.setQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        partido: {
                            ...oldData.partido,
                            estado: data?.estado || 'C2',
                            hora_inicio_segundo_tiempo: data?.hora_inicio_segundo_tiempo || oldData.partido.hora_inicio_segundo_tiempo
                        }
                    };
                }
            );
            
            // Invalidar otras queries pero sin refetch automático
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes(),
                refetchType: 'none'
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados(),
                refetchType: 'none'
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al comenzar segundo tiempo:', error);
        },
        ...options,
    });
};

interface TerminarPartidoParams {
    idPartido: number;
    observaciones?: string;
}

export const useTerminarPartido = (
    options?: Omit<UseMutationOptions<PartidoTimeResponse, MutationError, TerminarPartidoParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: async ({ idPartido, observaciones }: TerminarPartidoParams): Promise<PartidoTimeResponse> => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.terminarPartido(idPartido, observaciones) as Promise<PartidoTimeResponse>;
        },
        onSuccess: (data, { idPartido }) => {
            // Actualizar cache directamente sin refetch - MUCHO MÁS RÁPIDO
            queryClient.setQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        partido: {
                            ...oldData.partido,
                            estado: data?.estado || 'T',
                            descripcion: data?.observaciones !== undefined ? data.observaciones : oldData.partido.descripcion
                        }
                    };
                }
            );
            
            // Invalidar otras queries pero sin refetch automático
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes(),
                refetchType: 'none'
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados(),
                refetchType: 'none'
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al terminar partido:', error);
        },
        ...options,
    });
};

export const useFinalizarPartido = (
    options?: Omit<UseMutationOptions<PartidoTimeResponse, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: async (idPartido: number): Promise<PartidoTimeResponse> => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.finalizarPartido(idPartido) as Promise<PartidoTimeResponse>;
        },
        onSuccess: (data, idPartido) => {
            // Actualizar cache directamente sin refetch - MUCHO MÁS RÁPIDO
            queryClient.setQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        partido: {
                            ...oldData.partido,
                            estado: 'F'
                        }
                    };
                }
            );
            
            // Invalidar otras queries pero sin refetch automático
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes(),
                refetchType: 'none'
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados(),
                refetchType: 'none'
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al finalizar partido:', error);
        },
        ...options,
    });
};

interface SuspenderPartidoParams {
    idPartido: number;
    motivo?: string;
}

export const useSuspenderPartido = (
    options?: Omit<UseMutationOptions<PartidoTimeResponse, MutationError, SuspenderPartidoParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: async ({ idPartido, motivo }: SuspenderPartidoParams): Promise<PartidoTimeResponse> => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.suspenderPartido(idPartido, motivo) as Promise<PartidoTimeResponse>;
        },
        onSuccess: (data, { idPartido }) => {
            // Actualizar cache directamente sin refetch - MUCHO MÁS RÁPIDO
            queryClient.setQueryData<DatosCompletosPlanillero>(
                planilleroKeys.datosCompletos(idPartido),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        partido: {
                            ...oldData.partido,
                            estado: data?.estado || 'S'
                        }
                    };
                }
            );
            
            // Invalidar otras queries pero sin refetch automático
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes(),
                refetchType: 'none'
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados(),
                refetchType: 'none'
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al suspender partido:', error);
        },
        ...options,
    });
};