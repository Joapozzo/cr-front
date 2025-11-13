export enum SolicitudEstado {
    E = 'pendiente',
    A = 'aceptada',
    R = 'rechazada',
}

export interface SolicitudEnviada {
    id_solicitud: number;
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string;
    nombre_categoria: string;
    id_categoria_edicion: number;
    estado: SolicitudEstado;
    tipo_solicitud: 'J' | 'E';
    mensaje_jugador?: string;
    mensaje_capitan?: string;
    fecha_solicitud: string;
    fecha_respuesta: string;
}

export interface SolicitudRecibida {
    id_solicitud: number;
    id_jugador: number;
    nombre_jugador: string;
    img_jugador?: string;
    nombre_categoria: string;
    id_categoria_edicion: number;
    estado: SolicitudEstado;
    tipo_solicitud: 'J' | 'E';
    mensaje_jugador?: string;
    mensaje_capitan?: string;
    fecha_solicitud: string;
    fecha_respuesta: string;
}


export interface EnviarSolicitudData {
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
    mensaje_jugador?: string;
}

export interface SolicitudResponse {
    message: string;
    data: any;
}

export interface SolicitudesJugadorResponse {
    message: string;
    data: any[];
    total: number;
}

export interface ConfirmarSolicitudParams {
    id_solicitud: number;
    id_jugador: number;
}

export interface RechazarSolicitudParams {
    id_solicitud: number;
    id_jugador: number;
}

export interface CancelarInvitacionParams {
    id_solicitud: number;
    id_equipo: number;
    id_jugador: number;
    id_categoria_edicion: number;
}

export interface EnviarInvitacionParams {
    id_equipo: number;
    id_jugador_invitado: number;
    mensaje_capitan?: string;
}

export interface ObtenerSolicitudesEquipoParams {
    id_equipo: number;
}

export interface ObtenerSolicitudesEquipoResponse {
    message: string;
    data: SolicitudRecibida[];
    total: number;
}


export interface SolicitudBajaResponse {
    solicitudes: SolicitudBaja[];
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
}

export interface SolicitudBaja {
    id_solicitud: number;
    jugador: JugadorSolicitud;
    equipo: EquipoSolicitud;
    categoria: string;
    motivo: string;
    observaciones: string;
    estado: "A" | "P" | "R";
    fecha_solicitud: string;
    fecha_respuesta: string | null;
    solicitado_por: string;
    respondido_por: string | null;
    motivo_rechazo: string | null;
}

export interface JugadorSolicitud {
    id_jugador: number;
    nombre: string;
    apellido: string;
    dni: string;
}

export interface EquipoSolicitud {
    id_equipo: number;
    nombre: string;
    img: string | null;
}
