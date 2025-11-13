'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCategoriasPorEdicion, useCrearCategoriaEdicion, useDatosParaCrearCategoria } from '@/app/hooks/useCategorias';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { Plus, RefreshCcw, Loader2 } from 'lucide-react';
import { getCategoriasColumns } from '@/app/components/columns/CategoriasColumns';
import { FormField, FormModal, useModals } from '@/app/components/modals/ModalAdmin';
import { crearCategoriaEdicionSchema, CrearCategoriaEdicionInput } from '@/app/schemas/categoria.schema';
import toast from 'react-hot-toast';
import { useCategoriaStore } from '@/app/stores/categoriaStore';

const CategoriasPage = () => {
    const params = useParams();
    const router = useRouter();
    const edicionId = parseInt(params.id as string);

    const { modals, openModal, closeModal } = useModals();
    const { data: categorias, isLoading, error } = useCategoriasPorEdicion(edicionId);
    const { data: datosCrear, isLoading: isLoadingDatos } = useDatosParaCrearCategoria({
        enabled: modals.create
    });
    const { mutate: crearCategoriaEdicion } = useCrearCategoriaEdicion();
    const { setCategoriaSeleccionada } = useCategoriaStore();

    const handleIngresarCategoria = (id_categoria: number) => {
        const categoriaEdicion = categorias?.find((cat) => cat.edicion.id_edicion === edicionId && cat.categoria.id_categoria === id_categoria);

        if (categoriaEdicion) {
            setCategoriaSeleccionada({
                id_edicion: categoriaEdicion.edicion.id_edicion,
                id_categoria_edicion: categoriaEdicion.id_categoria_edicion,
                nombre_completo: categoriaEdicion.categoria.nombre_completo,
                tipo_futbol: categoriaEdicion.configuracion.tipo_futbol,
                duracion_tiempo: categoriaEdicion.configuracion.duracion_tiempo,
                duracion_entretiempo: categoriaEdicion.configuracion.duracion_entretiempo,
                publicada: categoriaEdicion.configuracion.publicada,
                puntos_victoria: categoriaEdicion.configuracion.puntos_victoria,
                puntos_empate: categoriaEdicion.configuracion.puntos_empate,
                puntos_derrota: categoriaEdicion.configuracion.puntos_derrota,
            });
            
            router.push(`/adm/ediciones/${edicionId}/${id_categoria}/resumen`);
        }
    };

    const columns = getCategoriasColumns(handleIngresarCategoria);

    const handleAgregarCategoria = () => {
        openModal('create');
    };

    const handleCrearCategoria = async (data: CrearCategoriaEdicionInput): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Agregar publicada por defecto
            const dataConDefaults = {
                ...data,
                publicada: 'N' // Por defecto no publicada
            };

            crearCategoriaEdicion(
                { id_edicion: edicionId, data: dataConDefaults },
                {
                    onSuccess: () => {
                        toast.success('Categoría creada exitosamente');
                        resolve();
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al crear la categoría');
                        reject(error);
                    }
                }
            );
        });
    };

    const RefreshPage = () => {
        window.location.reload();
    };

    const categoriaOptions = datosCrear?.data?.map(cat => ({
        value: cat.id_categoria,
        label: cat.nombre_completo
    })) || [];

    const categoriaFields: FormField[] = [
        {
            name: 'id_categoria',
            label: 'Categoría',
            type: 'select',
            required: true,
            placeholder: 'Seleccionar categoría',
            options: categoriaOptions
        },
        {
            name: 'tipo_futbol',
            label: 'Tipo de Fútbol (Jugadores)',
            type: 'number',
            required: true,
            placeholder: '7'
        },
        {
            name: 'duracion_tiempo',
            label: 'Duración Tiempo (minutos)',
            type: 'number',
            required: true,
            placeholder: '45'
        },
        {
            name: 'duracion_entretiempo',
            label: 'Duración Entretiempo (minutos)',
            type: 'number',
            required: true,
            placeholder: '15'
        },
        {
            name: 'puntos_victoria',
            label: 'Puntos Victoria',
            type: 'number',
            required: true,
            placeholder: '3'
        },
        {
            name: 'puntos_empate',
            label: 'Puntos Empate',
            type: 'number',
            required: true,
            placeholder: '1'
        },
        {
            name: 'puntos_derrota',
            label: 'Puntos Derrota',
            type: 'number',
            required: true,
            placeholder: '0'
        }
    ];

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
                        onClick={RefreshPage}
                        className="flex items-center"
                        variant='more'
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refrescar
                    </Button>
                </div>
            </div>

            {/* Tabla de categorías */}
            {isLoading ? (
                <TableSkeleton columns={6} rows={8} />
            ) : (
                <DataTable
                    data={categorias || []}
                    columns={columns}
                    emptyMessage={error?.message || "No hay categorías para mostrar"}
                />
            )}

                {isLoadingDatos ? (
                    // Loader mientras cargan los datos
                    <FormModal
                        isOpen={modals.create}
                        onClose={() => closeModal('create')}
                        title="Crear Categoría"
                        fields={[]}
                        onSubmit={() => Promise.resolve()}
                        type="create"
                    >
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-6 h-6 animate-spin text-[var(--green)]" />
                                <span className="text-[var(--white)]">Cargando datos...</span>
                            </div>
                        </div>
                    </FormModal>
                ) : (
                    <FormModal
                        isOpen={modals.create}
                        onClose={() => closeModal('create')}
                        title="Crear Categoría"
                        fields={categoriaFields}
                        onSubmit={handleCrearCategoria}
                        type="create"
                        validationSchema={crearCategoriaEdicionSchema}
                    />
                )}
        </div>
    );
};

export default CategoriasPage;