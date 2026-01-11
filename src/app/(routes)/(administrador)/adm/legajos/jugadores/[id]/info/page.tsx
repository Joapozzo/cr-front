'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import {
    useJugadorDetalle,
    useJugadorEstadisticasGenerales,
} from '@/app/hooks/legajos/useJugadores';
import { JugadorInfoTab } from '@/app/components/legajos/jugadores/JugadorInfoTab';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function JugadorInfoPage() {
    const params = useParams();
    
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    const { data: jugadorInfo, isLoading: isLoadingInfo } = useJugadorDetalle(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    const { data: estadisticasGenerales, isLoading: isLoadingEstadisticas } = useJugadorEstadisticasGenerales(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    const isLoading = isLoadingInfo || isLoadingEstadisticas;

    if (!idJugador) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                    <div className="space-y-6">
                        <Skeleton height={150} borderRadius={6} />
                        <Skeleton height={200} borderRadius={6} />
                        <Skeleton height={250} borderRadius={6} />
                    </div>
                </SkeletonTheme>
            </div>
        );
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <JugadorInfoTab
                jugadorInfo={jugadorInfo}
                estadisticas={estadisticasGenerales}
                isLoading={isLoadingInfo}
                isLoadingEstadisticas={isLoadingEstadisticas}
            />
        </div>
    );
}
