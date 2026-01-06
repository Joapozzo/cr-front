import { useState, useEffect, useMemo } from 'react';
import { Zona } from '@/app/types/zonas';
import { useZonaStore } from '@/app/stores/zonaStore';
import { TablaPosicionesVariant } from '@/app/components/posiciones/TablaPosiciones';

interface UsePlayoffsProps {
  variant: TablaPosicionesVariant;
  zonasPlayoff: Zona[];
  posicionesLength: number;
  showPlayoffTabs: boolean;
  showZonaSelector: boolean;
}

interface UsePlayoffsReturn {
  zonasTodosContraTodos: Zona[];
  zonasPlayoffFiltradas: Zona[];
  etapasPlayoff: Array<{ id_etapa: number; nombre: string }>;
  etapaPlayoffActiva: number;
  setEtapaPlayoffActiva: (etapa: number) => void;
  zonasPlayoffEtapaActiva: Zona[];
  showTabs: boolean;
  mostrarSelectorZonas: boolean;
  mostrarSelectorEtapas: boolean;
  activeTab: 'posiciones' | 'playoff';
  setActiveTab: (tab: 'posiciones' | 'playoff') => void;
}

/**
 * Hook para manejar lógica de playoffs y zonas
 * - Filtra zonas todos-contra-todos y de playoff
 * - Obtiene etapas únicas
 * - Maneja etapa activa y zonas filtradas
 * - Determina visibilidad de tabs y selectores
 */
export const usePlayoffs = ({
  variant,
  zonasPlayoff,
  posicionesLength,
  showPlayoffTabs,
  showZonaSelector,
}: UsePlayoffsProps): UsePlayoffsReturn => {
  const [activeTab, setActiveTab] = useState<'posiciones' | 'playoff'>('posiciones');
  const [etapaPlayoffActiva, setEtapaPlayoffActiva] = useState<number>(0);
  const { zonaSeleccionada, setZonaSeleccionada } = useZonaStore();

  // Separar zonas de todos contra todos y playoff (solo para modo completa)
  const zonasTodosContraTodos = useMemo(() => {
    if (variant !== 'completa') return [];
    return zonasPlayoff.filter(z => 
      z.tipoZona?.nombre === 'todos-contra-todos' || 
      z.tipoZona?.nombre === 'todos-contra-todos-ida-vuelta'
    );
  }, [zonasPlayoff, variant]);

  const zonasPlayoffFiltradas = useMemo(() => {
    if (variant !== 'completa') return [];
    return zonasPlayoff.filter(z => 
      z.tipoZona?.nombre === 'eliminacion-directa' || 
      z.tipoZona?.nombre === 'eliminacion-directa-ida-vuelta'
    );
  }, [zonasPlayoff, variant]);

  // Obtener etapas únicas de playoffs
  const etapasPlayoff = useMemo(() => {
    return Array.from(
      new Map(zonasPlayoffFiltradas.map(z => [z.etapa.id_etapa, z.etapa])).values()
    );
  }, [zonasPlayoffFiltradas]);

  // Establecer etapa de playoff activa inicial
  useEffect(() => {
    if (etapasPlayoff.length > 0 && etapaPlayoffActiva === 0) {
      setEtapaPlayoffActiva(etapasPlayoff[0].id_etapa);
    }
  }, [etapasPlayoff, etapaPlayoffActiva]);

  // Filtrar zonas de playoff por etapa activa
  const zonasPlayoffEtapaActiva = useMemo(() => {
    return zonasPlayoffFiltradas.filter(z => z.etapa.id_etapa === etapaPlayoffActiva);
  }, [zonasPlayoffFiltradas, etapaPlayoffActiva]);

  // Inicializar zona seleccionada
  useEffect(() => {
    if (zonasTodosContraTodos.length > 0 && zonaSeleccionada === 0) {
      setZonaSeleccionada(zonasTodosContraTodos[0].id_zona);
    }
  }, [zonasTodosContraTodos, zonaSeleccionada, setZonaSeleccionada]);

  // Determinar vista inicial
  useEffect(() => {
    if (variant === 'completa') {
      if (posicionesLength > 0 || zonasTodosContraTodos.length > 0) {
        setActiveTab('posiciones');
      } else if (zonasPlayoffFiltradas.length > 0) {
        setActiveTab('playoff');
      }
    }
  }, [variant, posicionesLength, zonasTodosContraTodos.length, zonasPlayoffFiltradas.length]);

  // Determinar si mostrar tabs (solo modo completa)
  const showTabs = variant === 'completa' && showPlayoffTabs && 
    (zonasPlayoffFiltradas.length > 0) && 
    (posicionesLength > 0 || zonasTodosContraTodos.length > 0);

  // Determinar si mostrar selector de zonas
  const mostrarSelectorZonas = variant === 'completa' && 
    showZonaSelector && 
    activeTab === 'posiciones' && 
    zonasTodosContraTodos.length > 1;

  // Determinar si mostrar selector de etapas
  const mostrarSelectorEtapas = variant === 'completa' && 
    activeTab === 'playoff' && 
    etapasPlayoff.length > 1;

  return {
    zonasTodosContraTodos,
    zonasPlayoffFiltradas,
    etapasPlayoff,
    etapaPlayoffActiva,
    setEtapaPlayoffActiva,
    zonasPlayoffEtapaActiva,
    showTabs,
    mostrarSelectorZonas,
    mostrarSelectorEtapas,
    activeTab,
    setActiveTab,
  };
};

