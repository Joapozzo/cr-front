import { useState, useCallback } from 'react';
import { JugadorDestacadoDt } from '@/app/types/jugador';

interface UseModalSeleccionarJugadorProps {
    onSeleccionar: (jugador: JugadorDestacadoDt) => Promise<void>;
    onClose: () => void;
    onRefetch?: () => void;
}

/**
 * Hook que maneja el estado y lógica del modal de selección de jugador
 */
export const useModalSeleccionarJugador = ({
    onSeleccionar,
    onClose,
    onRefetch,
}: UseModalSeleccionarJugadorProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroOrden, setFiltroOrden] = useState<'goles' | 'asistencias' | 'nombre'>('goles');
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
    const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);

    const handleSeleccionarJugador = useCallback((jugadorId: number) => {
        setJugadorSeleccionado(jugadorId);
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleOrdenChange = useCallback((value: 'goles' | 'asistencias' | 'nombre') => {
        setFiltroOrden(value);
    }, []);

    const handleConfirmar = useCallback(
        async (jugador: JugadorDestacadoDt | undefined) => {
            if (!jugador) return;

            try {
                await onSeleccionar(jugador);
                // Resetear estado
                setJugadorSeleccionado(null);
                setSearchTerm('');
                // Cerrar modal
                onClose();
                // Refetch después de cerrar para evitar errores
                onRefetch?.();
            } catch (error) {
                console.error('Error al seleccionar jugador:', error);
                throw error;
            }
        },
        [onSeleccionar, onClose, onRefetch]
    );

    const handleBuscarManual = useCallback(() => {
        setMostrarModalBusqueda(true);
    }, []);

    const handleCloseModalBusqueda = useCallback(() => {
        setMostrarModalBusqueda(false);
        onClose();
    }, [onClose]);

    const reset = useCallback(() => {
        setSearchTerm('');
        setFiltroOrden('goles');
        setJugadorSeleccionado(null);
        setMostrarModalBusqueda(false);
    }, []);

    return {
        // Estado
        searchTerm,
        filtroOrden,
        jugadorSeleccionado,
        mostrarModalBusqueda,

        // Handlers
        handleSeleccionarJugador,
        handleSearchChange,
        handleOrdenChange,
        handleConfirmar,
        handleBuscarManual,
        handleCloseModalBusqueda,
        reset,
    };
};

