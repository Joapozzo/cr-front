'use client';

import React, { useMemo } from 'react';
import { Partido } from '@/app/types/partido';
import { EstadisticasCaraACara as EstadisticasCaraACaraType } from '@/app/types/partidoDetalle';
import { EstadisticasCaraACara } from './EstadisticasCaraACara';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';

interface CaraACaraTabProps {
  historial: Partido[];
  idEquipoLocal: number;
  idEquipoVisita: number;
  nombreEquipoLocal: string;
  nombreEquipoVisita: string;
  imgEquipoLocal?: string | null;
  imgEquipoVisita?: string | null;
  loading?: boolean;
}

export const CaraACaraTab: React.FC<CaraACaraTabProps> = ({
  historial,
  idEquipoLocal,
  idEquipoVisita,
  nombreEquipoLocal,
  nombreEquipoVisita,
  imgEquipoLocal,
  imgEquipoVisita,
  loading = false
}) => {

  // Calcular estadísticas a partir del historial
  const estadisticas = useMemo<EstadisticasCaraACaraType>(() => {
    if (!historial || historial.length === 0) {
      return {
        victorias_local: 0,
        victorias_visita: 0,
        empates: 0,
        total_partidos: 0,
        porcentaje_victorias_local: 0,
        porcentaje_victorias_visita: 0,
        porcentaje_empates: 0
      };
    }

    let victoriasLocal = 0;
    let victoriasVisita = 0;
    let empates = 0;

    historial.forEach(partido => {
      if (partido.goles_local === null || partido.goles_visita === null) {
        return; // Saltar partidos sin resultado
      }

      const esLocalEnHistorial = partido.id_equipolocal === idEquipoLocal;
      const golesEquipoLocal = esLocalEnHistorial ? partido.goles_local : partido.goles_visita;
      const golesEquipoVisita = esLocalEnHistorial ? partido.goles_visita : partido.goles_local;

      if (golesEquipoLocal > golesEquipoVisita) {
        victoriasLocal++;
      } else if (golesEquipoVisita > golesEquipoLocal) {
        victoriasVisita++;
      } else {
        empates++;
      }
    });

    const totalPartidos = victoriasLocal + victoriasVisita + empates;
    const porcentajeLocal = totalPartidos > 0 ? Math.round((victoriasLocal / totalPartidos) * 100) : 0;
    const porcentajeVisita = totalPartidos > 0 ? Math.round((victoriasVisita / totalPartidos) * 100) : 0;
    const porcentajeEmpates = totalPartidos > 0 ? Math.round((empates / totalPartidos) * 100) : 0;

    return {
      victorias_local: victoriasLocal,
      victorias_visita: victoriasVisita,
      empates: empates,
      total_partidos: totalPartidos,
      porcentaje_victorias_local: porcentajeLocal,
      porcentaje_victorias_visita: porcentajeVisita,
      porcentaje_empates: porcentajeEmpates
    };
  }, [historial, idEquipoLocal, idEquipoVisita]);

  // Ordenar partidos por fecha (más reciente primero)
  const partidosOrdenados = useMemo(() => {
    if (!historial || historial.length === 0) {
      return [];
    }
    return [...historial].sort((a, b) => {
      const fechaA = new Date(a.dia).getTime();
      const fechaB = new Date(b.dia).getTime();
      return fechaB - fechaA;
    });
  }, [historial]);

  if (!historial || historial.length === 0) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay historial de partidos disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4 sm:space-y-6 w-full">
      {/* Estadísticas Cara a Cara */}
      <div>
        <EstadisticasCaraACara
          estadisticas={estadisticas}
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

