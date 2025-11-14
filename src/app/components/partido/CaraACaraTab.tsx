'use client';

import React from 'react';
import { HistorialPartidos } from '@/app/types/partidoDetalle';
import { EstadisticasCaraACara } from './EstadisticasCaraACara';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';
import CaraCaraSkeleton from '../skeletons/CaraCaraSkeleton';

interface CaraACaraTabProps {
  historial: HistorialPartidos;
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const CaraACaraTab: React.FC<CaraACaraTabProps> = ({
  historial,
  nombreEquipoLocal,
  nombreEquipoVisita,
  imgEquipoLocal,
  imgEquipoVisita,
  loading = false
}) => {

  if (loading) {
    return (
      <CaraCaraSkeleton />
    );
  }

  if (!historial || !historial.partidos || historial.partidos.length === 0) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay historial de partidos disponible</p>
        </div>
      </div>
    );
  }

  // Ordenar partidos por fecha (más reciente primero)
  const partidosOrdenados = [...historial.partidos].sort((a, b) => {
    const fechaA = new Date(a.dia).getTime();
    const fechaB = new Date(b.dia).getTime();
    return fechaB - fechaA;
  });

  return (
    <div className="py-4 space-y-4 sm:space-y-6 w-full">
      {/* Estadísticas Cara a Cara */}
      <div>
        <EstadisticasCaraACara
          estadisticas={historial.estadisticas}
          nombreEquipoLocal={nombreEquipoLocal}
          nombreEquipoVisita={nombreEquipoVisita}
          imgEquipoLocal={imgEquipoLocal}
          imgEquipoVisita={imgEquipoVisita}
          loading={loading}
        />
      </div>

      {/* Lista de partidos unificada */}
      <div>
        {/* <h4 className="text-white font-semibold text-sm px-1 mb-3">Partidos Anteriores</h4> */}
        <ListaPartidos
          partidos={partidosOrdenados}
        />
      </div>
    </div>
  );
};

