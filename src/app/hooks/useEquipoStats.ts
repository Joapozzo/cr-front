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
    // Helper para obtener ganados (compatible con ambos tipos)
    const ganados = equipo.partidos_ganados_live ?? 
      (('partidos_ganados' in equipo) ? equipo.partidos_ganados : 
       (('ganados' in equipo) ? (equipo as EquipoPosicion).ganados : 0));
    
    const empatados = equipo.partidos_empatados_live ?? 
      (('partidos_empatados' in equipo) ? equipo.partidos_empatados : 
       (('empatados' in equipo) ? (equipo as EquipoPosicion).empatados : 0));
    
    const perdidos = equipo.partidos_perdidos_live ?? 
      (('partidos_perdidos' in equipo) ? equipo.partidos_perdidos : 
       (('perdidos' in equipo) ? (equipo as EquipoPosicion).perdidos : 0));

    const partidosJugados = equipo.partidos_jugados_live ?? 
      (('partidos_jugados' in equipo) ? equipo.partidos_jugados : 0);

    const golesFavor = equipo.goles_favor_live ?? 
      (('goles_favor' in equipo) ? equipo.goles_favor : 0);

    const golesContra = equipo.goles_contra_live ?? 
      (('goles_contra' in equipo) ? equipo.goles_contra : 0);

    const diferenciaGoles = equipo.diferencia_goles_live ?? 
      (('diferencia_goles' in equipo) ? equipo.diferencia_goles : 0);

    const puntosFinales = equipo.puntos_finales_live ?? 
      equipo.puntos_finales ?? 
      (('puntos' in equipo) ? equipo.puntos : 0);

    const apercibimientos = equipo.apercibimientos ?? 0;
    const puntosDescontados = equipo.puntos_descontados ?? 0;

    const isLive = equipo.en_vivo ?? false;

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

