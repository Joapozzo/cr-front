'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCategoriasPorEdicion, useCrearCategoriaEdicion, useDatosParaCrearCategoria } from '@/app/hooks/useCategorias';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { Plus, RefreshCcw, Loader2 } from 'lucide-react';
import { getCategoriasColumns } from '@/app/components/columns/CategoriasColumns';
import { FormField, FormModal, useModals, FormDataValue } from '@/app/components/modals/ModalAdmin';
import { crearCategoriaEdicionSchema } from '@/app/schemas/categoria.schema';
import toast from 'react-hot-toast';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import HelperCrearNombreCategoria from '@/app/components/modals/HelperCrearNombreCategoria';

const CategoriasPage = () => {
    const params = useParams();
    const router = useRouter();
    const edicionId = parseInt(params.id as string);

    const { modals, openModal, closeModal } = useModals();
    const { data: categorias, isLoading, error, refetch } = useCategoriasPorEdicion(edicionId);
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
                limite_cambios: categoriaEdicion.configuracion.limite_cambios,
                recambio: categoriaEdicion.configuracion.recambio,
                color: categoriaEdicion.configuracion.color,
            });
            
            router.push(`/adm/ediciones/${edicionId}/${id_categoria}/resumen`);
        }
    };

    const columns = getCategoriasColumns(handleIngresarCategoria);

    const handleAgregarCategoria = () => {
        openModal('create');
    };

    const handleCrearCategoria = async (data: Record<string, FormDataValue>): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Procesar id_categoria: puede ser un id_categoria normal o un nombre_xxx
            let idCategoria: number | undefined;
            let idNombreCat: number | undefined;
            
            const categoriaValue = data.id_categoria;
            
            if (typeof categoriaValue === 'string' && categoriaValue.startsWith('nombre_')) {
                // Es un nombre de categoría, extraer el id
                const idNombre = categoriaValue.replace('nombre_', '');
                idNombreCat = parseInt(idNombre);
            } else if (categoriaValue !== undefined && categoriaValue !== null) {
                // Es un id_categoria normal
                idCategoria = typeof categoriaValue === 'number' ? categoriaValue : parseInt(String(categoriaValue));
            }

            // Agregar publicada por defecto y color default
            const dataConDefaults: any = {
                ...data,
                publicada: 'N', // Por defecto no publicada
                color: '#3B82F6', // Color default (azul)
            };

            // Reemplazar id_categoria con el valor correcto
            delete dataConDefaults.id_categoria;
            if (idCategoria) {
                dataConDefaults.id_categoria = idCategoria;
            } else if (idNombreCat) {
                dataConDefaults.id_nombre_cat = idNombreCat;
            }

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

    const handleRefresh = () => {
        refetch();
    };

    const categoriaOptions = useMemo(() => {
        const options: Array<{ value: string | number; label: string; esNombre?: boolean }> = [];
        
        // Agregar categorías existentes
        if (datosCrear?.data?.categorias) {
            datosCrear.data.categorias.forEach(cat => {
                options.push({
                    value: cat.id_categoria,
                    label: cat.nombre_completo,
                    esNombre: false
                });
            });
        }
        
        // Agregar nombres de categoría disponibles (sin categoría asociada)
        if (datosCrear?.data?.nombres_disponibles) {
            datosCrear.data.nombres_disponibles.forEach(nombre => {
                options.push({
                    value: `nombre_${nombre.id_nombre_cat}`, // Prefijo para identificar que es un nombre
                    label: `${nombre.nombre_categoria} (nuevo)`,
                    esNombre: true
                });
            });
        }
        
        return options;
    }, [datosCrear?.data]);

    const categoriaFields: FormField[] = useMemo(() => [
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
    ], [categoriaOptions]);

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
                        disabled={isLoading}
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
                    onRowClick={(row) => {
                        if (row?.categoria?.id_categoria) {
                            handleIngresarCategoria(row.categoria.id_categoria);
                        }
                    }}
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
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--green)]" />
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
                    validationSchema={crearCategoriaEdicionSchema}
                >
                    <HelperCrearNombreCategoria />
                </FormModal>
            )}
        </div>
    );
};

export default CategoriasPage;