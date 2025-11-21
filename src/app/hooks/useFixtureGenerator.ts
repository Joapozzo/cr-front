import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { GenerarFixtureInput, GenerarFixtureResponse } from '../types/fixture-generator';
import toast from 'react-hot-toast';

export const useGenerarFixture = () => {
    const queryClient = useQueryClient();

    return useMutation<GenerarFixtureResponse, Error, GenerarFixtureInput>({
        mutationFn: async (input: GenerarFixtureInput) => {
            const response = await api.post<GenerarFixtureResponse>(
                '/admin/fixture-generator/generar',
                input
            );
            return response;
        },
        onSuccess: (data) => {
            toast.success(
                `Fixture generado exitosamente: ${data.partidosCreados} partidos en ${data.totalJornadas} jornadas`
            );
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['partidos'] });
            queryClient.invalidateQueries({ queryKey: ['zonas'] });
        },
        onError: (error: Error & { response?: { data?: { error?: string } } }) => {
            const mensaje = error.response?.data?.error || error.message || 'Error al generar el fixture';
            toast.error(mensaje);
        },
    });
};

