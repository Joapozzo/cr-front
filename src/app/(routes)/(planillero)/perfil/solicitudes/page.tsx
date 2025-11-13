'use client';

import SolicitudesJugadorPage from '@/app/components/PageUsuarioSolicitudes'; 
import SolicitudesCapitanPage from '@/app/components/PageCapitanesSolicitudes';
import TeamSelector from '@/app/components/TeamSelector';
import { esCapitanDelEquipoSeleccionado } from '@/app/utils/capitanHelpers';
import { usePlayerStore } from '@/app/stores/playerStore';

export default function SolicitudesPage() {
    const { equipoSeleccionado } = usePlayerStore();
    const esCapitan = esCapitanDelEquipoSeleccionado();
    
    return (
        <div className="w-full">
            <TeamSelector />
            
            {esCapitan ? (
                <SolicitudesCapitanPage equipoSeleccionado={equipoSeleccionado} esCapitan={esCapitan} />
            ) : (
                <SolicitudesJugadorPage equipoSeleccionado={equipoSeleccionado} />
            )}
        </div>
    );
}