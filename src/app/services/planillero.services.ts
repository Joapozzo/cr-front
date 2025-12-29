import { api } from "../lib/api";
import { DashboardPlanillero } from "../types/dashboard";
import { DatosCompletosPlanillero } from "../types/partido";

export interface PlanilleroPartidosResponse {
    message: string;
    total: number;
    partidos: any[];
}

export const planilleroService = {
    dashboardPlanillero: async (): Promise<DashboardPlanillero> => {
        try {
            const response = await api.get<DashboardPlanillero>(`/planillero/dashboard`);
            return response;
        } catch (error) {
            console.error('Error al obtener el dashboard del planillero:', error);
            throw new Error('No se pudieron cargar el dashboard del planillero');
        }
    },
    
    partidosPendientesPlanillero: async (): Promise<PlanilleroPartidosResponse> => {
        try {
            const response = await api.get<PlanilleroPartidosResponse>(`/planillero/partidos-pendientes`);
            return response;
        } catch (error) {
            console.error('Error al obtener partidos pendientes del planillero:', error);
            throw new Error('No se pudieron cargar los partidos pendientes del planillero');
        }
    },

    partidosPlanilladosPlanillero: async (): Promise<PlanilleroPartidosResponse> => {
        try {
            const response = await api.get<PlanilleroPartidosResponse>(`/planillero/partidos-planillados`);
            return response;
        } catch (error) {
            console.error('Error al obtener partidos planillados del planillero:', error);
            throw new Error('No se pudieron cargar los partidos planillados del planillero');
        }
    },

    obtenerDatosCompletosPlanillero: async (idPartido: number): Promise<DatosCompletosPlanillero> => {
        try {
            const response = await api.get<DatosCompletosPlanillero>(`/planillero/partidos/${idPartido}`);
            return response;
        } catch (error) {
            console.error('Error al obtener datos completos del partido:', error);
            throw new Error('No se pudieron cargar los datos del partido');
        }
    },

    // Acciones del partido
    asignarDorsal: async (idCategoriaEdicion: number, idPartido: number, idEquipo: number, idJugador: number, dorsal: number) => {
        const response = await api.post(`/planillero/partido/asignar-dorsal/${idPartido}/${idCategoriaEdicion}`, {
            idEquipo,
            idJugador,
            dorsal
        });
        return response;
    },

    eliminarDorsal: async (idCategoriaEdicion: number, idPartido: number, idJugador: number, idEquipo: number) => {
        const response = await api.put(`/planillero/partido/eliminar-dorsal/${idPartido}/${idCategoriaEdicion}`,
            { idJugador, idEquipo });
        return response;
    },

    comenzarPartido: async (idPartido: number) => {
        const response = await api.post(`/planillero/partidos/comenzar/${idPartido}`);
        return response;
    },

    terminarPrimerTiempo: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/terminar-primer-tiempo/${idPartido}`);
        return response;
    },

    comenzarSegundoTiempo: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/comenzar-segundo-tiempo/${idPartido}`);
        return response;
    },

    terminarPartido: async (idPartido: number, observaciones?: string) => {
        const response = await api.put(`/planillero/partidos/terminar/${idPartido}`, {
            ...(observaciones !== undefined && { observaciones })
        });
        return response;
    },

    finalizarPartido: async (idPartido: number) => {
        const response = await api.put(`/planillero/partidos/finalizar/${idPartido}`);
        return response;
    },

    suspenderPartido: async (idPartido: number, motivo?: string) => {
        const response = await api.put(`/planillero/partidos/suspender/${idPartido}`, {
            motivo
        });
        return response;
    },

    // GOLES
    crearGol: async (idPartido: number, golData: any) => {
        const response = await api.post(`/planillero/goles/${idPartido}`, golData);
        return response;
    },

    editarGol: async (idGol: number, idPartido: number, golData: any) => {
        const response = await api.put(`/planillero/goles/${idGol}/${idPartido}`, golData);
        return response;
    },

    eliminarGol: async (idGol: number, idPartido: number) => {
        const response = await api.delete(`/planillero/goles/${idGol}/${idPartido}`);
        return response;
    },

    obtenerGolesPorPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/goles/partido/${idPartido}`);
        return response;
    },

    // AMONESTACIONES
    crearAmonestacion: async (idPartido: number, amonestacionData: any) => {
        const response = await api.post(`/planillero/amonestaciones/${idPartido}`, amonestacionData);
        return response;
    },

    editarAmonestacion: async (idAmonestacion: number, idPartido: number, amonestacionData: any) => {
        const response = await api.put(`/planillero/amonestaciones/${idAmonestacion}/${idPartido}`, amonestacionData);
        return response;
    },

    eliminarAmonestacion: async (idAmonestacion: number, idPartido: number) => {
        const response = await api.delete(`/planillero/amonestaciones/${idAmonestacion}/${idPartido}`);
        return response;
    },

    obtenerAmonestacionesPorPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/amonestaciones/partido/${idPartido}`);
        return response;
    },

    // EXPULSIONES
    crearExpulsion: async (idPartido: number, expulsionData: any) => {
        const response = await api.post(`/planillero/expulsiones/${idPartido}`, expulsionData);
        return response;
    },

    editarExpulsion: async (idExpulsion: number, idPartido: number, expulsionData: any) => {
        const response = await api.put(`/planillero/expulsiones/${idExpulsion}/${idPartido}`, expulsionData);
        return response;
    },

    eliminarExpulsion: async (idExpulsion: number, idPartido: number) => {
        const response = await api.delete(`/planillero/expulsiones/${idExpulsion}/${idPartido}`);
        return response;
    },

    obtenerExpulsionesPorPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/expulsiones/partido/${idPartido}`);
        return response;
    },

    // INCIDENCIAS GENERALES
    obtenerIncidenciasPartido: async (idPartido: number) => {
        const response = await api.get(`/planillero/incidencias/partido/${idPartido}`);
        return response;
    },

    // JUGADORES EVENTUALES
    inscribirJugadorEventual: async (idPartido: number, jugadorData: {
        dni: string;
        nombre: string;
        apellido: string;
        email: string;
        id_equipo: number;
        id_categoria_edicion: number;
        dorsal?: number;
        fecha_nacimiento?: string;
    }) => {
        try {
            const response = await api.post(`/planillero/inscribir-jugador-eventual/${idPartido}`, jugadorData);
            return response;
        } catch (error) {
            console.error('Error al inscribir jugador eventual:', error);
            throw error;
        }
    },

    // JUGADORES DESTACADOS
    marcarJugadorDestacado: async (idPartido: number, jugadorData: any) => {
        const response = await api.put(`/planillero/marcar-jugador-destacado/${idPartido}`, jugadorData);
        return response;
    },

    desmarcarJugadorDestacado: async (idPartido: number, jugadorData: any) => {
        const response = await api.put(`/planillero/desmarcar-jugador-destacado/${idPartido}`, jugadorData);
        return response;
    },

    seleccionarMVP: async (idPartido: number, mvpData: any) => {
        const response = await api.put(`/planillero/seleccionar-mvp/${idPartido}`, mvpData);
        return response;
    },

    // Validaciones en tiempo real
    validarEmail: async (email: string) => {
        try {
            const response = await api.get(`/planillero/validar-email/${encodeURIComponent(email)}`);
            return response;
        } catch (error) {
            console.error('Error al validar email:', error);
            throw error;
        }
    },

    validarDNI: async (dni: string) => {
        try {
            const response = await api.get(`/planillero/validar-dni/${dni}`);
            return response;
        } catch (error) {
            console.error('Error al validar DNI:', error);
            throw error;
        }
    },

    // PENALES
    registrarPenales: async (idPartido: number, penLocal: number, penVisita: number) => {
        try {
            const response = await api.put(`/planillero/partidos/${idPartido}/penales`, {
                pen_local: penLocal,
                pen_visita: penVisita
            });
            return response;
        } catch (error) {
            console.error('Error al registrar penales:', error);
            throw error;
        }
    },

    // OBSERVACIONES
    guardarObservacionesPartido: async (idPartido: number, observaciones: string) => {
        try {
            const response = await api.put(`/planillero/partidos/${idPartido}/observaciones`, {
                observaciones
            });
            return response;
        } catch (error) {
            console.error('Error al guardar observaciones:', error);
            throw error;
        }
    }
}