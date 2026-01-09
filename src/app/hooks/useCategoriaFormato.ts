import { useCategoriaStore } from '../stores/categoriaStore';
import { useFases } from './useFases';
import toast from 'react-hot-toast';

export const useCategoriaFormato = () => {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCatEdicion = Number(categoriaSeleccionada?.id_categoria_edicion) || 0;

    const {
        fases,
        isLoading,
        isFetching,
        isError,
        error,
        isCreating,
        crearFase,
        eliminarFase,
        refetch,
        isEmpty,
        totalFases,
    } = useFases(idCatEdicion);

    const handleCrearFase = async () => {
        try {
            await crearFase();
            toast.success(`Fase ${totalFases + 1} creada exitosamente`);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || 
                               (error as { message?: string })?.message || 
                               'Error al crear la fase';
            toast.error(errorMessage);
        }
    };

    const handleRefetch = async () => {
        try {
            await refetch();
            toast.success('Datos actualizados correctamente');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || 
                               (error as { message?: string })?.message || 
                               'Error al actualizar los datos';
            toast.error(errorMessage);
        }
    };

    return {
        // Data
        categoriaSeleccionada,
        idCatEdicion,
        fases,
        totalFases,
        isEmpty,
        
        // States
        isLoading,
        isFetching,
        isCreating,
        isError,
        error,
        
        // Actions
        handleCrearFase,
        handleRefetch,
        eliminarFase,
    };
};

