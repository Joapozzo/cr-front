export const URI_IMG = 'https://coparelampago.com';
export const imagenFallBack = 'https://coparelampago.com/uploads/Equipos/team-default.png'
export const imagenFallBackUser = '/logos/player-default.png';

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Función para formatear teléfono
export const formatPhone = (phone: number | string | null | undefined): string => {
    if (!phone) return '';
    return phone.toString();
};