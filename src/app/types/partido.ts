import { Equipo } from "./equipo";
import { InfoVacante, TemporadaPartido } from "./temporada";

export type EstadoPartido = 'P' | 'C1' | 'E' | 'C2' | 'T' | 'F' | 'S' | 'A' | 'I';

export interface EquipoPartido {
    id_equipo?: number;
    nombre: string;
    img?: string | null;
}

export interface Planillero {
    nombre: string;
    apellido: string;
}

export interface Partido {
    id_partido: number;
    id_equipolocal: number;
    id_equipovisita: number;
    jornada: number;
    dia: string;
    hora: string;
    goles_local: number | null;
    goles_visita: number | null;
    pen_local?: number | null;
    pen_visita?: number | null;
    cancha: number;
    arbitro: string | null;
    destacado?: boolean;
    estado: EstadoPartido;
    id_categoria_edicion?: number;
    id_zona?: number;
    vacante_local?: string | null;
    vacante_visita?: string | null;
    interzonal?: boolean;
    ventaja_deportiva?: boolean;
    ida?: boolean;
    vuelta?: boolean;
    descripcion?: string | null;
    equipoLocal: EquipoPartido;
    equipoVisita: EquipoPartido;
    planillero?: Planillero | null;
    nombre_categoria_completo?: string | null;
    cancha_ref?: CanchaRef;
    id_cancha?: number;
}

export interface CanchaRef {
    nombre: string;
    predio: {
        nombre: string;
    };
}

export interface Division {
    nombre: string | null;
}

export interface NombreCategoria {
    nombre_categoria: string;
}

export interface Categoria {
    division: Division | null;
    nombreCategoria: NombreCategoria;
}

export interface CategoriaEdicion {
    duracion_tiempo: number;
    duracion_entretiempo: number;
    categoria: Categoria;
}

export interface Zona {
    nombre: string | null;
    id_tipo_zona?: number | null;
}

export interface JugadorDestacado {
    id_jugador: number;
    id_usuario: string;
    nombre: string;
    apellido: string;
}

export interface PartidoCompleto {
    id_partido: number;
    jornada: number;
    dia: string | null;
    cancha: number | null;
    canchaData?: {
        tipo_futbol: number | null;
    } | null;
    arbitro: string | null;
    goles_local: number | null;
    goles_visita: number | null;
    pen_local: number | null;
    pen_visita: number | null;
    estado: string;
    id_jugador_destacado: number | null;
    descripcion?: string | null;
    equipoLocal: Equipo | null;
    equipoVisita: Equipo | null;
    zona: Zona | null;
    categoriaEdicion: CategoriaEdicion | null;
    jugador_destacado: JugadorDestacado | null;
    hora: string | null;
    id_categoria_edicion: number;
    hora_inicio: string | null;
    hora_inicio_segundo_tiempo: string | null;
}

export interface PosicionJugador {
    id_posicion: number;
    codigo: string;
    nombre: string;
}

export interface JugadorPlantel {
    id_jugador: number;
    id_equipo: number;
    eventual: string | null;
    sancionado: string | null;
    destacado: boolean;
    fecha_adicion: Date;
    posicion: PosicionJugador | null;
    nombre: string;
    apellido: string;
    dni: string | null;
    img: string | null;
    nacimiento: Date | null;
    capitan: boolean;
    dorsal: number | null;
    // Campos de formación
    en_cancha?: boolean;
    minuto_entrada?: number | null;
    minuto_salida?: number | null;
    cantidad_cambios?: number | null;
    // Campo para identificar si es titular original o entró después
    es_titular_original?: boolean; // true = titular desde inicio, false = entró después
}

export interface FormacionJugador {
    id_jugador: number;
    dorsal: number | null;
    goles: number | null;
    en_cancha: boolean;
    titular: boolean; // Mantener por compatibilidad, pero usar en_cancha
    minuto_entrada: number | null;
    minuto_salida: number | null;
    cantidad_cambios: number | null;
    registrado_en: Date;
    id_equipo: number;
    jugador: JugadorPlantel;
}

export interface JugadorDestacadoPartido {
    id_jugador: number;
    id_equipo: number;
    nombre_equipo: string;
    dt: string | null;
    nombre: string;
    apellido: string;
    img_jugador: string | null;
    posicion: string | null;
}

