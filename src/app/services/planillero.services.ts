import { api } from "../lib/api";
import { DashboardPlanillero } from "../types/dashboard";
import { DatosCompletosPlanillero } from "../types/partido";

const ID_PLANILLERO = 'd18376b2-7448-4dbb-b29d-b55a2a4e573e';

export interface PlanilleroPartidosResponse {
    message: string;
    total: number;
    partidos: any[];
}

export const planilleroService = {
    dashboardPlanillero: async (): Promise<DashboardPlanillero> => {
        try {
            const response = await api.get<DashboardPlanillero>(`/planillero/dashboard/${ID_PLANILLERO}`);
            return response;
        } catch (error) {
            console.error('Error al obtener el dashboard del planillero:', error);
            throw new Error('No se pudieron cargar el dashboard del planillero');
        }
    },
    
    partidosPendientesPlanillero: async (): Promise<PlanilleroPartidosResponse> => {
        try {
            const response = await api.get(`/planillero/partidos-pendientes/${ID_PLANILLERO}`);
            return response;
        } catch (error) {
            console.error('Error al obtener partidos pendientes del planillero:', error);
            throw new Error('No se pudieron cargar los partidos pendientes del planillero');
        }
    },

    partidosPlanilladosPlanillero: async (): Promise<PlanilleroPartidosResponse> => {
        try {
            const response = await api.get(`/planillero/partidos-planillados/${ID_PLANILLERO}`);
            return response;
        } catch (error) {
            console.error('Error al obtener partidos planillados del planillero:', error);
            throw new Error('No se pudieron cargar los partidos planillados del planillero');
        }
    },

    obtenerDatosCompletosPlanillero: async (idPartido: number): Promise<DatosCompletosPlanillero> => {
        try {
            const response = await api.get(`/planillero/partidos/${idPartido}/${ID_PLANILLERO}`);
            return response;
        } catch (error) {
            console.error('Error al obtener datos completos del partido:', error);
            throw new Error('No se pudieron cargar los datos del partido');
        }
    },

    // Acciones del partido
    asignarDorsal: async (idCategoriaEdicion: number, idPartido: number, idEquipo: number, idJugador: number, dorsal: number) => {
        const response = await api.post(`/planillero/partido/asignar-dorsal/${idPartido}/${idCategoriaEdicion}/${ID_PLANILLERO}`, {
            idEquipo,
            idJugador,
            dorsal
        });
        return response;
    },

    eliminarDorsal: async (idCategoriaEdicion: number, idPartido: number, idJugador: number, idEquipo: number) => {
        const response = await api.put(`/planillero/partido/eliminar-dorsal/${idPartido}/${idCategoriaEdicion}/${ID_PLANILLERO}`,
            { idJugador, idEquipo });
        return response;
    },

    comenzarPartido: async (idPartido: number) => {
        const response = await api.post(`/planillero/partidos/comenzar/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    terminarPrimerTiempo: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/terminar-primer-tiempo/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    comenzarSegundoTiempo: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/comenzar-segundo-tiempo/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    terminarPartido: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/terminar/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    finalizarPartido: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/finalizar/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    suspenderPartido: async (idPartido: number, motivo?: string) => {
        const response = await api.put(`/planillero/partidos/suspender/${idPartido}/${ID_PLANILLERO}`, {
            motivo
        });
        return response;
    },

    // GOLES
    crearGol: async (idPartido: number, golData: any) => {
        const response = await api.post(`/planillero/goles/${idPartido}/${ID_PLANILLERO}`, golData);
        return response;
    },

    editarGol: async (idGol: number, idPartido: number, golData: any) => {
        const response = await api.put(`/planillero/goles/${idGol}/${idPartido}/${ID_PLANILLERO}`, golData);
        return response;
    },

    eliminarGol: async (idGol: number, idPartido: number) => {
        const response = await api.delete(`/planillero/goles/${idGol}/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    obtenerGolesPorPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/goles/partido/${idPartido}`);
        return response;
    },

    // AMONESTACIONES
    crearAmonestacion: async (idPartido: number, amonestacionData: any) => {
        const response = await api.post(`/planillero/amonestaciones/${idPartido}/${ID_PLANILLERO}`, amonestacionData);
        return response;
    },

    editarAmonestacion: async (idAmonestacion: number, idPartido: number, amonestacionData: any) => {
        const response = await api.put(`/planillero/amonestaciones/${idAmonestacion}/${idPartido}/${ID_PLANILLERO}`, amonestacionData);
        return response;
    },

    eliminarAmonestacion: async (idAmonestacion: number, idPartido: number) => {
        const response = await api.delete(`/planillero/amonestaciones/${idAmonestacion}/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    obtenerAmonestacionesPorPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/amonestaciones/partido/${idPartido}`);
        return response;
    },

    // EXPULSIONES
    crearExpulsion: async (idPartido: number, expulsionData: any) => {
        const response = await api.post(`/planillero/expulsiones/${idPartido}/${ID_PLANILLERO}`, expulsionData);
        return response;
    },

    editarExpulsion: async (idExpulsion: number, idPartido: number, expulsionData: any) => {
        const response = await api.put(`/planillero/expulsiones/${idExpulsion}/${idPartido}/${ID_PLANILLERO}`, expulsionData);
        return response;
    },

    eliminarExpulsion: async (idExpulsion: number, idPartido: number) => {
        const response = await api.delete(`/planillero/expulsiones/${idExpulsion}/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    obtenerExpulsionesPorPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/expulsiones/partido/${idPartido}`);
        return response;
    },

    // INCIDENCIAS GENERALES
    obtenerIncidenciasPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/incidencias/partido/${idPartido}/${ID_PLANILLERO}`);
        return response;
    },

    // JUGADORES EVENTUALES
    inscribirJugadorEventual: async (idPartido: number, jugadorData: any) => {
        const response = await api.post(`/planillero/inscribir-jugador-eventual/${idPartido}/${ID_PLANILLERO}`, jugadorData);
        return response;
    },

    // JUGADORES DESTACADOS
    marcarJugadorDestacado: async (idPartido: number, jugadorData: any) => {
        const response = await api.put(`/planillero/marcar-jugador-destacado/${idPartido}/${ID_PLANILLERO}`, jugadorData);
        return response;
    },

    desmarcarJugadorDestacado: async (idPartido: number, jugadorData: any) => {
        const response = await api.put(`/planillero/desmarcar-jugador-destacado/${idPartido}/${ID_PLANILLERO}`, jugadorData);
        return response;
    },

    seleccionarMVP: async (idPartido: number, mvpData: any) => {
        const response = await api.put(`/planillero/seleccionar-mvp/${idPartido}/${ID_PLANILLERO}`, mvpData);
        return response;
    }
}