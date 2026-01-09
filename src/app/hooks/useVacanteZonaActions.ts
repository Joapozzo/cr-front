import { useLiberarVacante, useOcuparVacante, useActualizarVacante } from './useTemporadas';
import toast from 'react-hot-toast';

export const useVacanteZonaActions = () => {
    const { mutate: liberarVacante } = useLiberarVacante();
    const { mutate: ocuparVacante } = useOcuparVacante();
    const { mutate: actualizarVacante } = useActualizarVacante();

    const handleVaciarVacante = async (
        idZona: number,
        idCategoriaEdicion: number,
        vacante: number
    ): Promise<void> => {
        const toastId = toast.loading("Vaciando vacante...");

        return new Promise((resolve, reject) => {
            liberarVacante({
                id_zona: idZona,
                id_categoria_edicion: idCategoriaEdicion,
                data: { vacante }
            }, {
                onSuccess: () => {
                    toast.success(`Vacante ${vacante} liberada exitosamente`, { id: toastId });
                    resolve();
                },
                onError: (error: unknown) => {
                    const errorObj = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
                    const errorMessage = errorObj?.response?.data?.error ||
                        errorObj?.response?.data?.message ||
                        errorObj?.message ||
                        'Error al vaciar vacante';
                    toast.error(errorMessage, { id: toastId });
                    reject(error);
                }
            });
        });
    };

    const handleAsignarEquipo = async (
        idZona: number,
        idCategoriaEdicion: number,
        vacante: number,
        idEquipo: number
    ): Promise<void> => {
        const toastId = toast.loading("Asignando equipo...");

        return new Promise((resolve, reject) => {
            ocuparVacante({
                id_zona: idZona,
                id_categoria_edicion: idCategoriaEdicion,
                data: { vacante, id_equipo: idEquipo }
            }, {
                onSuccess: () => {
                    toast.success(`Equipo asignado a vacante ${vacante} exitosamente`, { id: toastId });
                    resolve();
                },
                onError: (error: unknown) => {
                    const errorObj = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
                    const errorMessage = errorObj?.response?.data?.error ||
                        errorObj?.response?.data?.message ||
                        errorObj?.message ||
                        'Error al asignar equipo';
                    toast.error(errorMessage, { id: toastId });
                    reject(error);
                }
            });
        });
    };

    const handleReemplazarEquipo = async (
        idZona: number,
        idCategoriaEdicion: number,
        vacante: number,
        idEquipo: number
    ): Promise<void> => {
        const toastId = toast.loading("Reemplazando equipo...");

        return new Promise((resolve, reject) => {
            actualizarVacante({
                id_zona: idZona,
                id_categoria_edicion: idCategoriaEdicion,
                data: { vacante, id_equipo: idEquipo }
            }, {
                onSuccess: () => {
                    toast.success(`Equipo reemplazado en vacante ${vacante} exitosamente`, { id: toastId });
                    resolve();
                },
                onError: (error: unknown) => {
                    const errorObj = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
                    const errorMessage = errorObj?.response?.data?.error ||
                        errorObj?.response?.data?.message ||
                        errorObj?.message ||
                        'Error al reemplazar equipo';
                    toast.error(errorMessage, { id: toastId });
                    reject(error);
                }
            });
        });
    };

    return {
        handleVaciarVacante,
        handleAsignarEquipo,
        handleReemplazarEquipo,
    };
};

