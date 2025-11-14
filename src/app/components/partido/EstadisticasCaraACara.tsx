'use client';

import React from 'react';
import { EstadisticasCaraACara as EstadisticasCaraACaraType } from '@/app/types/partidoDetalle';
import { BaseCard } from '@/app/components/BaseCard';
import { ImagenPublica } from '@/app/components/common/ImagenPublica';
import { Shield } from 'lucide-react';
import StatCaraCaraSkeleton from '../skeletons/StatCaraCaraSkeleton';

interface EstadisticasCaraACaraProps {
  estadisticas: EstadisticasCaraACaraType;
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
      <StatCaraCaraSkeleton />
    );
  }

  return (
    <BaseCard className="p-3 sm:p-4 w-full flex items-center justify-center">
      <div className="flex items-center justify-between gap-3 sm:gap-4 w-full">
        {/* Victorias Local */}
        <div className="flex flex-col items-center text-left flex-1">
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
        </div>

        {/* Empates */}
        <div className="flex flex-col items-center text-left flex-1">
          {/* Número de empates */}
          <p className="text-white font-bold text-2xl sm:text-3xl mb-1 mt-[52px] sm:mt-[60px]">
            {estadisticas.empates}
          </p>
          {/* Porcentaje */}
          <p className="text-[var(--green)] text-sm sm:text-base font-medium mb-1">
            {estadisticas.porcentaje_empates}%
          </p>
          {/* Label */}
          <p className="text-[#737373] text-xs sm:text-sm">Empates</p>
        </div>

        {/* Victorias Visita */}
        <div className="flex flex-col items-center text-left flex-1">
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
        </div>
      </div>
    </BaseCard>
  );
};

