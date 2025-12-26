/**
 * Tipos comunes para el módulo de Legajos
 */

export interface PaginacionMetadata {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    pagination?: PaginacionMetadata;
    message?: string;
}

export type EstadoJugador = 'A' | 'I' | 'E'; // A=Activo, I=Inactivo, E=Expulsado

export type EstadoSolicitud = 'E' | 'A' | 'R';

export type ResultadoPartido = 'G' | 'E' | 'P';

export type TipoRanking = 'goles' | 'asistencias' | 'amarillas' | 'expulsiones';

export type TipoFixture = 'proximos' | 'recientes';

