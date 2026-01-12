'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import EquipoHeaderSkeleton from '@/app/components/equipo/skeletons/EquipoHeaderSkeleton';
import EquipoStatsSkeleton from '@/app/components/equipo/skeletons/EquipoStatsSkeleton';
import CapitanesSkeleton from '@/app/components/equipo/skeletons/CapitanesSkeleton';
import SolicitudesSkeleton from '@/app/components/equipo/skeletons/SolicitudesSkeleton';
import PlantelSkeleton from '@/app/components/equipo/skeletons/PlantelSkeleton';

// Lazy load containers with dynamic import
const EquipoHeaderContainer = dynamic(
    () => import('@/app/components/equipo/containers/EquipoHeaderContainer'),
    { ssr: false }
);

const EquipoStatsContainer = dynamic(
    () => import('@/app/components/equipo/containers/EquipoStatsContainer'),
    { ssr: false }
);

const CapitanesContainer = dynamic(
    () => import('@/app/components/equipo/containers/CapitanesContainer'),
    { ssr: false }
);

const SolicitudesContainer = dynamic(
    () => import('@/app/components/equipo/containers/SolicitudesContainer'),
    { ssr: false }
);

const PlantelContainer = dynamic(
    () => import('@/app/components/equipo/containers/PlantelContainer'),
    { ssr: false }
);

export default function EquipoPlantelContent() {
    const params = useParams();
    const { categoriaSeleccionada } = useCategoriaStore();

    // Memoizar y validar los IDs - Priorizar el param de la URL sobre el store
    const { idCategoriaEdicion, idEquipo } = useMemo(() => {
        let catId: number | null = null;
        if (params?.id_categoria) {
            const id = Number(params.id_categoria);
            if (!isNaN(id) && id > 0) {
                catId = id;
            }
        }
        if (!catId && categoriaSeleccionada?.id_categoria_edicion) {
            const id = Number(categoriaSeleccionada.id_categoria_edicion);
            if (!isNaN(id) && id > 0) {
                catId = id;
            }
        }

        let equipoId: number | null = null;
        if (params?.id_equipo) {
            const id = Number(params.id_equipo);
            if (!isNaN(id) && id > 0) {
                equipoId = id;
            }
        }

        return {
            idCategoriaEdicion: catId,
            idEquipo: equipoId
        };
    }, [params?.id_categoria, params?.id_equipo, categoriaSeleccionada?.id_categoria_edicion]);

    // Early return si no hay IDs válidos
    if (!idCategoriaEdicion || !idEquipo) {
        return (
            <div className="space-y-6">
                <EquipoHeaderSkeleton />
                <EquipoStatsSkeleton />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CapitanesSkeleton />
                    <SolicitudesSkeleton />
                </div>
                <PlantelSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <EquipoHeaderContainer
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
            />

            {/* Stats */}
            <EquipoStatsContainer
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
            />

            {/* Grid con Capitanes y Solicitudes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CapitanesContainer
                    idEquipo={idEquipo}
                    idCategoriaEdicion={idCategoriaEdicion}
                />

                <SolicitudesContainer
                    idEquipo={idEquipo}
                    idCategoriaEdicion={idCategoriaEdicion}
                />
            </div>

            {/* Plantel */}
            <PlantelContainer
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
            />
        </div>
    );
}