export interface IncidenciaPartido {
    tipo: 'gol' | 'asistencia' | 'amarilla' | 'roja' | 'doble_amarilla' | 'cambio';
    id: number;
    id_jugador: number | null;
    id_equipo: number | null;
    minuto: number | null;
    tiempo?: '1T' | '2T' | 'ET' | 'PEN';
    nombre: string;
    apellido: string;
    // Campos específicos por tipo
    penal?: 'S' | 'N';
    en_contra?: 'S' | 'N';
    id_gol?: number | null;
    tipo_tarjeta?: string | null;
    // Campos específicos para cambios
    jugador_sale_id?: number | null;
    jugador_sale_nombre?: string;
    jugador_entra_id?: number | null;
    jugador_entra_nombre?: string;
    observaciones?: string | null;
    // Flag para identificar actualizaciones optimistas (no se persiste en BD)
    _optimistic?: boolean;
}

export interface DatosCompletosPlanillero {
    message: string;
    partido: PartidoCompleto;
    plantel_local: JugadorPlantel[];
    plantel_visita: JugadorPlantel[];
    formaciones: FormacionJugador[];
    jugadores_destacados: JugadorDestacadoPartido[];
    incidencias: IncidenciaPartido[];
}

export interface Incidencias {
    goles: IncidenciaGol[];
    expulsiones: [];
}

export interface IncidenciaGol {
    id_equipo: number;
    id: number;
    nombre: string;
    apellido: string;
    tipo: string;
    id_jugador: number | null;
    minuto: number;
    penal?: 'S' | 'N';
    en_contra?: 'S' | 'N';
}

export interface PartidoEquipo {
    id_partido: number;
    id_equipolocal: number;
    id_equipovisita: number;
    jornada: number;
    dia: string;
    hora: string;
    goles_local: number | null;
    goles_visita: number | null;
    pen_local: number | null;
    pen_visita: number | null;
    cancha: number;
    estado: string;
    id_zona: number;
    id_categoria_edicion: number;
    equipoLocal: EquipoPartido;
    equipoVisita: EquipoPartido;
    incidencias: Incidencias;
}

export interface UltimoYProximoPartidoResponse {
    ultimo: PartidoEquipo | null;
    proximo: PartidoEquipo | null;
}

export interface PartidoZona {
    id_partido: number;
    jornada: number;
    dia: string | null;
    hora: string | null;
    goles_local: number | null;
    goles_visita: number | null;
    pen_local: number | null;
    pen_visita: number | null;
    estado: string;
    vacante_local: number;
    vacante_visita: number;
    id_equipolocal: number | null;
    id_equipovisita: number | null;
    equipoLocal: Equipo | null;
    equipoVisita: Equipo | null;
    temporadaLocal: TemporadaPartido | null;
    temporadaVisita: TemporadaPartido | null;
    id_partido_previo_local: number | null;
    id_partido_previo_visita: number | null;
    res_partido_previo_local: string | null;
    res_partido_previo_visita: string | null;
    id_partido_posterior_ganador: number | null;
    id_partido_posterior_perdedor: number | null;
    nomenclatura_partido_previo_local: string | null;
    nomenclatura_partido_previo_visita: string | null;
    info_vacante_local: InfoVacante;
    info_vacante_visita: InfoVacante;
}

// Tipos centralizados para cronómetro
export type FasePartido = 'PT' | 'ET' | 'ST';

/**
 * Tipo completo de cronómetro usado en useCronometroPartido
 * Incluye todos los campos necesarios para el cronómetro completo
 */
export interface CronometroData {
    tiempoFormateado: string;
    tiempoAdicional: number;
    fase: FasePartido;
    shouldShowAdicional: boolean;
    minuto: number;
}

/**
 * Tipo simple de cronómetro usado en useCronometroSimple
 * Versión simplificada sin tiempo adicional
 */
export interface CronometroSimple {
    tiempoFormateado: string;
    fase: FasePartido;
    enVivo: boolean;
}

/**
 * Tipo para props de componentes que reciben cronómetro
 * Similar a CronometroData pero sin el campo minuto
 * Compatible con CronometroData (acepta objetos con más propiedades)
 */
export type CronometroProps = Omit<CronometroData, 'minuto'>;