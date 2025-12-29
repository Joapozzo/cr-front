'use client';

import { useTablaPosiciones } from '../hooks/useTablas';
import TablaPosiciones from './stats/TablePosiciones';
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
                <p className="text-[var(--red)] text-sm">Error al cargar la tabla de posiciones</p>
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

    // Convertir EquipoPosicion[] a PosicionTabla[] para el componente TablaPosiciones
    const posicionesFormateadas: PosicionTabla[] = posiciones.map((equipo, index) => ({
        id: equipo.id_equipo,
        posicion: index + 1,
        equipo: {
            id_equipo: equipo.id_equipo,
            nombre: equipo.nombre_equipo,
            img: equipo.img_equipo || undefined
        },
        partidos_jugados: equipo.partidos_jugados,
        ganados: equipo.ganados,
        empatados: equipo.empatados,
        perdidos: equipo.perdidos,
        goles_favor: equipo.goles_favor,
        goles_contra: equipo.goles_contra,
        diferencia_goles: equipo.diferencia_goles,
        puntos: equipo.puntos,
        puntos_descontados: equipo.puntos_descontados,
        puntos_finales: equipo.puntos_finales ?? equipo.puntos,
        apercibimientos: equipo.apercibimientos,
        ultima_actualizacion: equipo.ultima_actualizacion
    }));

    return <TablaPosiciones posiciones={posicionesFormateadas} />;
};

export default StandingsTable;

