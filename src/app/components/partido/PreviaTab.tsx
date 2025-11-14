'use client';

import React from 'react';
import { UltimoPartidoEquipo } from '@/app/types/partidoDetalle';
import { UltimosPartidosEquipo } from './UltimosPartidosEquipo';

interface PreviaTabProps {
  ultimosPartidosLocal: UltimoPartidoEquipo[];
  ultimosPartidosVisita: UltimoPartidoEquipo[];
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const PreviaTab: React.FC<PreviaTabProps> = ({
  ultimosPartidosLocal,
  ultimosPartidosVisita,
  nombreEquipoLocal,
  nombreEquipoVisita,
  imgEquipoLocal = null,
  imgEquipoVisita = null,
  loading = false
}) => {
  return (
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Últimos partidos en dos columnas */}
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 flex w-full items-center justify-between">
        {/* Últimos partidos Local */}
        <UltimosPartidosEquipo
          partidos={ultimosPartidosLocal}
          titulo={nombreEquipoLocal}
          imgEquipo={imgEquipoLocal}
          loading={loading}
        />

        {/* Últimos partidos Visita */}
        <UltimosPartidosEquipo
          partidos={ultimosPartidosVisita}
          titulo={nombreEquipoVisita}
          imgEquipo={imgEquipoVisita}
          loading={loading}
        />
      </div>
    </div>
  );
};

