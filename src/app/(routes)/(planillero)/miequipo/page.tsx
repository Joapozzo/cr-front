'use client';

import { useState, useMemo } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EquipoTabs, TabEquipo } from '@/app/components/equipo/EquipoTabs';
import { ResumenTab } from '@/app/components/equipo/resumen/ResumenTab';
import { PlantelTab } from '@/app/components/equipo/plantel/PlantelTab';
import { StatsTab } from '@/app/components/equipo/stats/StatsTab';
import { PartidosTab } from '@/app/components/equipo/partidos/PartidosTab';
import { ParticipacionesTab } from '@/app/components/equipo/participaciones/ParticipacionesTab';
import { useEquipoResumen } from '@/app/hooks/useEquipoResumen';
import { useEquiposUsuario } from '@/app/hooks/useEquiposUsuario';
import { useEquipoPlantel } from '@/app/hooks/useEquipoPlantel';
import { useEquipoParticipaciones } from '@/app/hooks/useEquipoParticipaciones';
import { useEquipoSeleccionado } from './EquipoContext';
import { useRouter } from 'next/navigation';

export default function MiEquipoPage() {
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState<TabEquipo>('resumen');
  const { equipoSeleccionado } = useEquipoSeleccionado();

  // Obtener equipos del usuario con información completa
  const { data: equiposUsuario, isLoading: loadingEquipos } = useEquiposUsuario();

  // Obtener resumen del equipo seleccionado
  const { data: resumen, isLoading: loadingResumen } = useEquipoResumen(
    equipoSeleccionado?.id_equipo || null,
    equipoSeleccionado?.id_categoria_edicion || null
  );

  // Obtener plantel del equipo
  const { data: plantel, isLoading: loadingPlantel } = useEquipoPlantel(
    equipoSeleccionado?.id_equipo || null,
    equipoSeleccionado?.id_categoria_edicion || null
  );

  // Los partidos ahora se obtienen dentro del componente PartidosTab usando usePartidosUsuarioPorEquipo
  // Las estadísticas se obtienen dentro del componente StatsTab

  // Obtener participaciones del equipo
  const { data: participaciones, isLoading: loadingParticipaciones } = useEquipoParticipaciones(
    equipoSeleccionado?.id_equipo || null
  );

  // Verificar si el usuario pertenece al equipo
  const perteneceAlEquipo = useMemo(() => {
    if (!equipoSeleccionado) return false;
    return equiposUsuario?.some(eq => eq.id_equipo === equipoSeleccionado.id_equipo) || false;
  }, [equipoSeleccionado, equiposUsuario]);

  const esCapitan = equipoSeleccionado?.es_capitan || false;

  // Handler para ver todos los stats
  const handleVerTodosStats = (tipo: string) => {
    if (equipoSeleccionado) {
      router.push(`/equipos/${equipoSeleccionado.id_equipo}/stats?tipo=${tipo}`);
    }
  };

  if (loadingEquipos) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Cargando equipos...</p>
        </div>
      </UserPageWrapper>
    );
  }

  if (!equiposUsuario || equiposUsuario.length === 0) {
    return (
      <UserPageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center w-full max-w-md">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#737373]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-white text-base font-medium">Todavía no tienes ningún equipo asignado</p>
                <p className="text-[#737373] text-sm">Cuando te asignen a un equipo, aparecerá aquí</p>
              </div>
            </div>
          </div>
        </div>
      </UserPageWrapper>
    );
  }

  if (!equipoSeleccionado) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Selecciona un equipo</p>
        </div>
      </UserPageWrapper>
    );
  }

  const isLoading = loadingResumen;

  // Contenido según la tab activa
  const renderTabContent = () => {
    switch (tabActiva) {
      case 'resumen':
        return (
          <ResumenTab
            idEquipo={equipoSeleccionado.id_equipo}
            resumen={resumen || null}
            loading={loadingResumen}
            onVerTodosStats={handleVerTodosStats}
          />
        );
      case 'plantel':
        return (
          <PlantelTab
            idEquipo={equipoSeleccionado.id_equipo}
            plantel={plantel || null}
            perteneceAlEquipo={perteneceAlEquipo}
            esCapitan={esCapitan}
            loading={loadingPlantel}
          />
        );
      case 'stats':
        return (
          <StatsTab
            idEquipo={equipoSeleccionado.id_equipo}
            idCategoriaEdicion={equipoSeleccionado.id_categoria_edicion}
          />
        );
      case 'partidos':
        return (
          <PartidosTab
            idEquipo={equipoSeleccionado.id_equipo}
            idCategoriaEdicion={equipoSeleccionado.id_categoria_edicion}
          />
        );
      case 'participaciones':
        return (
          <ParticipacionesTab
            idEquipo={equipoSeleccionado.id_equipo}
            participaciones={participaciones || []}
            loading={loadingParticipaciones}
          />
        );
      default:
        return null;
    }
  };


  return (
    <div className="space-y-6">
      {/* Tabs */}
      <EquipoTabs
        tabActiva={tabActiva}
        onTabChange={setTabActiva}
        loading={isLoading}
      />
      {renderTabContent()}
    </div>
  );
}
