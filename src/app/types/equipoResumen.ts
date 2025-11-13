// Tipos para el resumen del equipo

import { PartidoEquipo } from './partido';
import { JugadorEstadistica, TipoEstadistica } from './estadisticas';

// Partido resumido para los últimos partidos (solo escudo y resultado)
export interface PartidoResumido {
  id_partido: number;
  id_equipo_rival: number;
  nombre_equipo_rival: string;
  img_equipo_rival: string | null;
  goles_equipo: number;
  goles_rival: number;
  es_local: boolean; // Si el equipo actual es local o visita
  resultado: 'victoria' | 'derrota' | 'empate';
}

// Estadísticas resumidas para el slider
export interface StatsResumen {
  tipo: TipoEstadistica;
  jugadores: JugadorEstadistica[];
  titulo: string;
  verTodosUrl?: string; // URL para ver todos (opcional)
}

// Resumen completo del equipo
export interface EquipoResumen {
  proximo_partido: PartidoEquipo | null;
  ultimo_partido: PartidoEquipo | null;
  ultimos_partidos: PartidoResumido[]; // Máximo 5
  stats: StatsResumen[]; // Array de stats (goleadores, mvps, amarillas, rojas)
}

