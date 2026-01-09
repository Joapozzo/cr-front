"use client";

import { Plus, AlertCircle, Filter } from 'lucide-react';
import TablaSanciones from '@/app/components/sanciones/TablaSanciones';
import ModalDetallesSancion from '@/app/components/sanciones/ModalDetallesSancion';
import ModalFormSancion from '@/app/components/sanciones/ModalFormSancion';
import ModalConfirmarEliminar from '@/app/components/sanciones/ModalConfirmarEliminar';
import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { useSancionesAdmin } from './hooks/useSancionesAdmin';
import { CategoriaActual } from '@/app/types/categoria';
import { Sancion } from '@/app/types/sancion';

interface SancionesClientProps {
    initialCategorias?: CategoriaActual[];
    initialCategoriaId?: number | null;
    initialSanciones?: Sancion[];
}

export default function SancionesClient({
    initialCategorias,
    initialCategoriaId,
    initialSanciones
}: SancionesClientProps) {
    const {
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
        modalDetalles,
        modalForm,
        modalEliminar,
        crearMutation,
        editarMutation,
        eliminarMutation,
        handleVerDetalles,
        handleCrear,
        handleEditar,
        handleEliminar,
        handleSubmitForm,
        handleConfirmarEliminar,
        setModalDetalles,
        setModalForm,
        setModalEliminar,
    } = useSancionesAdmin({
        initialCategorias,
        initialCategoriaId,
        initialSanciones
    });

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
                                Seleccionar categoría
                            </label>
                            <select
                                value={categoriaSeleccionadaId || ''}
                                onChange={(e) => setCategoriaSeleccionadaId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full md:w-96 px-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--color-primary)]"
                                disabled={isLoadingCategorias || noHayCategorias}
                            >
                                {categorias.length === 0 ? (
                                    <option value="">No hay categorías disponibles</option>
                                ) : (
                                    categorias.map((cat: any) => (
                                        <option key={cat.id_categoria_edicion} value={cat.id_categoria_edicion}>
                                            {cat.nombre}
                                            {/* {cat.categoria.division?.nombre ? ` - ${cat.categoria.division.nombre}` : ''} */}
                                        </option>
                                    ))
                                )}
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
                                Nueva sanción
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            {noHayCategorias ? (
                <div className="flex items-center justify-center h-64 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-[var(--color-warning)] mx-auto mb-4" />
                        <p className="text-[var(--white)] font-semibold mb-2">No hay categorías disponibles</p>
                        <p className="text-[var(--gray-100)]">
                            No se encontraron categorías activas para gestionar sanciones
                        </p>
                    </div>
                </div>
            ) : !categoriaSeleccionadaId ? (
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
                            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white rounded-lg transition-colors"
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

