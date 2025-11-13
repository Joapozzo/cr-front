'use client';

import { useCrearEdicion, useTodasLasEdiciones } from '@/app/hooks/useEdiciones';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getEdicionesColumns } from '@/app/components/columns/EdicionesColumns';
import { FormField, FormModal, useModals } from '@/app/components/modals/ModalAdmin';
import { CrearEdicion } from '@/app/types/edicion';
import toast from 'react-hot-toast';
import { crearEdicionSchema } from '@/app/schemas/edicion.schema';
import { useEdicionStore } from '@/app/stores/edicionStore';

const EdicionesPage = () => {

    const { modals, openModal, closeModal } = useModals();
    const { data: ediciones, isLoading, error } = useTodasLasEdiciones();
    const { mutate: crearEdicion } = useCrearEdicion();
    const { setEdicionSeleccionada } = useEdicionStore();

    const router = useRouter();

    const handleCreate = async (data: CrearEdicion): Promise<void> => {
        return new Promise((resolve, reject) => {
            crearEdicion(data, {
                onSuccess: (nuevaEdicion) => {
                    toast.success('Edición creada exitosamente');
                    resolve(nuevaEdicion);
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
            <div className="flex items-center justify-between bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--white)] mb-1">
                        Ediciones
                    </h1>
                    <p className="text-[var(--gray-100)] text-sm">
                        Gestiona todas las ediciones del torneo
                    </p>
                </div>
                <Button
                    onClick={() => openModal('create')}
                    variant='success'
                    className='flex items-center'
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar nueva edición
                </Button>
            </div>

            {/* Contenido */}
            {isLoading ? (
                <TableSkeleton columns={7} rows={5} />
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
                                />
                            </div>
                        )
                    )}

                    {Object.keys(edicionesPorTemporada).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">
                                No hay ediciones disponibles
                            </p>
                            <Button
                                onClick={() => openModal('create')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear primera edición
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <FormModal
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                title="Crear Edición"
                fields={edicionFields}
                onSubmit={handleCreate}
                type="create"
                validationSchema={crearEdicionSchema}
            />
        </div>
    );
};

export default EdicionesPage;