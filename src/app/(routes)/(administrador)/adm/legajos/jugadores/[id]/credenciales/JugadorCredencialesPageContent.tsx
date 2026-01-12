'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { JugadorCredencialesTab } from '@/app/components/legajos/jugadores/JugadorCredencialesTab';

export default function JugadorCredencialesPageContent() {
    const params = useParams();
    
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    if (!idJugador) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <JugadorCredencialesTab idJugador={idJugador} />
        </div>
    );
}

