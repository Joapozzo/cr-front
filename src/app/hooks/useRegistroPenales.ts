import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { planilleroService } from '../services/planillero.services';
import { useQueryClient } from '@tanstack/react-query';
import { planilleroKeys } from './usePartidoPlanillero';

interface UseRegistroPenalesProps {
    idPartido: number;
    onSuccess?: () => void;
}

export const useRegistroPenales = ({
    idPartido,
    onSuccess,
}: UseRegistroPenalesProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const registrarPenales = async (penLocal: number, penVisita: number) => {
        if (penLocal === penVisita) {
            throw new Error('Los penales deben ser diferentes. Debe haber un ganador.');
        }

        setIsLoading(true);
        try {
            await planilleroService.registrarPenales(
                idPartido,
                penLocal,
                penVisita
            );

            // Invalidar queries relacionadas para refrescar los datos
            await queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(idPartido),
            });

            toast.success('Penales registrados correctamente');
            onSuccess?.();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                'Error al registrar los penales';
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        registrarPenales,
        isLoading,
    };
};

