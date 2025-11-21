// ============ TIPOS PARA PREDIOS ============

/**
 * Predio base
 */
export interface Predio {
    id_predio: number;
    nombre: string;
    direccion: string | null;
    descripcion: string | null;
    estado: 'A' | 'I';
}

/**
 * Cancha base
 */
export interface Cancha {
    id_cancha: number;
    id_predio: number;
    nombre: string;
    tipo_futbol?: number | null; // 5, 7, 8, 11
    estado: 'A' | 'I';
}

/**
 * Cancha con información del predio
 */
export interface CanchaConPredio extends Cancha {
    predio: {
        id_predio: number;
        nombre: string;
        estado?: 'A' | 'I';
        direccion?: string | null;
    };
}

/**
 * Predio con sus canchas
 */
export interface PredioConCanchas extends Predio {
    canchas: Cancha[];
}

/**
 * Predio completo con información de canchas y partidos
 */
export interface PredioDetalle extends Predio {
    canchas: Array<{
        id_cancha: number;
        nombre: string;
        estado: 'A' | 'I';
        tienePartidos: boolean;
    }>;
}

/**
 * Cancha completa con información del predio y partidos
 */
export interface CanchaDetalle extends Cancha {
    predio: {
        id_predio: number;
        nombre: string;
        direccion: string | null;
        estado: 'A' | 'I';
    };
    partidos?: Array<{
        id_partido: number;
        dia: Date | string;
        hora: string | null;
        estado: string;
    }>;
}

// ============ INPUTS ============

/**
 * Input para crear un predio
 */
export interface CrearPredioInput {
    nombre: string;
    direccion?: string | null;
    descripcion?: string | null;
    estado?: 'A' | 'I';
}

/**
 * Input para actualizar un predio
 */
export interface ActualizarPredioInput {
    nombre?: string;
    direccion?: string | null;
    descripcion?: string | null;
    estado?: 'A' | 'I';
}

/**
 * Input para crear una cancha
 */
export interface CrearCanchaInput {
    id_predio: number;
    nombre: string;
    tipo_futbol?: number; // 5, 7, 8, 11
    estado?: 'A' | 'I';
}

/**
 * Input para actualizar una cancha
 */
export interface ActualizarCanchaInput {
    id_predio?: number;
    nombre?: string;
    tipo_futbol?: number; // 5, 7, 8, 11
    estado?: 'A' | 'I';
}

// ============ RESPONSES ============

/**
 * Response al crear un predio
 */
export interface CrearPredioResponse {
    mensaje: string;
    predio: PredioConCanchas;
}

/**
 * Response al obtener predios
 */
export interface ObtenerPrediosResponse {
    predios: PredioConCanchas[];
    total: number;
}

/**
 * Response al actualizar un predio
 */
export interface ActualizarPredioResponse {
    mensaje: string;
    predio: PredioConCanchas;
}

/**
 * Response al eliminar un predio
 */
export interface EliminarPredioResponse {
    mensaje: string;
}

/**
 * Response al crear una cancha
 */
export interface CrearCanchaResponse {
    mensaje: string;
    cancha: CanchaConPredio;
}

/**
 * Response al obtener canchas
 */
export interface ObtenerCanchasResponse {
    canchas: CanchaConPredio[];
    total: number;
}

/**
 * Response al actualizar una cancha
 */
export interface ActualizarCanchaResponse {
    mensaje: string;
    cancha: CanchaConPredio;
}

/**
 * Response al eliminar una cancha
 */
export interface EliminarCanchaResponse {
    mensaje: string;
}

// ============ PARÁMETROS DE CONSULTA ============

/**
 * Parámetros para obtener canchas
 */
export interface ObtenerCanchasParams {
    id_predio?: number;
    incluir_inactivas?: boolean;
}

