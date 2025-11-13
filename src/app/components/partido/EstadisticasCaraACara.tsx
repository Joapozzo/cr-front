'use client';

import React from 'react';
import { EstadisticasCaraACara } from '@/app/types/partidoDetalle';
import { BaseCard } from '@/app/components/BaseCard';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { Trophy, Shield } from 'lucide-react';

interface EstadisticasCaraACaraProps {
  estadisticas: EstadisticasCaraACara;
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const EstadisticasCaraACara: React.FC<EstadisticasCaraACaraProps> = ({
  estadisticas,
  nombreEquipoLocal,
  nombreEquipoVisita,
  imgEquipoLocal,
  imgEquipoVisita,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <BaseCard key={i} className="p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-[#262626] rounded w-20" />
              <div className="h-8 bg-[#262626] rounded w-12" />
              <div className="h-3 bg-[#262626] rounded w-16" />
            </div>
          </BaseCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Victorias Local */}
      <BaseCard className="p-3 sm:p-4 flex flex-col items-center text-center">
        {/* Escudo del equipo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0 flex items-center justify-center border border-[#262626] mb-3">
          <ImagenPublica
            src={imgEquipoLocal || '/img/default-team.png'}
            alt={nombreEquipoLocal}
            width={48}
            height={48}
            fallbackIcon={<Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#737373]" />}
          />
        </div>
        {/* Número de victorias */}
        <p className="text-white font-bold text-2xl sm:text-3xl mb-1">
          {estadisticas.victorias_local}
        </p>
        {/* Porcentaje */}
        <p className="text-[var(--green)] text-sm sm:text-base font-medium mb-1">
          {estadisticas.porcentaje_victorias_local}%
        </p>
        {/* Label */}
        <p className="text-[#737373] text-xs sm:text-sm">Victorias</p>
      </BaseCard>

      {/* Empates */}
      <BaseCard className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
        {/* Número de empates */}
        <p className="text-white font-bold text-2xl sm:text-3xl mb-1">
          {estadisticas.empates}
        </p>
        {/* Porcentaje */}
        <p className="text-[var(--green)] text-sm sm:text-base font-medium mb-1">
          {estadisticas.porcentaje_empates}%
        </p>
        {/* Label */}
        <p className="text-[#737373] text-xs sm:text-sm">Empates</p>
      </BaseCard>

      {/* Victorias Visita */}
      <BaseCard className="p-3 sm:p-4 flex flex-col items-center text-center">
        {/* Escudo del equipo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-[var(--black-800)] flex-shrink-0 flex items-center justify-center border border-[#262626] mb-3">
          <ImagenPublica
            src={imgEquipoVisita || '/img/default-team.png'}
            alt={nombreEquipoVisita}
            width={48}
            height={48}
            fallbackIcon={<Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#737373]" />}
          />
        </div>
        {/* Número de victorias */}
        <p className="text-white font-bold text-2xl sm:text-3xl mb-1">
          {estadisticas.victorias_visita}
        </p>
        {/* Porcentaje */}
        <p className="text-[var(--green)] text-sm sm:text-base font-medium mb-1">
          {estadisticas.porcentaje_victorias_visita}%
        </p>
        {/* Label */}
        <p className="text-[#737373] text-xs sm:text-sm">Victorias</p>
      </BaseCard>
    </div>
  );
};

