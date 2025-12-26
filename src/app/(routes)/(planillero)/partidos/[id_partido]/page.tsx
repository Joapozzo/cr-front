'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BackButton from '@/app/components/ui/BackButton';
import PartidoHeaderSticky from '@/app/components/partido/CardPartidoHeader';
import { PartidoTabs, TabPartido } from '@/app/components/partido/PartidoTabs';
import { PreviaTab } from '@/app/components/partido/PreviaTab';
import { CaraACaraTab } from '@/app/components/partido/CaraACaraTab';
import { PartidoCompleto, IncidenciaGol, EstadoPartido } from '@/app/types/partido';
import { PartidoDetalleSkeleton } from '@/app/components/skeletons/PartidoDetalleSkeleton';
import JugadoresTabsUnified from '@/app/components/partido/JugadoresTabsUnified';
import { usePartidoDetalleUsuario } from '@/app/hooks/usePartidos';
import { useCronometroPartido } from '@/app/hooks/useCronometroPartido';
import usePartidoStore from '@/app/stores/partidoStore';

export default function PartidoPageUsuario() {
  const params = useParams();
  const idPartido = params?.id_partido ? parseInt(params.id_partido as string) : null;
  
  const [tabActiva, setTabActiva] = useState<TabPartido>('previa');

  // Hook para obtener detalle del partido
  const { data: datosPartido, isLoading: isLoadingData, error } = usePartidoDetalleUsuario(idPartido);

  // Store para calcular el cronómetro
  const {
    setEstadoPartido,
    setHoraInicio,
    setHoraInicioSegundoTiempo,
    setMinutosPorTiempo,
    setMinutosEntretiempo
  } = usePartidoStore();

  // Hook para calcular el cronómetro
  const cronometro = useCronometroPartido();

  // Configurar el store con los datos del partido cuando se cargan
  useEffect(() => {
    if (datosPartido?.partido) {
      const partido = datosPartido.partido;
      if (partido.estado) {
        setEstadoPartido(partido.estado as EstadoPartido);
      }
      if (partido.categoriaEdicion?.duracion_tiempo) {
        setMinutosPorTiempo(partido.categoriaEdicion.duracion_tiempo);
      }
      if (partido.categoriaEdicion?.duracion_entretiempo) {
        setMinutosEntretiempo(partido.categoriaEdicion.duracion_entretiempo);
      }
      if (['C1', 'C2', 'T'].includes(partido.estado) && partido.hora_inicio) {
        setHoraInicio(new Date(partido.hora_inicio));
      }
      if (['C2', 'T'].includes(partido.estado) && partido.hora_inicio_segundo_tiempo) {
        setHoraInicioSegundoTiempo(new Date(partido.hora_inicio_segundo_tiempo));
      }
    }
  }, [datosPartido, setEstadoPartido, setHoraInicio, setHoraInicioSegundoTiempo, setMinutosPorTiempo, setMinutosEntretiempo]);

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

  if (isLoadingData || !datosPartido) {
    return (
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
        <PartidoDetalleSkeleton />
      </div>
    );
  }

  const goles = datosPartido.incidencias?.filter((inc: IncidenciaGol) => inc.tipo === 'gol') as IncidenciaGol[] || [];

  // Renderizar contenido según tab
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'previa':
        return (
          <PreviaTab
            ultimosPartidosLocal={datosPartido.ultimos_partidos_local || []}
            ultimosPartidosVisita={datosPartido.ultimos_partidos_visita || []}
            nombreEquipoLocal={datosPartido.partido?.equipoLocal?.nombre || 'Local'}
            nombreEquipoVisita={datosPartido.partido?.equipoVisita?.nombre || 'Visitante'}
            idEquipoLocal={datosPartido.partido?.equipoLocal?.id_equipo}
            idEquipoVisita={datosPartido.partido?.equipoVisita?.id_equipo}
            imgEquipoLocal={datosPartido.partido?.equipoLocal?.img}
            imgEquipoVisita={datosPartido.partido?.equipoVisita?.img}
            loading={isLoadingData}
          />
        );
      case 'cara-a-cara':
        return (
          <CaraACaraTab
            historial={datosPartido.historial || []}
            nombreEquipoLocal={datosPartido.partido?.equipoLocal?.nombre || 'Local'}
            nombreEquipoVisita={datosPartido.partido?.equipoVisita?.nombre || 'Visitante'}
            imgEquipoLocal={datosPartido.partido?.equipoLocal?.img}
            imgEquipoVisita={datosPartido.partido?.equipoVisita?.img}
            loading={isLoadingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <BackButton />

      {/* Header del partido - Sin botones de control (solo lectura) */}
      <PartidoHeaderSticky
        partido={datosPartido.partido as PartidoCompleto}
        goles={goles}
        esPlanillero={false} // Modo solo lectura
        isLoading={isLoadingData}
        cronometro={cronometro}
      />
      
      {/* Si está finalizado, mostrar incidencias y formaciones */}
      {datosPartido.partido && (
        <>
          {/* Incidencias y Formaciones */}
          <JugadoresTabsUnified
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
            jugadorDestacado={datosPartido.partido?.jugadorDestacado || null}
            cambios={datosPartido.cambios || []}
            idPartido={idPartido}
            loading={isLoadingData}
          />
        </>
      )}

      {/* Tabs de Previa / Cara a Cara */}
      <PartidoTabs
        tabActiva={tabActiva}
        onTabChange={setTabActiva}
        loading={isLoadingData}
      />

      {/* Contenido de las tabs */}
      {renderTabContent()}
    </div>
  );
}

