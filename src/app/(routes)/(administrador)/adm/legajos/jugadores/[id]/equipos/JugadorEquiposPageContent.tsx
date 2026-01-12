'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useJugadorEquipos } from '@/app/hooks/legajos/useJugadores';
import { JugadorEquiposTab } from '@/app/components/legajos/jugadores/JugadorEquiposTab';

export default function JugadorEquiposPageContent() {
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
}

