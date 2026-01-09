// ============================================
// TIPOS PARA DASHBOARD DE ADMINISTRACIÓN
// ============================================

export interface CategoriaActiva {
    id_categoria_edicion: number;
    nombre_completo: string;
    id_edicion: number;
    nombre_edicion: string | null;
    color: string | null;
}

export interface ZonaSinTerminar {
    id_zona: number;
    nombre_zona: string | null;
    nombre_categoria_completo: string;
    nombre_edicion: string | null;
    id_edicion: number;
    id_categoria_edicion: number;
    cantidad_equipos: number | null;
    fase: number | null;
    etapa: string | null;
    partidos_totales: number;
    partidos_finalizados: number;
}

export interface SancionActiva {
    id_expulsion: number;
    jugador: {
        nombre: string;
        apellido: string;
        img: string | null;
    };
    equipo: {
        id_equipo: number;
        nombre: string;
    };
    categoria: string;
    fechas_restantes: number | null;
    motivo: string | null;
    tipo_tarjeta: string | null;
}

export interface PartidoEnVivo {
    id_partido: number;
    jornada: number;
    dia: string | null; // ISO date string from backend
    hora: string | null;
    goles_local: number | null;
    goles_visita: number | null;
    estado: string;
    hora_inicio: string | null; // ISO datetime string from backend
    tiempo_transcurrido_minutos: number | null;
    equipoLocal: {
        id_equipo: number;
        nombre: string;
        img: string | null;
    };
    equipoVisita: {
        id_equipo: number;
        nombre: string;
        img: string | null;
    };
    categoria: string;
    zona: string | null;
}

export interface JugadorEventual {
    id_jugador: number;
    id_equipo: number;
    id_categoria_edicion: number;
    jugador: {
        nombre: string;
        apellido: string;
        img: string | null;
    };
    equipo: {
        nombre: string;
    };
    categoria: string;
    partidos_eventuales_jugados: number;
    limite_partidos_eventuales: number | null;
    partidos_restantes: number;
}

export interface EstadisticasChart {
    partidos_por_estado: {
        estado: string;
        cantidad: number;
    }[];
    equipos_por_categoria: {
        categoria: string;
        cantidad: number;
    }[];
    goles_por_jornada: {
        jornada: number;
        total_goles: number;
    }[];
    sanciones_por_tipo: {
        tipo_tarjeta: string;
        cantidad: number;
    }[];
}

