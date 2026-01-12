import { useParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook para extraer y validar el ID del jugador desde los parámetros de la URL
 */
export const useJugadorId = (): number | null => {
    const params = useParams();

    return useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);
};

