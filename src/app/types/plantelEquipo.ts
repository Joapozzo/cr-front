import { PosicionJugador } from './partido';

export interface JugadorPlantel {
  id_jugador: number;
  nombre: string;
  apellido: string;
  img: string | null;
  posicion: PosicionJugador | null;
  sancionado: 'S' | 'N';
  eventual: 'S' | 'N';
  es_capitan?: boolean;
}

export interface PlantelEquipo {
  id_equipo: number;
  jugadores: JugadorPlantel[];
}

