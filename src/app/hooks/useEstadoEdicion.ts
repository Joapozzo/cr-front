import { useState, useCallback } from 'react';
import { useCambiarEstadoEdicion } from './useEdiciones';
import { EdicionAdmin } from '../types/edicion';
import toast from 'react-hot-toast';

interface UseEstadoEdicionProps {
    edicionActual: EdicionAdmin | null;
}

interface UseEstadoEdicionReturn {
    estadoActual: string;
    isTerminada: boolean;
    isTerminarModalOpen: boolean;
    setIsTerminarModalOpen: (open: boolean) => void;
    handleTerminarEdicion: () => void;
    isChangingEstado: boolean;
}

export const useEstadoEdicion = ({
    edicionActual,
}: UseEstadoEdicionProps): UseEstadoEdicionReturn => {
    const estadoActual = edicionActual?.estado || 'I';
    const isTerminada = estadoActual === 'T';

    const [isTerminarModalOpen, setIsTerminarModalOpen] = useState(false);
    const { mutate: cambiarEstado, isPending: isChangingEstado } = useCambiarEstadoEdicion();

    const handleTerminarEdicion = useCallback(() => {
        if (!edicionActual?.id_edicion) return;

        cambiarEstado(
            { id: edicionActual.id_edicion, estado: 'T' },
            {
                onSuccess: (data) => {
                    toast.success(data.message || 'Edición terminada exitosamente');
                    setIsTerminarModalOpen(false);
                },
                onError: (error: Error) => {
                    toast.error(error.message || 'Error al terminar la edición');
                },
            }
        );
    }, [edicionActual, cambiarEstado]);

    return {
        estadoActual,
        isTerminada,
        isTerminarModalOpen,
        setIsTerminarModalOpen,
        handleTerminarEdicion,
        isChangingEstado,
    };
};

