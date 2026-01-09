import { useMemo } from 'react';
import { JugadorDestacadoDt } from '@/app/types/jugador';

interface UseJugadoresFiltradosProps {
    jugadores: JugadorDestacadoDt[];
    posicionesIds: number[];
    searchTerm: string;
    filtroOrden: 'goles' | 'asistencias' | 'nombre';
    usarFiltroBackend: boolean; // Si es true, los jugadores ya vienen filtrados por posición del backend
}

/**
 * Hook que maneja el filtrado y ordenamiento de jugadores
 * Lógica pura, testeable sin UI
 */
export const useJugadoresFiltrados = ({
    jugadores,
    posicionesIds,
    searchTerm,
    filtroOrden,
    usarFiltroBackend,
}: UseJugadoresFiltradosProps) => {
    const jugadoresFiltrados = useMemo(() => {
        // 1. Filtrar por posiciones (solo si hay múltiples posiciones, porque si hay una sola ya viene filtrado del backend)
        let filtrados = jugadores;
        if (!usarFiltroBackend && posicionesIds.length > 1) {
            filtrados = jugadores.filter(
                (j) => j.posicion && posicionesIds.includes(j.posicion.id_posicion)
            );
        }

        // 2. Filtrar por búsqueda
        if (searchTerm.trim()) {
            const termino = searchTerm.toLowerCase();
            filtrados = filtrados.filter(
                (j) =>
                    j.nombre.toLowerCase().includes(termino) ||
                    j.apellido.toLowerCase().includes(termino) ||
                    j.equipo.nombre.toLowerCase().includes(termino)
            );
        }

        // 3. Ordenar
        const ordenados = [...filtrados].sort((a, b) => {
            if (filtroOrden === 'goles') {
                return b.estadisticas.goles - a.estadisticas.goles;
            } else if (filtroOrden === 'asistencias') {
                return b.estadisticas.asistencias - a.estadisticas.asistencias;
            } else {
                return a.apellido.localeCompare(b.apellido);
            }
        });

        return ordenados;
    }, [jugadores, posicionesIds, searchTerm, filtroOrden, usarFiltroBackend]);

    return {
        jugadoresFiltrados,
        total: jugadoresFiltrados.length,
    };
};

