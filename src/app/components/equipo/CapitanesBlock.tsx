'use client';

import CapitanesManager from '@/app/components/CapitanesManager';
import { JugadorPlantel } from '@/app/types/jugador';

interface Equipo {
    id_equipo: number;
    nombre: string;
}

interface CapitanesBlockProps {
    plantel: JugadorPlantel[];
    idEquipo: number;
    idCategoriaEdicion: number;
    equipo: Equipo;
}

export default function CapitanesBlock({
    plantel,
    idEquipo,
    idCategoriaEdicion,
    equipo
}: CapitanesBlockProps) {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <CapitanesManager
                plantel={plantel}
                idEquipo={idEquipo}
                idCategoriaEdicion={idCategoriaEdicion}
                equipoNombre={equipo.nombre}
            />
        </div>
    );
}

