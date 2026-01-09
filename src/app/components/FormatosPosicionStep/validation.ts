/**
 * Funciones puras de validación para formatos de posición
 */

import { FormatoTemporal } from './types';
import { LIMITES, MENSAJES } from './constants';

/**
 * Valida si dos rangos se superponen
 */
export const rangosSeSuperponen = (
    desde1: number,
    hasta1: number,
    desde2: number,
    hasta2: number
): boolean => {
    return !(hasta1 < desde2 || hasta2 < desde1);
};

/**
 * Valida un formato individual
 */
export const validarFormato = (
    formato: FormatoTemporal,
    otrosFormatos: FormatoTemporal[],
    cantidadEquipos: number
): FormatoTemporal['errores'] => {
    const errores: FormatoTemporal['errores'] = {};

    // Validar posición desde
    if (formato.posicion_desde < 1) {
        errores.posicion_desde = MENSAJES.ERROR_POSICION_DESDE_MIN;
    } else if (formato.posicion_desde > cantidadEquipos) {
        errores.posicion_desde = MENSAJES.ERROR_POSICION_DESDE_MAX(cantidadEquipos);
    }

    // Validar posición hasta
    if (formato.posicion_hasta < 1) {
        errores.posicion_hasta = MENSAJES.ERROR_POSICION_HASTA_MIN;
    } else if (formato.posicion_hasta > cantidadEquipos) {
        errores.posicion_hasta = MENSAJES.ERROR_POSICION_HASTA_MAX(cantidadEquipos);
    }

    // Validar rango
    if (formato.posicion_desde > formato.posicion_hasta) {
        errores.posicion_hasta = MENSAJES.ERROR_POSICION_RANGO;
    }

    // Validar descripción
    if (!formato.descripcion.trim()) {
        errores.descripcion = MENSAJES.ERROR_DESCRIPCION_REQUERIDA;
    } else if (formato.descripcion.length > LIMITES.DESCRIPCION_MAX_LENGTH) {
        errores.descripcion = MENSAJES.ERROR_DESCRIPCION_MAX;
    }

    // Validar superposiciones
    const formatosSuperpuestos = otrosFormatos.filter(
        (otro) =>
            otro.id !== formato.id &&
            rangosSeSuperponen(
                formato.posicion_desde,
                formato.posicion_hasta,
                otro.posicion_desde,
                otro.posicion_hasta
            )
    );

    if (formatosSuperpuestos.length > 0) {
        const rangos = formatosSuperpuestos
            .map((f) => `${f.posicion_desde}-${f.posicion_hasta}`)
            .join(', ');
        errores.superposicion = MENSAJES.ERROR_SUPERPOSICION(rangos);
    }

    return Object.keys(errores).length > 0 ? errores : undefined;
};

