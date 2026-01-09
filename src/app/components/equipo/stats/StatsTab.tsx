'use client';

import React, { useState, useMemo } from 'react';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { TablaPosiciones } from '@/app/components/posiciones/TablaPosiciones';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';
import {
  usePosicionesPorCategoriaEdicion,
  useZonasPlayoffPorCategoriaEdicion,
  // Hooks por equipo (filtradas por equipo)
  useGoleadoresPorEquipo,
  useAsistenciasPorEquipo,
  useAmarillasPorEquipo,
  useRojasPorEquipo,
  useMVPsPorEquipo
} from '@/app/hooks/useEstadisticas';
import { useCategoriaStore } from '@/app/stores/categoriaStore';

interface StatsTabProps {
  idEquipo: number;
  idCategoriaEdicion?: number | null;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  idEquipo,
  idCategoriaEdicion,
}) => {
  const [activeTab, setActiveTab] = useState<EstadisticaTab>('posiciones');
  
  // Usar idCategoriaEdicion si se pasa como prop, sino intentar obtenerlo del store
  const { categoriaSeleccionada } = useCategoriaStore();
  const id_categoria_edicion = idCategoriaEdicion ?? categoriaSeleccionada?.id_categoria_edicion;

  const { data: posicionesData, isLoading: loadingPosiciones } = usePosicionesPorCategoriaEdicion(
    id_categoria_edicion || null,
    { enabled: !!id_categoria_edicion }
  );
  
  const { data: zonasPlayoffData, isLoading: loadingPlayoff } = useZonasPlayoffPorCategoriaEdicion(
    id_categoria_edicion || null,
    { enabled: !!id_categoria_edicion }
  );

  const { data: goleadores, isLoading: loadingGoleadores } = useGoleadoresPorEquipo(
    idEquipo
  );
  const { data: asistencias, isLoading: loadingAsistencias } = useAsistenciasPorEquipo(
    idEquipo
  );
  const { data: amarillas, isLoading: loadingAmarillas } = useAmarillasPorEquipo(
    idEquipo
  );
  const { data: rojas, isLoading: loadingRojas } = useRojasPorEquipo(
    idEquipo
  );
  const { data: mvps, isLoading: loadingMVPs } = useMVPsPorEquipo(
    idEquipo
  );

  // Procesar posiciones: si hay múltiples zonas, aplanarlas o mostrar por zona
  // Misma lógica que en /estadisticas/page.tsx
  const posicionesAplanadas = useMemo(() => {
    if (!posicionesData || posicionesData.length === 0) return [];

    // Si hay una sola zona, devolver sus posiciones directamente
    if (posicionesData.length === 1) {
      return posicionesData[0].posiciones.map(pos => ({
        id_equipo: pos.id_equipo,
        nombre_equipo: pos.nombre_equipo,
        partidos_jugados: pos.partidos_jugados,
        ganados: pos.partidos_ganados, // Mapear partidos_ganados a ganados
        empatados: pos.partidos_empatados, // Mapear partidos_empatados a empatados
        perdidos: pos.partidos_perdidos, // Mapear partidos_perdidos a perdidos
        goles_favor: pos.goles_favor,
        goles_contra: pos.goles_contra,
        diferencia_goles: pos.diferencia_goles,
        puntos: pos.puntos,
        puntos_descontados: pos.puntos_descontados,
        puntos_finales: pos.puntos_finales,
        apercibimientos: pos.apercibimientos,
        ultima_actualizacion: new Date().toISOString().split('T')[0],
        img_equipo: pos.img_equipo || undefined,
        // Campos para datos en vivo
        puntos_live: pos.puntos_live,
        goles_favor_live: pos.goles_favor_live,
        goles_contra_live: pos.goles_contra_live,
        diferencia_goles_live: pos.diferencia_goles_live,
        puntos_finales_live: pos.puntos_finales_live,
        partidos_jugados_live: pos.partidos_jugados_live,
        partidos_ganados_live: pos.partidos_ganados_live,
        partidos_empatados_live: pos.partidos_empatados_live,
        partidos_perdidos_live: pos.partidos_perdidos_live,
        en_vivo: pos.en_vivo
      }));
    }

    // Si hay múltiples zonas, aplanar todas las posiciones
    const todasPosiciones: EquipoPosicion[] = [];
    posicionesData.forEach(zona => {
      zona.posiciones.forEach(pos => {
        todasPosiciones.push({
          id_equipo: pos.id_equipo,
          nombre_equipo: pos.nombre_equipo,
          partidos_jugados: pos.partidos_jugados,
          ganados: pos.partidos_ganados, // Mapear partidos_ganados a ganados
          empatados: pos.partidos_empatados, // Mapear partidos_empatados a empatados
          perdidos: pos.partidos_perdidos, // Mapear partidos_perdidos a perdidos
          goles_favor: pos.goles_favor,
          goles_contra: pos.goles_contra,
          diferencia_goles: pos.diferencia_goles,
          puntos: pos.puntos,
          puntos_descontados: pos.puntos_descontados,
          puntos_finales: pos.puntos_finales,
          apercibimientos: pos.apercibimientos,
          ultima_actualizacion: new Date().toISOString().split('T')[0],
          img_equipo: pos.img_equipo || undefined,
          // Campos para datos en vivo
          puntos_live: pos.puntos_live,
          goles_favor_live: pos.goles_favor_live,
          goles_contra_live: pos.goles_contra_live,
          diferencia_goles_live: pos.diferencia_goles_live,
          puntos_finales_live: pos.puntos_finales_live,
          partidos_jugados_live: pos.partidos_jugados_live,
          partidos_ganados_live: pos.partidos_ganados_live,
          partidos_empatados_live: pos.partidos_empatados_live,
          partidos_perdidos_live: pos.partidos_perdidos_live,
          en_vivo: pos.en_vivo
        });
      });
    });

    // Ordenar por puntos finales (usando valores live si están disponibles), diferencia de goles, goles a favor
    return todasPosiciones.sort((a, b) => {
      const equipoA = a as EquipoPosicion & { puntos_finales_live?: number; diferencia_goles_live?: number; goles_favor_live?: number };
      const equipoB = b as EquipoPosicion & { puntos_finales_live?: number; diferencia_goles_live?: number; goles_favor_live?: number };
      
      const puntosA = equipoA.puntos_finales_live ?? equipoA.puntos_finales ?? equipoA.puntos ?? 0;
      const puntosB = equipoB.puntos_finales_live ?? equipoB.puntos_finales ?? equipoB.puntos ?? 0;
      if (puntosB !== puntosA) return puntosB - puntosA;
      
      const difA = equipoA.diferencia_goles_live ?? equipoA.diferencia_goles ?? 0;
      const difB = equipoB.diferencia_goles_live ?? equipoB.diferencia_goles ?? 0;
      if (difB !== difA) return difB - difA;
      
      const gfA = equipoA.goles_favor_live ?? equipoA.goles_favor ?? 0;
      const gfB = equipoB.goles_favor_live ?? equipoB.goles_favor ?? 0;
      return gfB - gfA;
    });
  }, [posicionesData]);

  // Si no hay id_equipo o id_categoria_edicion, mostrar mensaje
  if (!idEquipo) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">
            No hay equipo disponible para mostrar las estadísticas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6">
      {/* Tabs de estadísticas - Idéntico a /estadisticas */}
      <EstadisticasTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenido según tab seleccionado - Idéntico a /estadisticas */}
      <div className="min-h-[300px]">
        {activeTab === 'posiciones' && (
          <>
            {posicionesData && posicionesData.length > 1 ? (
              // Si hay múltiples zonas, mostrar cada una
              <div className="space-y-6">
                {posicionesData.map((zona) => (
                  <div key={zona.id_zona} className="space-y-2">
                    <h3 className="text-white font-semibold text-sm px-2">
                      {zona.nombre_zona}
                    </h3>
                    <TablaPosiciones
                      variant="completa"
                      posiciones={zona.posiciones.map(pos => ({
                        ...pos, // Preservar todos los campos originales (incluyendo _live y en_vivo)
                        // Mapear campos para compatibilidad con EquipoPosicion
                        ganados: pos.partidos_ganados,
                        empatados: pos.partidos_empatados,
                        perdidos: pos.partidos_perdidos,
                        ultima_actualizacion: new Date().toISOString().split('T')[0],
                        img_equipo: pos.img_equipo || undefined
                      }))}
                      zonasPlayoff={zonasPlayoffData || []}
                      isLoading={loadingPosiciones || loadingPlayoff}
                      userTeamIds={[idEquipo]} // Resaltar el equipo actual
                      formatosPosicion={zona.formatosPosicion}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <TablaPosiciones
                variant="completa"
                posiciones={posicionesAplanadas}
                zonasPlayoff={zonasPlayoffData || []}
                isLoading={loadingPosiciones || loadingPlayoff}
                userTeamIds={[idEquipo]} // Resaltar el equipo actual
                formatosPosicion={posicionesData && posicionesData.length === 1 ? posicionesData[0].formatosPosicion : undefined}
              />
            )}
          </>
        )}

        {activeTab === 'goleadores' && (
          <TablaJugadoresEstadisticas
            jugadores={goleadores || []}
            tipo="goleadores"
            isLoading={loadingGoleadores}
          />
        )}

        {activeTab === 'asistencias' && (
          <TablaJugadoresEstadisticas
            jugadores={asistencias || []}
            tipo="asistencias"
            isLoading={loadingAsistencias}
          />
        )}

        {activeTab === 'amarillas' && (
          <TablaJugadoresEstadisticas
            jugadores={amarillas || []}
            tipo="amarillas"
            isLoading={loadingAmarillas}
          />
        )}

        {activeTab === 'rojas' && (
          <TablaJugadoresEstadisticas
            jugadores={rojas || []}
            tipo="rojas"
            isLoading={loadingRojas}
          />
        )}

        {activeTab === 'mvps' && (
          <TablaJugadoresEstadisticas
            jugadores={mvps || []}
            tipo="mvps"
            isLoading={loadingMVPs}
          />
        )}
      </div>
    </div>
  );
};

