'use client';

import TablaGoleadores from '@/app/components/stats/TableGoleadores';
import TablaExpulsados from '@/app/components/stats/TableExpulsados';
import { useExpulsadosCategoria, useGoleadoresCategoria, usePosicionesZonaCategoria, useStatsCategoria, useZonasPlayoffCategoria } from '@/app/hooks/useCategoriaDashboard';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useZonaStore } from '@/app/stores/zonaStore';
import EstadisticasRapidas from '@/app/components/stats/StatsRapidas';
import EstadisticasRapidasSkeleton from '@/app/components/skeletons/EstadisticasRapidasSkeleton';
import TablaGoleadoresSkeleton from '@/app/components/skeletons/TablaGoleadoresSkeleton';
import ZonasPlayoff from '@/app/components/stats/ZonaPlayOff';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { Zona } from '@/app/types/zonas';

export default function EstadisticasPage() {
    const { categoriaSeleccionada } = useCategoriaStore();
    const { zonaSeleccionada } = useZonaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    const { data: stats, isLoading } = useStatsCategoria(idCategoriaEdicion);
    const { data: goleadores, isLoading: isLoadingGoleadores } = useGoleadoresCategoria(idCategoriaEdicion);
    const { data: expulsados, isLoading: isLoadingExpulsados } = useExpulsadosCategoria(idCategoriaEdicion);
    const { data: posiciones, isLoading: isLoadingPosiciones } = usePosicionesZonaCategoria(zonaSeleccionada, idCategoriaEdicion);
    const { data: zonasPlayoff, isLoading: isLoadingZonasPlayoff } = useZonasPlayoffCategoria(idCategoriaEdicion);
    const { data: zonas } = useObtenerTodasLasZonas(idCategoriaEdicion);
    const zonasLiguilla = zonas?.filter(z => z.tipoZona?.id === 1) as Zona[] | undefined;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Estadísticas - Serie A Libre
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Posiciones, goleadores y jugadores sancionados de la categoría
                    </p>
                </div>
            </div>

            {
                isLoading
                    ? <EstadisticasRapidasSkeleton />
                    : <EstadisticasRapidas stats={stats?.data?.stats} />
            }

            <ZonasPlayoff
                zonasPlayoff={zonasPlayoff?.data || []}
                zonasTodosContraTodos={zonasLiguilla || []}
                id_categoria_edicion={idCategoriaEdicion}
                posiciones={posiciones || []}
                isLoading={isLoadingPosiciones || isLoadingZonasPlayoff}
            />

            {/* Goleadores y Expulsados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {
                    isLoadingGoleadores
                        ? <TablaGoleadoresSkeleton />
                        : <TablaGoleadores goleadores={goleadores?.goleadores || []} />
                }
                {
                    isLoadingExpulsados
                        ? <TablaGoleadoresSkeleton />
                        : <TablaExpulsados expulsados={expulsados?.expulsados || []} />
                }
            </div>
        </div>
    );
}