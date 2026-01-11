'use client';

import { useParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useJugadorEquipos } from '@/app/hooks/legajos/useJugadores';
import { JugadorEquiposTab } from '@/app/components/legajos/jugadores/JugadorEquiposTab';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JugadorEquiposPageContent = () => {
    const params = useParams();
    
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    const { data: equipos, isLoading: isLoadingEquipos } = useJugadorEquipos(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    if (!idJugador) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <JugadorEquiposTab
                equipos={equipos}
                isLoading={isLoadingEquipos}
            />
        </div>
    );
};

export default function JugadorEquiposPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="space-y-4">
                            <Skeleton height={200} borderRadius={6} />
                            <Skeleton height={200} borderRadius={6} />
                        </div>
                    </SkeletonTheme>
                </div>
            }
        >
            <JugadorEquiposPageContent />
        </Suspense>
    );
}
