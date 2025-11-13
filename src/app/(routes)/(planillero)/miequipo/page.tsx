'use client';

import { PartidosDestacados } from "@/app/components/DaysMatchEquipo";
import TeamTablesContainer from "@/app/components/TablesTeamContainer";
import { useParams } from "next/navigation";
import { usePlayerStore } from "@/app/stores/playerStore";
import { useMemo } from "react";

const PageTeam: React.FC = () => {
    const params = useParams();
    const { equipos, esCapitanDeEquipo } = usePlayerStore();

    const id_edicion = params.id_edicion ? parseInt(params.id_edicion as string) : equipos[0]?.id_edicion;
    
    // Encontrar el equipo correspondiente a esta edición
    const equipoEdicion = useMemo(() => {
        return equipos?.find(team => team.id_edicion === id_edicion);
    }, [equipos, id_edicion]);
    
    const id_categoria_edicion = equipoEdicion?.id_categoria_edicion;
    // const id_zona = equipoEdicion?.id_zona;
    const esCapitan = esCapitanDeEquipo(Number(equipoEdicion?.id_equipo));
    const id_zona = 1;
    const id_equipo = 10;

    // Determinar si es la edición actual (la primera en el array ordenado por temporada desc)
    const edicionActual = equipos?.[0]?.id_edicion;
    const esEdicionActual = id_edicion === edicionActual;

    if (!id_edicion || !id_categoria_edicion || !id_zona) {
        return <div className="text-center py-8 text-[var(--gray-100)]">No se encontró información del equipo</div>;
    }

    return (
        <div className="w-full flex flex-col gap-6 px-6">
            {/* <TeamStatsGrid id_categoria_edicion={id_categoria_edicion} id_equipo={id_equipo} /> */}
            <PartidosDestacados id_categoria_edicion={id_categoria_edicion} id_equipo={id_equipo}/>
            <TeamTablesContainer 
                id_categoria_edicion={id_categoria_edicion}
                id_zona={id_zona}
                esCapitan={esCapitan}
                esEdicionActual={esEdicionActual}
                id_equipo={id_equipo}
            />
        </div>
    );
}

export default PageTeam;