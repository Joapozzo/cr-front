'use client';

import React from 'react';
import { EstadisticasCaraACara as EstadisticasCaraACaraType } from '@/app/types/partidoDetalle';
import { BaseCard } from '@/app/components/BaseCard';
import { EscudoEquipo } from '@/app/components/common/EscudoEquipo';
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
          <EscudoEquipo
            src={imgEquipoLocal}
            alt={nombreEquipoLocal}
            size={48}
            className="mb-3 flex-shrink-0"
          />
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
          <EscudoEquipo
            src={imgEquipoVisita}
            alt={nombreEquipoVisita}
            size={48}
            className="mb-3 flex-shrink-0"
          />
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

