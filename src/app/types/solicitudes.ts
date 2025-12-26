export enum SolicitudEstado {
    E = 'pendiente',
    A = 'aceptada',
    R = 'rechazada',
}

export interface SolicitudEnviada {
    id_solicitud: number;
    id_jugador: number;
    nombre_jugador: string;
    img_jugador?: string | null;
    id_equipo: number;
    nombre_equipo: string;
    img_equipo?: string | null;
    nombre_categoria: string;
    id_categoria_edicion: number;
    edicion?: string;
    estado: SolicitudEstado | 'P' | 'A' | 'R';
    tipo_solicitud: 'J' | 'E' | 'B'; // 'B' para Baja
    mensaje_jugador?: string;
    mensaje_capitan?: string;
    motivo?: string;
    observaciones?: string;
    motivo_rechazo?: string | null;
    fecha_solicitud: string;
    fecha_respuesta: string | null;
    agregado_por?: string | null;
    respondido_por_username?: string | null;
}

export interface SolicitudRecibida {
    id_solicitud: number;
    id_jugador: number;
    nombre_jugador: string;
    img_jugador?: string | null;
    nombre_categoria: string;
    id_categoria_edicion: number;
    edicion?: string;
    estado: SolicitudEstado;
    tipo_solicitud: 'J' | 'E';
    mensaje_jugador?: string | null;
    mensaje_capitan?: string | null;
    fecha_solicitud: string;
    fecha_respuesta: string | null;
    agregado_por?: string | null;
    respondido_por_username?: string | null;
}


export interface EnviarSolicitudData {
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
    mensaje_jugador?: string;
}

export interface SolicitudResponse {
    message: string;
    data?: SolicitudRecibida | SolicitudEnviada;
}

export interface SolicitudesJugadorResponse {
    message: string;
    data: SolicitudEnviada[];
    total: number;
}

export interface ConfirmarSolicitudParams {
    id_solicitud: number;
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
}

export interface RechazarSolicitudParams {
    id_solicitud: number;
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
}

export interface CancelarInvitacionParams {
    id_solicitud: number;
    id_equipo: number;
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

export interface SolicitarBajaParams {
    id_equipo: number;
    id_jugador_capitan: number;
    id_categoria_edicion: number;
    id_jugador_baja: number;
    motivo?: string;
    observaciones?: string;
}