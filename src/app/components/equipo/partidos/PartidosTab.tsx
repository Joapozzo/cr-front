'use client';

import React, { useState, useMemo } from 'react';
import { Partido } from '@/app/types/partido';
import { FiltrosFixture } from '@/app/components/fixture/FiltrosFixture';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';
import { FixtureSkeleton } from '@/app/components/skeletons/FixtureSkeleton';
import { formatearFecha } from '@/app/utils/formated';
import { formatearFechaCompleta } from '@/app/utils/fechas';

interface PartidosTabProps {
  idEquipo: number;
  partidos: Partido[];
  loading?: boolean;
}

type VistaType = 'fecha' | 'jornada';

export const PartidosTab: React.FC<PartidosTabProps> = ({
  idEquipo,
  partidos,
  loading = false
}) => {
  const [vistaActiva, setVistaActiva] = useState<VistaType>('jornada');
  
  // Filtrar solo los partidos del equipo actual
  const partidosEquipo = useMemo(() => {
    return partidos.filter(
      partido => 
        partido.id_equipolocal === idEquipo || 
        partido.id_equipovisita === idEquipo
    );
  }, [partidos, idEquipo]);

  // Obtener todas las jornadas disponibles
  const jornadas = useMemo(() => {
    const jornadasSet = new Set(partidosEquipo.map(p => p.jornada));
    return Array.from(jornadasSet).sort((a, b) => a - b);
  }, [partidosEquipo]);

  // Agrupar partidos por jornada
  const partidosPorJornada = useMemo(() => {
    return partidosEquipo.reduce((acc, partido) => {
      if (!acc[partido.jornada]) {
        acc[partido.jornada] = [];
      }
      acc[partido.jornada].push(partido);
      return acc;
    }, {} as Record<number, Partido[]>);
  }, [partidosEquipo]);

  // Obtener la jornada actual (la primera disponible)
  const jornadaActual = useMemo(() => {
    return jornadas.length > 0 ? jornadas[0] : 1;
  }, [jornadas]);

  // Obtener partidos de la jornada seleccionada
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(jornadaActual);

  // Actualizar jornada seleccionada cuando cambia jornadaActual
  React.useEffect(() => {
    if (jornadas.length > 0) {
      if (!jornadas.includes(jornadaSeleccionada)) {
        setJornadaSeleccionada(jornadaActual);
      }
    }
  }, [jornadaActual, jornadas, jornadaSeleccionada]);

  const partidosJornadaActual = partidosPorJornada[jornadaSeleccionada] || [];

  // Agrupar partidos por fecha (día)
  const partidosPorDia = useMemo(() => {
    return partidosEquipo.reduce((acc, partido) => {
      const fecha = partido.dia;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(partido);
      return acc;
    }, {} as Record<string, Partido[]>);
  }, [partidosEquipo]);

  // Ordenar fechas de más reciente a más antigua
  const fechasOrdenadas = useMemo(() => {
    return Object.keys(partidosPorDia).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [partidosPorDia]);

  if (loading) {
    return <FixtureSkeleton />;
  }

  if (!partidosEquipo || partidosEquipo.length === 0) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-6 sm:p-8 text-center">
          <p className="text-[#737373] text-xs sm:text-sm">No hay partidos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4 sm:space-y-6">
      {/* Tabs y Filtros */}
      <div className="flex sm:items-center sm:justify-between gap-4 items-center w-full mx-auto justify-between">
        {/* Tabs */}
        <div className="flex gap-2 bg-[var(--black-900)] border border-[#262626] rounded-xl p-1">
          <button
            onClick={() => setVistaActiva('jornada')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              vistaActiva === 'jornada'
                ? 'bg-[var(--green)] text-white'
                : 'text-[#737373] hover:text-white'
            }`}
          >
            Por Jornada
          </button>
          <button
            onClick={() => setVistaActiva('fecha')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              vistaActiva === 'fecha'
                ? 'bg-[var(--green)] text-white'
                : 'text-[#737373] hover:text-white'
            }`}
          >
            Por Fecha
          </button>
        </div>

        {/* Filtros */}
        {vistaActiva === 'jornada' && jornadas.length > 0 && (
          <FiltrosFixture
            jornadas={jornadas}
            jornadaActual={jornadaSeleccionada}
            onJornadaChange={setJornadaSeleccionada}
            loading={loading}
          />
        )}
      </div>

      {/* Contenido */}
      <div>
        {vistaActiva === 'jornada' ? (
          // Vista por Jornada
          partidosJornadaActual.length > 0 ? (
            <ListaPartidos
              partidos={partidosJornadaActual}
              titulo={`Jornada ${jornadaSeleccionada}`}
              subtitulo={formatearFechaCompleta(partidosJornadaActual[0]?.dia)}
            />
          ) : (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
              <p className="text-[#737373] text-sm">
                No hay partidos programados para esta jornada
              </p>
            </div>
          )
        ) : (
          // Vista por Fecha (Día)
          fechasOrdenadas.length > 0 ? (
            <div className="space-y-4">
              {fechasOrdenadas.map((fecha) => (
                <ListaPartidos
                  key={fecha}
                  partidos={partidosPorDia[fecha]}
                  subtitulo={formatearFechaCompleta(fecha)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
              <p className="text-[#737373] text-sm">
                No hay partidos disponibles
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

