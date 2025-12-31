'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { BaseCardTableSkeleton } from '@/app/components/skeletons/BaseCardTableSkeleton';

// Lazy load de componentes de estadísticas
const PosicionesContent = dynamic(
  () => import('./components/PosicionesContent'),
  {
    loading: () => <BaseCardTableSkeleton columns={5} rows={6} hasAvatar={false} />,
    ssr: false
  }
);

const JugadoresEstadisticasContent = dynamic(
  () => import('./components/JugadoresEstadisticasContent'),
  {
    loading: () => <BaseCardTableSkeleton columns={3} rows={4} hasAvatar={true} />,
    ssr: false
  }
);

function EstadisticasPageContent() {
  const searchParams = useSearchParams();

  // Obtener el tipo de estadística desde search params
  const tipoEstadistica = useMemo(() => {
    const tipoParam = searchParams.get('tipo');
    if (tipoParam && ['posiciones', 'goleadores', 'asistencias', 'amarillas', 'rojas', 'mvps'].includes(tipoParam)) {
      return tipoParam as EstadisticaTab;
    }
    // Si no hay tipo, default a posiciones
    return 'posiciones' as EstadisticaTab;
  }, [searchParams]);

  // Renderizar el componente correspondiente según el tipo
  switch (tipoEstadistica) {
    case 'posiciones':
      return <PosicionesContent />;
    case 'goleadores':
      return <JugadoresEstadisticasContent tipo="goleadores" />;
    case 'asistencias':
      return <JugadoresEstadisticasContent tipo="asistencias" />;
    case 'amarillas':
      return <JugadoresEstadisticasContent tipo="amarillas" />;
    case 'rojas':
      return <JugadoresEstadisticasContent tipo="rojas" />;
    case 'mvps':
      return <JugadoresEstadisticasContent tipo="mvps" />;
    default:
      return <PosicionesContent />;
  }
}

export default function EstadisticasPage() {
  return (
    <Suspense fallback={<BaseCardTableSkeleton columns={5} rows={6} hasAvatar={false} />}>
      <EstadisticasPageContent />
    </Suspense>
  );
}
