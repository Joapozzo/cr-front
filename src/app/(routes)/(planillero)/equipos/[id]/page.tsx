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
import { useEquipoResumen } from '@/app/hooks/useEquipoResumen';
import { useEquipoPlantel } from '@/app/hooks/useEquipoPlantel';
import { useEquipoParticipaciones } from '@/app/hooks/useEquipoParticipaciones';
import { useEquipoPorId } from '@/app/hooks/useEquipos';


export default function EquipoPage() {
  const params = useParams();
  const router = useRouter();
  const idEquipo = params?.id ? parseInt(params.id as string) : null;

  // Player store
  const { equipos, esCapitanDeEquipo } = usePlayerStore();

  // Estado local
  const [tabActiva, setTabActiva] = useState<TabEquipo>('resumen');

  // Obtener datos del equipo (deshabilitado si no hay idEquipo)
  const { data: equipo, isLoading: loadingEquipo } = useEquipoPorId(idEquipo || 0, {
    enabled: !!idEquipo
  });

  // Obtener datos relacionados (deshabilitados si no hay idEquipo)
  const { data: resumen, isLoading: loadingResumen } = useEquipoResumen(
    idEquipo || null,
    undefined, // id_categoria_edicion (opcional, se usará la última activa)
    { enabled: !!idEquipo }
  );
  
  const { data: plantel, isLoading: loadingPlantel } = useEquipoPlantel(
    idEquipo || null,
    undefined, // id_categoria_edicion (opcional, se usará la última activa)
    { enabled: !!idEquipo }
  );

  const { data: participaciones, isLoading: loadingParticipaciones } = useEquipoParticipaciones(
    idEquipo || null,
    { enabled: !!idEquipo }
  );

  // Early return si no hay idEquipo (después de todos los hooks)
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

  // Contenido según la tab activa
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'resumen':
        return (
          <ResumenTab
            idEquipo={idEquipo}
            resumen={resumen || null}
            loading={loadingResumen}
            onVerTodosStats={handleVerTodosStats}
          />
        );
      case 'plantel':
        return (
          <PlantelTab
            idEquipo={idEquipo}
            plantel={plantel || null}
            perteneceAlEquipo={perteneceAlEquipo}
            esCapitan={esCapitan}
            loading={loadingPlantel}
          />
        );
      case 'stats':
        return (
          <StatsTab
            idEquipo={idEquipo}
          />
        );
      case 'partidos':
        return (
          <PartidosTab
            idEquipo={idEquipo}
          />
        );
      case 'participaciones':
        return (
          <ParticipacionesTab
            idEquipo={idEquipo}
            participaciones={participaciones || []}
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
        nombreEquipo={equipo?.nombre || 'Cargando...'}
        imgEquipo={equipo?.img || null}
        perteneceAlEquipo={perteneceAlEquipo}
        esCapitan={esCapitan}
        equiposDelUsuario={equipos}
        onCambiarEquipo={handleCambiarEquipo}
        loading={loadingEquipo}
      >
        <EquipoTabs
          tabActiva={tabActiva}
          onTabChange={setTabActiva}
          loading={loadingEquipo}
        />
        {renderTabContent()}
      </EquipoLayout>
    </UserPageWrapper>
  );
}

