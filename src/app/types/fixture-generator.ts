export interface ZonaElegible {
    id_zona: number;
    nombre: string | null;
    cantidad_equipos: number;
    es_impar: boolean;
}

export interface GenerarFixtureInput {
    id_categoria_edicion: number;
    zonas_seleccionadas: number[];
    incluir_interzonales: boolean;
    distribucion_interzonales: 'concentrada' | 'distribuida';
    posicion_interzonales?: 'inicio' | 'medio' | 'fin' | number; // number = número de jornada específica
    formato_torneo: 'ida' | 'ida-vuelta';
    permitir_fecha_libre: boolean;
    autocompletar_planillero: boolean;
    dia_semana: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    fecha_inicio: string; // formato ISO string
    canchas_seleccionadas: number[];
    hora_inicio: string; // formato "HH:MM"
    hora_fin: string; // formato "HH:MM"
}

export interface GenerarFixtureResponse {
    mensaje: string;
    partidosCreados: number;
    totalJornadas: number;
}

export interface Planillero {
    uid: string;
    nombre: string;
    apellido: string;
}

export interface Cancha {
    id_cancha: number;
    nombre: string;
    id_predio: number;
    nombre_predio?: string;
    tipo_futbol: number;
    estado: string;
}

export interface PreviewFecha {
    fecha: string; // formato DD/MM/YYYY
    diaSemana: string;
}

