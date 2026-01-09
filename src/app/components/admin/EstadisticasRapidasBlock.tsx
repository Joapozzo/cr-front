'use client';

import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useStatsCategoria } from '@/app/hooks/useCategoriaDashboard';
import EstadisticasRapidas from '@/app/components/stats/StatsRapidas';
import EstadisticasRapidasSkeleton from '@/app/components/skeletons/EstadisticasRapidasSkeleton';

interface EstadisticasRapidasBlockProps {
    enabled: boolean;
}

export default function EstadisticasRapidasBlock({ enabled }: EstadisticasRapidasBlockProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion) || 0;

    const { data: stats, isLoading } = useStatsCategoria(idCategoriaEdicion, { 
        enabled: enabled && !!idCategoriaEdicion 
    });

    if (isLoading) {
        return <EstadisticasRapidasSkeleton />;
    }

    if (!stats?.data?.stats) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-8 text-center">
                <p className="text-[var(--gray-200)] text-sm">
                    No hay estadísticas disponibles
                </p>
            </div>
        );
    }

    return <EstadisticasRapidas stats={stats.data.stats} />;
}

