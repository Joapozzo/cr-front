import { PartidoExpulsados } from './../../../../cr-back/src/models/partido';
import { Equipo } from "./equipo";
import { PosicionJugador } from "./partido";

export interface Jugador {
    id_jugador: number;
    nombre: string;
    apellido: string;
    img: string;
    posicion: PosicionJugador;
}

export interface ObtenerEquiposActualesDelJugadorResponse { 
    id_equipo: number;
    nombre_equipo: string;
    img_equipo: string;
    id_categoria_edicion: number;
    nombre_categoria: string;
    id_edicion: number;
    nombre_torneo: string;
    temporada: number;
    es_capitan: boolean;
}

export interface JugadorDestacadoDt {
    id_jugador: number;
    id_partido: number;
    id_equipo: number;
    nombre: string;
    apellido: string;
    img: string;
    dorsal: number;
    posicion: {
        id_posicion: number;
        codigo: string;
        nombre: string;
    } | null;
    equipo: {
        id_equipo: number;
        nombre: string;
        img: string;
    };
    estadisticas: {
        goles: number;
        asistencias: number;
        amarillas: number;
        rojas: number;
        minutos_jugados: number;
        titular: boolean;
        destacado: boolean;
    };
}

export interface JugadoresDestacadosResponse {
    success: boolean;
    data: JugadorDestacadoDt[];
    total: number;
    filtros: {
        id_categoria_edicion: number;
        jornada: number;
        id_posicion: number | null;
    };
}

export interface PosicionJugadorResponse { 
    success: boolean;
    data: PosicionJugador[];
    total: number;
}

export interface SearchJugadoresResponse {
    success: boolean;
    data: JugadorDestacadoDt[];
    total: number;
    categira_edicion: number;
    jornada: number;
    query: string;
    id_posicion: number | null;
}

export interface JugadorCategoria {
    id_jugador: number;
    nombre: string;
    apellido: string;
    img: string;
    dni: string | null;
    posicion: {
        id_posicion: number;
        codigo: string;
        nombre: string;
    } | null;
    equipo: {
        id_equipo: number;
        nombre: string;
        img: string;
    };
}

export interface SearchJugadoresCategoriaResponse {
    success: boolean;
    data: JugadorCategoria[];
    total: number;
    categoria_edicion: number;
    query: string;
}

interface Stats {
    goles: number;
    partidos: number;
    promedio: number;
}

export interface Goleador {
    jugador: Jugador;
    equipo: Equipo;
    stats: Stats;
}

export interface Sancion {
    fechas: number;
    fechas_restantes: number;
    motivo: string;
    art: string;
    tipo_tarjeta: string;
    fecha_expulsion: string;
}

export interface Expulsado {
    id_expulsion: number;
    jugador: Jugador;
    equipo: Equipo;
    sancion: Sancion;
    partido: PartidoExpulsados;
}