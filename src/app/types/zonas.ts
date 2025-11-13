import { PosicionTabla } from "./categoria";
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

export interface Zona {
    id_zona: number;
    nombre?: string;
    tipoZona?: TipoZona;
    cantidad_equipos?: number;
    numero_fase: number;
    etapa: Etapa;
    campeon?: string;
    id_equipo_campeon?: number;
    terminada?: string;
    id_categoria_edicion: number;
    temporadas: Temporada[];
    partidos?: PartidoZona[];
    posiciones?: PosicionTabla[];
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