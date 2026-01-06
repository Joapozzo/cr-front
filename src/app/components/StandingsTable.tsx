'use client';

import { useTablaPosiciones } from '../hooks/useTablas';
import { TablaPosiciones } from './posiciones/TablaPosiciones';
import TablaPosicionesSkeleton from './skeletons/TablePosicionesSkeleton';
import { PosicionTabla } from '@/app/types/categoria';

interface StandingsTableProps {
    id_categoria_edicion: number;
    id_zona?: number;
}

const StandingsTable = ({ id_categoria_edicion, id_zona }: StandingsTableProps) => {
    const { data: posiciones, isLoading, error } = useTablaPosiciones(
        id_categoria_edicion,
        id_zona || 0,
        { enabled: !!id_categoria_edicion && !!id_zona }
    );

    if (isLoading) {
        return <TablaPosicionesSkeleton />;
    }

    if (error) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                <p className="text-[var(--color-secondary)] text-sm">Error al cargar la tabla de posiciones</p>
            </div>
        );
    }

    if (!posiciones || posiciones.length === 0) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                <p className="text-[var(--gray-200)] text-sm">No hay datos disponibles</p>
            </div>
        );
    }

    // Convertir a formato EquipoPosicion
    const posicionesFormateadas = posiciones.map((equipo) => ({
        id_equipo: equipo.id_equipo,
        nombre_equipo: equipo.nombre_equipo,
        img_equipo: equipo.img_equipo,
        partidos_jugados: equipo.partidos_jugados_live ?? equipo.partidos_jugados,
        ganados: equipo.partidos_ganados_live ?? equipo.ganados,
        empatados: equipo.partidos_empatados_live ?? equipo.empatados,
        perdidos: equipo.partidos_perdidos_live ?? equipo.perdidos,
        goles_favor: equipo.goles_favor_live ?? equipo.goles_favor,
        goles_contra: equipo.goles_contra_live ?? equipo.goles_contra,
        diferencia_goles: equipo.diferencia_goles_live ?? equipo.diferencia_goles,
        puntos: equipo.puntos,
        puntos_descontados: equipo.puntos_descontados,
        puntos_finales: equipo.puntos_finales_live ?? equipo.puntos_finales ?? equipo.puntos,
        apercibimientos: equipo.apercibimientos,
        ultima_actualizacion: equipo.ultima_actualizacion,
        puntos_live: equipo.puntos_live,
        goles_favor_live: equipo.goles_favor_live,
        goles_contra_live: equipo.goles_contra_live,
        diferencia_goles_live: equipo.diferencia_goles_live,
        puntos_finales_live: equipo.puntos_finales_live,
        partidos_jugados_live: equipo.partidos_jugados_live,
        partidos_ganados_live: equipo.partidos_ganados_live,
        partidos_empatados_live: equipo.partidos_empatados_live,
        partidos_perdidos_live: equipo.partidos_perdidos_live,
        en_vivo: equipo.en_vivo
    }));

    return <TablaPosiciones variant="simple" posiciones={posicionesFormateadas} isLoading={isLoading} error={error} />;
};

export default StandingsTable;

