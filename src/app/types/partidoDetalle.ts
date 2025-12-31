import { PartidoCompleto, IncidenciaPartido, JugadorPlantel, JugadorDestacado } from './partido';
import { Partido } from './partido';

// Datos completos del partido para vista de usuario
export interface PartidoDetalleUsuario {
  partido: PartidoCompleto;
  incidencias: IncidenciaPartido[];
  plantel_local: JugadorPlantel[];
  plantel_visita: JugadorPlantel[];
  jugadores_destacados?: JugadorDestacado[];
  cambios?: Array<{
    id_cambio: number;
    id_partido: number;
    tipo_cambio: 'ENTRADA' | 'SALIDA';
    minuto: number;
    tiempo: string | null;
    id_jugador_sale: number | null;
    id_jugador_entra: number | null;
    id_equipo: number | null;
    jugadorSale?: {
      id_jugador: number;
      nombre: string;
      apellido: string;
    } | null;
    jugadorEntra?: {
      id_jugador: number;
      nombre: string;
      apellido: string;
    } | null;
  }>;
  ultimos_partidos_local?: Partido[];
  ultimos_partidos_visita?: Partido[];
  historial?: Partido[];
}

// Último partido resumido de un equipo
export interface UltimoPartidoEquipo {
  id_partido: number;
  id_equipo_rival: number;
  nombre_equipo_rival: string;
  img_equipo_rival: string | null;
  goles_equipo: number;
  goles_rival: number;
  es_local: boolean;
  resultado: 'victoria' | 'derrota' | 'empate';
  fecha: string;
}

// Estadísticas cara a cara
export interface EstadisticasCaraACara {
  victorias_local: number;
  victorias_visita: number;
  empates: number;
  total_partidos: number;
  porcentaje_victorias_local: number;
  porcentaje_victorias_visita: number;
  porcentaje_empates: number;
}

// Historial de partidos entre dos equipos
export interface HistorialPartidos {
  partidos: Partido[];
  estadisticas: EstadisticasCaraACara;
}

