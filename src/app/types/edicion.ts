import { Categoria } from "./categoria";

export interface EdicionConCategorias {
    id_edicion: number;
    nombre: string;
    temporada: number;
    img: string | null;
    categorias: Categoria[];
}

export interface Edicion {
    id_edicion: number;
    id_torneo: number;
    nombre: string;
    temporada: number;
    cantidad_eventuales: number;
    partidos_eventuales: number;
    apercibimientos: number;
    puntos_descuento: number;
    estado: string;
    img?: string | null;
}

export type CrearEdicion = Omit<Edicion, 'id_edicion' | 'id_torneo' | 'estado'>;

export type EdicionResponse = {
    success: boolean;
    data: Edicion;
    message: string;
}

export interface EdicionHome {
    id_edicion: number;
    nombre: string;
    temporada: number;
}

export interface EdicionAdmin {
    id_edicion: number;
    nombre: string;
    temporada: number;
    cantidad_eventuales: number;
    partidos_eventuales: number;
    apercibimientos: number;
    puntos_descuento: number;
    img: string | null;
    estado: string;
    partidos_jugados: string;
    jugadores: number;
    equipos: number;
    categorias: number;
}