import { EstadoPartido } from "../types/partido";

export const formatTime = (hora: string | null): string => {
    if (!hora) return '';
    return hora.substring(0, 5);
};

export const formatDate = (dia: string | null): string => {
    if (!dia) return '';
    return new Date(dia).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit'
    });
};

export const getEstadoTexto = (estado: string): string => {
    switch (estado) {
        case 'P': return 'Programado';
        case 'C1': return 'Primer Tiempo';
        case 'E': return 'Entretiempo';
        case 'C2': return 'Segundo Tiempo';
        case 'T':
        case 'F': return 'Final';
        case 'S': return 'Suspendido';
        case 'A': return 'Postergado';
        default: return '';
    }
};

export const getEstadoColor = (estado: EstadoPartido) => {
    switch (estado) {
        case 'P':
            return 'text-[#737373]';
        case 'C1':
        case 'E':
        case 'C2':
            return 'text-green-400';
        case 'T':
        case 'F':
            return 'text-[#737373]';
        case 'S':
            return 'text-red-400';
        case 'A':
            return 'text-orange-400';
        default:
            return 'text-[#737373]';
    }
};

export const formatNombreJugador = (nombre: string, apellido: string): string => {
    return `${nombre.charAt(0).toLowerCase()}.${apellido.toLowerCase()}`;
};

export const getNombreCategoria = (categoriaEdicion: any): string => {
    const division = categoriaEdicion?.categoria.division?.nombre || '';
    const categoria = categoriaEdicion?.categoria.nombreCategoria.nombre_categoria || 'Categoría';
    return division ? `${division} - ${categoria}` : categoria;
};