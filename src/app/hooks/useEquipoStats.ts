import { useMemo } from 'react';
import { EquipoPosicion, IEquipoPosicion } from '@/app/types/posiciones';

type EquipoConLive = (IEquipoPosicion | EquipoPosicion) & {
  en_vivo?: boolean;
  puntos_live?: number;
  goles_favor_live?: number;
  goles_contra_live?: number;
  diferencia_goles_live?: number;
  puntos_finales_live?: number;
  partidos_jugados_live?: number;
  partidos_ganados_live?: number;
  partidos_empatados_live?: number;
  partidos_perdidos_live?: number;
};

export interface EquipoStats {
  ganados: number;
  empatados: number;
  perdidos: number;
  partidosJugados: number;
  golesFavor: number;
  golesContra: number;
  diferenciaGoles: number;
  puntosFinales: number;
  apercibimientos: number;
  puntosDescontados: number;
  isLive: boolean;
}

/**
 * Hook para normalizar estadísticas de un equipo
 * Maneja la compatibilidad entre tipos EquipoPosicion e IEquipoPosicion
 * y prioriza valores live cuando están disponibles
 */
export const useEquipoStats = (equipo: EquipoConLive): EquipoStats => {
  return useMemo(() => {
    // Convertir a any para evitar problemas de tipos con propiedades dinámicas
    const equipoAny = equipo as any;
    
    // Si el equipo está en vivo, priorizar valores live
    // Los valores live pueden ser 0, así que verificamos que la propiedad exista (no undefined)
    const usarLive = equipoAny.en_vivo === true;
    
    // Helper para obtener valor live o oficial
    const getLiveOrOfficial = (liveKey: string, officialKey: string, fallbackKey?: string): number => {
      if (usarLive && liveKey in equipoAny && equipoAny[liveKey] !== undefined) {
        return equipoAny[liveKey];
      }
      if (officialKey in equipoAny && equipoAny[officialKey] !== undefined) {
        return equipoAny[officialKey];
      }
      if (fallbackKey && fallbackKey in equipoAny && equipoAny[fallbackKey] !== undefined) {
        return equipoAny[fallbackKey];
      }
      return 0;
    };
    
    // Obtener valores usando helper
    const ganados = getLiveOrOfficial('partidos_ganados_live', 'partidos_ganados', 'ganados');
    const empatados = getLiveOrOfficial('partidos_empatados_live', 'partidos_empatados', 'empatados');
    const perdidos = getLiveOrOfficial('partidos_perdidos_live', 'partidos_perdidos', 'perdidos');
    const partidosJugados = getLiveOrOfficial('partidos_jugados_live', 'partidos_jugados');
    const golesFavor = getLiveOrOfficial('goles_favor_live', 'goles_favor');
    const golesContra = getLiveOrOfficial('goles_contra_live', 'goles_contra');
    const diferenciaGoles = getLiveOrOfficial('diferencia_goles_live', 'diferencia_goles');
    
    // Puntos finales: live -> puntos_finales -> puntos
    const puntosFinales = (usarLive && 'puntos_finales_live' in equipoAny && equipoAny.puntos_finales_live !== undefined)
      ? equipoAny.puntos_finales_live
      : (equipoAny.puntos_finales !== undefined 
          ? equipoAny.puntos_finales 
          : (equipoAny.puntos !== undefined ? equipoAny.puntos : 0));

    const apercibimientos = equipoAny.apercibimientos ?? 0;
    const puntosDescontados = equipoAny.puntos_descontados ?? 0;

    const isLive = equipoAny.en_vivo === true;

    return {
      ganados,
      empatados,
      perdidos,
      partidosJugados,
      golesFavor,
      golesContra,
      diferenciaGoles,
      puntosFinales,
      apercibimientos,
      puntosDescontados,
      isLive,
    };
  }, [equipo]);
};

