

export interface EquipoActual {
    id_equipo: number;
    nombre: string;
    img?: string | null;
}

export interface Equipo {
    id_equipo: number;
    nombre: string;
    descripcion?: string;
    img?: string | null;
}

export interface EquipoTemporada {
    id_equipo: number;
    nombre: string;
    img?: string | null;
    vacante: number | null;
    lista_de_buena_fe: number;
    zona: string | null;
    solicitudes_pendientes: number;
    id_zona?: number | null;
}

export interface EquipoResponse {
    equipo: Equipo;
    mensaje: string;
}

export interface EquiposPorCategoriaResponse {
    equipos: EquipoTemporada[];
    total: number;
}

// Input para crear equipo
export interface CrearEquipoInput {
    nombre: string;
    descripcion?: string;
    img?: string;
}

export interface BuscarEquiposDisponiblesResponse {
    message: string;
    data: {
        equipos: Equipo[];
        total: number;
    };
}

export interface BuscarEquiposEdicionResponse {
    message: string;
    data: {
        equipos: Equipo[];
        total: number;
    };
}

export interface EquiposExpulsion {
    id_equipo: number;
    nombre: string;
    img?: string | null;
    expulsion: {
        id_expulsion: number;
        fecha_expulsion: string;
        motivo: string;
    }
}

export interface EquipoExpulsadoResponse {
    total: number;
    equipos: EquiposExpulsion[];
}