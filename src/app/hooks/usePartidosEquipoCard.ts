import { useMemo, useState } from 'react';
import { PartidoEquipo } from '@/app/types/partido';
import { useUltimosYProximosPartidosJugador } from './usePartidos';
import { useAuthStore } from '@/app/stores/authStore';

type TabType = 'ultimos' | 'proximos';

interface UsePartidosEquipoCardProps {
  partidos?: PartidoEquipo[];
  misEquiposIds?: number[];
  loading?: boolean;
}

interface UsePartidosEquipoCardReturn {
  partidos: PartidoEquipo[];
  partidosPasados: PartidoEquipo[];
  partidosFuturos: PartidoEquipo[];
  partidosActivos: PartidoEquipo[];
  misEquiposIds: number[];
  loading: boolean;
  error: Error | null;
  activeTab: TabType;
  slideDirection: 'left' | 'right';
  handleTabChange: (tab: TabType) => void;
}

/**
 * Hook que maneja toda la lógica del componente PartidosEquipoCard
 * - Obtiene partidos del jugador
 * - Procesa y separa partidos en pasados/futuros
 * - Extrae IDs de equipos
 * - Maneja estados de loading y error
 */
export const usePartidosEquipoCard = ({
  partidos: partidosProp,
  misEquiposIds: misEquiposIdsProp,
  loading: loadingProp,
}: UsePartidosEquipoCardProps): UsePartidosEquipoCardReturn => {
  // Obtener equipos del store
  const equipos = useAuthStore((state) => state.equipos);

  // Hook para obtener partidos del jugador (si no se pasan como prop)
  const {
    data: partidosData,
    isLoading: isLoadingPartidos,
    isFetching: isFetchingPartidos,
    error: errorPartidos,
  } = useUltimosYProximosPartidosJugador({
    enabled: !partidosProp, // Solo hacer fetch si no se pasan partidos como prop
  });

  // Procesar partidos: usar prop o datos del hook
  const partidos = useMemo(() => {
    if (partidosProp) return partidosProp;

    if (!partidosData) return [];

    // Convertir la respuesta { ultimo, proximo } en un array
    const partidosArray: PartidoEquipo[] = [];
    if (partidosData.ultimo) partidosArray.push(partidosData.ultimo);
    if (partidosData.proximo) partidosArray.push(partidosData.proximo);

    return partidosArray;
  }, [partidosProp, partidosData]);

  // Extraer IDs de equipos: usar prop, store o extraer de partidos
  const misEquiposIds = useMemo(() => {
    // 1. Si se pasa como prop, usar eso
    if (misEquiposIdsProp && misEquiposIdsProp.length > 0) {
      return misEquiposIdsProp;
    }

    // 2. Si hay equipos en el store, usar esos IDs
    if (equipos && equipos.length > 0) {
      return equipos.map((e) => e.id);
    }

    // 3. Extraer IDs únicos de los partidos
    const ids = new Set<number>();
    partidos.forEach((p) => {
      if (p.id_equipolocal) ids.add(p.id_equipolocal);
      if (p.id_equipovisita) ids.add(p.id_equipovisita);
    });

    return Array.from(ids);
  }, [misEquiposIdsProp, equipos, partidos]);

  // Separar partidos en últimos y próximos
  const partidosPasados = useMemo(
    () => partidos?.filter((p) => ['F', 'T', 'S'].includes(p.estado)) || [],
    [partidos]
  );

  const partidosFuturos = useMemo(
    () => partidos?.filter((p) => ['P', 'C1', 'C2', 'E', 'T'].includes(p.estado)) || [],
    [partidos]
  );

  // Estado de loading: usar prop, o estado del hook considerando carga inicial
  // Si no se ha recibido data (undefined) significa que aún no terminó la carga inicial
  // También considerar isFetching cuando no hay datos aún (pero no si ya hay datos - refetch en background)
  // Solo mostrar como "no hay datos" cuando data ya existe pero está vacío
  const hasDataLoaded = partidosData !== undefined;
  const loading = loadingProp ?? (isLoadingPartidos || (!hasDataLoaded && (isFetchingPartidos || !partidosProp)));

  // Estado del tab activo y dirección de slide
  const [activeTab, setActiveTab] = useState<TabType>('proximos');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Partidos activos según el tab seleccionado
  const partidosActivos = useMemo(
    () => (activeTab === 'ultimos' ? partidosPasados : partidosFuturos),
    [activeTab, partidosPasados, partidosFuturos]
  );

  // Manejar cambio de tab con dirección de animación
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;

    // Determinar dirección del slide
    setSlideDirection(tab === 'ultimos' ? 'left' : 'right');
    setActiveTab(tab);
  };

  return {
    partidos,
    partidosPasados,
    partidosFuturos,
    partidosActivos,
    misEquiposIds,
    loading,
    error: errorPartidos,
    activeTab,
    slideDirection,
    handleTabChange,
  };
};

