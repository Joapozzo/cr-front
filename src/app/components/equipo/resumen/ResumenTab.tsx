'use client';

import React from 'react';
import { EquipoResumen } from '@/app/types/equipoResumen';
import { ProximoPartidoCard } from './ProximoPartidoCard';
import { UltimoPartidoCard } from './UltimoPartidoCard';
import { UltimosPartidosResumen } from './UltimosPartidosResumen';
import { StatsResumenSlider } from './StatsResumenSlider';

interface ResumenTabProps {
  idEquipo: number;
  resumen: EquipoResumen | null;
  loading?: boolean;
  onVerTodosStats?: (tipo: string) => void;
}

export const ResumenTab: React.FC<ResumenTabProps> = ({
  idEquipo,
  resumen,
  loading = false,
  onVerTodosStats
}) => {
  
  if (!resumen && !loading) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Próximo partido */}
      <ProximoPartidoCard
        partido={resumen?.proximo_partido || null}
        idEquipoActual={idEquipo}
        loading={loading}
      />

      {/* Último partido */}
      <UltimoPartidoCard
        partido={resumen?.ultimo_partido || null}
        idEquipoActual={idEquipo}
        loading={loading}
      />

      {/* Últimos partidos resumidos */}
      <UltimosPartidosResumen
        partidos={resumen?.ultimos_partidos || []}
        loading={loading}
      />

      {/* Estadísticas (slider horizontal) */}
      <StatsResumenSlider
        stats={resumen?.stats || []}
        loading={loading}
        onVerTodos={onVerTodosStats}
      />
    </div>
  );
};

