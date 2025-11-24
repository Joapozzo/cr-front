/**
 * Tipos TypeScript para Legajos de Jugadores
 */
import { EstadoJugador, EstadoSolicitud, ResultadoPartido, PaginacionMetadata } from './common.types';

export interface JugadorBusqueda {
    id_jugador: number;
    nombre: string;
    apellido: string;
    nombre_completo: string;
    dni?: string;
    img?: string;
    posicion?: {
        codigo: string;
        nombre: string;
    };
    estado: EstadoJugador;
    equipos_actuales: Array<{
        id_equipo: number;
        nombre: string;
    }>;
    link_legajo: string;
}

export interface BusquedaJugadoresParams {
    q?: string;
    id_categoria_edicion?: number;
    estado?: EstadoJugador;
    page?: number;
    limit?: number;
}

export interface BusquedaJugadoresResponse {
    data: JugadorBusqueda[];
    pagination: PaginacionMetadata;
}

export interface JugadorInformacionBasica {
    id_jugador: number;
    usuario: {
        uid: string;
        nombre: string;
        apellido: string;
        dni?: string;
        img?: string;
        nacimiento?: string;
        edad?: number | null;
    };
    posicion?: {
        id_posicion: number;
        codigo: string;
        nombre: string;
    };
    resumen: {
        total_equipos: number;
        categorias_jugadas: number;
        partidos_totales: number;
    };
}

export interface EstadisticasJugador {
    partidos_jugados: number;
    partidos_titular: number;
    partidos_suplente: number;
    minutos_jugados: number;
    goles_totales: number;
    goles_normales: number;
    goles_penales: number;
    goles_autogoles: number;
    asistencias: number;
    amarillas: number;
    rojas: number;
    destacado: number;
    promedio_goles_por_partido: number;
    promedio_minutos_por_partido: number;
}

export interface HistorialEquiposJugador {
    temporada: number;
    edicion: {
        id_edicion: number;
        nombre: string;
        temporada: number;
    };
    categorias: Array<{
        categoria: {
            id_categoria: number;
            division: string | null;
            nombre: string | null;
        };
        planteles: Array<{
            equipo: {
                id_equipo: number;
                nombre: string;
                img?: string;
            };
            categoria_edicion: {
                id_categoria_edicion: number;
                categoria: {
                    id_categoria: number;
                    division: string | null;
                    nombre: string | null;
                };
                edicion: {
                    id_edicion: number;
                    nombre: string;
                    temporada: number;
                };
            };
            tipo: 'eventual' | 'titular';
            estado: 'activo' | 'baja';
            fecha_adicion: string;
            fecha_baja: string | null;
            partidos_jugados: number;
        }>;
    }>;
}

export interface PartidoJugador {
    id_partido: number;
    fecha: string | null;
    hora: string | null;
    jornada: number;
    equipo_local: {
        id_equipo: number;
        nombre: string;
        img?: string;
    } | null;
    equipo_visita: {
        id_equipo: number;
        nombre: string;
        img?: string;
    } | null;
    goles_local: number | null;
    goles_visita: number | null;
    resultado: ResultadoPartido | null;
    categoria_edicion: {
        id_categoria_edicion: number;
        categoria: {
            id_categoria: number;
            division: {
                nombre: string | null;
            } | null;
            nombreCategoria: {
                nombre_categoria: string;
            } | null;
        };
        edicion: {
            nombre: string | null;
            temporada: number | null;
        };
    } | null;
    zona: {
        id_zona: number;
        nombre: string | null;
    } | null;
    cancha: {
        id_cancha: number;
        nombre: string;
        predio: {
            nombre: string;
        } | null;
    } | null;
    estado: string;
    estadisticas_individuales: {
        titular: boolean;
        suplente: boolean;
        minutos_jugados: number;
        goles: Array<{
            id_gol: number;
            minuto: number | null;
            tipo: 'normal' | 'penal' | 'autogol';
        }>;
        asistencias: Array<{
            id_asistencia: number;
            minuto: number;
        }>;
        amarillas: Array<{
            id_amonestacion: number;
            minuto: number | null;
        }>;
        rojas: Array<{
            id_expulsion: number;
            minuto: number | null;
            tipo_tarjeta: string | null;
        }>;
        destacado: boolean;
    };
    mi_equipo: {
        id_equipo: number;
        es_local: boolean;
    };
    resultado: ResultadoPartido | null;
}

