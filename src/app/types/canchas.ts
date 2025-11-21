// ============ TIPOS PARA DISPONIBILIDAD DE CANCHAS ============

/**
 * Conflicto de cancha
 */
export interface ConflictoCancha {
    id_partido: number;
    hora_inicio: string;
    hora_fin: string;
    equipos?: {
        local?: string;
        visita?: string;
    };
    jornada?: number;
}

/**
 * Disponibilidad de cancha
 */
export interface DisponibilidadCancha {
    disponible: boolean;
    conflictos?: ConflictoCancha[];
    mensaje?: string;
    total_partidos_dia?: number;
    llegara_al_limite?: boolean;
    advertencia?: string;
}

/**
 * Cancha disponible
 */
export interface CanchaDisponible {
    id_cancha: number;
    nombre: string;
    id_predio: number;
    nombre_predio: string;
    estado: string;
    disponible: boolean;
    conflictos?: ConflictoCancha[];
}

/**
 * Response de consulta de disponibilidad
 */
export interface ConsultarDisponibilidadResponse {
    disponible?: boolean;
    mensaje?: string;
    conflictos?: ConflictoCancha[];
    canchas?: CanchaDisponible[];
    total?: number;
    disponibles?: number;
    ocupadas?: number;
    total_partidos_dia?: number;
    llegara_al_limite?: boolean;
    advertencia?: string;
}

/**
 * Parámetros para consultar disponibilidad
 */
export interface ConsultarDisponibilidadParams {
    fecha: string; // Formato: YYYY-MM-DD
    hora_inicio: string; // Formato: HH:MM
    id_categoria_edicion: number;
    id_predio?: number;
    id_cancha?: number;
    id_partido_excluir?: number;
}

