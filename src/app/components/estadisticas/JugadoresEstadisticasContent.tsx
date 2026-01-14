'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { TablaJugadoresEstadisticas } from '@/app/components/estadisticas/TablaJugadoresEstadisticas';
import {
  useGoleadoresPorCategoriaEdicion,
  useAsistenciasPorCategoriaEdicion,
  useAmarillasPorCategoriaEdicion,
  useRojasPorCategoriaEdicion,
  useMVPsPorCategoriaEdicion
} from '@/app/hooks/useEstadisticas';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';
import { TipoEstadistica } from '@/app/types/estadisticas';

interface JugadoresEstadisticasContentProps {
  tipo: TipoEstadistica;
}

function JugadoresEstadisticasContentInner({ tipo }: JugadoresEstadisticasContentProps) {
  const searchParams = useSearchParams();
  const { categoriaSeleccionada } = useEdicionCategoria();

  // Memoizar el ID de categoría de forma más estable para evitar cambios innecesarios
  const categoriaId = useMemo(() => {
    const categoriaParam = searchParams.get('categoria');
    if (categoriaParam) {
      const parsed = parseInt(categoriaParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    // Solo usar categoriaSeleccionada si tiene un ID válido
    if (categoriaSeleccionada?.id && categoriaSeleccionada.id > 0) {
      return categoriaSeleccionada.id;
    }
    return null;
  }, [searchParams, categoriaSeleccionada?.id]); // Solo dependencia del ID, no del objeto completo

  const { data: goleadores, isLoading: loadingGoleadores, error: errorGoleadores } = 
    useGoleadoresPorCategoriaEdicion(categoriaId, { enabled: tipo === 'goleadores' && !!categoriaId });
  
  const { data: asistencias, isLoading: loadingAsistencias, error: errorAsistencias } = 
    useAsistenciasPorCategoriaEdicion(categoriaId, { enabled: tipo === 'asistencias' && !!categoriaId });
  
  const { data: amarillas, isLoading: loadingAmarillas, error: errorAmarillas } = 
    useAmarillasPorCategoriaEdicion(categoriaId, { enabled: tipo === 'amarillas' && !!categoriaId });
  
  const { data: rojas, isLoading: loadingRojas, error: errorRojas } = 
    useRojasPorCategoriaEdicion(categoriaId, { enabled: tipo === 'rojas' && !!categoriaId });
  
  const { data: mvps, isLoading: loadingMVPs, error: errorMVPs } = 
    useMVPsPorCategoriaEdicion(categoriaId, { enabled: tipo === 'mvps' && !!categoriaId });

  const getData = () => {
    switch (tipo) {
      case 'goleadores':
        return { data: goleadores, loading: loadingGoleadores, error: errorGoleadores };
      case 'asistencias':
        return { data: asistencias, loading: loadingAsistencias, error: errorAsistencias };
      case 'amarillas':
        return { data: amarillas, loading: loadingAmarillas, error: errorAmarillas };
      case 'rojas':
        return { data: rojas, loading: loadingRojas, error: errorRojas };
      case 'mvps':
        return { data: mvps, loading: loadingMVPs, error: errorMVPs };
      default:
        return { data: [], loading: false, error: null };
    }
  };

  const { data, loading, error } = getData();

  if (error) {
    return (
      <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-8">
        <p className="text-red-400 text-center text-sm">
          {error.message || `Error al cargar ${tipo}`}
        </p>
      </div>
    );
  }

  return (
    <TablaJugadoresEstadisticas
      jugadores={data || []}
      tipo={tipo}
      isLoading={loading}
    />
  );
}

export default function JugadoresEstadisticasContent({ tipo }: JugadoresEstadisticasContentProps) {
  return <JugadoresEstadisticasContentInner tipo={tipo} />;
}

