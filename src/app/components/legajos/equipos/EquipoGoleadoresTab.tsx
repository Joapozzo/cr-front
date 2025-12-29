'use client';

import { GoleadorEquipo } from '@/app/types/legajos';
import TablaGoleadores from '@/app/components/stats/TableGoleadores';
import { Goleador } from '@/app/types/jugador';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EquipoGoleadoresTabProps {
    goleadores: GoleadorEquipo[] | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
}

// Función para convertir GoleadorEquipo a Goleador (formato del componente)
const convertirGoleador = (goleador: GoleadorEquipo): Goleador => {
    return {
        jugador: goleador.jugador ? {
            id_jugador: goleador.jugador.id_jugador,
            nombre: goleador.jugador.nombre,
            apellido: goleador.jugador.apellido,
            img: goleador.jugador.img,
            posicion: {
                codigo: goleador.jugador.posicion.codigo,
                nombre: goleador.jugador.posicion.nombre,
            },
        } : {
            id_jugador: 0,
            nombre: 'N/A',
            apellido: '',
            posicion: {
                codigo: '',
                nombre: '',
            },
        },
        equipo: {
            id_equipo: 0,
            nombre: 'N/A',
        },
        stats: {
            goles: (() => {
                const val: string | number | undefined = goleador.total;
                if (typeof val === 'string') {
                    return Number(val) || 0;
                } else if (typeof val === 'number') {
                    return val;
                }
                return 0;
            })() as number,
            partidos: (() => {
                const val: string | number | undefined = goleador.partidos_jugados;
                if (typeof val === 'string') {
                    return Number(val) || 0;
                } else if (typeof val === 'number') {
                    return val;
                }
                return 0;
            })() as number,
            promedio: Number(goleador.partidos_jugados ? (Number(goleador.total) / Number(goleador.partidos_jugados)).toFixed(2) : '0.00'),
        },
    };
};

export const EquipoGoleadoresTab = ({ goleadores, isLoading, categoriaSeleccionada }: EquipoGoleadoresTabProps) => {
    if (!categoriaSeleccionada) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver los goleadores</p>
        );
    }

    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <Skeleton height={200} borderRadius={6} />
            </SkeletonTheme>
        );
    }

    if (!goleadores || goleadores.length === 0) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No hay goleadores registrados</p>
        );
    }

    const goleadoresConvertidos = goleadores.map(convertirGoleador);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--white)] mb-4">Goleadores</h2>
            <TablaGoleadores goleadores={goleadoresConvertidos} />
        </div>
    );
};

