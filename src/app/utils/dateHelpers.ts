/**
 * Helper para formatear fechas sin problemas de timezone
 * Convierte una fecha a formato YYYY-MM-DD usando la fecha local (no UTC)
 */
export const formatDateToLocalString = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    
    // Usar métodos locales para evitar problemas de timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

/**
 * Crea una fecha desde un string YYYY-MM-DD sin problemas de timezone
 */
export const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

/**
 * Formatea fecha para mostrar (DD/MM/YYYY)
 */
export const formatDateForDisplay = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
};

