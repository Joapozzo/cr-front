'use client';

import React from 'react';
import { UltimoPartidoEquipo } from '@/app/types/partidoDetalle';
import { UltimosPartidosEquipo } from './UltimosPartidosEquipo';

interface PreviaTabProps {
  ultimosPartidosLocal: UltimoPartidoEquipo[];
  ultimosPartidosVisita: UltimoPartidoEquipo[];
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  loading?: boolean;
}

export const PreviaTab: React.FC<PreviaTabProps> = ({
  ultimosPartidosLocal,
  ultimosPartidosVisita,
  nombreEquipoLocal,
  nombreEquipoVisita,
  loading = false
}) => {
  return (
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Últimos partidos en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Últimos partidos Local */}
        <UltimosPartidosEquipo
          partidos={ultimosPartidosLocal}
          titulo={nombreEquipoLocal}
          loading={loading}
        />

        {/* Últimos partidos Visita */}
        <UltimosPartidosEquipo
          partidos={ultimosPartidosVisita}
          titulo={nombreEquipoVisita}
          loading={loading}
        />
      </div>
    </div>
  );
};

