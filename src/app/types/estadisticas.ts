// Tipos para estadísticas de jugadores

export interface JugadorEstadistica {
  id_jugador: number;
  nombre: string;
  apellido: string;
  img: string;
  equipo: {
    id_equipo: number;
    nombre: string;
    img: string;
  };
  categoria_edicion: string;
  valor: number; // goles, asistencias, amarillas, rojas, mvps
}

export type TipoEstadistica = 'goleadores' | 'asistencias' | 'amarillas' | 'rojas' | 'mvps';

