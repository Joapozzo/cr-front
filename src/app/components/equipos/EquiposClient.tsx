'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Shield, Ban } from 'lucide-react';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import {
    useEquiposPorCategoriaEdicion,
    useEquiposInactivosPorCategoriaEdicion,
    useExpulsarEquipo,
    useReactivarEquipo
} from '@/app/hooks/useEquipos';
import toast from 'react-hot-toast';
import { PageHeader } from '@/app/components/ui/PageHeader';
import EquiposStatsCards from './EquiposStatsCards';
import EquiposAlerts from './EquiposAlerts';
import EquiposTabs from './EquiposTabs';
import EquiposActivosTable from './EquiposActivosTable';
import EquiposInactivosTable from './EquiposInactivosTable';
import ExpulsarEquipoModal from './modals/ExpulsarEquipoModal';
import ReactivarEquipoModal from './modals/ReactivarEquipoModal';

type TabType = 'activos' | 'inactivos';

export default function EquiposClient() {
    const router = useRouter();
    const params = useParams();
    const { id, id_categoria } = params;

    const categoriaEdicion = useCategoriaStore((state) => state.categoriaSeleccionada);
    const categoriaEdicionId = Number(categoriaEdicion?.id_categoria_edicion);

    const [activeTab, setActiveTab] = useState<TabType>('activos');
    const [equipoToExpulsar, setEquipoToExpulsar] = useState<{ id_equipo: number; nombre: string } | null>(null);
    const [equipoToReactivar, setEquipoToReactivar] = useState<{
        id_equipo: number;
        nombre: string;
        expulsion?: { motivo?: string; fecha_expulsion: string };
        [key: string]: unknown;
    } | null>(null);

    // Queries
    const {
        data: equiposActivosData,
        isLoading: loadingActivos,
        error: errorActivos
    } = useEquiposPorCategoriaEdicion(categoriaEdicionId, {
        enabled: !!categoriaEdicionId
    });

    const {
        data: equiposInactivosData,
        isLoading: loadingInactivos,
        error: errorInactivos
    } = useEquiposInactivosPorCategoriaEdicion(categoriaEdicionId, {
        enabled: !!categoriaEdicionId
    });

    // Mutations
    const { mutate: expulsarEquipo } = useExpulsarEquipo();
    const { mutate: reactivarEquipo } = useReactivarEquipo();

    // Memoize equipos arrays to avoid recreating on every render
    const equiposActivos = useMemo(
        () => equiposActivosData?.equipos || [],
        [equiposActivosData?.equipos]
    );
    
    const equiposInactivos = useMemo(
        () => equiposInactivosData?.equipos || [],
        [equiposInactivosData?.equipos]
    );

    // Memoized calculations
    const stats = useMemo(
        () => ({
            totalEquipos: equiposActivos.length + equiposInactivos.length,
            equiposActivos: equiposActivos.length,
            equiposInactivos: equiposInactivos.length,
            totalJugadores: equiposActivos.reduce((sum, e) => sum + (e.lista_de_buena_fe || 0), 0),
            totalSolicitudes: equiposActivos.reduce((sum, e) => sum + (e.solicitudes_pendientes || 0), 0)
        }),
        [equiposActivos, equiposInactivos]
    );

    const tabs = useMemo(
        () => [
            {
                id: 'activos' as TabType,
                label: 'Equipos activos',
                count: equiposActivos.length,
                icon: Shield,
                color: 'text-[var(--color-primary)]'
            },
            {
                id: 'inactivos' as TabType,
                label: 'Equipos expulsados',
                count: equiposInactivos.length,
                icon: Ban,
                color: 'text-[var(--red)]'
            }
        ],
        [equiposActivos.length, equiposInactivos.length]
    );

    // Handlers
    const handleExpulsarEquipo = useCallback((equipoId: number) => {
        const equipo = equiposActivos.find((e) => e.id_equipo === equipoId);
        if (equipo) {
            setEquipoToExpulsar(equipo);
        }
    }, [equiposActivos]);

    const handleConfirmarExpulsion = useCallback(
        async (formData: { motivo?: string }) => {
            if (!equipoToExpulsar) return;

            try {
                await new Promise<void>((resolve, reject) => {
                    expulsarEquipo(
                        {
                            id_equipo: equipoToExpulsar.id_equipo,
                            id_categoria_edicion: categoriaEdicionId,
                            motivo: formData.motivo
                        },
                        {
                            onSuccess: (data) => {
                                toast.success(data.message || 'Equipo expulsado exitosamente');
                                setEquipoToExpulsar(null);
                                resolve();
                            },
                            onError: (error) => {
                                reject(error);
                            }
                        }
                    );
                });
            } catch (error) {
                throw error;
            }
        },
        [equipoToExpulsar, categoriaEdicionId, expulsarEquipo]
    );

    const handleReactivarEquipo = useCallback((equipoId: number) => {
        const equipo = equiposInactivos.find((e) => e.id_equipo === equipoId);
        if (equipo) {
            setEquipoToReactivar({
                id_equipo: equipo.id_equipo,
                nombre: equipo.nombre,
                expulsion: equipo.expulsion ? {
                    motivo: equipo.expulsion.motivo,
                    fecha_expulsion: equipo.expulsion.fecha_expulsion
                } : undefined
            });
        }
    }, [equiposInactivos]);

    const handleConfirmarReactivacion = useCallback(async () => {
        if (!equipoToReactivar) return;

        try {
            await new Promise((resolve) => {
                reactivarEquipo(
                    {
                        id_equipo: equipoToReactivar.id_equipo,
                        id_categoria_edicion: categoriaEdicionId
                    },
                    {
                        onSuccess: () => {
                            toast.success('Equipo reactivado exitosamente');
                            setEquipoToReactivar(null);
                            resolve(true);
                        },
                        onError: (error) => {
                            throw error;
                        }
                    }
                );
            });
        } catch (error) {
            throw error;
        }
    }, [equipoToReactivar, categoriaEdicionId, reactivarEquipo]);

    const handleRowClick = useCallback(
        (equipo: { id_equipo: number }) => {
            router.push(`/adm/ediciones/${id}/${id_categoria}/equipos/${equipo.id_equipo}`);
        },
        [router, id, id_categoria]
    );

    const isLoading = activeTab === 'activos' ? loadingActivos : loadingInactivos;
    const error = activeTab === 'activos' ? errorActivos : errorInactivos;

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Equipos - ${categoriaEdicion?.nombre_completo || 'Cargando...'}`}
                description="Gestiona los equipos de la categoría. Haz clic en cualquier fila para ver los detalles del equipo."
            />

            <EquiposStatsCards
                totalEquipos={stats.totalEquipos}
                equiposActivos={stats.equiposActivos}
                equiposInactivos={stats.equiposInactivos}
                totalJugadores={stats.totalJugadores}
                totalSolicitudes={stats.totalSolicitudes}
                // TODO: Calcular estadísticas de fichas médicas cuando el backend las devuelva
                // jugadoresConFichaValida={stats.jugadoresConFichaValida}
                // jugadoresSinFicha={stats.jugadoresSinFicha}
            />

            <EquiposAlerts
                totalSolicitudes={stats.totalSolicitudes}
                equiposInactivos={stats.equiposInactivos}
            />

            <EquiposTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                error={error}
            >
                {activeTab === 'activos' && (
                    <EquiposActivosTable
                        equipos={equiposActivos}
                        isLoading={isLoading}
                        onRowClick={handleRowClick}
                        onExpulsarEquipo={handleExpulsarEquipo}
                    />
                )}

                {activeTab === 'inactivos' && (
                    <EquiposInactivosTable
                        equipos={equiposInactivos}
                        isLoading={isLoading}
                        onReactivarEquipo={handleReactivarEquipo}
                    />
                )}
            </EquiposTabs>

            <ExpulsarEquipoModal
                isOpen={!!equipoToExpulsar}
                onClose={() => setEquipoToExpulsar(null)}
                equipo={equipoToExpulsar}
                onConfirm={handleConfirmarExpulsion}
            />

            <ReactivarEquipoModal
                isOpen={!!equipoToReactivar}
                onClose={() => setEquipoToReactivar(null)}
                equipo={equipoToReactivar}
                onConfirm={handleConfirmarReactivacion}
            />
        </div>
    );
}

