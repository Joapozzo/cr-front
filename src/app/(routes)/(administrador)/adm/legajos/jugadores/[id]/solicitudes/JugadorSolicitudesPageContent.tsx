'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useJugadorSolicitudes } from '@/app/hooks/legajos/useJugadores';
import { JugadorSolicitudesTab } from '@/app/components/legajos/jugadores/JugadorSolicitudesTab';

export default function JugadorSolicitudesPageContent() {
    const params = useParams();
    
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useJugadorSolicitudes(
        idJugador ?? 0,
        undefined,
        { enabled: idJugador !== null }
    );

    if (!idJugador) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <JugadorSolicitudesTab
                solicitudes={solicitudes}
                isLoading={isLoadingSolicitudes}
            />
        </div>
    );
}

