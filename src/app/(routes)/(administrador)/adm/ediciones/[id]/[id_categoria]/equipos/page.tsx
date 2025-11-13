'use client';

import { useState } from 'react';
import { Shield, Users, FileText, Ban, AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import { DataTable } from '@/app/components/ui/DataTable';
import getEquiposColumns from '@/app/components/columns/EquiposColumns';
import getEquiposInactivosColumns from '@/app/components/columns/EquiposInactivosColumns';
import { FormModal, useModals } from '@/app/components/modals/ModalAdmin';
import { useEquiposPorCategoriaEdicion, useEquiposInactivosPorCategoriaEdicion, useExpulsarEquipo, useReactivarEquipo } from '@/app/hooks/useEquipos';
import { useParams, useRouter } from 'next/navigation';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import toast from 'react-hot-toast';

type TabType = 'activos' | 'inactivos';

export default function EquiposPage() {
    const router = useRouter();
    const params = useParams();
    const { id, id_categoria } = params;

    const categoriaEdicion = useCategoriaStore((state) => state.categoriaSeleccionada);
    const categoriaEdicionId = Number(categoriaEdicion?.id_categoria_edicion);

    const [activeTab, setActiveTab] = useState<TabType>('activos');
    const [equipoToExpulsar, setEquipoToExpulsar] = useState<any>(null);
    const { modals, openModal, closeModal } = useModals();
    const [equipoToReactivar, setEquipoToReactivar] = useState<any>(null);

    const {
        data: equiposActivosData,
        isLoading: loadingActivos,
        error: errorActivos
    } = useEquiposPorCategoriaEdicion(categoriaEdicionId);

    const {
        data: equiposInactivosData,
        isLoading: loadingInactivos,
        error: errorInactivos
    } = useEquiposInactivosPorCategoriaEdicion(categoriaEdicionId);

    const {
        mutate: expulsarEquipo,
        isPending: isExpulsando,
        error: errorExpulsar,
    } = useExpulsarEquipo();

    const {
        mutate: reactivarEquipo,
        isPending: isReactivando,
        error: errorReactivar,
    } = useReactivarEquipo();

    const equiposActivos = equiposActivosData?.equipos || [];
    const equiposInactivos = equiposInactivosData?.equipos || [];

    const handleExpulsarEquipo = (equipoId: number) => {
        const equipo = equiposActivos.find(e => e.id_equipo === equipoId);
        if (equipo) {
            setEquipoToExpulsar(equipo);
            openModal('delete'); // Usando modal de tipo delete como confirmación
        }
    };

    const handleConfirmarExpulsion = async (formData: { motivo?: string }) => {
        if (!equipoToExpulsar) return;

        try {
            await new Promise((resolve) => {
                expulsarEquipo({
                    id_equipo: equipoToExpulsar.id_equipo,
                    id_categoria_edicion: categoriaEdicionId,
                    motivo: formData.motivo
                }, {
                    onSuccess: () => resolve(true),
                    onError: (error) => {
                        throw error;
                    }
                });
            });

            // Modal se cierra automáticamente en FormModal al completarse exitosamente
            setEquipoToExpulsar(null);
        } catch (error) {
            throw error; // Re-lanzar para que FormModal maneje el error
        }
    };

    const handleReactivarEquipo = (equipoId: number) => {
        // CAMBIO: En lugar de ejecutar directamente, abrir el modal
        const equipo = equiposInactivos.find(e => e.id_equipo === equipoId);
        if (equipo) {
            setEquipoToReactivar(equipo);
            openModal('edit');
        }
    };

    const handleConfirmarReactivacion = async () => {
        if (!equipoToReactivar) return;

        try {
            await new Promise((resolve) => {
                reactivarEquipo({
                    id_equipo: equipoToReactivar.id_equipo,
                    id_categoria_edicion: categoriaEdicionId
                }, {
                    onSuccess: () => {
                        toast.success('Equipo reactivado exitosamente');
                        resolve(true);
                    },
                    onError: (error) => {
                        throw error;
                    }
                });
            });
            setEquipoToReactivar(null);
        } catch (error) {
            throw error;
        }
    };

    const handleRowClick = (equipo: any) => {
        router.push(`/adm/ediciones/${id}/${id_categoria}/equipos/${equipo.id_equipo}`);
    };

    const equiposActivosColumns = getEquiposColumns(handleExpulsarEquipo);
    const equiposInactivosColumns = getEquiposInactivosColumns(handleReactivarEquipo);

    const totalEquipos = equiposActivos.length + equiposInactivos.length;
    const totalJugadores = equiposActivos.reduce((sum, e) => sum + (e.lista_de_buena_fe || 0), 0);
    const totalSolicitudes = equiposActivos.reduce((sum, e) => sum + (e.solicitudes_pendientes || 0), 0);

    const tabs = [
        {
            id: 'activos' as TabType,
            label: 'Equipos Activos',
            count: equiposActivos.length,
            icon: Shield,
            color: 'text-[var(--green)]'
        },
        {
            id: 'inactivos' as TabType,
            label: 'Equipos Expulsados',
            count: equiposInactivos.length,
            icon: Ban,
            color: 'text-[var(--red)]'
        }
    ];

    const isLoading = activeTab === 'activos' ? loadingActivos : loadingInactivos;
    const error = activeTab === 'activos' ? errorActivos : errorInactivos;

    // Campos del modal de expulsión
    const expulsionFields = [
        {
            name: 'motivo',
            label: 'Motivo de la expulsión',
            type: 'textarea' as const,
            placeholder: 'Describe el motivo de la expulsión (opcional)',
            required: false
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Equipos - {categoriaEdicion?.nombre_completo || 'Cargando...'}
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Gestiona los equipos de la categoría. Haz clic en cualquier fila para ver los detalles del equipo.
                    </p>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--green)]/20 rounded-lg">
                            <Shield className="w-5 h-5 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Total Equipos</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {totalEquipos}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--green)]/20 rounded-lg">
                            <Shield className="w-5 h-5 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Activos</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {equiposActivos.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--red)]/20 rounded-lg">
                            <Ban className="w-5 h-5 text-[var(--red)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Expulsados</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {equiposInactivos.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--green)]/20 rounded-lg">
                            <Users className="w-5 h-5 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Total Jugadores</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {totalJugadores}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                            <FileText className="w-5 h-5 text-[var(--yellow)]" />
                        </div>
                        <div>
                            <p className="text-[var(--gray-100)] text-sm">Solicitudes</p>
                            <p className="text-[var(--white)] text-xl font-bold">
                                {totalSolicitudes}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertas importantes */}
            {(totalSolicitudes > 0 || equiposInactivos.length > 0) && (
                <div className="space-y-3">
                    {totalSolicitudes > 0 && (
                        <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-[var(--yellow)]" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--yellow)] font-medium">
                                        Solicitudes pendientes
                                    </h3>
                                    <p className="text-[var(--yellow)]/80 text-sm">
                                        Hay {totalSolicitudes} solicitudes esperando aprobación
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {equiposInactivos.length > 0 && (
                        <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--red)]/20 rounded-lg">
                                    <Ban className="w-5 h-5 text-[var(--red)]" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--red)] font-medium">
                                        Equipos expulsados
                                    </h3>
                                    <p className="text-[var(--red)]/80 text-sm">
                                        Hay {equiposInactivos.length} equipos expulsados de esta categoría
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                <div className="flex border-b border-[var(--gray-300)]">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors relative ${isActive
                                    ? 'text-[var(--white)] border-b-2 border-[var(--green)]'
                                    : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--green)]' : tab.color}`} />
                                <span>{tab.label}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${isActive
                                    ? 'bg-[var(--green)]/20 text-[var(--green)]'
                                    : 'bg-[var(--gray-300)] text-[var(--gray-100)]'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {error && (
                        <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4 mb-4">
                            <p className="text-[var(--red)] text-sm">
                                Error al cargar los datos: {error.message}
                            </p>
                        </div>
                    )}

                    {activeTab === 'activos' && (
                        <DataTable
                            data={equiposActivos}
                            columns={equiposActivosColumns}
                            isLoading={isLoading}
                            emptyMessage="No se encontraron equipos activos para esta categoría."
                            onRowClick={handleRowClick}
                        />
                    )}

                    {activeTab === 'inactivos' && (
                        <DataTable
                            data={equiposInactivos}
                            columns={equiposInactivosColumns}
                            isLoading={isLoading}
                            emptyMessage="No hay equipos expulsados en esta categoría."
                        // onRowClick={handleRowClick} // Comentado para equipos inactivos
                        />
                    )}
                </div>
            </div>

            {/* Modal de Expulsión */}
            <FormModal
                isOpen={modals.delete}
                onClose={() => {
                    closeModal('delete');
                    setEquipoToExpulsar(null);
                }}
                title={`Expulsar Equipo: ${equipoToExpulsar?.nombre || ''}`}
                fields={expulsionFields}
                onSubmit={handleConfirmarExpulsion}
                submitText="Confirmar Expulsión"
                type="delete"
            >
                {/* Contenido adicional del modal */}
                <div className="mb-6 p-4 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-[var(--red)] flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <h4 className="text-[var(--red)] font-medium">
                                Advertencia: Esta acción tendrá las siguientes consecuencias
                            </h4>
                            <ul className="text-[var(--red)]/80 text-sm space-y-1 ml-2">
                                <li>• El equipo será removido de todas las zonas del torneo</li>
                                <li>• Se liberarán las vacantes que ocupaba</li>
                                <li>• Los partidos ya jugados se mantendrán en el historial</li>
                                <li>• El plantel de jugadores se mantendrá intacto</li>
                                <li>• Podrá ser reactivado posteriormente si es necesario</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </FormModal>

            <FormModal
                isOpen={modals.edit}
                onClose={() => {
                    closeModal('edit');
                    setEquipoToReactivar(null);
                }}
                title={`Reactivar Equipo: ${equipoToReactivar?.nombre || ''}`}
                fields={[]} // Sin campos, solo confirmación
                onSubmit={handleConfirmarReactivacion}
                submitText="Confirmar Reactivación"
                type="edit"
            >
                {/* Contenido del modal de reactivación */}
                <div className="mb-6 p-4 bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <RotateCcw className="w-6 h-6 text-[var(--green)] flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <h4 className="text-[var(--green)] font-medium">
                                Al reactivar este equipo:
                            </h4>
                            <ul className="text-[var(--green)]/80 text-sm space-y-1 ml-2">
                                <li>• El equipo volverá a estar disponible para participar</li>
                                <li>• Podrá ser asignado a nuevas zonas y vacantes</li>
                                <li>• Su plantel de jugadores seguirá intacto</li>
                                <li>• Los partidos del historial se mantendrán</li>
                                <li>• Aparecerá nuevamente en la lista de equipos activos</li>
                            </ul>

                            {equipoToReactivar?.expulsion && (
                                <div className="mt-3 p-3 bg-[var(--gray-300)] rounded-lg">
                                    <p className="text-[var(--gray-100)] text-sm">
                                        <strong>Motivo de expulsión anterior: </strong>
                                        {equipoToReactivar.expulsion.motivo || 'Sin motivo especificado'}
                                    </p>
                                    <p className="text-[var(--gray-100)] text-xs mt-1">
                                        Expulsado el: {new Date(equipoToReactivar.expulsion.fecha_expulsion).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </FormModal>
        </div>
    );
}