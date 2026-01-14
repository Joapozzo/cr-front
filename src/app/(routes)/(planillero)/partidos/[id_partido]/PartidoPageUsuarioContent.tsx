'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import BackButton from '@/app/components/ui/BackButton';
import { PartidoTabs, TabPartido } from '@/app/components/partido/PartidoTabs';
import { PartidoCompleto, IncidenciaGol, EstadoPartido } from '@/app/types/partido';
import {
  LazyCardPartidoHeader,
  LazyJugadoresTabsUnified,
  LazyPreviaTab,
  LazyCaraACaraTab,
} from '@/app/components/partido/LazyPartidoComponents';
import {
  CardPartidoHeaderFallback,
  JugadoresTabsUnifiedFallback,
  PreviaTabFallback,
  CaraACaraTabFallback,
} from '@/app/components/partido/partidoFallbacks';
import { usePartidoDetalleUsuario } from '@/app/hooks/usePartidos';
import { useCronometroPartido } from '@/app/hooks/useCronometroPartido';
import { useSyncPartidoToStore } from '@/app/hooks/useSyncPartidoToStore';
import { usePartidoLive } from '@/app/hooks/usePartidoLive';

export default function PartidoPageUsuarioContent() {
  const params = useParams();
  const [tabActiva, setTabActiva] = useState<TabPartido>('previa');
  
  // Memoizar y validar el ID de partido
  const idPartido = useMemo(() => {
    if (params?.id_partido) {
      const parsed = parseInt(params.id_partido as string);
      return !isNaN(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
  }, [params?.id_partido]);

  // Hook para obtener detalle del partido - TODOS los hooks deben llamarse antes de cualquier early return
  const { 
    data: datosPartido, 
    isLoading: isLoadingData, 
    error 
  } = usePartidoDetalleUsuario(idPartido, {
    enabled: idPartido !== null
  });
  
  // Solo considerar loading si no hay datos (isLoading solo en carga inicial)
  // Si hay datos pero está fetching, no bloquear renderizado
  const isInitialLoading = isLoadingData && !datosPartido;

  // Hook para calcular el cronómetro
  const cronometro = useCronometroPartido();

  // Sync the partido to the store
  useSyncPartidoToStore({ partido: datosPartido?.partido });

  // WebSocket hook para actualizaciones en tiempo real
  usePartidoLive(idPartido);

  // Early return si no hay ID válido DESPUÉS de todos los hooks
  if (!idPartido) {
    return (
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Partido no encontrado</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-red-400 text-sm">Error al cargar el partido: {error.message}</p>
        </div>
      </div>
    );
  }

  const goles = datosPartido?.incidencias?.filter((inc: IncidenciaGol) => inc.tipo === 'gol') as IncidenciaGol[] || [];

  // Renderizar siempre, pero mostrar skeleton solo cuando no hay datos
  return (
    <div className="min-h-screen p-3 sm:p-4 flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full overflow-x-hidden">
      <BackButton />

      {/* Header del partido - Sin botones de control (solo lectura) */}
      {datosPartido?.partido ? (
        <LazyCardPartidoHeader
          partido={datosPartido.partido as PartidoCompleto}
          goles={goles}
          esPlanillero={false} // Modo solo lectura
          cronometro={cronometro}
        />
      ) : isInitialLoading ? (
        <CardPartidoHeaderFallback />
      ) : null}
      
      {/* Si está finalizado, mostrar incidencias y formaciones */}
      {datosPartido?.partido ? (
        <LazyJugadoresTabsUnified
          mode="view" // Modo solo lectura
          estadoPartido={datosPartido.partido?.estado as EstadoPartido}
          equipoLocal={{
            id_equipo: datosPartido.partido?.equipoLocal?.id_equipo || 0,
            nombre: datosPartido.partido?.equipoLocal?.nombre || 'Local',
            jugadores: datosPartido.plantel_local || []
          }}
          equipoVisita={{
            id_equipo: datosPartido.partido?.equipoVisita?.id_equipo || 0,
            nombre: datosPartido.partido?.equipoVisita?.nombre || 'Visitante',
            jugadores: datosPartido.plantel_visita || []
          }}
          incidencias={datosPartido.incidencias || []}
          destacados={datosPartido.jugadores_destacados || []}
          jugadorDestacado={
            datosPartido.partido?.jugadorDestacado?.usuario
              ? {
                  id_jugador: datosPartido.partido.jugadorDestacado.id_jugador,
                  id_usuario: '',
                  nombre: datosPartido.partido.jugadorDestacado.usuario.nombre || '',
                  apellido: datosPartido.partido.jugadorDestacado.usuario.apellido || ''
                }
              : datosPartido.partido?.jugador_destacado || null
          }
          cambios={datosPartido.cambios || []}
          idPartido={idPartido}
        />
      ) : isInitialLoading ? (
        <JugadoresTabsUnifiedFallback />
      ) : null}

      {/* Tabs de Previa / Cara a Cara */}
      {datosPartido ? (
        <>
          <PartidoTabs
            tabActiva={tabActiva}
            onTabChange={setTabActiva}
            loading={false}
          />
          
          {/* Contenido de las tabs - Solo renderizar el tab activo */}
          {tabActiva === 'previa' ? (
            <LazyPreviaTab
              ultimosPartidosLocal={datosPartido?.ultimos_partidos_local}
              ultimosPartidosVisita={datosPartido?.ultimos_partidos_visita}
              nombreEquipoLocal={datosPartido?.partido?.equipoLocal?.nombre || 'Local'}
              nombreEquipoVisita={datosPartido?.partido?.equipoVisita?.nombre || 'Visitante'}
              idEquipoLocal={datosPartido?.partido?.equipoLocal?.id_equipo}
              idEquipoVisita={datosPartido?.partido?.equipoVisita?.id_equipo}
              imgEquipoLocal={datosPartido?.partido?.equipoLocal?.img}
              imgEquipoVisita={datosPartido?.partido?.equipoVisita?.img}
            />
          ) : (
            <LazyCaraACaraTab
              historial={datosPartido?.historial}
              idEquipoLocal={datosPartido?.partido?.equipoLocal?.id_equipo || 0}
              idEquipoVisita={datosPartido?.partido?.equipoVisita?.id_equipo || 0}
              nombreEquipoLocal={datosPartido?.partido?.equipoLocal?.nombre || 'Local'}
              nombreEquipoVisita={datosPartido?.partido?.equipoVisita?.nombre || 'Visitante'}
              imgEquipoLocal={datosPartido?.partido?.equipoLocal?.img}
              imgEquipoVisita={datosPartido?.partido?.equipoVisita?.img}
            />
          )}
        </>
      ) : isInitialLoading ? (
        <>
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-2">
            <div className="flex gap-2 justify-center">
              <div className="h-10 w-full max-w-[200px] bg-[#262626] rounded-lg animate-pulse" />
              <div className="h-10 w-full max-w-[200px] bg-[#262626] rounded-lg animate-pulse" />
            </div>
          </div>
          {tabActiva === 'previa' ? <PreviaTabFallback /> : <CaraACaraTabFallback />}
        </>
      ) : null}
    </div>
  );
}

