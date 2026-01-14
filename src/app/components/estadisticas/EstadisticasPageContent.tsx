'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';

// Lazy load de componentes de estadísticas
const PosicionesContent = dynamic(
  () => import('./PosicionesContent'),
  {
    loading: () => <div className="animate-pulse space-y-4"><div className="h-64 bg-[#262626] rounded" /></div>,
    ssr: false
  }
);

const JugadoresEstadisticasContent = dynamic(
  () => import('./JugadoresEstadisticasContent'),
  {
    loading: () => <div className="animate-pulse space-y-4"><div className="h-64 bg-[#262626] rounded" /></div>,
    ssr: false
  }
);

export default function EstadisticasPageContent() {
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

