// useCrearGol.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';
import { DatosCompletosPlanillero, IncidenciaPartido } from '../types/partido';
import { planilleroKeys } from './usePartidosPlanillero';

interface CrearGolData {
    idPartido: number;
    golData: {
        id_categoria_edicion: number;
        id_equipo: number;
        id_jugador: number;
        minuto: number;
        penal: "S" | "N";
        en_contra: "S" | "N";
        asistencia: "S" | "N";
        id_jugador_asistencia?: number;
    };
}

export const useCrearGol = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idPartido, golData }: CrearGolData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.crearGol(idPartido, golData);
        },
        onMutate: async ({ idPartido, golData }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                // Obtener datos del jugador desde el plantel
                const equipoKey = golData.id_equipo === previousData.partido.equipoLocal?.id_equipo 
                    ? 'plantel_local' 
                    : 'plantel_visita';
                const plantel = previousData[equipoKey] || [];
                const jugador = plantel.find(j => j.id_jugador === golData.id_jugador);

                if (jugador) {
                    // Crear incidencia optimista temporal
                    const nuevaIncidencia: IncidenciaPartido = {
                        tipo: 'gol',
                        id: Date.now(), // ID temporal negativo para identificar
                        id_jugador: golData.id_jugador,
                        id_equipo: golData.id_equipo,
                        minuto: golData.minuto,
                        nombre: jugador.nombre,
                        apellido: jugador.apellido,
                        penal: golData.penal,
                        en_contra: golData.en_contra,
                        _optimistic: true // Flag para identificar
                    };

                    // Actualizar goles del partido optimísticamente
                    const nuevoGolesLocal = golData.id_equipo === previousData.partido.equipoLocal?.id_equipo
                        ? (previousData.partido.goles_local || 0) + (golData.en_contra === 'S' ? 0 : 1)
                        : (previousData.partido.goles_local || 0) + (golData.en_contra === 'S' ? 1 : 0);
                    
                    const nuevoGolesVisita = golData.id_equipo === previousData.partido.equipoVisita?.id_equipo
                        ? (previousData.partido.goles_visita || 0) + (golData.en_contra === 'S' ? 0 : 1)
                        : (previousData.partido.goles_visita || 0) + (golData.en_contra === 'S' ? 1 : 0);

                    queryClient.setQueryData<DatosCompletosPlanillero>(
                        ['planillero', 'datos-completos', idPartido],
                        {
                            ...previousData,
                            incidencias: [...(previousData.incidencias || []), nuevaIncidencia],
                            partido: {
                                ...previousData.partido,
                                goles_local: nuevoGolesLocal,
                                goles_visita: nuevoGolesVisita
                            }
                        }
                    );
                }
            }

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['planillero', 'datos-completos', variables.idPartido],
                    context.previousData
                );
            }
        },
        onSuccess: (data, variables) => {
            // Invalidar incidencias
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.incidencias(variables.idPartido)
            });
            // Invalidar datos básicos porque cambió el marcador
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosBasicos(variables.idPartido)
            });
            // Invalidar plantel del equipo porque cambió estadísticas de goles
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.plantel(variables.idPartido, variables.golData.id_equipo)
            });
            // También invalidar datos completos por compatibilidad
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useCrearAmonestacion.ts
interface CrearAmonestacionData {
    idPartido: number;
    amonestacionData: {
        id_categoria_edicion: number;
        id_equipo: number;
        id_jugador: number;
        minuto: number;
    };
}

export const useCrearAmonestacion = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idPartido, amonestacionData }: CrearAmonestacionData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.crearAmonestacion(idPartido, amonestacionData);
        },
        onMutate: async ({ idPartido, amonestacionData }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const equipoKey = amonestacionData.id_equipo === previousData.partido.equipoLocal?.id_equipo 
                    ? 'plantel_local' 
                    : 'plantel_visita';
                const plantel = previousData[equipoKey] || [];
                const jugador = plantel.find(j => j.id_jugador === amonestacionData.id_jugador);

                if (jugador) {
                    const nuevaIncidencia: IncidenciaPartido = {
                        tipo: 'amarilla',
                        id: Date.now(),
                        id_jugador: amonestacionData.id_jugador,
                        id_equipo: amonestacionData.id_equipo,
                        minuto: amonestacionData.minuto,
                        nombre: jugador.nombre,
                        apellido: jugador.apellido,
                        _optimistic: true
                    };

                    queryClient.setQueryData<DatosCompletosPlanillero>(
                        ['planillero', 'datos-completos', idPartido],
                        {
                            ...previousData,
                            incidencias: [...(previousData.incidencias || []), nuevaIncidencia]
                        }
                    );
                }
            }

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['planillero', 'datos-completos', variables.idPartido],
                    context.previousData
                );
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.incidencias(variables.idPartido)
            });
            // Invalidar plantel porque cambió estadísticas de amarillas y posiblemente sancionado
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.plantel(variables.idPartido, variables.amonestacionData.id_equipo)
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useCrearExpulsion.ts
interface CrearExpulsionData {
    idPartido: number;
    expulsionData: {
        id_categoria_edicion: number;
        id_equipo: number;
        id_jugador: number;
        minuto: number;
        motivo: string;
    };
}

export const useCrearExpulsion = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idPartido, expulsionData }: CrearExpulsionData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.crearExpulsion(idPartido, expulsionData);
        },
        onMutate: async ({ idPartido, expulsionData }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const equipoKey = expulsionData.id_equipo === previousData.partido.equipoLocal?.id_equipo 
                    ? 'plantel_local' 
                    : 'plantel_visita';
                const plantel = previousData[equipoKey] || [];
                const jugador = plantel.find(j => j.id_jugador === expulsionData.id_jugador);

                if (jugador) {
                    const nuevaIncidencia: IncidenciaPartido = {
                        tipo: 'roja',
                        id: Date.now(),
                        id_jugador: expulsionData.id_jugador,
                        id_equipo: expulsionData.id_equipo,
                        minuto: expulsionData.minuto,
                        nombre: jugador.nombre,
                        apellido: jugador.apellido,
                        observaciones: expulsionData.motivo,
                        _optimistic: true
                    };

                    queryClient.setQueryData<DatosCompletosPlanillero>(
                        ['planillero', 'datos-completos', idPartido],
                        {
                            ...previousData,
                            incidencias: [...(previousData.incidencias || []), nuevaIncidencia]
                        }
                    );
                }
            }

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['planillero', 'datos-completos', variables.idPartido],
                    context.previousData
                );
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.incidencias(variables.idPartido)
            });
            // Invalidar plantel porque cambió estadísticas de rojas y estado sancionado
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.plantel(variables.idPartido, variables.expulsionData.id_equipo)
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};