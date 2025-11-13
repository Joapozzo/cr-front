'use client';

import React from 'react';
import { HistorialPartidos } from '@/app/types/partidoDetalle';
import { EstadisticasCaraACara } from './EstadisticasCaraACara';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';

interface CaraACaraTabProps {
  historial: HistorialPartidos;
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  
  const diaSemana = dias[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  
  return `${diaSemana}, ${dia} ${mes}`;
};

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
      <div className="py-4 space-y-4 sm:space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[#262626] rounded w-20 mb-2" />
              <div className="h-8 bg-[#262626] rounded w-12 mb-1" />
              <div className="h-3 bg-[#262626] rounded w-16" />
            </div>
          ))}
        </div>
        {/* Partidos skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-[#262626] rounded w-32 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#262626] rounded" />
            ))}
          </div>
        </div>
      </div>
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
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Estadísticas Cara a Cara */}
      <div>
        <h4 className="text-white font-semibold text-sm px-1 mb-3">Historial</h4>
        <EstadisticasCaraACara
          estadisticas={historial.estadisticas}
          nombreEquipoLocal={nombreEquipoLocal}
          nombreEquipoVisita={nombreEquipoVisita}
          imgEquipoLocal={imgEquipoLocal}
          imgEquipoVisita={imgEquipoVisita}
          loading={loading}
        />
      </div>

      {/* Lista de partidos */}
      <div>
        <h4 className="text-white font-semibold text-sm px-1 mb-3">Partidos Anteriores</h4>
        <div className="space-y-4">
          {partidosOrdenados.map((partido) => (
            <ListaPartidos
              key={partido.id_partido}
              partidos={[partido]}
              titulo={formatearFecha(partido.dia)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

