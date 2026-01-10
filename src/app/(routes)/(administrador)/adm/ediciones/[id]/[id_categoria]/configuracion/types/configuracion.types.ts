/**
 * Tipos específicos para la configuración de categoría
 */

export interface CategoriaEdicionConfig {
    tipo_futbol: number;
    duracion_tiempo: number;
    duracion_entretiempo: number;
    puntos_victoria: number;
    puntos_empate: number;
    puntos_derrota: number;
    fecha_inicio_mercado?: string;
    fecha_fin_mercado?: string;
    limite_cambios?: number | null;
    recambio?: boolean | null;
    color?: string | null;
}

/**
 * Payload para actualizar la configuración en la API
 */
export interface ActualizarConfigPayload {
    tipo_futbol?: number;
    duracion_tiempo?: number;
    duracion_entretiempo?: number;
    puntos_victoria?: number;
    puntos_empate?: number;
    puntos_derrota?: number;
    fecha_inicio_mercado?: string;
    fecha_fin_mercado?: string;
    limite_cambios?: number | null;
    recambio?: boolean | null;
    color?: string | null;
}

/**
 * Configuración que viene de la API (CategoriaEdicionDto.configuracion)
 */
export interface ConfiguracionAPI {
    tipo_futbol: number;
    duracion_tiempo: number;
    duracion_entretiempo: number;
    publicada: "S" | "N";
    puntos_victoria: number;
    puntos_empate: number;
    puntos_derrota: number;
    fecha_inicio_mercado?: string | null;
    fecha_fin_mercado?: string | null;
    limite_cambios?: number | null;
    recambio?: boolean | null;
    color?: string | null;
}

