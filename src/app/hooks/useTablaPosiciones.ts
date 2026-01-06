import { useMemo } from 'react';
import { EquipoPosicion, IEquipoPosicion, ITablaPosicion } from '@/app/types/posiciones';
import { FormatoPosicion } from '@/app/types/zonas';
import { TablaPosicionesVariant, TablaPosicionesColumnMode } from '@/app/components/posiciones/TablaPosiciones';

interface UseTablaPosicionesProps {
  variant: TablaPosicionesVariant;
  posiciones?: EquipoPosicion[] | IEquipoPosicion[];
  tablaActual?: ITablaPosicion;
  formatosPosicion?: FormatoPosicion[];
  isLoading?: boolean;
  loading?: boolean;
}

interface UseTablaPosicionesReturn {
  columnMode: TablaPosicionesColumnMode;
  posicionesAMostrar: (EquipoPosicion | IEquipoPosicion)[];
  formatosPosicionFinal: FormatoPosicion[];
  isLoading: boolean;
  isEmpty: boolean;
}

/**
 * Hook para manejar lógica de tabla de posiciones
 * - Determina modo de columnas (compact/full)
 * - Resuelve posiciones a mostrar según variant
 * - Resuelve formatos de posición finales
 * - Centraliza estados de loading y empty
 */
export const useTablaPosiciones = ({
  variant,
  posiciones = [],
  tablaActual,
  formatosPosicion = [],
  isLoading = false,
  loading = false,
}: UseTablaPosicionesProps): UseTablaPosicionesReturn => {
  // Determinar modo de columnas
  const columnMode: TablaPosicionesColumnMode = useMemo(() => {
    return variant === 'home' ? 'compact' : 'full';
  }, [variant]);

  // Obtener posiciones a mostrar según el modo
  const posicionesAMostrar = useMemo(() => {
    if (variant === 'home' && tablaActual) {
      return tablaActual.posiciones;
    }
    return posiciones;
  }, [variant, tablaActual, posiciones]);

  // Obtener formatos de posición a usar
  const formatosPosicionFinal = useMemo(() => {
    if (variant === 'home' && tablaActual?.formatosPosicion) {
      return tablaActual.formatosPosicion;
    }
    return formatosPosicion;
  }, [variant, tablaActual, formatosPosicion]);

  // Estados centralizados
  const isLoadingState = isLoading || loading;
  const isEmpty = posicionesAMostrar.length === 0;

  return {
    columnMode,
    posicionesAMostrar,
    formatosPosicionFinal,
    isLoading: isLoadingState,
    isEmpty,
  };
};

