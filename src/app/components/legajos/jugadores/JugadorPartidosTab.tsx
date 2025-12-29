'use client';

import { HistorialPartidosJugadorResponse, PartidoJugador } from '@/app/types/legajos';
import MatchCard from '@/app/components/CardPartidoGenerico';
import { Pagination } from '@/app/components/legajos/shared/Pagination';
import { History } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface JugadorPartidosTabProps {
    partidos: HistorialPartidosJugadorResponse | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
    page: number;
    onPageChange: (page: number) => void;
    idJugador: number;
}

// Función para convertir PartidoJugador a formato del componente MatchCard
const convertirPartidoJugador = (partido: PartidoJugador, idJugador: number): any => {
    return {
        id_partido: partido.id_partido,
        jornada: partido.jornada,
        dia: partido.fecha || '',
        hora: partido.hora || '',
        estado: partido.estado || 'P',
        goles_local: partido.goles_local ?? null,
        goles_visita: partido.goles_visita ?? null,
        pen_local: null,
        pen_visita: null,
        cancha: partido.cancha?.id_cancha || 0,
        id_zona: partido.zona?.id_zona || 0,
        id_categoria_edicion: partido.categoria_edicion?.id_categoria_edicion || 0,
        id_equipolocal: partido.equipo_local?.id_equipo || 0,
        id_equipovisita: partido.equipo_visita?.id_equipo || 0,
        equipoLocal: {
            nombre: partido.equipo_local?.nombre || 'TBD',
            img: partido.equipo_local?.img || undefined,
        },
        equipoVisita: partido.equipo_visita ? {
            nombre: partido.equipo_visita.nombre,
            img: partido.equipo_visita.img || undefined,
        } : undefined,
        incidencias: {
            goles: partido.estadisticas_individuales.goles.map(gol => ({
                id_equipo: partido.mi_equipo.id_equipo,
                id: gol.id_gol,
                nombre: '',
                apellido: '',
                tipo: gol.tipo,
                id_jugador: idJugador,
                minuto: gol.minuto || 0,
                penal: gol.tipo === 'penal' ? 'S' : 'N',
                en_contra: gol.tipo === 'autogol' ? 'S' : 'N',
            })),
            expulsiones: partido.estadisticas_individuales.rojas.map(roja => ({
                id: roja.id_expulsion,
                id_equipo: partido.mi_equipo.id_equipo,
            })),
        },
    };
};

export const JugadorPartidosTab = ({
    partidos,
    isLoading,
    categoriaSeleccionada: _categoriaSeleccionada,
    page: _page,
    onPageChange,
    idJugador,
}: JugadorPartidosTabProps) => {
    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <div className="space-y-4">
                    <Skeleton height={200} borderRadius={6} />
                    <Skeleton height={200} borderRadius={6} />
                </div>
            </SkeletonTheme>
        );
    }

    if (!partidos || partidos.data.length === 0) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No hay partidos registrados</p>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[var(--white)] mb-3 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Historial de partidos
                </h3>
                <div className="space-y-3">
                    {partidos.data.map((partido) => {
                        const partidoConvertido = convertirPartidoJugador(partido, idJugador);
                        return (
                            <div key={partido.id_partido} className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)]">
                                <MatchCard partido={partidoConvertido} misEquiposIds={[partido.mi_equipo.id_equipo]} />
                                {/* Estadísticas individuales del jugador en este partido */}
                                <div className="px-4 pb-4 pt-2 border-t border-[var(--gray-300)]">
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-[var(--gray-100)]">
                                            <span className="font-semibold text-[var(--white)]">
                                                {partido.estadisticas_individuales.titular ? 'Titular' : 'Suplente'}
                                            </span>
                                        </div>
                                        {partido.estadisticas_individuales.minutos_jugados > 0 && (
                                            <div className="flex items-center gap-1 text-[var(--gray-100)]">
                                                <span>{partido.estadisticas_individuales.minutos_jugados} min</span>
                                            </div>
                                        )}
                                        {partido.estadisticas_individuales.goles.length > 0 && (
                                            <div className="flex items-center gap-1 text-[var(--green)]">
                                                <span className="font-semibold">{partido.estadisticas_individuales.goles.length} gol(es)</span>
                                            </div>
                                        )}
                                        {partido.estadisticas_individuales.asistencias.length > 0 && (
                                            <div className="flex items-center gap-1 text-[var(--yellow)]">
                                                <span className="font-semibold">{partido.estadisticas_individuales.asistencias.length} asistencia(s)</span>
                                            </div>
                                        )}
                                        {partido.estadisticas_individuales.amarillas.length > 0 && (
                                            <div className="flex items-center gap-1 text-[var(--yellow)]">
                                                <span className="font-semibold">{partido.estadisticas_individuales.amarillas.length} amarilla(s)</span>
                                            </div>
                                        )}
                                        {partido.estadisticas_individuales.rojas.length > 0 && (
                                            <div className="flex items-center gap-1 text-[var(--red)]">
                                                <span className="font-semibold">{partido.estadisticas_individuales.rojas.length} roja(s)</span>
                                            </div>
                                        )}
                                        {partido.estadisticas_individuales.destacado && (
                                            <div className="flex items-center gap-1 text-[var(--green)]">
                                                <span className="font-semibold">⭐ Destacado</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {partidos.pagination && partidos.pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                        <Pagination
                            currentPage={partidos.pagination.currentPage}
                            totalPages={partidos.pagination.totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

