'use client';

import { useMemo } from 'react';
import { TablaPosiciones as TablaPosicionesType } from '@/app/types/legajos';
import { TablaPosiciones } from '@/app/components/posiciones/TablaPosiciones';
import { EquipoPosicion } from '@/app/types/posiciones';
import { Zona } from '@/app/types/zonas';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useZonasPlayoffPorCategoriaEdicion } from '@/app/hooks/useEstadisticas';

interface EquipoTablaTabProps {
    tabla: TablaPosicionesType | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
    idEquipo: number;
}

export const EquipoTablaTab = ({ tabla, isLoading, categoriaSeleccionada, idEquipo }: EquipoTablaTabProps) => {
    // Obtener zonas de playoff desde el hook (similar a StatsTab)
    const { data: zonasPlayoffData, isLoading: loadingPlayoff } = useZonasPlayoffPorCategoriaEdicion(
        categoriaSeleccionada || null,
        { enabled: !!categoriaSeleccionada }
    );

    // Separar zonas de todos contra todos (tipo 1 y 3) y eliminación directa (tipo 2 y 4)
    // 1: todos-contra-todos
    // 2: eliminacion-directa
    // 3: todos-contra-todos-ida-vuelta
    // 4: eliminacion-directa-ida-vuelta
    const zonasTodosContraTodos = useMemo(() => {
        if (!tabla) return [];
        return tabla.tablas.filter(t => {
            const tipo = t.zona.tipo;
            // Tipo 1 (todos-contra-todos) y tipo 3 (todos-contra-todos-ida-vuelta)
            return tipo === '1' || tipo === '3' || !tipo;
        });
    }, [tabla]);

    const zonasEliminacionDirecta = useMemo(() => {
        if (!tabla) return [];
        return tabla.tablas.filter(t => {
            const tipo = t.zona.tipo;
            // Solo tipo 2 (eliminacion-directa) y tipo 4 (eliminacion-directa-ida-vuelta)
            return tipo === '2' || tipo === '4';
        });
    }, [tabla]);

    // Convertir zonas de todos contra todos a formato EquipoPosicion[]
    const posicionesAplanadas = useMemo(() => {
        if (!tabla || zonasTodosContraTodos.length === 0) return [];

        // Si hay una sola zona, convertir directamente
        if (zonasTodosContraTodos.length === 1) {
            return zonasTodosContraTodos[0].tabla.map(equipo => ({
                id_equipo: equipo.equipo.id_equipo,
                nombre_equipo: equipo.equipo.nombre,
                partidos_jugados: equipo.partidos_jugados,
                ganados: equipo.ganados,
                empatados: equipo.empatados,
                perdidos: equipo.perdidos,
                goles_favor: equipo.goles_favor,
                goles_contra: equipo.goles_contra,
                diferencia_goles: equipo.diferencia_goles,
                puntos: equipo.puntos,
                ultima_actualizacion: new Date().toISOString().split('T')[0],
                img_equipo: equipo.equipo.img,
            } as EquipoPosicion));
        }

        // Si hay múltiples zonas, aplanarlas todas
        const todasPosiciones: EquipoPosicion[] = [];
        zonasTodosContraTodos.forEach(tablaZona => {
            tablaZona.tabla.forEach(equipo => {
                todasPosiciones.push({
                    id_equipo: equipo.equipo.id_equipo,
                    nombre_equipo: equipo.equipo.nombre,
                    partidos_jugados: equipo.partidos_jugados,
                    ganados: equipo.ganados,
                    empatados: equipo.empatados,
                    perdidos: equipo.perdidos,
                    goles_favor: equipo.goles_favor,
                    goles_contra: equipo.goles_contra,
                    diferencia_goles: equipo.diferencia_goles,
                    puntos: equipo.puntos,
                    ultima_actualizacion: new Date().toISOString().split('T')[0],
                    img_equipo: equipo.equipo.img,
                } as EquipoPosicion);
            });
        });

        // Ordenar por puntos, diferencia de goles, goles a favor
        return todasPosiciones.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
            return b.goles_favor - a.goles_favor;
        });
    }, [tabla, zonasTodosContraTodos]);

    // Convertir posiciones por zona (para mostrar cada zona por separado si hay múltiples)
    const posicionesPorZona = useMemo(() => {
        if (!tabla || zonasTodosContraTodos.length === 0) return [];
        
        return zonasTodosContraTodos.map(tablaZona => ({
            id_zona: tablaZona.zona.id_zona,
            nombre_zona: tablaZona.zona.nombre,
            posiciones: tablaZona.tabla.map(equipo => ({
                id_equipo: equipo.equipo.id_equipo,
                nombre_equipo: equipo.equipo.nombre,
                partidos_jugados: equipo.partidos_jugados,
                ganados: equipo.ganados,
                empatados: equipo.empatados,
                perdidos: equipo.perdidos,
                goles_favor: equipo.goles_favor,
                goles_contra: equipo.goles_contra,
                diferencia_goles: equipo.diferencia_goles,
                puntos: equipo.puntos,
                ultima_actualizacion: new Date().toISOString().split('T')[0],
                img_equipo: equipo.equipo.img,
            } as EquipoPosicion)),
        }));
    }, [tabla, zonasTodosContraTodos]);

    // Obtener posiciones de zonas de eliminación directa si existen
    const posicionesDeEliminacion = useMemo(() => {
        if (!tabla || zonasEliminacionDirecta.length === 0) return [];
        
        const posiciones: EquipoPosicion[] = [];
        zonasEliminacionDirecta.forEach(tablaZona => {
            if (tablaZona.tabla && tablaZona.tabla.length > 0) {
                tablaZona.tabla.forEach(equipo => {
                    posiciones.push({
                        id_equipo: equipo.equipo.id_equipo,
                        nombre_equipo: equipo.equipo.nombre,
                        partidos_jugados: equipo.partidos_jugados,
                        ganados: equipo.ganados,
                        empatados: equipo.empatados,
                        perdidos: equipo.perdidos,
                        goles_favor: equipo.goles_favor,
                        goles_contra: equipo.goles_contra,
                        diferencia_goles: equipo.diferencia_goles,
                        puntos: equipo.puntos,
                        ultima_actualizacion: new Date().toISOString().split('T')[0],
                        img_equipo: equipo.equipo.img,
                    } as EquipoPosicion);
                });
            }
        });
        return posiciones;
    }, [tabla, zonasEliminacionDirecta]);

    // Convertir zonas de eliminación directa al formato de PlayoffBracket (fallback)
    const zonasParaBracket: Zona[] = useMemo(() => {
        if (!tabla) return [];
        return zonasEliminacionDirecta.map(tablaZona => ({
            id_zona: tablaZona.zona.id_zona,
            nombre: tablaZona.zona.nombre,
            numero_fase: tablaZona.zona.fase || 0,
            id_categoria_edicion: categoriaSeleccionada || 0,
            etapa: {
                id_etapa: 0,
                nombre: tablaZona.zona.nombre || '',
            },
            partidos: [],
            temporadas: [],
        } as Zona));
    }, [tabla, zonasEliminacionDirecta, categoriaSeleccionada]);

    // Usar zonas de playoff del hook si están disponibles, sino usar las de la tabla
    const zonasPlayoffFinales = zonasPlayoffData && zonasPlayoffData.length > 0 
        ? zonasPlayoffData 
        : zonasParaBracket;

    if (!categoriaSeleccionada) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
                <p className="text-[var(--gray-100)] text-center text-sm">Selecciona una categoría para ver la tabla</p>
            </div>
        );
    }

    if (isLoading || loadingPlayoff) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <SkeletonTheme baseColor="#ffffff08" highlightColor="#ffffff15">
                    <Skeleton height={200} borderRadius={8} />
                </SkeletonTheme>
            </div>
        );
    }

    if (!tabla) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
                <p className="text-[var(--gray-100)] text-center text-sm">No se pudo cargar la tabla</p>
            </div>
        );
    }

    // Si hay múltiples zonas, mostrar cada una por separado
    if (posicionesPorZona.length > 1) {
        return (
            <div className="space-y-4">
                {posicionesPorZona.map((zona) => (
                    <div key={zona.id_zona} className="space-y-2">
                        {zona.nombre_zona && (
                            <h3 className="text-white/90 font-medium text-sm px-1">
                                {zona.nombre_zona}
                            </h3>
                        )}
                        <TablaPosiciones
                            variant="completa"
                            posiciones={zona.posiciones}
                            zonasPlayoff={zonasPlayoffFinales}
                            isLoading={false}
                            userTeamIds={[idEquipo]}
                            showPlayoffTabs={true}
                            showZonaSelector={false}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // Si hay una sola zona o zonas aplanadas, mostrar tabla única
    if (posicionesAplanadas.length > 0) {
        return (
            <TablaPosiciones
                variant="completa"
                posiciones={posicionesAplanadas}
                zonasPlayoff={zonasPlayoffFinales}
                isLoading={false}
                userTeamIds={[idEquipo]}
                showPlayoffTabs={true}
                showZonaSelector={false}
            />
        );
    }

    // Si solo hay playoff pero también hay posiciones, mostrar ambos
    if (zonasPlayoffFinales.length > 0) {
        // Si hay posiciones disponibles (de todos contra todos o eliminación directa), mostrarlas junto con playoff
        const posicionesParaMostrar = posicionesAplanadas.length > 0 
            ? posicionesAplanadas 
            : posicionesDeEliminacion.length > 0 
                ? posicionesDeEliminacion 
                : [];

        return (
            <TablaPosiciones
                variant="completa"
                posiciones={posicionesParaMostrar}
                zonasPlayoff={zonasPlayoffFinales}
                isLoading={false}
                userTeamIds={[idEquipo]}
                showPlayoffTabs={true}
                showZonaSelector={false}
            />
        );
    }

    // Si no hay nada
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
            <p className="text-[var(--gray-100)] text-center text-sm">No hay tablas de posiciones disponibles</p>
        </div>
    );
};

