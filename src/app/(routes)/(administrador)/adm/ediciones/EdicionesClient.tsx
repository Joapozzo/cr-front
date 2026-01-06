'use client';

import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { Plus, RefreshCcw } from 'lucide-react';
import { getEdicionesColumns } from '@/app/components/columns/EdicionesColumns';
import { FormModal } from '@/app/components/modals/ModalAdmin';
import { EdicionAdmin } from '@/app/types/edicion';
import { useEdicionesAdmin } from './hooks/useEdicionesAdmin';
import { useTodasLasEdiciones } from '@/app/hooks/useEdiciones';

interface EdicionesClientProps {
    initialEdiciones?: EdicionAdmin[] | null;
}

export const EdicionesClient = ({ 
    initialEdiciones
}: EdicionesClientProps) => {
    const {
        modals,
        openModal,
        closeModal,
        handleRefresh,
        handleCreate,
        handleIngresarEdicion,
        edicionFields,
        validationSchema,
    } = useEdicionesAdmin();

    // Usar React Query para obtener ediciones (con initialData del server)
    const { data: ediciones, error, isLoading, isFetching } = useTodasLasEdiciones({
        initialData: initialEdiciones || undefined,
    });

    // Usar ediciones del hook (React Query) si están disponibles, sino usar las iniciales del server
    const edicionesActuales = ediciones || initialEdiciones || [];
    
    // Agrupar ediciones por temporada
    const edicionesPorTemporada = edicionesActuales.reduce((acc, edicion) => {
        const year = new Date().getFullYear();
        const temporada = `Temporada ${year}`;

        if (!acc[temporada]) {
            acc[temporada] = [];
        }
        acc[temporada].push(edicion);
        return acc;
    }, {} as Record<string, EdicionAdmin[]>);

    const columns = getEdicionesColumns((id: number) => handleIngresarEdicion(ediciones, id));

    // Manejar error
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-[var(--color-secondary)] mb-4">Error al cargar las ediciones</p>
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
                            disabled={isFetching}
                        >
                            <RefreshCcw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                            Refrescar
                        </Button>
                    </div>
                }
            />

            {/* Contenido */}
            {(isLoading || (isFetching && edicionesActuales.length === 0)) ? (
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
                                            handleIngresarEdicion(ediciones, edicion.id_edicion);
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
                validationSchema={validationSchema}
            />
        </div>
    );
};

