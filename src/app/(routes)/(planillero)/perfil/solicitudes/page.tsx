'use client';

import { useState, useEffect } from 'react';
import SolicitudesJugadorPage from '@/app/components/PageUsuarioSolicitudes'; 
import SolicitudesCapitanPage from '@/app/components/PageCapitanesSolicitudes';
import TeamSelector from '@/app/components/TeamSelector';
import { usePlayerStore } from '@/app/stores/playerStore';

export default function SolicitudesPage() {
    const [mounted, setMounted] = useState(false);
    const { equipoSeleccionado, equipos } = usePlayerStore();
    
    // Verificar si es capitán solo después de montar en el cliente
    const esCapitan = mounted && equipoSeleccionado?.es_capitan === true;
    
    // Mostrar selector si hay más de un equipo
    const mostrarSelector = mounted && equipos && equipos.length > 1;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Skeleton de carga mientras se monta el componente
    if (!mounted) {
        return (
            <div className="w-full">
                <TeamSelector />
                <div className="px-6 py-8">
                    <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--gray-300)] p-6 animate-pulse">
                        <div className="h-8 bg-[var(--gray-300)] rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-[var(--gray-300)] rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full">
            {mostrarSelector && <TeamSelector />}
            
            {esCapitan ? (
                <SolicitudesCapitanPage equipoSeleccionado={equipoSeleccionado} esCapitan={esCapitan} />
            ) : (
                <SolicitudesJugadorPage />
            )}
        </div>
    );
}
