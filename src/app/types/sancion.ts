export interface Sancion {
    id_expulsion: number;
    id_partido: number | null;
    id_jugador: number | null;
    minuto: number | null;
    descripcion: string | null;
    motivo: string | null;
    estado: string | null;
    fechas: number | null;
    fechas_restantes: number | null;
    multa: string | null;
    fecha_creacion: Date | null;
    fecha_actualizacion: Date | null;
    tipo_tarjeta: string | null;
    apelacion: string | null;
    observaciones: string | null;
    art: string | null;
    jugador?: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
            dni: string | null;
            img: string | null;
        };
    };
    partido?: {
        id_partido: number;
        jornada: number;
        dia: string | null;
        hora: string | null;
        equipoLocal?: {
            nombre: string;
        };
        equipoVisita?: {
            nombre: string;
        };
        categoriaEdicion?: {
            id_categoria_edicion: number;
            categoria: {
                nombreCategoria: {
                    nombre_categoria: string;
                };
            };
        };
    };
}

export interface CrearSancionInput {
    id_categoria_edicion: number;
    id_jugador: number;
    minuto?: number;
    descripcion?: string;
    motivo?: string;
    fechas?: number;
    multa?: 'S' | 'N';
    tipo_tarjeta?: string;
    art?: string;
    observaciones?: string;
}

export interface EditarSancionInput {
    minuto?: number;
    descripcion?: string;
    motivo?: string;
    fechas?: number;
    fechas_restantes?: number;
    multa?: 'S' | 'N';
    tipo_tarjeta?: string;
    art?: string;
    observaciones?: string;
    apelacion?: 'S' | 'N';
}

export interface SancionesResponse {
    success: boolean;
    message: string;
    data: Sancion[];
}

export interface SancionResponse {
    success: boolean;
    message: string;
    data: Sancion;
}

export interface VerificarSancionResponse {
    success: boolean;
    message: string;
    data: {
        sancionado: boolean;
    };
}
