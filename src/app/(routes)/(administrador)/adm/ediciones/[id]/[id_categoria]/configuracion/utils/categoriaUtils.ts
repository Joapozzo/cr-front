/**
 * Funciones puras para transformación de datos de categoría
 */
import { formatISOToDateInput, convertDateToISO } from '@/app/utils/fechas';
import { CategoriaEdicionConfig, ConfiguracionAPI, ActualizarConfigPayload } from '../types/configuracion.types';

/**
 * Obtiene solo los campos que han cambiado entre dos objetos
 */
export const getChangedFields = <T extends Record<string, any>>(
    current: T,
    original: T
): Partial<T> => {
    const changed: Partial<T> = {};
    
    for (const key in current) {
        if (current.hasOwnProperty(key) && original.hasOwnProperty(key)) {
            const currentValue = current[key];
            const originalValue = original[key as keyof T];
            
            // Comparación profunda para objetos y arrays
            if (!isDeepEqual(currentValue, originalValue)) {
                changed[key] = currentValue;
            }
        }
    }
    
    return changed;
};

/**
 * Comparación profunda simple (suficiente para objetos planos)
 */
function isDeepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    
    if (a == null || b == null) return a === b;
    
    if (typeof a !== typeof b) return false;
    
    if (typeof a !== 'object') return a === b;
    
    // Para objetos planos
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!isDeepEqual(a[key], b[key])) return false;
    }
    
    return true;
}

/**
 * Transforma la configuración de la API al formato del formulario
 */
export const formatConfigFromAPI = (apiData: ConfiguracionAPI | null | undefined): CategoriaEdicionConfig => {
    if (!apiData) {
        return getDefaultConfig();
    }

    return {
        tipo_futbol: apiData.tipo_futbol ?? 7,
        duracion_tiempo: apiData.duracion_tiempo ?? 25,
        duracion_entretiempo: apiData.duracion_entretiempo ?? 5,
        puntos_victoria: apiData.puntos_victoria ?? 3,
        puntos_empate: apiData.puntos_empate ?? 1,
        puntos_derrota: apiData.puntos_derrota ?? 0,
        fecha_inicio_mercado: formatISOToDateInput(apiData.fecha_inicio_mercado ?? undefined),
        fecha_fin_mercado: formatISOToDateInput(apiData.fecha_fin_mercado ?? undefined),
        limite_cambios: apiData.limite_cambios ?? null,
        recambio: apiData.recambio ?? null,
        color: apiData.color ?? null,
    };
};

/**
 * Transforma la configuración del formulario al formato esperado por la API
 * Solo incluye los campos que han cambiado
 */
export const formatConfigForAPI = (
    config: CategoriaEdicionConfig,
    originalConfig: CategoriaEdicionConfig
): ActualizarConfigPayload => {
    const changedFields = getChangedFields(config, originalConfig);
    const payload: ActualizarConfigPayload = {};

    // Transformar solo los campos que cambiaron
    if ('tipo_futbol' in changedFields) {
        payload.tipo_futbol = config.tipo_futbol;
    }
    if ('duracion_tiempo' in changedFields) {
        payload.duracion_tiempo = config.duracion_tiempo;
    }
    if ('duracion_entretiempo' in changedFields) {
        payload.duracion_entretiempo = config.duracion_entretiempo;
    }
    if ('puntos_victoria' in changedFields) {
        payload.puntos_victoria = config.puntos_victoria;
    }
    if ('puntos_empate' in changedFields) {
        payload.puntos_empate = config.puntos_empate;
    }
    if ('puntos_derrota' in changedFields) {
        payload.puntos_derrota = config.puntos_derrota;
    }
    if ('fecha_inicio_mercado' in changedFields) {
        payload.fecha_inicio_mercado = convertDateToISO(config.fecha_inicio_mercado);
    }
    if ('fecha_fin_mercado' in changedFields) {
        payload.fecha_fin_mercado = convertDateToISO(config.fecha_fin_mercado);
    }
    if ('limite_cambios' in changedFields) {
        payload.limite_cambios = config.limite_cambios;
    }
    if ('recambio' in changedFields) {
        payload.recambio = config.recambio;
    }
    if ('color' in changedFields) {
        payload.color = config.color;
    }

    return payload;
};

/**
 * Retorna la configuración por defecto
 */
export const getDefaultConfig = (): CategoriaEdicionConfig => ({
    tipo_futbol: 7,
    duracion_tiempo: 25,
    duracion_entretiempo: 5,
    puntos_victoria: 3,
    puntos_empate: 1,
    puntos_derrota: 0,
    fecha_inicio_mercado: '',
    fecha_fin_mercado: '',
    limite_cambios: null,
    recambio: null,
    color: null,
});

