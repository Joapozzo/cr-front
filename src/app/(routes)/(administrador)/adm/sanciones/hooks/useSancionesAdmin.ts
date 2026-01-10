import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useCategoriasPorEdicionActivas } from '@/app/hooks/useCategorias';
import {
    useSancionesPorCategoria,
    useCrearSancion,
    useEditarSancion,
    useEliminarSancion
} from '@/app/hooks/useSanciones';
import { Sancion, CrearSancionInput, EditarSancionInput } from '@/app/types/sancion';
import { CategoriaActual } from '@/app/types/categoria';

interface UseSancionesAdminProps {
    initialCategorias?: CategoriaActual[];
    initialCategoriaId?: number | null;
    initialSanciones?: Sancion[];
}

export function useSancionesAdmin({
    initialCategorias,
    initialCategoriaId,
    initialSanciones
}: UseSancionesAdminProps = {}) {
    const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState<number | null>(
        initialCategoriaId || null
    );

    // Estados para modales
    const [modalDetalles, setModalDetalles] = useState<Sancion | null>(null);
    const [modalForm, setModalForm] = useState<{ tipo: 'crear' | 'editar'; sancion?: Sancion } | null>(null);
    const [modalEliminar, setModalEliminar] = useState<Sancion | null>(null);

    // Obtener categorías de la edición
    const { data: categoriasData, isLoading: isLoadingCategorias } = useCategoriasPorEdicionActivas();
    const categorias = useMemo(() => categoriasData || initialCategorias || [], [categoriasData, initialCategorias]);

    // Seleccionar automáticamente la primera categoría si hay categorías disponibles
    useEffect(() => {
        if (categorias.length > 0 && !categoriaSeleccionadaId) {
            const primeraCategoriaId = categorias[0].id_categoria_edicion;
            setCategoriaSeleccionadaId(primeraCategoriaId);
        }
    }, [categorias, categoriaSeleccionadaId]);

    // Queries y Mutations
    const { data: sancionesData, isLoading, isError, error, refetch } = useSancionesPorCategoria(
        categoriaSeleccionadaId || 0,
        undefined
    );
    const crearMutation = useCrearSancion();
    const editarMutation = useEditarSancion();
    const eliminarMutation = useEliminarSancion();

    const sanciones = sancionesData?.data || initialSanciones || [];
    const noHayCategorias = !isLoadingCategorias && categorias.length === 0;

    // Handlers
    const handleVerDetalles = (sancion: Sancion) => {
        setModalDetalles(sancion);
    };

    const handleCrear = () => {
        if (!categoriaSeleccionadaId) {
            toast.error('Debes seleccionar una categoría primero');
            return;
        }
        setModalForm({ tipo: 'crear' });
    };

    const handleEditar = (sancion: Sancion) => {
        setModalForm({ tipo: 'editar', sancion });
    };

    const handleEliminar = (sancion: Sancion) => {
        setModalEliminar(sancion);
    };

    const handleSubmitForm = async (data: CrearSancionInput | EditarSancionInput) => {
        try {
            if (modalForm?.tipo === 'crear') {
                await crearMutation.mutateAsync(data as CrearSancionInput);
                toast.success('Sanción creada exitosamente');
                setModalForm(null);
                refetch();
            } else if (modalForm?.tipo === 'editar' && modalForm.sancion) {
                await editarMutation.mutateAsync({
                    id_expulsion: modalForm.sancion.id_expulsion,
                    data: data as EditarSancionInput
                });
                toast.success('Sanción actualizada exitosamente');
                setModalForm(null);
                refetch();
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar la sanción');
        }
    };

    const handleConfirmarEliminar = async () => {
        if (!modalEliminar) return;

        try {
            await eliminarMutation.mutateAsync(modalEliminar.id_expulsion);
            toast.success('Sanción revocada exitosamente');
            setModalEliminar(null);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Error al revocar la sanción');
        }
    };

    return {
        // Estado
        categoriaSeleccionadaId,
        setCategoriaSeleccionadaId,
        categorias,
        isLoadingCategorias,
        noHayCategorias,
        sanciones,
        isLoading,
        isError,
        error,
        refetch,
        
        // Modales
        modalDetalles,
        modalForm,
        modalEliminar,
        
        // Mutations
        crearMutation,
        editarMutation,
        eliminarMutation,
        
        // Handlers
        handleVerDetalles,
        handleCrear,
        handleEditar,
        handleEliminar,
        handleSubmitForm,
        handleConfirmarEliminar,
        
        // Modal setters
        setModalDetalles,
        setModalForm,
        setModalEliminar,
    };
}

