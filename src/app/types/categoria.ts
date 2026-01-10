import { Edicion } from "./edicion";
import { Equipo } from "./equipo";
import { Expulsado, Goleador } from "./jugador";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  id_edicion: number;
  id_categoria_edicion: number;
  color?: string | null;
}

export interface CategoriaActual {
  id_categoria_edicion: number;
  nombre: string;
  edicion: Edicion
}

export interface CategoriaEdicion {
  id_categoria: number;
  nombre: string;
  id_edicion: number;
  id_categoria_edicion: number;
  tipo_futbol: string;
  duracion_tiempo: number;
  duracion_entretiempo: number;
  publicada: string;
  puntos_victoria: number;
  puntos_empate: number;
  puntos_derrota: number
}

export interface CategoriaEdicionDto {
  id_categoria_edicion: number;
  categoria: {
    id_categoria: number;
    division: {
      id_division: number;
      nombre: string;
      descripcion: string | null;
      genero: "M" | "F" | "X";
    };
    nombreCategoria: {
      id_nombre_cat: number;
      nombre_categoria: string;
      desc: string | null;
    };
    nombre_completo: string;
  };
  edicion: {
    id_edicion: number;
    nombre: string;
    temporada: number;
  };
  configuracion: {
    tipo_futbol: number;
    duracion_tiempo: number;
    duracion_entretiempo: number;
    publicada: "S" | "N";
    puntos_victoria: number;
    puntos_empate: number;
    puntos_derrota: number;
    fecha_inicio_mercado?: string | null;
    fecha_fin_mercado?: string | null;
    limite_cambios?: number | null;
    recambio?: boolean | null;
    color?: string | null;
  };
  estadisticas: {
    partidos_jugados: string;
    equipos: number;
    jugadores: number;
    estado: string;
  };
}

export interface CategoriaEdicionListResponse {
  message: string;
  data: CategoriaEdicionDto[];
  error: string | null;
}

export interface CategoriaEdicionResponse {
  message: string;
  data: CategoriaEdicion;
  error: string | null;
}

export interface CategoriaDisponible {
  id_categoria: number;
  nombre_completo: string;
}

export interface NombreCategoriaDisponible {
  id_nombre_cat: number;
  nombre_categoria: string;
  es_nombre: boolean;
}

export interface DivisionDisponible {
  id_division: number;
  nombre: string;
  descripcion: string | null;
  genero: 'M' | 'F' | 'X';
}

export interface DatosCrearCategoriaData {
  categorias: CategoriaDisponible[];
  nombres_disponibles: NombreCategoriaDisponible[];
  divisiones_disponibles: DivisionDisponible[];
}

export interface DatosCrearCategoriaResponse {
  success: boolean;
  message: string;
  data: DatosCrearCategoriaData;
}

export interface CrearCategoriaInput {
  id_categoria: number;
  tipo_futbol: number;
  duracion_tiempo: number;
  duracion_entretiempo: number;
  publicada: string;
  puntos_victoria: number;
  puntos_empate: number;
  puntos_derrota: number;
  limite_cambios?: number | null;
  recambio?: boolean | null;
  color?: string | null;
}

export interface ActualizarCategoriaInput {
  tipo_futbol?: number;
  duracion_tiempo?: number;
  duracion_entretiempo?: number;
  puntos_victoria?: number;
  puntos_empate?: number;
  puntos_derrota?: number;
  limite_cambios?: number | null;
  recambio?: boolean | null;
  color?: string | null;
}

export interface CategoriaResponse {
  success: boolean;
  message: string;
  data: CategoriaEdicion;
}

export interface CategoriaSeleccionada {
    id_edicion: number;
    id_categoria_edicion: number;
    nombre_completo: string;
    tipo_futbol: number;
    duracion_tiempo: number;
    duracion_entretiempo: number;
    publicada: string;
    puntos_victoria: number;
    puntos_empate: number;
    puntos_derrota: number;
    fecha_inicio_mercado?: string;
    fecha_fin_mercado?: string;
    limite_cambios?: number | null;
    recambio?: boolean | null;
    color?: string | null;
}

export interface StatsCategoria {
  cantidad_equipos: number;
  partidos_finalizados: number;
  partidos_pendientes: number;
  total_partidos: number;
  jugadores_sancionados: number;
}

export interface StatsCategoriaResponse {
  success: boolean;
  message: string;
  data: {
    stats: StatsCategoria;
  };
}

export interface GoleadoresResponse {
  goleadores: Goleador[];
  pagination: Pagination;
}

export interface ExpulsadosResponse {
  expulsados: Expulsado[];
  pagination: Pagination;
}

export interface PosicionTabla {
  id: number;
  posicion: number;
  partidos_jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  goles_favor: number;
  goles_contra: number;
  diferencia_goles: number;
  puntos: number; // Puntos base (sin descuento)
  puntos_descontados?: number; // Descuento por apercibimientos
  puntos_finales?: number; // Puntos finales (puntos - descuento)
  apercibimientos?: number;
  ultima_actualizacion: string;
  equipo: Equipo;
  // Campos para datos en vivo
  puntos_live?: number;
  goles_favor_live?: number;
  goles_contra_live?: number;
  diferencia_goles_live?: number;
  puntos_finales_live?: number;
  partidos_jugados_live?: number;
  partidos_ganados_live?: number;
  partidos_empatados_live?: number;
  partidos_perdidos_live?: number;
  en_vivo?: boolean;
}

export interface EstadisticasVacantes {
  total: number;
  ocupadas: number;
  sin_ocupar: number;
  porcentaje_ocupado: number;
}

export interface EstadisticasEquipos {
  total: number;
  sin_vacante: number;
}

export interface EstadisticasJugadores {
  total: number;
}

export interface EstadisticasCategoriaEdicion {
  vacantes: EstadisticasVacantes;
  equipos: EstadisticasEquipos;
  jugadores: EstadisticasJugadores;
  mensaje: string;
}

export interface EstadisticasCategoriaEdicionResponse {
  success: boolean;
  message: string;
  data: EstadisticasCategoriaEdicion;
}

export interface ZonaPartido {
  id_zona: number;
  nombre: string;
  numero_fase: number;
}

export interface PartidoCategoria {
  id_partido: number;
  jornada: number;
  dia: string | null;
  hora: string | null;
  cancha: string | null;
  estado: string;
  id_equipolocal: number | null;
  id_equipovisita: number | null;
  vacante_local: number;
  vacante_visita: number;
  goles_local?: number | null;
  goles_visita?: number | null;
  equipoLocal: {
    id_equipo: number;
    nombre: string;
    img: string | null;
  } | null;
  equipoVisita: {
    id_equipo: number;
    nombre: string;
    img: string | null;
  } | null;
  zona: ZonaPartido;
}

export interface ProximosPartidosResponse {
  success: boolean;
  message: string;
  data: PartidoCategoria[];
}

export interface UltimosPartidosJugadosResponse {
  success: boolean;
  message: string;
  data: PartidoCategoria[];
}

export type TablaPosicionesResponse = PosicionTabla[];