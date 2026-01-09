import { useState, useEffect, useRef } from 'react';
import { useEliminarPartido } from '@/app/hooks/usePartidosAdmin';
import toast from 'react-hot-toast';

interface PromiseResolvers {
    resolve: () => void;
    reject: (error: Error) => void;
}

interface UseEliminarPartidoFlowProps {
    onSuccess?: () => void;
}

interface UseEliminarPartidoFlowReturn {
    confirmarEliminacion: (idPartido: number) => Promise<void>;
    deleteError: Error | null;
    deleteSuccess: boolean;
    resetDeleteMutation: () => void;
    promiseResolvers: PromiseResolvers | null;
    setPromiseResolvers: (resolvers: PromiseResolvers | null) => void;
}

/**
 * Hook para encapsular toda la lógica de eliminación de partidos
 * incluyendo promise resolvers, efectos y toasts
 */
export const useEliminarPartidoFlow = ({
    onSuccess,
}: UseEliminarPartidoFlowProps = {}): UseEliminarPartidoFlowReturn => {
    const toastShownRef = useRef(false);
    const [promiseResolvers, setPromiseResolvers] = useState<PromiseResolvers | null>(null);

    const {
        mutate: eliminarPartido,
        error: deleteError,
        isSuccess: deleteSuccess,
        reset: resetDeleteMutation,
    } = useEliminarPartido();

    const confirmarEliminacion = async (idPartido: number): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            setPromiseResolvers({ resolve, reject });
            eliminarPartido(idPartido);
        });
    };

    // Efecto para manejar éxito
    useEffect(() => {
        if (deleteSuccess) {
            toast.success('Partido eliminado correctamente');
            resetDeleteMutation();

            if (promiseResolvers) {
                promiseResolvers.resolve();
                setPromiseResolvers(null);
            }

            onSuccess?.();
        }
    }, [deleteSuccess, promiseResolvers, resetDeleteMutation, onSuccess]);

    // Efecto para manejar errores
    useEffect(() => {
        if (deleteError && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.error(deleteError.message || 'Error al eliminar el partido');

            if (promiseResolvers) {
                promiseResolvers.reject(new Error(deleteError.message));
                setPromiseResolvers(null);
            }
        }
    }, [deleteError, promiseResolvers]);

    // Resetear cuando se cierra el modal
    const resetOnClose = () => {
        resetDeleteMutation();
        setPromiseResolvers(null);
        toastShownRef.current = false;
    };

    return {
        confirmarEliminacion,
        deleteError,
        deleteSuccess,
        resetDeleteMutation: resetOnClose,
        promiseResolvers,
        setPromiseResolvers,
    };
};

