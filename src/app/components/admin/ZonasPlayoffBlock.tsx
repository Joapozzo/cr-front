'use client';

import { useMemo } from 'react';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useZonaStore } from '@/app/stores/zonaStore';
import { usePosicionesZonaCategoria, useZonasPlayoffCategoria } from '@/app/hooks/useCategoriaDashboard';
import { useObtenerTodasLasZonas } from '@/app/hooks/useZonas';
import { Zona } from '@/app/types/zonas';
import ZonasPlayoff from '@/app/components/stats/ZonaPlayOff';
import TablaPosicionesSkeleton from '@/app/components/skeletons/TablePosicionesSkeleton';

interface ZonasPlayoffBlockProps {
    enabled: boolean;
}

export default function ZonasPlayoffBlock({ enabled }: ZonasPlayoffBlockProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const { zonaSeleccionada } = useZonaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion) || 0;

    const { data: zonasPlayoff, isLoading: isLoadingZonasPlayoff } = useZonasPlayoffCategoria(idCategoriaEdicion, { 
        enabled: enabled && !!idCategoriaEdicion 
    });
    const { data: zonas } = useObtenerTodasLasZonas(idCategoriaEdicion, { 
        enabled: enabled && !!idCategoriaEdicion 
    });
    const { data: posiciones, isLoading: isLoadingPosiciones } = usePosicionesZonaCategoria(
        zonaSeleccionada,
        idCategoriaEdicion,
        { enabled: enabled && !!idCategoriaEdicion && !!zonaSeleccionada }
    );

    // Memoizar zonasLiguilla para evitar recálculos innecesarios
    const zonasLiguilla = useMemo(() => {
        return zonas?.filter(z => z.tipoZona?.id === 1) as Zona[] | undefined;
    }, [zonas]);

    const isLoading = isLoadingPosiciones || isLoadingZonasPlayoff;

    if (isLoading) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                <div className="p-4 border-b border-[var(--gray-300)]">
                    <div className="h-6 bg-[var(--gray-300)] rounded w-48 animate-pulse"></div>
                </div>
                <TablaPosicionesSkeleton />
            </div>
        );
    }

    return (
        <ZonasPlayoff
            zonasPlayoff={zonasPlayoff?.data || []}
            zonasTodosContraTodos={zonasLiguilla || []}
            id_categoria_edicion={idCategoriaEdicion}
            posiciones={posiciones || []}
            isLoading={isLoading}
        />
    );
}

