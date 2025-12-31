'use client';

import React from 'react';
import { Partido } from '@/app/types/partido';
import { UltimosPartidosEquipo } from './UltimosPartidosEquipo';

interface PreviaTabProps {
  ultimosPartidosLocal: Partido[];
  ultimosPartidosVisita: Partido[];
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  idEquipoLocal?: number;
  idEquipoVisita?: number;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const PreviaTab: React.FC<PreviaTabProps> = ({
  ultimosPartidosLocal,
  ultimosPartidosVisita,
  nombreEquipoLocal,
  nombreEquipoVisita,
  idEquipoLocal,
  idEquipoVisita,
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
          idEquipoPrincipal={idEquipoLocal}
          titulo={nombreEquipoLocal}
          imgEquipo={imgEquipoLocal}
          loading={loading}
          alineacionTitulo="center"
        />

        {/* Últimos partidos Visita */}
        <UltimosPartidosEquipo
          partidos={ultimosPartidosVisita}
          idEquipoPrincipal={idEquipoVisita}
          titulo={nombreEquipoVisita}
          imgEquipo={imgEquipoVisita}
          loading={loading}
          alineacionTitulo="center"
        />
      </div>
    </div>
  );
};

