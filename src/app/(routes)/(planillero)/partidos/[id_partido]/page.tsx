'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import BackButton from '@/app/components/ui/BackButton';
import PartidoHeaderSticky from '@/app/components/partido/CardPartidoHeader';
import { JugadoresTabsUnified } from '@/app/components/partido/JugadoresTabsUnified';
import { PartidoTabs, TabPartido } from '@/app/components/partido/PartidoTabs';
import { PreviaTab } from '@/app/components/partido/PreviaTab';
import { CaraACaraTab } from '@/app/components/partido/CaraACaraTab';
import { PartidoDetalleUsuario, UltimoPartidoEquipo, HistorialPartidos } from '@/app/types/partidoDetalle';
import { PartidoCompleto, IncidenciaGol, EstadoPartido } from '@/app/types/partido';
import { mockPartidoDetalleUsuario } from '@/app/mocks/partidoDetalle.mock';
import { PartidoDetalleSkeleton } from '@/app/components/skeletons/PartidoDetalleSkeleton';

export default function PartidoPageUsuario() {
  const params = useParams();
  const idPartido = params?.id_partido ? parseInt(params.id_partido as string) : null;
  
  const [tabActiva, setTabActiva] = useState<TabPartido>('previa');
  const [isLoading] = useState(false);

  // TODO: Reemplazar con hook real
  // const { data: datosPartido, isLoading } = usePartidoDetalleUsuario(idPartido);
  const datosPartido = mockPartidoDetalleUsuario;
  const isLoadingData = isLoading;

  if (!idPartido) {
    return (
      <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Partido no encontrado</p>
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

  const goles = datosPartido.incidencias.filter(inc => inc.tipo === 'gol') as IncidenciaGol[];
  const estaFinalizado = ['T', 'F'].includes(datosPartido.partido.estado as EstadoPartido);

  // Renderizar contenido según tab
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'previa':
        return (
          <PreviaTab
            ultimosPartidosLocal={mockPartidoDetalleUsuario.ultimos_partidos_local}
            ultimosPartidosVisita={mockPartidoDetalleUsuario.ultimos_partidos_visita}
            nombreEquipoLocal={datosPartido.partido.equipoLocal?.nombre || 'Local'}
            nombreEquipoVisita={datosPartido.partido.equipoVisita?.nombre || 'Visitante'}
            loading={isLoadingData}
          />
        );
      case 'cara-a-cara':
        return (
          <CaraACaraTab
            historial={mockPartidoDetalleUsuario.historial}
            nombreEquipoLocal={datosPartido.partido.equipoLocal?.nombre || 'Local'}
            nombreEquipoVisita={datosPartido.partido.equipoVisita?.nombre || 'Visitante'}
            imgEquipoLocal={datosPartido.partido.equipoLocal?.img}
            imgEquipoVisita={datosPartido.partido.equipoVisita?.img}
            loading={isLoadingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
      <BackButton />

      {/* Header del partido - Sin botones de control (solo lectura) */}
      <PartidoHeaderSticky
        partido={datosPartido.partido as PartidoCompleto}
        goles={goles}
        esPlanillero={false} // Modo solo lectura
        isLoading={isLoadingData}
      />

      {/* Si está finalizado, mostrar incidencias y formaciones */}
      {estaFinalizado && (
        <>
          {/* Incidencias y Formaciones */}
          <JugadoresTabsUnified
            mode="view" // Modo solo lectura
            estadoPartido={datosPartido.partido.estado as EstadoPartido}
            equipoLocal={{
              id_equipo: datosPartido.partido.equipoLocal?.id_equipo!,
              nombre: datosPartido.partido.equipoLocal?.nombre!,
              jugadores: datosPartido.plantel_local || []
            }}
            equipoVisita={{
              id_equipo: datosPartido.partido.equipoVisita?.id_equipo!,
              nombre: datosPartido.partido.equipoVisita?.nombre!,
              jugadores: datosPartido.plantel_visita || []
            }}
            incidencias={datosPartido.incidencias || []}
            destacados={datosPartido.jugadores_destacados}
            jugadorDestacado={datosPartido.partido.jugador_destacado}
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

