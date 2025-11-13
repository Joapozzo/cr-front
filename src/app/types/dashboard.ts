import { PartidoCompleto } from "./partido";

export interface EstadisticasPlanillero {
    pendientes: number;
    completados: number;
    completados_este_mes: number;
}

export interface DashboardPlanillero { 
    message: string;
    estadisticas: EstadisticasPlanillero;
    proximo_partido: PartidoCompleto | null;
    partidos_semana: PartidoCompleto[];
}