'use client';

import { useCrearEdicion, useTodasLasEdiciones } from '@/app/hooks/useEdiciones';
import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { Plus, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getEdicionesColumns } from '@/app/components/columns/EdicionesColumns';
import { FormField, FormModal, useModals, FormDataValue } from '@/app/components/modals/ModalAdmin';
import { CrearEdicion, EdicionAdmin } from '@/app/types/edicion';
import toast from 'react-hot-toast';
import { crearEdicionSchema } from '@/app/schemas/edicion.schema';
import { useEdicionStore } from '@/app/stores/edicionStore';

const EdicionesPage = () => {

    const { modals, openModal, closeModal } = useModals();
    const { data: ediciones, isLoading, error, refetch, isFetching } = useTodasLasEdiciones();
    const { mutate: crearEdicion } = useCrearEdicion();
    const { setEdicionSeleccionada } = useEdicionStore();

    const router = useRouter();

    const handleRefresh = () => {
        refetch();
    };

    const handleCreate = async (data: Record<string, FormDataValue>): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Convertir datos del formulario a CrearEdicion
            // Si img es un File, lo omitimos del objeto ya que el tipo espera string | null
            // El backend probablemente maneja el archivo por separado
            const edicionData: CrearEdicion = {
                nombre: String(data.nombre || ''),
                temporada: Number(data.temporada || 0),
                cantidad_eventuales: Number(data.cantidad_eventuales || 0),
                partidos_eventuales: Number(data.partidos_eventuales || 0),
                apercibimientos: Number(data.apercibimientos || 0),
                puntos_descuento: Number(data.puntos_descuento || 0),
                img: data.img instanceof File ? undefined : (data.img ? String(data.img) : undefined),
            };

            crearEdicion(edicionData, {
                onSuccess: () => {
                    toast.success('Edición creada exitosamente');
                    resolve();
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al crear la edición');
                    reject(error);
                }
            });
        });
    };

    const handleIngresarEdicion = (id_edicion: number) => {
        const edicionSeleccionada = ediciones?.find((edicion) => edicion.id_edicion === id_edicion);

        if (edicionSeleccionada) {
            setEdicionSeleccionada({
                id_edicion: edicionSeleccionada.id_edicion,
                nombre: edicionSeleccionada.nombre,
                temporada: edicionSeleccionada.temporada,
                cantidad_eventuales: edicionSeleccionada.cantidad_eventuales,
                partidos_eventuales: edicionSeleccionada.partidos_eventuales,
                apercibimientos: edicionSeleccionada.apercibimientos,
                puntos_descuento: edicionSeleccionada.puntos_descuento,
                img: edicionSeleccionada.img,
            });
        }
        router.push(`/adm/ediciones/${id_edicion}`);
    };

    const columns = getEdicionesColumns(handleIngresarEdicion);

    const edicionFields: FormField[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Apertura 2025' },
        { name: 'temporada', label: 'Temporada', type: 'number', required: true, placeholder: '2025' },
        { name: 'cantidad_eventuales', label: 'Cantidad de Eventuales', type: 'number', required: true, placeholder: '5' },
        { name: 'partidos_eventuales', label: 'Partidos Eventuales', type: 'number', required: true, placeholder: '3' },
        { name: 'apercibimientos', label: 'Apercibimientos', type: 'number', required: true, placeholder: '5' },
        { name: 'puntos_descuento', label: 'Puntos de Descuento', type: 'number', required: true, placeholder: '1' },
        { name: 'img', label: 'Imagen', type: 'file', accept: 'image/*' },
    ];

    // Agrupar ediciones por temporada
    const edicionesPorTemporada = ediciones?.reduce((acc, edicion) => {
        const year = new Date().getFullYear();
        const temporada = `Temporada ${year}`;

        if (!acc[temporada]) {
            acc[temporada] = [];
        }
        acc[temporada].push(edicion);
        return acc;
    }, {} as Record<string, typeof ediciones>) || {};

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-[var(--red)] mb-4">Error al cargar las ediciones</p>
                    <Button onClick={() => window.location.reload()}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="Ediciones"
                description="Gestiona todas las ediciones del torneo"
                actions={
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => openModal('create')}
                            variant='success'
                            className='flex items-center'
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar nueva edición
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            variant='more'
                            className='flex items-center'
                            disabled={isLoading || isFetching}
                        >
                            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
                            Refrescar
                        </Button>
                    </div>
                }
            />

            {/* Contenido */}
            {(isLoading || isFetching) ? (
                <TableSkeleton columns={8} rows={5} />
            ) : (
                <div className="space-y-8">
                    {Object.entries(edicionesPorTemporada).map(
                        ([temporada, edicionesTemporada]) => (
                            <div key={temporada} className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">
                                    {temporada}
                                </h2>
                                <DataTable
                                    data={edicionesTemporada}
                                    columns={columns}
                                    emptyMessage="No hay ediciones disponibles"
                                    onRowClick={(row) => {
                                        const edicion = row as EdicionAdmin;
                                        if (edicion.id_edicion) {
                                            handleIngresarEdicion(edicion.id_edicion);
                                        }
                                    }}
                                />
                            </div>
                        )
                    )}

                    {Object.keys(edicionesPorTemporada).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">
                                No hay ediciones disponibles
                            </p>
                            {/* <Button
                                onClick={() => openModal('create')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear primera edición
                            </Button> */}
                        </div>
                    )}
                </div>
            )}

            <FormModal
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                title="Crear edición"
                fields={edicionFields}
                onSubmit={handleCreate}
                type="create"
                validationSchema={crearEdicionSchema}
            />
        </div>
    );
};

export default EdicionesPage;