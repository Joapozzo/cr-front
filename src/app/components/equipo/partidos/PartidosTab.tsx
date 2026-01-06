'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Partido } from '@/app/types/partido';
import { FiltrosFixture } from '@/app/components/fixture/FiltrosFixture';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';
import { FixtureSkeleton } from '@/app/components/skeletons/FixtureSkeleton';
import { formatearFechaCompleta } from '@/app/utils/fechas';
import { usePartidosUsuarioPorEquipo } from '@/app/hooks/usePartidos';

interface PartidosTabProps {
  idEquipo: number;
  idCategoriaEdicion?: number | null;
}

type VistaType = 'fecha' | 'jornada';

export const PartidosTab: React.FC<PartidosTabProps> = ({
  idEquipo,
  idCategoriaEdicion,
}) => {
  const [vistaActiva, setVistaActiva] = useState<VistaType>('jornada');
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [allPartidos, setAllPartidos] = useState<Partido[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);
  const queryKeyRef = useRef<string>('');
  const limit = 20;

  // Generar clave única para la query actual
  const currentQueryKey = useMemo(() => {
    return `${idEquipo}-${vistaActiva}-${idCategoriaEdicion}-${vistaActiva === 'jornada' ? jornadaSeleccionada : 'all'}`;
  }, [idEquipo, vistaActiva, idCategoriaEdicion, jornadaSeleccionada]);

  // Hook para obtener partidos del equipo
  const { 
    data: partidosData, 
    isLoading, 
    error
  } = usePartidosUsuarioPorEquipo(
    idEquipo,
    vistaActiva,
    idCategoriaEdicion ?? null,
    vistaActiva === 'jornada' ? jornadaSeleccionada : undefined,
    limit,
    page
  );

  // Resetear cuando cambia el equipo, categoría o vista (pero NO cuando cambia la jornada)
  useEffect(() => {
    queryKeyRef.current = currentQueryKey;
    setPage(1);
    setAllPartidos([]);
    if (vistaActiva === 'jornada') {
      setJornadaSeleccionada(undefined);
    }
  }, [idEquipo, idCategoriaEdicion, vistaActiva]);

  // Actualizar queryKeyRef cuando cambia currentQueryKey (para evitar procesar datos antiguos)
  useEffect(() => {
    queryKeyRef.current = currentQueryKey;
  }, [currentQueryKey]);

  // Actualizar lista acumulada de partidos cuando cambian los datos
  useEffect(() => {
    // Solo procesar si la query key coincide (evitar procesar datos de queries anteriores)
    if (!partidosData || queryKeyRef.current !== currentQueryKey) {
      return;
    }

    if (partidosData.partidos) {
      if (page === 1) {
        // Si es la primera página, reemplazar todo
        setAllPartidos(partidosData.partidos);
      } else {
        // Si es una página posterior, agregar a los existentes
        setAllPartidos(prev => {
          // Evitar duplicados comparando id_partido
          const existingIds = new Set(prev.map(p => p.id_partido));
          const newPartidos = partidosData.partidos.filter(p => !existingIds.has(p.id_partido));
          return [...prev, ...newPartidos];
        });
      }
    }
  }, [partidosData, page, currentQueryKey]);

  // Calcular si hay más páginas
  const hasNextPage = partidosData ? (partidosData.offset + partidosData.limit) < partidosData.total : false;
  const isFetchingNextPage = isLoading && page > 1;

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

  // Para vista por jornada: usar directamente los partidos acumulados (la API ya filtra por jornada)
  const partidosJornadaActual = vistaActiva === 'jornada' ? allPartidos : [];

  // Agrupar partidos por fecha (día)
  const partidosPorDia = useMemo(() => {
    return allPartidos.reduce((acc, partido) => {
      const fecha = partido.dia;
      if (!fecha) return acc;
      // Normalizar la fecha: extraer solo la parte de la fecha (YYYY-MM-DD) si viene como ISO string
      const fechaNormalizada = fecha.includes('T') ? fecha.split('T')[0] : fecha;
      if (!acc[fechaNormalizada]) {
        acc[fechaNormalizada] = [];
      }
      acc[fechaNormalizada].push(partido);
      return acc;
    }, {} as Record<string, Partido[]>);
  }, [allPartidos]);

  // Ordenar fechas: primero las más cercanas a hoy (futuras/presente), luego las pasadas
  const fechasOrdenadas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hoyTime = hoy.getTime();

    const fechas = Object.keys(partidosPorDia);
    
    // Separar fechas futuras/presente y pasadas
    const fechasFuturas = fechas.filter(fecha => {
      const fechaTime = new Date(fecha).getTime();
      return fechaTime >= hoyTime;
    });
    
    const fechasPasadas = fechas.filter(fecha => {
      const fechaTime = new Date(fecha).getTime();
      return fechaTime < hoyTime;
    });

    // Ordenar futuras ascendente (más cercana primero)
    fechasFuturas.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    // Ordenar pasadas descendente (más reciente primero)
    fechasPasadas.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Combinar: futuras primero, luego pasadas
    return [...fechasFuturas, ...fechasPasadas];
  }, [partidosPorDia]);

  // Obtener jornadas disponibles
  const jornadasDisponibles = useMemo(() => {
    return partidosData?.jornadas || [];
  }, [partidosData?.jornadas]);

  // Inicializar jornada seleccionada cuando se cargan las jornadas
  useEffect(() => {
    if (vistaActiva === 'jornada' && jornadasDisponibles.length > 0) {
      // Si no hay jornada seleccionada o la jornada seleccionada no está en las disponibles, seleccionar la primera
      if (!jornadaSeleccionada || !jornadasDisponibles.includes(jornadaSeleccionada)) {
        setJornadaSeleccionada(jornadasDisponibles[0]);
      }
    }
  }, [jornadasDisponibles, vistaActiva, jornadaSeleccionada]);

  // Si no hay id_equipo, mostrar mensaje
  if (!idEquipo) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">
            No hay equipo disponible para mostrar los partidos
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && page === 1) {
    return <FixtureSkeleton />;
  }

  if (error) {
    return (
      <div className="py-4">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
          <p className="text-red-400 text-sm">
            Error al cargar los partidos: {error.message}
          </p>
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
            onClick={() => {
              setVistaActiva('jornada');
              setPage(1);
              setAllPartidos([]);
            }}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              vistaActiva === 'jornada'
                ? 'bg-[var(--color-primary)] text-white'
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
                ? 'bg-[var(--color-primary)] text-white'
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
        {vistaActiva === 'jornada' ? (
          // Vista por Jornada
          jornadasDisponibles.length === 0 ? (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
              <p className="text-[#737373] text-sm">
                No hay partidos disponibles
              </p>
            </div>
          ) : jornadaSeleccionada ? (
            isLoading && page === 1 ? (
              <FixtureSkeleton />
            ) : partidosJornadaActual.length > 0 ? (
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
            ) : !isLoading ? (
              <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                <p className="text-[#737373] text-sm">
                  No hay partidos programados para esta jornada
                </p>
              </div>
            ) : null
          ) : (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
              <p className="text-[#737373] text-sm">
                Selecciona una jornada
              </p>
            </div>
          )
        ) : (
          // Vista por Fecha (Día)
          isLoading && page === 1 ? (
            <FixtureSkeleton />
          ) : fechasOrdenadas.length > 0 ? (
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
          ) : !isLoading ? (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
              <p className="text-[#737373] text-sm">
                No hay partidos disponibles
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

