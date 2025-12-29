/**
 * Tipos TypeScript para Legajos de Equipos
 */
import { PaginacionMetadata, ResultadoPartido, TipoRanking, TipoFixture, EstadoSolicitud } from './common.types';

export interface EquipoBusqueda {
    id_equipo: number;
    nombre: string;
    img?: string;
    categorias: Array<{
        id_categoria_edicion: number;
        categoria: {
            division: string | null;
            nombre: string | null;
        };
        edicion: {
            nombre: string | null;
            temporada: number | null;
        };
    }>;
    total_jugadores: number;
    link_legajo: string;
}

export interface BusquedaEquiposParams {
    q?: string;
    id_categoria_edicion?: number;
    page?: number;
    limit?: number;
}

export interface BusquedaEquiposResponse {
    data: EquipoBusqueda[];
    pagination: PaginacionMetadata;
}

export interface EquipoInformacionBasica {
    id_equipo: number;
    nombre: string;
    descripcion?: string;
    img?: string;
    resumen: {
        categorias_activas: number;
        total_jugadores: number;
        total_partidos: number;
    };
}

export interface PlantelEquipo {
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
    capitanes: Array<{
        id_jugador: number;
        nombre: string;
        apellido: string;
        img?: string;
        fecha_inicio: string;
    }>;
    jugadores: Array<{
        jugador: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            img?: string;
            posicion: {
                codigo: string;
                nombre: string;
            };
        };
        tipo: 'eventual' | 'titular';
        estado: 'activo' | 'baja';
        partidos_jugados: number;
        estadisticas: {
            goles: number;
            asistencias: number;
            amarillas: number;
            rojas: number;
        };
        sancionado: boolean;
        fecha_adicion: string;
    }>;
    contadores: {
        eventuales: {
            usados: number;
            disponibles: number;
        };
        partidos_eventuales_por_jugador: Array<{
            id_jugador: number;
            partidos_eventuales: number;
        }>;
    };
    jugadores_sancionados: Array<{
        id_jugador: number;
        nombre: string;
        apellido: string;
        img?: string;
    }>;
}

export interface CategoriaEquipo {
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
    estado_temporada: string;
    zona: {
        id_zona: number;
        nombre: string;
    } | null;
    resumen: {
        partidos_jugados: number;
        posicion_tabla: number | null;
    };
}

export interface EstadisticasEquipo {
    estadisticas_generales: {
        partidos_jugados: number;
        partidos_ganados: number;
        partidos_empatados: number;
        partidos_perdidos: number;
        goles_favor: number;
        goles_contra: number;
        diferencia_goles: number;
        puntos: number;
        apercibimientos: number;
    };
    por_zona: Array<{
        zona: {
            id_zona: number;
            nombre: string;
        };
        estadisticas: {
            partidos_jugados: number;
            partidos_ganados: number;
            partidos_empatados: number;
            partidos_perdidos: number;
            goles_favor: number;
            goles_contra: number;
            diferencia_goles: number;
            puntos: number;
            apercibimientos: number;
        };
        posicion: number;
    }>;
    racha: {
        ultimos_resultados: ResultadoPartido[];
        cantidad: number;
    };
}

export interface PartidoEquipo {
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
    rival: {
        id_equipo: number;
        nombre: string;
        img?: string;
    } | null;
    goles_equipo: Array<{
        id_gol: number;
        jugador: {
            id_jugador?: number;
            nombre?: string;
            apellido?: string;
        } | null;
        minuto: number | null;
        tipo: 'normal' | 'penal' | 'autogol';
    }>;
    tarjetas: {
        amarillas: Array<{
            id_amonestacion: number;
            jugador: {
                id_jugador?: number;
                nombre?: string;
                apellido?: string;
            } | null;
            minuto: number | null;
        }>;
        rojas: Array<{
            id_expulsion: number;
            jugador: {
                id_jugador?: number;
                nombre?: string;
                apellido?: string;
            } | null;
            minuto: number | null;
            tipo_tarjeta: string | null;
        }>;
    };
}

export interface HistorialPartidosEquipoResponse {
    data: PartidoEquipo[];
    pagination: PaginacionMetadata;
}

export interface TablaPosiciones {
    tablas: Array<{
        zona: {
            id_zona: number;
            nombre: string;
            tipo?: string;
            fase?: number;
        };
        tabla: Array<{
            equipo: {
                id_equipo: number;
                nombre: string;
                img?: string;
            };
            partidos_jugados: number;
            ganados: number;
            empatados: number;
            perdidos: number;
            goles_favor: number;
            goles_contra: number;
            diferencia_goles: number;
            puntos: number;
        }>;
        posicion_equipo: number;
    }>;
}

export interface GoleadorEquipo {
    jugador: {
        id_jugador: number;
        nombre: string;
        apellido: string;
        img?: string;
        posicion: {
            codigo: string;
            nombre: string;
        };
    } | null;
    total: number;
    goles_normales?: number;
    goles_penales?: number;
    goles_autogoles?: number;
    partidos_jugados?: number;
}

export interface HistorialCapitanes {
    capitanes_actuales: Array<{
        id_jugador: number;
        nombre: string;
        apellido: string;
        img?: string;
        fecha_inicio: string;
        fecha_fin?: string | null;
    }>;
    capitanes_anteriores: Array<{
        id_jugador: number;
        nombre: string;
        apellido: string;
        img?: string;
        fecha_inicio: string;
        fecha_fin?: string | null;
    }>;
}

export interface SancionEquipo {
    id_expulsion: number;
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
    fecha_expulsion: string;
    motivo?: string;
    estado: 'activo' | 'inactivo';
}

export interface FixtureEquipo {
    id_partido: number;
    fecha: string | null;
    hora: string | null;
    jornada: number;
    rival: {
        id_equipo: number;
        nombre: string;
        img?: string;
    } | null;
    cancha: {
        id_cancha: number;
        nombre: string;
        predio?: string;
    } | null;
    zona?: string;
    resultado: ResultadoPartido | null;
    goles_local: number | null;
    goles_visita: number | null;
}

export interface SolicitudesEquipo {
    jugadores_solicitaron: Array<{
        id_solicitud: number;
        jugador: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            img?: string;
        };
        mensaje_jugador?: string;
        estado: 'enviado' | 'aceptado' | 'rechazado';
        fecha_solicitud: string;
        fecha_respuesta?: string | null;
    }>;
    invitaciones_enviadas: Array<{
        id_solicitud: number;
        jugador: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            img?: string;
        };
        mensaje_capitan?: string;
        estado: 'enviado' | 'aceptado' | 'rechazado';
        fecha_solicitud: string;
        fecha_respuesta?: string | null;
    }>;
}

