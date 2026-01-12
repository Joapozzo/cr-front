import { useState, useCallback } from 'react';
import { useFichaMedicaJugador, useSubirFichaMedicaAdmin, useCambiarEstadoFichaMedica } from '@/app/hooks/useFichaMedica';
import { FormDataValue } from '@/app/components/modals/ModalAdmin';
import { validarSubirFicha, validarCambiarEstado } from '../helpers/validations';
import { descargarFichaMedica } from '../helpers/download';

interface UseFichaMedicaActionsProps {
    idJugador: number;
}

export const useFichaMedicaActions = ({ idJugador }: UseFichaMedicaActionsProps) => {
    const { data: fichaMedica, isLoading, refetch } = useFichaMedicaJugador(
        idJugador,
        { enabled: idJugador > 0 }
    );

    const { mutate: subirFichaMedica, isPending: isSubiendo } = useSubirFichaMedicaAdmin();
    const { mutate: cambiarEstado, isPending: isCambiandoEstado } = useCambiarEstadoFichaMedica();

    const [showSubirModal, setShowSubirModal] = useState(false);
    const [showCambiarEstadoModal, setShowCambiarEstadoModal] = useState(false);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('');

    const handleSubirFicha = useCallback(async (data: Record<string, FormDataValue>) => {
        const validated = validarSubirFicha(data);
        
        return new Promise<void>((resolve, reject) => {
            subirFichaMedica(
                {
                    id_jugador: idJugador,
                    ...validated,
                },
                {
                    onSuccess: () => {
                        refetch();
                        resolve();
                    },
                    onError: (error) => {
                        reject(error);
                    },
                }
            );
        });
    }, [idJugador, subirFichaMedica, refetch]);

    const handleCambiarEstado = useCallback(async (data: Record<string, FormDataValue>) => {
        if (!fichaMedica) {
            throw new Error('No hay ficha médica para modificar');
        }

        const validated = validarCambiarEstado(data);

        return new Promise<void>((resolve, reject) => {
            cambiarEstado(
                {
                    id_ficha_medica: fichaMedica.id_ficha_medica,
                    ...validated,
                },
                {
                    onSuccess: () => {
                        refetch();
                        resolve();
                    },
                    onError: (error) => {
                        reject(error);
                    },
                }
            );
        });
    }, [fichaMedica, cambiarEstado, refetch]);

    const handleDescargar = useCallback(() => {
        descargarFichaMedica(idJugador, fichaMedica?.url_ficha);
    }, [idJugador, fichaMedica?.url_ficha]);

    const openSubirModal = useCallback(() => {
        setShowSubirModal(true);
    }, []);

    const closeSubirModal = useCallback(() => {
        setShowSubirModal(false);
    }, []);

    const openCambiarEstadoModal = useCallback(() => {
        if (fichaMedica) {
            setEstadoSeleccionado(fichaMedica.estado);
            setShowCambiarEstadoModal(true);
        }
    }, [fichaMedica]);

    const closeCambiarEstadoModal = useCallback(() => {
        setShowCambiarEstadoModal(false);
        setEstadoSeleccionado('');
    }, []);

    const handleEstadoChange = useCallback((name: string, value: FormDataValue) => {
        if (name === 'estado') {
            setEstadoSeleccionado(value as string);
        }
    }, []);

    return {
        fichaMedica,
        isLoading,
        isSubiendo,
        isCambiandoEstado,
        showSubirModal,
        showCambiarEstadoModal,
        estadoSeleccionado,
        handleSubirFicha,
        handleCambiarEstado,
        handleDescargar,
        openSubirModal,
        closeSubirModal,
        openCambiarEstadoModal,
        closeCambiarEstadoModal,
        handleEstadoChange,
    };
};

