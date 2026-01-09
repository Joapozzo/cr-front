/**
 * Constantes de configuración para FormatosPosicionStep
 */

export const COLORES_PREDEFINIDOS = [
    { nombre: 'Verde', hex: '#2ad174' },
    { nombre: 'Amarillo', hex: '#e2b000' },
    { nombre: 'Rojo', hex: '#ef4444' },
    { nombre: 'Azul', hex: '#6366F1' },
    { nombre: 'Naranja', hex: '#f97316' },
] as const;

export const LIMITES = {
    DESCRIPCION_MAX_LENGTH: 100,
    PREVIEW_MAX_ROWS: 10,
    DEBOUNCE_DELAY_MS: 1000,
} as const;

export const MENSAJES = {
    ERROR_POSICION_DESDE_MIN: 'La posición desde debe ser mayor a 0',
    ERROR_POSICION_HASTA_MIN: 'La posición hasta debe ser mayor a 0',
    ERROR_POSICION_DESDE_MAX: (max: number) => `La posición desde no puede ser mayor a ${max}`,
    ERROR_POSICION_HASTA_MAX: (max: number) => `La posición hasta no puede ser mayor a ${max}`,
    ERROR_POSICION_RANGO: 'La posición hasta debe ser mayor o igual a la posición desde',
    ERROR_DESCRIPCION_REQUERIDA: 'La descripción es requerida',
    ERROR_DESCRIPCION_MAX: 'La descripción no puede exceder 100 caracteres',
    ERROR_SUPERPOSICION: (rangos: string) => `Se superpone con los rangos: ${rangos}`,
    TOAST_ERROR_VALIDACION: 'Por favor corrige los errores antes de agregar el formato',
    TOAST_SUCCESS_AGREGAR: 'Formato agregado exitosamente',
    TOAST_SUCCESS_ELIMINAR: 'Formato eliminado exitosamente',
    TOAST_SUCCESS_ELIMINAR_TEMPORAL: 'Formato eliminado',
    TOAST_ERROR_ELIMINAR: 'Error al eliminar el formato',
    TOAST_ERROR_ACTUALIZAR: 'Error al actualizar el formato',
} as const;

export const FORMATO_INICIAL = {
    id: '',
    posicion_desde: 1,
    posicion_hasta: 1,
    descripcion: '',
    color: COLORES_PREDEFINIDOS[0].hex,
    orden: 0,
} as const;

