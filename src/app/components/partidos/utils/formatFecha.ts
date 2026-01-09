/**
 * Formatea una fecha para usar en input type="date"
 * @param fecha - Fecha en string o Date
 * @returns Fecha en formato YYYY-MM-DD
 */
export function formatearFechaParaInput(fecha: string | Date | null | undefined): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
}

/**
 * Convierte una fecha de string a Date para enviar al backend
 * @param fechaString - Fecha en formato YYYY-MM-DD
 * @returns Date object o undefined
 */
export function parseFechaFromInput(fechaString: string | null | undefined): Date | undefined {
    if (!fechaString) return undefined;
    return new Date(fechaString);
}

/**
 * Normaliza un valor de fecha para el estado del form
 * @param value - Valor que puede ser string, Date, o null
 * @returns String en formato YYYY-MM-DD o null
 */
export function normalizeFechaValue(value: unknown): string | null {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return null;
}

