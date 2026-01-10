'use client';

import React from 'react';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { Plus, RefreshCcw, Loader2 } from 'lucide-react';
import { getCategoriasColumns } from '@/app/components/columns/CategoriasColumns';
import { FormModal } from '@/app/components/modals/ModalAdmin';
import { CategoriaEdicionDto } from '@/app/types/categoria';
import { useCategoriasPorEdicion } from '@/app/hooks/useCategorias';
import { useCategoriasAdmin } from '../../hooks/useCategoriasAdmin';
import HelperCrearNombreCategoria from '@/app/components/modals/HelperCrearNombreCategoria';
import HelperCrearDivision from '@/app/components/modals/HelperCrearDivision';
import HelperColorPicker from '@/app/components/modals/HelperColorPicker';
import { FormDataValue } from '@/app/components/modals/ModalAdmin';
import { useState, useEffect } from 'react';

interface CategoriasClientProps {
    initialCategorias?: CategoriaEdicionDto[] | null;
    edicionId: number;
}

export const CategoriasClient = ({ 
    initialCategorias,
    edicionId
}: CategoriasClientProps) => {
    const {
        modals,
        closeModal,
        handleRefresh,
        handleIngresarCategoria,
        handleAgregarCategoria,
        handleCrearCategoria: handleCrearCategoriaOriginal,
        categoriaFields,
        validationSchema,
        isLoadingDatos,
    } = useCategoriasAdmin(edicionId);

    // Wrapper para handleCrearCategoria que incluye el color del estado local
    const handleCrearCategoria = async (data: Record<string, any>): Promise<void> => {
        // Asegurar que el color esté en los datos antes de enviar
        const dataConColor = {
            ...data,
            color: colorValue || '#3B82F6'
        };
        return handleCrearCategoriaOriginal(dataConColor);
    };

    // Estado local para el color del formulario
    const [colorValue, setColorValue] = useState<string | null>('#3B82F6');
    const [colorError, setColorError] = useState<string>('');

    // Resetear el color cuando se abre el modal
    useEffect(() => {
        if (modals.create) {
            setColorValue('#3B82F6');
            setColorError('');
        }
    }, [modals.create]);

    // Handler para cambios en el color - también actualiza el FormModal
    const handleColorChange = (name: string, value: FormDataValue) => {
        // Solo manejar cambios del campo 'color'
        if (name === 'color') {
            // El color nunca debería ser un File, pero verificamos por seguridad
            if (value instanceof File) {
                // Si por alguna razón es un File, ignoramos el cambio
                return;
            }
            const colorStr = value ? String(value) : null;
            setColorValue(colorStr || '#3B82F6');
            setColorError(''); // Limpiar error al cambiar
        }
    };

    // Función para actualizar el FormModal directamente
    const updateFormModalColor = (color: string | null) => {
        // Esta función se pasará al HelperColorPicker para que actualice el FormModal
        // El FormModal se actualizará a través de onFieldChange cuando se llame desde el HelperColorPicker
    };

    // Usar React Query para obtener categorías (con initialData del server)
    const { data: categorias, error, isLoading, isFetching } = useCategoriasPorEdicion(edicionId, {
        initialData: initialCategorias || undefined,
    });

    const categoriasActuales = categorias || initialCategorias || [];

    const columns = getCategoriasColumns((id: number) => handleIngresarCategoria(categorias, id));

    // Helper para convertir hex a rgba con opacidad
    const hexToRgba = (hex: string | null | undefined, opacity: number = 0.1): string => {
        if (!hex) return '';
        const cleanHex = hex.replace('#', '');
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Función para obtener el estilo de la fila basado en el color de la categoría
    const getRowStyle = (row: CategoriaEdicionDto): React.CSSProperties => {
        const color = row.configuracion?.color;
        if (!color) return {};
        
        return {
            borderLeft: `3px solid ${color}`,
            backgroundColor: hexToRgba(color, 0.05),
        };
    };

    // Función para obtener clases adicionales de la fila con hover personalizado
    const getRowClassName = (row: CategoriaEdicionDto): string => {
        // La clase se maneja en DataTable basándose en si tiene color
        return '';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)]">
                        Categorías
                    </h1>
                    <p className="text-[var(--gray-100)] text-sm">
                        Gestiona las categorías de la edición
                    </p>
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        onClick={handleAgregarCategoria}
                        className="flex items-center"
                        variant='success'
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar categoría
                    </Button>
                    <Button
                        onClick={handleRefresh}
                        className="flex items-center"
                        variant='more'
                        disabled={isLoading || isFetching}
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
                        Refrescar
                    </Button>
                </div>
            </div>

            {/* Tabla de categorías */}
            {(isLoading || (isFetching && categoriasActuales.length === 0)) ? (
                <TableSkeleton columns={6} rows={8} />
            ) : (
                <DataTable
                    data={categoriasActuales}
                    columns={columns}
                    emptyMessage={error?.message || "No hay categorías para mostrar"}
                    onRowClick={(row) => {
                        if (row?.categoria?.id_categoria) {
                            handleIngresarCategoria(categorias, row.categoria.id_categoria);
                        }
                    }}
                    getRowStyle={(row) => getRowStyle(row as CategoriaEdicionDto)}
                    getRowClassName={(row) => getRowClassName(row as CategoriaEdicionDto)}
                />
            )}

            {/* Modal Crear Categoría */}
            {isLoadingDatos ? (
                <FormModal
                    isOpen={modals.create}
                    onClose={() => closeModal('create')}
                    title="Crear categoría"
                    fields={[]}
                    onSubmit={() => Promise.resolve()}
                    type="create"
                >
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                            <span className="text-[var(--white)]">Cargando datos...</span>
                        </div>
                    </div>
                </FormModal>
            ) : (
                <FormModal
                    isOpen={modals.create}
                    onClose={() => closeModal('create')}
                    title="Crear categoría"
                    fields={categoriaFields}
                    onSubmit={handleCrearCategoria}
                    type="create"
                    validationSchema={validationSchema}
                    onFieldChange={(name, value) => {
                        // Actualizar estado local para el color
                        if (name === 'color') {
                            handleColorChange(name, value);
                        }
                        // El FormModal manejará otros campos internamente
                    }}
                    initialData={{ color: colorValue || '#3B82F6' }}
                >
                    <HelperCrearNombreCategoria />
                    <HelperCrearDivision />
                    <div className="mb-4">
                        <HelperColorPicker 
                            value={colorValue} 
                            onChange={(name, value) => {
                                // Actualizar estado local
                                handleColorChange(name, value);
                            }}
                            error={colorError}
                        />
                    </div>
                </FormModal>
            )}
        </div>
    );
};

