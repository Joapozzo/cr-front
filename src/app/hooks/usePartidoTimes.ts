import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services'; 
import { planilleroKeys } from './usePartidoPlanillero';

interface MutationError {
    message: string;
    error?: string;
}

export const useComenzarPartido = (
    options?: Omit<UseMutationOptions<any, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (idPartido: number) => planilleroService.comenzarPartido(idPartido),
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
    return useMutation({
        mutationFn: (idPartido: number) => planilleroService.terminarPrimerTiempo(idPartido),
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
    return useMutation({
        mutationFn: (idPartido: number) => planilleroService.comenzarSegundoTiempo(idPartido),
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

export const useTerminarPartido = (
    options?: Omit<UseMutationOptions<any, MutationError, number>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (idPartido: number) => planilleroService.terminarPartido(idPartido),
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
    return useMutation({
        mutationFn: (idPartido: number) => planilleroService.finalizarPartido(idPartido),
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
    return useMutation({
        mutationFn: ({ idPartido, motivo }: SuspenderPartidoParams) => 
            planilleroService.suspenderPartido(idPartido, motivo),
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