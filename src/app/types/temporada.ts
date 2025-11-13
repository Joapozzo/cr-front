import { Equipo } from "./equipo";
import { ZonaPrevia } from "./zonas";

export interface Temporada {
    id: number;
    id_equipo: number;
    id_zona: number;
    vacante: number;
    pos_zona_previa: number;
    apercibimientos: number;
    ventaja: string;
    id_zona_previa: number;
    id_categoria_edicion: number;
    equipo?: Equipo;
    zonaPreviaRef?: ZonaPrevia;
    info_vacante: InfoVacante;
}

export interface TemporadaPartido {
    vacante: number;
    pos_zona_previa: number | null;
    id_zona_previa: number | null;
    zona_previa: ZonaPrevia | null;
}

export interface TemporadaDetalles {
    equipo: string;
    vacante: number;
    zona: string;
    categoria: string;
    edicion: string;
    temporada: number;
}

export interface OcuparVacanteResponse {
    temporada: any;
    mensaje: string;
    detalles: TemporadaDetalles;
}

export interface LiberarVacanteResponse {
    mensaje: string;
    detalles: {
        equipoLiberado: string;
        vacante: number;
    };
}

export interface OcuparVacanteInput {
    vacante: number;
    id_equipo: number;
}

export interface LiberarVacanteInput {
    vacante: number;
}

export interface ActualizarVacanteResponse {
    success: boolean;
    message: string;
    data: {
        equipoNuevo: string;
        equipoAnterior: string | null;
        vacante: number;
    };
}

export interface ActualizarVacanteInput {
    vacante: number;
    id_equipo: number;
}

export interface OcuparVacanteConAutomatizacionInput {
    vacante: number;
    id_zona: number;
    id_categoria_edicion: number;
    id_zona_previa: number;
    pos_zona_previa: number;
}

export interface OcuparVacanteConAutomatizacionResponse {
    temporada: any;
    mensaje: string;
    configuracion_automatizacion: {
        vacante: number;
        zona_previa: string;
        posicion: number;
    };
}

export interface ConfigurarAutomatizacionPartidoInput {
    vacante: number;
    id_partido_previo: number;
    res_partido_previo: 'G' | 'P';
}

export interface ConfigurarAutomatizacionPartidoResponse {
    partido: any;
    mensaje: string;
    configuracion: {
        vacante: number;
        tipo: string;
        partido_previo: {
            id: number;
            partido: string;
            zona: string;
            fase: number;
            resultado: string;
        };
    };
}

export interface ConfigurarAutomatizacionPartidoData {
    id_partido: number;
    vacante: number;
    id_partido_previo: number;
    res_partido_previo: 'G' | 'P';
}

export interface InfoVacante {
    isOcupada: boolean;
    label: string;
    tipo: 'equipo_directo' | 'automatizacion_posicion' | 'automatizacion_partido' | 'vacia';
    detalles: string | null;
}