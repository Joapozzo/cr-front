import { useActualizarPublicadaCategoria } from "./useCategorias";
import { useCategoriaStore } from "@/app/stores/categoriaStore";
import toast from "react-hot-toast";

interface UseCategoriaPublicacionReturn {
    isPublicada: boolean;
    togglePublicada: () => void;
    isUpdating: boolean;
}

/**
 * Hook que maneja la lógica de publicar/despublicar una categoría.
 * Incluye manejo de toast, actualización del store y gestión de errores.
 */
export const useCategoriaPublicacion = (idCategoriaEdicion: number): UseCategoriaPublicacionReturn => {
    const { categoriaSeleccionada } = useCategoriaStore();
    const isPublicada = categoriaSeleccionada?.publicada === 'S';

    const { mutate: actualizarPublicada, isPending: isUpdating } = useActualizarPublicadaCategoria();

    const togglePublicada = () => {
        if (!idCategoriaEdicion || !categoriaSeleccionada) return;
        
        const nuevoEstado: 'S' | 'N' = isPublicada ? 'N' : 'S';
        
        actualizarPublicada(
            { id_categoria_edicion: idCategoriaEdicion, publicada: nuevoEstado },
            {
                onSuccess: () => {
                    toast.success(
                        nuevoEstado === 'S' 
                            ? 'Categoría publicada exitosamente' 
                            : 'Categoría despublicada exitosamente'
                    );
                    
                    // Actualizar el store
                    const { setCategoriaSeleccionada } = useCategoriaStore.getState();
                    setCategoriaSeleccionada({
                        ...categoriaSeleccionada,
                        publicada: nuevoEstado
                    });
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al actualizar el estado de publicación');
                }
            }
        );
    };

    return {
        isPublicada,
        togglePublicada,
        isUpdating,
    };
};

