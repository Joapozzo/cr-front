import { useFases } from './useFases';
import toast from 'react-hot-toast';

interface UseFaseActionsProps {
    idCatEdicion: number;
}

export const useFaseActions = ({ idCatEdicion }: UseFaseActionsProps) => {
    const { eliminarFase, isDeleting } = useFases(idCatEdicion);

    const handleEliminarFase = async (numeroFase: number) => {
        const toastId = toast.loading('Eliminando fase...');
        try {
            await eliminarFase(numeroFase);
            toast.success(`Fase ${numeroFase} eliminada exitosamente`, { id: toastId });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || 
                               (error as { message?: string })?.message || 
                               'Error al eliminar la fase';
            toast.error(errorMessage, { id: toastId });
        }
    };

    return {
        handleEliminarFase,
        isDeleting,
    };
};

