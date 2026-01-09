/**
 * Formatea una hora para usar en input type="time"
 * @param hora - Hora en formato HH:MM:SS o HH:MM
 * @returns Hora en formato HH:MM
 */
export function formatearHoraParaInput(hora: string | null | undefined): string {
    if (!hora) return '';
    // Si viene en formato HH:MM:SS, tomar solo HH:MM
    return hora.split(':').slice(0, 2).join(':');
}

/**
 * Normaliza un valor de hora para el estado del form
 * @param value - Valor que puede ser string o null
 * @returns String en formato HH:MM o null
 */
export function normalizeHoraValue(value: unknown): string | null {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return null;
}

