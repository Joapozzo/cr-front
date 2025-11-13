export const formatearFecha = (fecha?: string) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    }).toUpperCase();
};

export const formatearHora = (hora?: string) => {
    if (!hora) return '';
    return hora.slice(0, 5); // HH:MM
};

