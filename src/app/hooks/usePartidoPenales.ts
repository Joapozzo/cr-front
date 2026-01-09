import { useState } from 'react';
import { EstadoPartido, PartidoCompleto } from '@/app/types/partido';
import { useRegistroPenales } from './useRegistroPenales';

interface UsePartidoPenalesParams {
    partido: PartidoCompleto | undefined | null;
    estadoActual: EstadoPartido;
    esPlanillero?: boolean;
}

export const usePartidoPenales = ({
    partido,
    estadoActual,
    esPlanillero = false,
}: UsePartidoPenalesParams) => {
    const [isModalPenalesOpen, setIsModalPenalesOpen] = useState(false);

    const { registrarPenales, isLoading: isLoadingPenales } = useRegistroPenales({
        idPartido: partido?.id_partido || 0,
        onSuccess: () => {
            setIsModalPenalesOpen(false);
        }
    });

    // Validaciones para mostrar botón de penales
    const puedeRegistrarPenales = (): boolean => {
        if (!esPlanillero) return false;
        if (!partido || estadoActual !== 'T') return false;
        if (partido.goles_local !== partido.goles_visita) return false;
        if (!partido.zona || !partido.zona.id_tipo_zona) return false;
        const idTipoZona = partido.zona.id_tipo_zona;
        return idTipoZona === 2 || idTipoZona === 4;
    };

    const mostrarBotonPenales = puedeRegistrarPenales();

    const abrirModalPenales = () => setIsModalPenalesOpen(true);
    const cerrarModalPenales = () => setIsModalPenalesOpen(false);

    return {
        mostrarBotonPenales,
        isModalPenalesOpen,
        abrirModalPenales,
        cerrarModalPenales,
        registrarPenales,
        isLoadingPenales,
    };
};

