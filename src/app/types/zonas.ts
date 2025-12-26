import { PosicionTabla } from "./categoria";
import { Equipo } from "./equipo";
import { PartidoZona } from "./partido";
import { Temporada } from "./temporada";

export interface ZonaPrevia {
    id_zona: number;
    nombre: string;
}

export interface TipoZona {
    id: number;
    nombre: string;
}

export interface Etapa {
    id_etapa: number;
    nombre: string;
}

export interface FormatoPosicion {
    id_formato_posicion: number;
    id_zona: number;
    posicion_desde: number;
    posicion_hasta: number;
    descripcion: string;
    color?: string | null;
    orden: number;
}

export interface Zona {
    id_zona: number;
    nombre?: string;
    tipoZona?: TipoZona;
    cantidad_equipos?: number;
    numero_fase: number;
    etapa: Etapa;
    campeon?: string;
    id_equipo_campeon?: number;
    equipoCampeon?: Equipo | null;
    terminada?: string;
    id_categoria_edicion: number;
    temporadas: Temporada[];
    partidos?: PartidoZona[];
    posiciones?: PosicionTabla[];
    formatosPosiciones?: FormatoPosicion[];
}

export interface ZonasList2Response {
    id_zona: number;
    nombre: string;
    cantidad_equipos: number;
    numero_fase: number;
    id_etapa: number;
    id_tipo_zona: number;
    campeon: string;
    terminada: string;
    id_categoria_edicion: number;
    tipoZona: TipoZona;
}

// Tipos para respuestas del backend
export interface ZonasListResponse {
    data: Zona[];
}

export interface ZonaResponse {
    data: Zona;
}

export interface DatosCrearZonaResponse {
    data: {
        tiposZona: TipoZona[];
        etapas: Etapa[];
        equipos: Equipo[];
    };
}

export interface CrearZonaInput {
    nombre?: string;
    tipo_zona?: string;
    cantidad_equipos?: number;
    id_etapa?: number;
    campeon?: string;
    jornada?: number;
}

export interface EditarZonaInput {
    nombre?: string;
    cantidad_equipos?: number;
    id_equipo_campeon?: number;
    campeon?: string;
    terminada?: string;
}

export interface CrearFormatoPosicionInput {
    posicion_desde: number;
    posicion_hasta: number;
    descripcion: string;
    color?: string | null;
    orden?: number;
}

export interface ActualizarFormatoPosicionInput {
    posicion_desde?: number;
    posicion_hasta?: number;
    descripcion?: string;
    color?: string | null;
    orden?: number;
}

export interface FormatoPosicionResponse {
    message: string;
    data: FormatoPosicion;
}

export interface FormatosPosicionListResponse {
    message: string;
    data: FormatoPosicion[];
}

export interface ZonaResponseDelete {
    success?: boolean;
    message?: string;
}

export interface ZonasPlayoffResponse {
    success: boolean;
    message: string;
    data: Zona[];
    total: number;
}