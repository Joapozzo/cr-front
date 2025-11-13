import { EquipoPosicion } from './posiciones';
import { JugadorEstadistica } from './estadisticas';
import { Zona } from './zonas';

export interface ParticipacionEquipo {
  id_categoria_edicion: number;
  nombre_categoria: string;
  nombre_edicion: string;
  temporada: number;
  // Posición final
  posicion_final?: number;
  // Instancia de eliminación (si fue eliminado en playoffs)
  instancia_eliminacion?: 'cuartos' | 'semifinal' | 'final' | 'campeon';
  // Stats generales del equipo
  goles_anotados: number;
  goles_recibidos: number;
  vallas_invictas: number;
  // Tabla de posiciones (solo top 3 + nuestro equipo)
  posiciones: EquipoPosicion[];
  // Top goleadores (solo top 3 + jugadores de nuestro equipo)
  goleadores: JugadorEstadistica[];
  // Top jugadores (solo top 3 + jugadores de nuestro equipo)
  mejores_jugadores: JugadorEstadistica[];
  // Top asistentes (solo top 3 + jugadores de nuestro equipo)
  maximos_asistentes: JugadorEstadistica[];
  // Zonas de playoff (si aplica)
  zonas_playoff?: Zona[];
}

