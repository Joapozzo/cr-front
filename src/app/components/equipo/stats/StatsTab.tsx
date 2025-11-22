'use client';

import React, { useState, useMemo } from 'react';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { TablaPosicionesCompleta } from '@/app/components/estadisticas/TablaPosicionesCompleta';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';
import {
  usePosicionesPorCategoriaEdicion,
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
}

export const StatsTab: React.FC<StatsTabProps> = ({
  idEquipo,
}) => {
  const [activeTab, setActiveTab] = useState<EstadisticaTab>('posiciones');
  const { categoriaSeleccionada } = useCategoriaStore();
  const id_categoria_edicion = categoriaSeleccionada?.id_categoria_edicion;

  const { data: posicionesData, isLoading: loadingPosiciones } = usePosicionesPorCategoriaEdicion(id_categoria_edicion || 0)

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
        ultima_actualizacion: new Date().toISOString().split('T')[0],
        img_equipo: pos.img_equipo || undefined
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
          ultima_actualizacion: new Date().toISOString().split('T')[0],
          img_equipo: pos.img_equipo || undefined
        });
      });
    });

    // Ordenar por puntos, diferencia de goles, goles a favor
    return todasPosiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.diferencia_goles !== a.diferencia_goles) return b.diferencia_goles - a.diferencia_goles;
      return b.goles_favor - a.goles_favor;
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
                    <TablaPosicionesCompleta
                      posiciones={zona.posiciones.map(pos => ({
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
                        ultima_actualizacion: new Date().toISOString().split('T')[0],
                        img_equipo: pos.img_equipo || undefined
                      }))}
                      zonasPlayoff={[]}
                      isLoading={loadingPosiciones}
                      userTeamIds={[idEquipo]} // Resaltar el equipo actual
                    />
                  </div>
                ))}
              </div>
            ) : (
              <TablaPosicionesCompleta
                posiciones={posicionesAplanadas}
                zonasPlayoff={[]}
                isLoading={loadingPosiciones}
                userTeamIds={[idEquipo]} // Resaltar el equipo actual
              />
            )}
          </>
        )}

        {activeTab === 'goleadores' && (
          <TablaJugadoresEstadisticas
            jugadores={goleadores || []}
            tipo="goleadores"
            isLoading={loadingGoleadores}
            onRowClick={(jugador) => {
              // TODO: Navegar a perfil del jugador o mostrar detalles
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'asistencias' && (
          <TablaJugadoresEstadisticas
            jugadores={asistencias || []}
            tipo="asistencias"
            isLoading={loadingAsistencias}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'amarillas' && (
          <TablaJugadoresEstadisticas
            jugadores={amarillas || []}
            tipo="amarillas"
            isLoading={loadingAmarillas}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'rojas' && (
          <TablaJugadoresEstadisticas
            jugadores={rojas || []}
            tipo="rojas"
            isLoading={loadingRojas}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'mvps' && (
          <TablaJugadoresEstadisticas
            jugadores={mvps || []}
            tipo="mvps"
            isLoading={loadingMVPs}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}
      </div>
    </div>
  );
};

