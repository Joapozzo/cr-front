export interface IUserData {
    uid: number;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    img: string | null;
    telefono: string;
    nacimiento: Date;
    username: string;
}

export interface IUserPlayer {
    id_jugador: number;
    id_posicion: number;
}

export interface SolicitudPendiente {
    id_solicitud: number;
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string;
    nombre_cat_edicion: string;
    fecha_solicitud: Date;
    mensaje_jugador?: string;
}

export interface Usuario {
    uid: string;
    nombre: string;
    apellido: string;
}

export interface UsuarioAdmin extends Record<string, unknown> {
    uid: string;
    email: string;
    nombre: string;
    apellido: string;
    estado: 'I' | 'O' | 'A';
    creado_en: string;
    actualizado_en: string;
    img: string | null;
    foto_selfie_url?: string | null;
    rol: {
        id_rol: number;
        nombre: string;
    };
    es_jugador: boolean;
    id_jugador?: number;
}

export interface UsuariosAdminPaginados {
    data: UsuarioAdmin[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}