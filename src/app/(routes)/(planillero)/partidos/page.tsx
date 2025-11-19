'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EdicionLayout } from '@/app/components/layouts/EdicionLayout';
import { FiltrosFixture } from '@/app/components/fixture/FiltrosFixture';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';
import { FixtureSkeleton } from '@/app/components/skeletons/FixtureSkeleton';
import { Partido } from '@/app/types/partido';
import { formatearFechaCompleta } from '@/app/utils/fechas';
import { usePartidosUsuario } from '@/app/hooks/usePartidos';

type VistaType = 'fecha' | 'jornada';

export default function PartidosPage() {
  const [vistaActiva, setVistaActiva] = useState<VistaType>('jornada');
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [allPartidos, setAllPartidos] = useState<Partido[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);
  const limit = 20;

  // Hook para obtener partidos
  const { 
    data: partidosData, 
    isLoading, 
    error
  } = usePartidosUsuario(
    vistaActiva,
    undefined, // id_categoria_edicion - se puede agregar después
    vistaActiva === 'jornada' ? jornadaSeleccionada : undefined,
    limit,
    page
  );

  // Actualizar lista acumulada de partidos cuando cambian los datos
  useEffect(() => {
    if (partidosData?.partidos) {
      if (page === 1) {
        setAllPartidos(partidosData.partidos);
      } else {
        setAllPartidos(prev => [...prev, ...partidosData.partidos]);
      }
    }
  }, [partidosData, page]);

  // Calcular si hay más páginas
  const hasNextPage = partidosData ? (partidosData.offset + partidosData.limit) < partidosData.total : false;
  const isFetchingNextPage = isLoading && page > 1;

  // Resetear cuando cambia la vista o jornada
  useEffect(() => {
    setPage(1);
    setAllPartidos([]);
  }, [vistaActiva, jornadaSeleccionada]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, isLoading]);

  // Agrupar partidos por jornada
  const partidosPorJornada = useMemo(() => {
    return allPartidos.reduce((acc, partido) => {
      if (!acc[partido.jornada]) {
        acc[partido.jornada] = [];
      }
      acc[partido.jornada].push(partido);
      return acc;
    }, {} as Record<number, Partido[]>);
  }, [allPartidos]);

  // Obtener partidos de la jornada seleccionada
  const partidosJornadaActual = jornadaSeleccionada ? (partidosPorJornada[jornadaSeleccionada] || []) : [];

  // Agrupar partidos por fecha (día)
  const partidosPorDia = useMemo(() => {
    return allPartidos.reduce((acc, partido) => {
      const fecha = partido.dia;
      if (!fecha) return acc;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(partido);
      return acc;
    }, {} as Record<string, Partido[]>);
  }, [allPartidos]);

  // Ordenar fechas de más reciente a más antigua
  const fechasOrdenadas = useMemo(() => {
    return Object.keys(partidosPorDia).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [partidosPorDia]);

  // Obtener jornadas disponibles
  const jornadasDisponibles = useMemo(() => {
    return partidosData?.jornadas || [];
  }, [partidosData?.jornadas]);

  // Inicializar jornada seleccionada cuando se cargan las jornadas
  useEffect(() => {
    if (vistaActiva === 'jornada' && !jornadaSeleccionada && jornadasDisponibles.length > 0) {
      setJornadaSeleccionada(jornadasDisponibles[0]);
    }
  }, [jornadasDisponibles, vistaActiva, jornadaSeleccionada]);

  return (
    <UserPageWrapper>
      <EdicionLayout
        nombreEdicion="Copa Relámpago"
        temporada="Clausura 2025"
        nombreCategoria="Primera - Masculino"
        loading={isLoading}
      >
        <div className="space-y-4">
          {/* Tabs y Filtros */}
          <div className="flex items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 bg-[var(--black-900)] border border-[#262626] rounded-xl p-1">
              <button
                onClick={() => {
                  setVistaActiva('jornada');
                  setPage(1);
                  setAllPartidos([]);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  vistaActiva === 'jornada'
                    ? 'bg-[var(--green)] text-white'
                    : 'text-[#737373] hover:text-white'
                }`}
              >
                Por Jornada
              </button>
              <button
                onClick={() => {
                  setVistaActiva('fecha');
                  setPage(1);
                  setAllPartidos([]);
                }}
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
            {vistaActiva === 'jornada' && jornadasDisponibles.length > 0 && (
              <FiltrosFixture
                jornadas={jornadasDisponibles}
                jornadaActual={jornadaSeleccionada || jornadasDisponibles[0]}
                onJornadaChange={(jornada) => {
                  setJornadaSeleccionada(jornada);
                  setPage(1);
                  setAllPartidos([]);
                }}
                loading={isLoading}
              />
            )}
          </div>

          {/* Contenido */}
          <div>
            {isLoading && page === 1 ? (
              <FixtureSkeleton />
            ) : error ? (
              <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                <p className="text-red-400 text-sm">
                  Error al cargar los partidos: {error.message}
                </p>
              </div>
            ) : vistaActiva === 'jornada' ? (
              // Vista por Jornada
              jornadasDisponibles.length === 0 ? (
                <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                  <p className="text-[#737373] text-sm">
                    No hay partidos disponibles
                  </p>
                </div>
              ) : jornadaSeleccionada ? (
                partidosJornadaActual.length > 0 ? (
                  <>
                    <ListaPartidos
                      partidos={partidosJornadaActual}
                      titulo={`Jornada ${jornadaSeleccionada}`}
                      subtitulo={partidosJornadaActual[0]?.dia ? formatearFechaCompleta(partidosJornadaActual[0].dia) : undefined}
                    />
                    {/* Observer para infinite scroll */}
                    <div ref={observerTarget} className="h-4" />
                    {isFetchingNextPage && (
                      <div className="flex justify-center py-4">
                        <p className="text-[#737373] text-sm">Cargando más partidos...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                    <p className="text-[#737373] text-sm">
                      No hay partidos programados para esta jornada
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                  <p className="text-[#737373] text-sm">
                    Selecciona una jornada
                  </p>
                </div>
              )
            ) : (
              // Vista por Fecha (Día)
              <div className="space-y-4">
                {fechasOrdenadas.length > 0 ? (
                  <>
                    {fechasOrdenadas.map((fecha) => (
                      <ListaPartidos
                        key={fecha}
                        partidos={partidosPorDia[fecha]}
                        titulo={formatearFechaCompleta(fecha)}
                      />
                    ))}
                    {/* Observer para infinite scroll */}
                    <div ref={observerTarget} className="h-4" />
                    {isFetchingNextPage && (
                      <div className="flex justify-center py-4">
                        <p className="text-[#737373] text-sm">Cargando más partidos...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                    <p className="text-[#737373] text-sm">
                      No hay partidos disponibles
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </EdicionLayout>
    </UserPageWrapper>
  );
}

