'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EquipoLayout } from '@/app/components/equipo/EquipoLayout';
import { EquipoTabs, TabEquipo } from '@/app/components/equipo/EquipoTabs';
import { ResumenTab } from '@/app/components/equipo/resumen/ResumenTab';
import { PlantelTab } from '@/app/components/equipo/plantel/PlantelTab';
import { StatsTab } from '@/app/components/equipo/stats/StatsTab';
import { PartidosTab } from '@/app/components/equipo/partidos/PartidosTab';
import { ParticipacionesTab } from '@/app/components/equipo/participaciones/ParticipacionesTab';
import { usePlayerStore } from '@/app/stores/playerStore';
import { mockEquipoResumen } from '@/app/mocks/equipoResumen.mock';
import { mockPlantelEquipo } from '@/app/mocks/plantelEquipo.mock';
import { mockEquipoStats } from '@/app/mocks/equipoStats.mock';
import { mockEquipoPartidos } from '@/app/mocks/equipoPartidos.mock';
import { mockParticipacionesEquipo } from '@/app/mocks/participacionesEquipo.mock';

// Mock data del equipo
const mockEquipo = {
  id_equipo: 1,
  nombre: 'Los Tigres FC',
  img: '/img/default-team.png',
  descripcion: 'Equipo fundado en 2020, con gran trayectoria en la Copa Relámpago.',
  categoria_edicion: {
    id_categoria_edicion: 1,
    nombre: 'Primera A - Clausura 2025'
  },
  id_edicion: 10
};

export default function EquipoPage() {
  const params = useParams();
  const router = useRouter();
  const idEquipo = params?.id ? parseInt(params.id as string) : null;

  // Player store
  const { equipos, esCapitanDeEquipo } = usePlayerStore();

  // Estado local
  const [tabActiva, setTabActiva] = useState<TabEquipo>('resumen');
  const [isLoading] = useState(false);

  // TODO: Fetch del equipo desde el backend
  // const { data: equipoData, isLoading } = useEquipoDetalle(idEquipo);

  if (!idEquipo) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Equipo no encontrado</p>
        </div>
      </UserPageWrapper>
    );
  }

  // Verificar si el usuario pertenece a este equipo
  const perteneceAlEquipo = equipos.some(eq => eq.id_equipo === idEquipo);
  const esCapitan = esCapitanDeEquipo(idEquipo);

  // Handler para cambiar de equipo desde el selector
  const handleCambiarEquipo = (nuevoIdEquipo: number) => {
    router.push(`/equipos/${nuevoIdEquipo}`);
  };

  // Handler para ver todos los stats
  const handleVerTodosStats = (tipo: string) => {
    // TODO: Navegar a la página de stats con el filtro correspondiente
    router.push(`/equipos/${idEquipo}/stats?tipo=${tipo}`);
  };

  // TODO: Reemplazar con hook real para obtener el resumen del equipo
  // const { data: resumen, isLoading: loadingResumen } = useEquipoResumen(idEquipo);
  const resumen = mockEquipoResumen; // Usar mock por ahora
  const loadingResumen = isLoading;

  // TODO: Reemplazar con hook real para obtener el plantel del equipo
  // const { data: plantel, isLoading: loadingPlantel } = useEquipoPlantel(idEquipo);
  const plantel = mockPlantelEquipo; // Usar mock por ahora
  const loadingPlantel = isLoading;

  // TODO: Reemplazar con hook real para obtener las stats del equipo
  // const { data: stats, isLoading: loadingStats } = useEquipoStats(idEquipo);
  const stats = mockEquipoStats; // Usar mock por ahora
  const loadingStats = isLoading;

  // TODO: Reemplazar con hook real para obtener los partidos del equipo
  // const { data: partidos, isLoading: loadingPartidos } = useEquipoPartidos(idEquipo);
  const partidos = mockEquipoPartidos; // Usar mock por ahora
  const loadingPartidos = isLoading;

  // TODO: Reemplazar con hook real para obtener las participaciones del equipo
  // const { data: participaciones, isLoading: loadingParticipaciones } = useEquipoParticipaciones(idEquipo);
  const participaciones = mockParticipacionesEquipo; // Usar mock por ahora
  const loadingParticipaciones = isLoading;

  // Contenido según la tab activa
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'resumen':
        return (
          <ResumenTab
            idEquipo={idEquipo}
            resumen={resumen}
            loading={loadingResumen}
            onVerTodosStats={handleVerTodosStats}
          />
        );
      case 'plantel':
        return (
          <PlantelTab
            idEquipo={idEquipo}
            idCategoriaEdicion={mockEquipo.categoria_edicion.id_categoria_edicion}
            idEdicion={mockEquipo.id_edicion}
            plantel={plantel}
            perteneceAlEquipo={perteneceAlEquipo}
            esCapitan={esCapitan}
            loading={loadingPlantel}
          />
        );
      case 'stats':
        return (
          <StatsTab
            idEquipo={idEquipo}
            posiciones={stats.posiciones}
            zonasPlayoff={stats.zonasPlayoff}
            goleadores={stats.goleadores}
            asistencias={stats.asistencias}
            amarillas={stats.amarillas}
            rojas={stats.rojas}
            mvps={stats.mvps}
            loading={loadingStats}
          />
        );
      case 'partidos':
        return (
          <PartidosTab
            idEquipo={idEquipo}
            partidos={partidos}
            loading={loadingPartidos}
          />
        );
      case 'participaciones':
        return (
          <ParticipacionesTab
            idEquipo={idEquipo}
            participaciones={participaciones}
            loading={loadingParticipaciones}
          />
        );
      default:
        return null;
    }
  };

  return (
    <UserPageWrapper>
      <EquipoLayout
        idEquipo={idEquipo}
        nombreEquipo={mockEquipo.nombre}
        imgEquipo={mockEquipo.img}
        perteneceAlEquipo={perteneceAlEquipo}
        esCapitan={esCapitan}
        equiposDelUsuario={equipos}
        onCambiarEquipo={handleCambiarEquipo}
        loading={isLoading}
      >
        <EquipoTabs
          tabActiva={tabActiva}
          onTabChange={setTabActiva}
          loading={isLoading}
        />
        {renderTabContent()}
      </EquipoLayout>
    </UserPageWrapper>
  );
}