export interface HistorialPartidosJugadorResponse {
    data: PartidoJugador[];
    pagination: PaginacionMetadata;
}

export interface HistorialDisciplinarioJugador {
    amonestaciones: Array<{
        id_amonestacion: number;
        fecha: string | null;
        partido: {
            id_partido: number;
            jornada: number;
            equipos: {
                local: string;
                visita: string;
            };
            categoria_edicion: {
                id_categoria_edicion: number;
                categoria: {
                    division: string | null;
                    nombre: string | null;
                };
                edicion: {
                    nombre: string | null;
                    temporada: number | null;
                };
            };
            zona: string | null;
        } | null;
        minuto: number | null;
    }>;
    expulsiones: Array<{
        id_expulsion: number;
        fecha: string | null;
        partido: {
            id_partido: number;
            jornada: number;
            equipos: {
                local: string;
                visita: string;
            };
            categoria_edicion: {
                id_categoria_edicion: number;
                categoria: {
                    division: string | null;
                    nombre: string | null;
                };
                edicion: {
                    nombre: string | null;
                    temporada: number | null;
                };
            };
            zona: string | null;
        } | null;
        minuto: number | null;
        tipo_tarjeta: string | null;
        motivo: string | null;
        descripcion: string | null;
        articulo: string | null;
        fechas_sancion: {
            total: number;
            restantes: number;
        };
        estado: string;
        multa: boolean;
        apelacion: boolean;
        observaciones: string | null;
        fecha_inicio_sancion: string | null;
    }>;
    resumen_por_categoria: Array<{
        id_categoria_edicion: number;
        total_amarillas: number;
        total_rojas: number;
        sanciones_vigentes: number;
        apercibimientos: number;
    }>;
}

export interface DestacadosJugador {
    veces_destacado: number;
    destacados: Array<{
        id_partido: number;
        jornada: number;
        fecha: string | null;
        categoria: {
            division: string | null;
            nombre: string | null;
        };
        zona: string | null;
    }>;
    participaciones_dreamteam: number;
    dreamteams: Array<{
        id_dreamteam: number;
        jornada: number;
        formacion: string | null;
        posicion: string | null;
        categoria: {
            division: string | null;
            nombre: string | null;
        };
    }>;
}

export interface SolicitudesJugador {
    solicitudes_entrada: Array<{
        id_solicitud: number;
        tipo: 'jugador_solicito' | 'equipo_invito';
        equipo: {
            id_equipo: number;
            nombre: string;
            img?: string;
        };
        categoria_edicion: {
            id_categoria_edicion: number;
            categoria: {
                division: string | null;
                nombre: string | null;
            };
            edicion: {
                nombre: string | null;
                temporada: number | null;
            };
        };
        estado: 'enviado' | 'aceptado' | 'rechazado';
        mensaje_jugador?: string;
        mensaje_capitan?: string;
        fecha_solicitud: string;
        fecha_respuesta?: string | null;
    }>;
    solicitudes_baja: Array<{
        id_solicitud: number;
        equipo: {
            id_equipo: number;
            nombre: string;
            img?: string;
        };
        categoria_edicion: {
            id_categoria_edicion: number;
            categoria: {
                division: string | null;
                nombre: string | null;
            };
            edicion: {
                nombre: string | null;
                temporada: number | null;
            };
        };
        motivo?: string;
        observaciones?: string;
        estado: 'pendiente' | 'aceptado' | 'rechazado';
        fecha_solicitud: string;
        fecha_respuesta?: string | null;
        solicitado_por: {
            uid: string;
            nombre: string;
            apellido: string;
        };
        respondido_por: {
            uid: string;
            nombre: string;
            apellido: string;
        } | null;
        motivo_rechazo?: string;
    }>;
}

