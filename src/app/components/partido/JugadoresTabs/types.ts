import { IncidenciaPartido, JugadorPlantel, EstadoPartido, JugadorDestacado } from '@/app/types/partido';

export interface EquipoData {
    id_equipo: number;
    nombre: string;
    jugadores: JugadorPlantel[];
}

export type TabType = 'local' | 'incidencias' | 'visita';

export interface ModalCambioState {
    isOpen: boolean;
    jugadorSale: JugadorPlantel | null;
    equipo: 'local' | 'visita';
}

export interface ModalEditarCambioState {
    isOpen: boolean;
    cambioId: number | null;
    jugadorSaleId: number | null;
    minuto: number | null;
    equipo: 'local' | 'visita';
}

export interface ModalEliminarCambioState {
    isOpen: boolean;
    cambioId: number | null;
    incidencia: IncidenciaPartido | null;
}

export interface ModalEliminarIncidenciaState {
    isOpen: boolean;
    incidencia: IncidenciaPartido | null;
}

export interface DobleAmarillaData {
    primeraAmarilla: IncidenciaPartido;
    segundaAmarilla: IncidenciaPartido;
    roja: IncidenciaPartido;
}

export interface IncidenciaAgrupada {
    tipo: 'separador' | 'incidencia';
    tiempo?: '1T' | '2T' | 'ET' | 'PEN';
    estadoPartido?: EstadoPartido;
    esTerminado?: boolean;
    incidencia?: IncidenciaPartido;
    asistenciaRelacionada?: IncidenciaPartido;
    segundaAmarillaRelacionada?: IncidenciaPartido;
    rojaRelacionada?: IncidenciaPartido;
    esDobleAmarilla?: boolean;
    dobleAmarillaData?: DobleAmarillaData;
}

export interface CambioNormalizado {
    id_cambio: number;
    id_partido: number;
    id_jugador_entra: number | null;
    id_jugador_sale: number | null;
    minuto: number;
    tiempo: string | null;
    tipo_cambio: 'ENTRADA' | 'SALIDA';
    registrado_por: string | null;
    registrado_en: string;
    observaciones: string | null;
    jugadorEntra?: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
        };
    } | null;
    jugadorSale?: {
        id_jugador: number;
        usuario: {
            nombre: string;
            apellido: string;
        };
    } | null;
    registrador: any | null;
    id_equipo?: number | null;
}

export interface CambiosProp {
    id_cambio: number;
    id_partido: number;
    tipo_cambio: 'ENTRADA' | 'SALIDA';
    minuto: number;
    tiempo: string | null;
    id_jugador_sale: number | null;
    id_jugador_entra: number | null;
    id_equipo: number | null;
    jugadorSale?: {
        id_jugador: number;
        nombre: string;
        apellido: string;
    } | null;
    jugadorEntra?: {
        id_jugador: number;
        nombre: string;
        apellido: string;
    } | null;
}

