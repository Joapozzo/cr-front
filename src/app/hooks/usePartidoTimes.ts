import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { planilleroKeys } from './usePartidoPlanillero';
import { useAuthStore } from '../stores/authStore';

interface MutationError {
    message: string;
    error?: string;
}

export const useComenzarPartido = (
    options?: Omit<UseMutationOptions<any, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: (idPartido: number) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.comenzarPartido(idPartido);
        },
        onSuccess: (data, idPartido) => {
            // Invalidar todas las queries del planillero para refrescar los datos
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.all
            });
            
            // Invalidar queries específicas
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes()
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados()
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al comenzar partido:', error);
        },
        ...options,
    });
};

export const useTerminarPrimerTiempo = (
    options?: Omit<UseMutationOptions<any, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: (idPartido: number) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.terminarPrimerTiempo(idPartido);
        },
        onSuccess: (data, idPartido) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.all
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes()
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados()
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al terminar primer tiempo:', error);
        },
        ...options,
    });
};

export const useComenzarSegundoTiempo = (
    options?: Omit<UseMutationOptions<any, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: (idPartido: number) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.comenzarSegundoTiempo(idPartido);
        },
        onSuccess: (data, idPartido) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.all
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes()
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados()
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
    options?: Omit<UseMutationOptions<any, MutationError, TerminarPartidoParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: ({ idPartido, observaciones }: TerminarPartidoParams) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.terminarPartido(idPartido, observaciones);
        },
        onSuccess: (data, idPartido) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.all
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes()
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados()
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al terminar partido:', error);
        },
        ...options,
    });
};

export const useFinalizarPartido = (
    options?: Omit<UseMutationOptions<any, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: (idPartido: number) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.finalizarPartido(idPartido);
        },
        onSuccess: (data, idPartido) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.all
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes()
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados()
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
    options?: Omit<UseMutationOptions<any, MutationError, SuspenderPartidoParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);
    return useMutation({
        mutationFn: ({ idPartido, motivo }: SuspenderPartidoParams) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return planilleroService.suspenderPartido(idPartido, motivo);
        },
        onSuccess: (data, { idPartido }) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.all
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPendientes()
            });
            
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.partidosPlanillados()
            });
        },
        onError: (error: MutationError) => {
            console.error('Error al suspender partido:', error);
        },
        ...options,
    });
};