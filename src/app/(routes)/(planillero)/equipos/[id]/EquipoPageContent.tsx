'use client';

import { useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TabEquipo } from '@/app/components/equipo/EquipoTabs';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';
import { useEquipoPorId } from '@/app/hooks/useEquipos';
import { usePlayerStore } from '@/app/stores/playerStore';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EquipoLayout } from '@/app/components/equipo/EquipoLayout';
import { EquipoTabs } from '@/app/components/equipo/EquipoTabs';

// Lazy load de componentes de tabs (usando los mismos que miequipo)
const ResumenContent = dynamic(
  () => import('../../miequipo/components/ResumenContent'),
  { ssr: false }
);

const PlantelContent = dynamic(
  () => import('../../miequipo/components/PlantelContent'),
  { ssr: false }
);

const PartidosContent = dynamic(
  () => import('../../miequipo/components/PartidosContent'),
  { ssr: false }
);

const ParticipacionesContent = dynamic(
  () => import('../../miequipo/components/ParticipacionesContent'),
  { ssr: false }
);

export default function EquipoPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Memoizar y validar el ID de equipo
  const idEquipo = useMemo(() => {
    if (params?.id) {
      const parsed = parseInt(params.id as string);
      return !isNaN(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
  }, [params?.id]);
  
  const { equipos, esCapitanDeEquipo } = usePlayerStore();

  // Obtener el tab desde search params (sin stats para equipos/[id])
  const tabActivo = useMemo(() => {
    if (!searchParams) return 'resumen' as TabEquipo;
    const tabParam = searchParams.get('tab');
    if (tabParam && ['resumen', 'plantel', 'partidos', 'participaciones'].includes(tabParam)) {
      return tabParam as TabEquipo;
    }
    return 'resumen' as TabEquipo;
  }, [searchParams]);
  
  const { data: equipo, isLoading: loadingEquipo } = useEquipoPorId(idEquipo ?? 0, {
    enabled: idEquipo !== null
  });

  // Verificar si el usuario pertenece a este equipo
  const perteneceAlEquipo = useMemo(() => {
    return equipos.some(eq => eq.id_equipo === idEquipo);
  }, [equipos, idEquipo]);
  
  // Early return si no hay ID válido DESPUÉS de todos los hooks
  if (!idEquipo) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Equipo no encontrado</p>
        </div>
      </UserPageWrapper>
    );
  }

  const esCapitan = esCapitanDeEquipo(idEquipo);

  // Handler para ver todos los stats - redirige a estadisticas
  const handleVerTodosStats = (tipo: string) => {
    if (equipo) {
      router.push(`/estadisticas?tipo=${tipo}`);
    }
  };

  // Handler para cambiar de equipo desde el selector
  const handleCambiarEquipo = (nuevoIdEquipo: number) => {
    router.push(`/equipos/${nuevoIdEquipo}`);
  };

  // Obtener id_categoria_edicion del equipo (necesitamos esto para los componentes)
  const idCategoriaEdicion = equipo?.categorias?.[0]?.id_categoria_edicion || undefined;

  if (!equipo && !loadingEquipo) {
    return (
      <UserPageWrapper>
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
          <p className="text-[#737373] text-sm">Equipo no encontrado</p>
        </div>
      </UserPageWrapper>
    );
  }

  // Renderizar el componente correspondiente según el tab
  const renderContent = () => {
    switch (tabActivo) {
      case 'resumen':
        return (
          <ResumenContent 
            idEquipo={idEquipo} 
            idCategoriaEdicion={idCategoriaEdicion || 0} 
            onVerTodosStats={handleVerTodosStats} 
          />
        );
      case 'plantel':
        return (
          <PlantelContent 
            idEquipo={idEquipo} 
            idCategoriaEdicion={idCategoriaEdicion || 0} 
            perteneceAlEquipo={perteneceAlEquipo} 
            esCapitan={esCapitan} 
          />
        );
      case 'partidos':
        return (
          <PartidosContent 
            idEquipo={idEquipo} 
            idCategoriaEdicion={idCategoriaEdicion || 0} 
          />
        );
      case 'participaciones':
        return (
          <ParticipacionesContent 
            idEquipo={idEquipo} 
          />
        );
      default:
        return (
          <ResumenContent 
            idEquipo={idEquipo} 
            idCategoriaEdicion={idCategoriaEdicion || 0} 
            onVerTodosStats={handleVerTodosStats} 
          />
        );
    }
  };

  return (
    <UserPageWrapper>
      {loadingEquipo ? (
        <div className="space-y-6">
          <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--black-800)] animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-[var(--black-800)] rounded animate-pulse w-48" />
                <div className="h-4 bg-[var(--black-800)] rounded animate-pulse w-24" />
              </div>
            </div>
          </div>
          <BaseCardTableSkeleton columns={3} rows={4} hasAvatar={false} />
        </div>
      ) : (
        <EquipoLayout
          idEquipo={idEquipo || 0}
          nombreEquipo={equipo?.nombre || 'Cargando...'}
          imgEquipo={equipo?.img || null}
          perteneceAlEquipo={perteneceAlEquipo}
          esCapitan={esCapitan}
          equiposDelUsuario={equipos}
          onCambiarEquipo={handleCambiarEquipo}
        >
          <div className="w-full space-y-6 pt-6">
            <EquipoTabs
              activeTab={tabActivo}
              idEquipo={idEquipo}
              baseUrl={`/equipos/${idEquipo}`}
            />
            {renderContent()}
          </div>
        </EquipoLayout>
      )}
    </UserPageWrapper>
  );
}

