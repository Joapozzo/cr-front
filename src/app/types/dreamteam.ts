import { Equipo } from "./equipo";
import { PosicionJugador } from "./partido";

export interface DreamTeamResponse {
    id_dreamteam: number;
    id_categoria_edicion: number;
    jornada: number;
    formacion: string | null;
    publicado: boolean;
    creado_en: string;
    actualizado_en: string;
    dreamteamJugadores: DreamTeamJugadorBackend[];
}

export interface DreamTeamJugadorBackend {
    id_partido: number;
    id_jugador: number;
    posicion_index?: number;
    posicion_codigo?: string;
    formacion: {
        equipo: Equipo;
        jugador: {
            id_jugador: number;
            id_posicion: number;
            usuario: {
                img: string;
                nombre: string;
                apellido: string;
            };
            posicion: PosicionJugador
        };
    };
}

export interface FormacionJugador {
    id_jugador: number;
    id_partido: number;
    dorsal: number;
    goles: number;
    asistencias: number;
    amarillas: number;
    rojas: number;
    minutos_jugados: number;
    titular: boolean;
    id_equipo: number;
    destacado: boolean;
}

export interface DreamTeam {
    id_dreamteam: number;
    jornada: number;
    formacion: string | null;
    id_categoria_edicion: number;
    publicado: boolean;
    jugadores: JugadorDreamTeam[];
    creado_en: string;
    actualizado_en: string;
}

export interface JugadorDreamTeam {
    id_jugador: number;
    id_partido: number;
    id_equipo: number;
    nombre: string;
    apellido: string;
    posicion: PosicionJugador;
    posicionEnFormacion: string;
    posicion_index?: number; // Índice de la posición en la formación (1-7)
    posicion_codigo?: string; // Código específico de la posición (ARQ, DEF, LD, etc.)
    equipo: Equipo;
    usuario?: {
        img: string;
        nombre: string;
        apellido: string;
    };
}

export interface EstadisticasJugador {
    goles: number;
    asistencias: number;
    amarillas: number;
    rojas: number;
    minutos_jugados: number;
    titular: boolean;
    destacado: boolean;
}

export interface AgregarJugadorRequest {
    id_categoria_edicion: number;
    jornada: number;
    id_partido: number;
    id_jugador: number;
    id_equipo: number;
    formacion?: string;
    posicionIndex?: number; // Índice de la posición en la formación (1-7)
    posicionCodigo?: string; // Código específico de la posición (ARQ, DEF, LD, etc.)
}

export interface AgregarJugadorResponse {
    mensaje: string;
    dreamteam: DreamTeamResponse;
    jugadorAgregado: {
        id_dreamteam: number;
        id_partido: number;
        id_jugador: number;
    };
    jugadoresActuales: number;
    jugadoresFaltantes: number;
}

// Posiciones para fútbol 7
export enum PosicionFutbol7 {
    ARQUERO = 'ARQ',
    DEFENSA = 'DEF',
    MEDIOCAMPISTA = 'MED',
    DELANTERO = 'DEL'
}

export interface Posicion {
    codigo: string;
    nombre: string;
}

export const convertirDreamTeamBackendAFrontend = (backend: DreamTeamResponse): DreamTeam => {
    const jugadores: JugadorDreamTeam[] = backend.dreamteamJugadores.map((dj, index) => ({
        id_jugador: dj.id_jugador,
        id_partido: dj.id_partido,
        id_equipo: dj.formacion.equipo.id_equipo,
        nombre: dj.formacion.jugador.usuario.nombre,
        apellido: dj.formacion.jugador.usuario.apellido,
        posicion: dj.formacion.jugador.posicion,
        posicionEnFormacion: String(index + 1),
        posicion_index: dj.posicion_index,
        posicion_codigo: dj.posicion_codigo,
        equipo: dj.formacion.equipo,
        usuario: dj.formacion.jugador.usuario
    }));

    return {
        id_dreamteam: backend.id_dreamteam,
        id_categoria_edicion: backend.id_categoria_edicion,
        jornada: backend.jornada,
        formacion: backend.formacion,
        publicado: backend.publicado,
        jugadores,
        creado_en: backend.creado_en,
        actualizado_en: backend.actualizado_en
    };
};