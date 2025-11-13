'use client';

import React, { useState } from 'react';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { TablaPosicionesCompleta } from '@/app/components/estadisticas/TablaPosicionesCompleta';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import { EquipoPosicion } from '@/app/types/posiciones';
import { JugadorEstadistica } from '@/app/types/estadisticas';
import { Zona } from '@/app/types/zonas';

interface StatsTabProps {
  idEquipo: number;
  posiciones?: EquipoPosicion[];
  zonasPlayoff?: Zona[];
  goleadores: JugadorEstadistica[];
  asistencias: JugadorEstadistica[];
  amarillas: JugadorEstadistica[];
  rojas: JugadorEstadistica[];
  mvps: JugadorEstadistica[];
  loading?: boolean;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  idEquipo,
  posiciones = [],
  zonasPlayoff = [],
  goleadores,
  asistencias,
  amarillas,
  rojas,
  mvps,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<EstadisticaTab>('posiciones');

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
          <TablaPosicionesCompleta
            posiciones={posiciones}
            zonasPlayoff={zonasPlayoff}
            isLoading={loading}
            userTeamIds={[idEquipo]} // Resaltar el equipo actual
          />
        )}

        {activeTab === 'goleadores' && (
          <TablaJugadoresEstadisticas
            jugadores={goleadores}
            tipo="goleadores"
            isLoading={loading}
            onRowClick={(jugador) => {
              // TODO: Navegar a perfil del jugador o mostrar detalles
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'asistencias' && (
          <TablaJugadoresEstadisticas
            jugadores={asistencias}
            tipo="asistencias"
            isLoading={loading}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'amarillas' && (
          <TablaJugadoresEstadisticas
            jugadores={amarillas}
            tipo="amarillas"
            isLoading={loading}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'rojas' && (
          <TablaJugadoresEstadisticas
            jugadores={rojas}
            tipo="rojas"
            isLoading={loading}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}

        {activeTab === 'mvps' && (
          <TablaJugadoresEstadisticas
            jugadores={mvps}
            tipo="mvps"
            isLoading={loading}
            onRowClick={(jugador) => {
              console.log('Jugador seleccionado:', jugador);
            }}
          />
        )}
      </div>
    </div>
  );
};

