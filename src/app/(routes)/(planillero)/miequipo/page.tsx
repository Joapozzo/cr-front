'use client';

import { useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TabEquipo } from '@/app/components/equipo/EquipoTabs';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';
import { useEquipoSeleccionado } from './EquipoContext';
import { useRouter } from 'next/navigation';
import { useEquiposUsuario } from '@/app/hooks/useEquiposUsuario';

// Lazy load de componentes de tabs
const ResumenContent = dynamic(
  () => import('./components/ResumenContent'),
  { ssr: false }
);

const PlantelContent = dynamic(
  () => import('./components/PlantelContent'),
  { ssr: false }
);

const PartidosContent = dynamic(
  () => import('./components/PartidosContent'),
  { ssr: false }
);

const ParticipacionesContent = dynamic(
  () => import('./components/ParticipacionesContent'),
  { ssr: false }
);

function MiEquipoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { equipoSeleccionado } = useEquipoSeleccionado();
  const { data: equiposUsuario } = useEquiposUsuario();

  // Obtener el tab desde search params
  const tabActivo = useMemo(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['resumen', 'plantel', 'stats', 'partidos', 'participaciones'].includes(tabParam)) {
      return tabParam as TabEquipo;
    }
    return 'resumen' as TabEquipo;
  }, [searchParams]);

  // Verificar si el usuario pertenece al equipo
  const perteneceAlEquipo = useMemo(() => {
    if (!equipoSeleccionado) return false;
    return equiposUsuario?.some(eq => eq.id_equipo === equipoSeleccionado.id_equipo) || false;
  }, [equipoSeleccionado, equiposUsuario]);

  const esCapitan = equipoSeleccionado?.es_capitan || false;

  // Si el tab es 'stats', redirigir a estadisticas con los parámetros correctos
  useEffect(() => {
    if (tabActivo === 'stats' && equipoSeleccionado) {
      const params = new URLSearchParams();
      params.set('categoria', equipoSeleccionado.id_categoria_edicion.toString());
      router.replace(`/estadisticas?${params.toString()}`);
    }
  }, [tabActivo, equipoSeleccionado, router]);

  // Handler para ver todos los stats - redirige a estadisticas
  const handleVerTodosStats = (tipo: string) => {
    if (equipoSeleccionado) {
      const params = new URLSearchParams();
      params.set('categoria', equipoSeleccionado.id_categoria_edicion.toString());
      params.set('tipo', tipo);
      router.push(`/estadisticas?${params.toString()}`);
    }
  };

  // Early returns DESPUÉS de todos los hooks
  if (tabActivo === 'stats' && equipoSeleccionado) {
    return null; // Redirigiendo...
  }

  if (!equipoSeleccionado) {
    return (
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
        <p className="text-[#737373] text-sm">Selecciona un equipo</p>
      </div>
    );
  }

  // Renderizar el componente correspondiente según el tab
  switch (tabActivo) {
    case 'resumen':
      return <ResumenContent idEquipo={equipoSeleccionado.id_equipo} idCategoriaEdicion={equipoSeleccionado.id_categoria_edicion} onVerTodosStats={handleVerTodosStats} />;
    case 'plantel':
      return <PlantelContent idEquipo={equipoSeleccionado.id_equipo} idCategoriaEdicion={equipoSeleccionado.id_categoria_edicion} perteneceAlEquipo={perteneceAlEquipo} esCapitan={esCapitan} />;
    case 'partidos':
      return <PartidosContent idEquipo={equipoSeleccionado.id_equipo} idCategoriaEdicion={equipoSeleccionado.id_categoria_edicion} />;
    case 'participaciones':
      return <ParticipacionesContent idEquipo={equipoSeleccionado.id_equipo} />;
    default:
      return <ResumenContent idEquipo={equipoSeleccionado.id_equipo} idCategoriaEdicion={equipoSeleccionado.id_categoria_edicion} onVerTodosStats={handleVerTodosStats} />;
  }
}

export default function MiEquipoPage() {
  return (
    <Suspense fallback={<BaseCardTableSkeleton columns={3} rows={4} hasAvatar={false} />}>
      <MiEquipoPageContent />
    </Suspense>
  );
}
