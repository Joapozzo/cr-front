"use client";
import { useState } from 'react';
import { Plus, AlertCircle, Filter } from 'lucide-react';
import { useCategoriasPorEdicionActivas } from '@/app/hooks/useCategorias';
import {
    useSancionesPorCategoria,
    useCrearSancion,
    useEditarSancion,
    useEliminarSancion
} from '@/app/hooks/useSanciones';
import TablaSanciones from '@/app/components/sanciones/TablaSanciones';
import ModalDetallesSancion from '@/app/components/sanciones/ModalDetallesSancion';
import ModalFormSancion from '@/app/components/sanciones/ModalFormSancion';
import ModalConfirmarEliminar from '@/app/components/sanciones/ModalConfirmarEliminar';
import { Sancion, CrearSancionInput, EditarSancionInput } from '@/app/types/sancion';
import { toast } from 'react-hot-toast';
import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';

export default function SancionesPage() {
    const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState<number | null>(null);

    // Estados para modales
    const [modalDetalles, setModalDetalles] = useState<Sancion | null>(null);
    const [modalForm, setModalForm] = useState<{ tipo: 'crear' | 'editar'; sancion?: Sancion } | null>(null);
    const [modalEliminar, setModalEliminar] = useState<Sancion | null>(null);

    // Obtener categorías de la edición
    const { data: categoriasData, isLoading: isLoadingCategorias } = useCategoriasPorEdicionActivas();
    const categorias = categoriasData || [];

    // Queries y Mutations
    const { data: sancionesData, isLoading, isError, error, refetch } = useSancionesPorCategoria(
        categoriaSeleccionadaId || 0,
        undefined
    );
    const crearMutation = useCrearSancion();
    const editarMutation = useEditarSancion();
    const eliminarMutation = useEliminarSancion();

    const sanciones = sancionesData?.data || [];

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

    if (categoriasData?.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-[var(--orange)] mx-auto mb-4" />
                    <p className="text-[var(--gray-100)]">No hay categorias disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Sanciones"
                description="Gestión de sanciones y expulsiones"
            />

            {/* Selector de Categoría */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                <div className="flex items-start gap-3">
                    <Filter className="w-5 h-5 text-[var(--gray-100)] mt-8" />
                    <div className="flex space-y-3 justify-between w-full">
                        <div>
                            <label className="block text-sm font-medium text-[var(--gray-100)] mb-2">
                                Seleccionar Categoría
                            </label>
                            <select
                                value={categoriaSeleccionadaId || ''}
                                onChange={(e) => setCategoriaSeleccionadaId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full md:w-96 px-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--green)]"
                                disabled={isLoadingCategorias}
                            >
                                <option value="">Seleccionar categoría...</option>
                                {categorias.map((cat: any) => (
                                    <option key={cat.id_categoria_edicion} value={cat.id_categoria_edicion}>
                                        {cat.nombre}
                                        {/* {cat.categoria.division?.nombre ? ` - ${cat.categoria.division.nombre}` : ''} */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botón Nueva Sanción */}
                        <div className='flex items-center p-2'>
                            <Button
                                onClick={handleCrear}
                                disabled={!categoriaSeleccionadaId}
                                className='flex items-center gap-2'
                                variant='success'
                            >
                                <Plus className="w-5 h-5" />
                                Nueva Sanción
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            {!categoriaSeleccionadaId ? (
                <div className="flex items-center justify-center h-64 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                    <div className="text-center">
                        <Filter className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-4" />
                        <p className="text-[var(--white)] font-semibold mb-2">Selecciona una categoría</p>
                        <p className="text-[var(--gray-100)]">
                            Elige una categoría para ver y gestionar sus sanciones
                        </p>
                    </div>
                </div>
            ) : isLoading ? (
                <TableSkeleton columns={7} rows={5} />
            ) : isError ? (
                <div className="flex items-center justify-center h-64 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-[var(--white)] font-semibold mb-2">Error al cargar sanciones</p>
                        <p className="text-[var(--gray-100)] mb-4">{error?.message}</p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-[var(--green)] hover:bg-[var(--green-win)] text-white rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Tabla */}
                    <TablaSanciones
                        sanciones={sanciones}
                        onVerDetalles={handleVerDetalles}
                        onEditar={handleEditar}
                        onEliminar={handleEliminar}
                    />
                </>
            )}

            {/* Modales */}
            {modalDetalles && (
                <ModalDetallesSancion
                    sancion={modalDetalles}
                    onClose={() => setModalDetalles(null)}
                />
            )}

            {modalForm && categoriaSeleccionadaId && (
                <ModalFormSancion
                    sancion={modalForm.sancion}
                    categoriaId={categoriaSeleccionadaId}
                    onClose={() => setModalForm(null)}
                    onSubmit={handleSubmitForm}
                    isLoading={crearMutation.isPending || editarMutation.isPending}
                />
            )}

            {modalEliminar && (
                <ModalConfirmarEliminar
                    sancion={modalEliminar}
                    onClose={() => setModalEliminar(null)}
                    onConfirm={handleConfirmarEliminar}
                    isLoading={eliminarMutation.isPending}
                />
            )}
        </div>
    );
}
