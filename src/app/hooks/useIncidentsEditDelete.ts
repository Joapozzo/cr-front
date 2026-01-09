// useEditarGol.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';
import { DatosCompletosPlanillero } from '../types/partido';
import { planilleroKeys } from './usePartidosPlanillero';

interface EditarGolData {
    idGol: number;
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

export const useEditarGol = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idGol, idPartido, golData }: EditarGolData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.editarGol(idGol, idPartido, golData);
        },
        onMutate: async ({ idPartido, idGol, golData }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const incidencias = previousData.incidencias || [];
                const incidenciaIndex = incidencias.findIndex(inc => inc.id === idGol && inc.tipo === 'gol');
                
                if (incidenciaIndex !== -1) {
                    const incidenciaAnterior = incidencias[incidenciaIndex];
                    const equipoKey = golData.id_equipo === previousData.partido.equipoLocal?.id_equipo 
                        ? 'plantel_local' 
                        : 'plantel_visita';
                    const plantel = previousData[equipoKey] || [];
                    const jugador = plantel.find(j => j.id_jugador === golData.id_jugador);

                    if (jugador) {
                        const incidenciasActualizadas = [...incidencias];
                        incidenciasActualizadas[incidenciaIndex] = {
                            ...incidenciaAnterior,
                            id_jugador: golData.id_jugador,
                            id_equipo: golData.id_equipo,
                            minuto: golData.minuto,
                            nombre: jugador.nombre,
                            apellido: jugador.apellido,
                            penal: golData.penal,
                            en_contra: golData.en_contra
                        };

                        // Recalcular goles si cambió en_contra o equipo
                        let nuevoGolesLocal = previousData.partido.goles_local || 0;
                        let nuevoGolesVisita = previousData.partido.goles_visita || 0;

                        // Revertir gol anterior
                        if (incidenciaAnterior.en_contra === 'S') {
                            if (incidenciaAnterior.id_equipo === previousData.partido.equipoLocal?.id_equipo) {
                                nuevoGolesVisita = Math.max(0, nuevoGolesVisita - 1);
                            } else {
                                nuevoGolesLocal = Math.max(0, nuevoGolesLocal - 1);
                            }
                        } else {
                            if (incidenciaAnterior.id_equipo === previousData.partido.equipoLocal?.id_equipo) {
                                nuevoGolesLocal = Math.max(0, nuevoGolesLocal - 1);
                            } else {
                                nuevoGolesVisita = Math.max(0, nuevoGolesVisita - 1);
                            }
                        }

                        // Aplicar nuevo gol
                        if (golData.en_contra === 'S') {
                            if (golData.id_equipo === previousData.partido.equipoLocal?.id_equipo) {
                                nuevoGolesVisita += 1;
                            } else {
                                nuevoGolesLocal += 1;
                            }
                        } else {
                            if (golData.id_equipo === previousData.partido.equipoLocal?.id_equipo) {
                                nuevoGolesLocal += 1;
                            } else {
                                nuevoGolesVisita += 1;
                            }
                        }

                        queryClient.setQueryData<DatosCompletosPlanillero>(
                            ['planillero', 'datos-completos', idPartido],
                            {
                                ...previousData,
                                incidencias: incidenciasActualizadas,
                                partido: {
                                    ...previousData.partido,
                                    goles_local: nuevoGolesLocal,
                                    goles_visita: nuevoGolesVisita
                                }
                            }
                        );
                    }
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
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosBasicos(variables.idPartido)
            });
            // Invalidar todos los planteles porque puede cambiar de equipo
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useEliminarGol.ts
interface EliminarGolData {
    idGol: number;
    idPartido: number;
}

export const useEliminarGol = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idGol, idPartido }: EliminarGolData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.eliminarGol(idGol, idPartido);
        },
        onMutate: async ({ idPartido, idGol }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const incidencias = previousData.incidencias || [];
                const incidenciaIndex = incidencias.findIndex(inc => inc.id === idGol && inc.tipo === 'gol');
                
                if (incidenciaIndex !== -1) {
                    const incidenciaEliminada = incidencias[incidenciaIndex];
                    const incidenciasActualizadas = incidencias.filter((_, index) => index !== incidenciaIndex);

                    // Revertir gol del marcador
                    let nuevoGolesLocal = previousData.partido.goles_local || 0;
                    let nuevoGolesVisita = previousData.partido.goles_visita || 0;

                    if (incidenciaEliminada.en_contra === 'S') {
                        if (incidenciaEliminada.id_equipo === previousData.partido.equipoLocal?.id_equipo) {
                            nuevoGolesVisita = Math.max(0, nuevoGolesVisita - 1);
                        } else {
                            nuevoGolesLocal = Math.max(0, nuevoGolesLocal - 1);
                        }
                    } else {
                        if (incidenciaEliminada.id_equipo === previousData.partido.equipoLocal?.id_equipo) {
                            nuevoGolesLocal = Math.max(0, nuevoGolesLocal - 1);
                        } else {
                            nuevoGolesVisita = Math.max(0, nuevoGolesVisita - 1);
                        }
                    }

                    queryClient.setQueryData<DatosCompletosPlanillero>(
                        ['planillero', 'datos-completos', idPartido],
                        {
                            ...previousData,
                            incidencias: incidenciasActualizadas,
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
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.incidencias(variables.idPartido)
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosBasicos(variables.idPartido)
            });
            // Invalidar todos los planteles porque puede cambiar de equipo
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useEditarAmonestacion.ts
interface EditarAmonestacionData {
    idAmonestacion: number;
    idPartido: number;
    amonestacionData: {
        id_categoria_edicion: number;
        id_equipo: number;
        id_jugador: number;
        minuto: number;
    };
}

export const useEditarAmonestacion = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idAmonestacion, idPartido, amonestacionData }: EditarAmonestacionData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.editarAmonestacion(idAmonestacion, idPartido, amonestacionData);
        },
        onMutate: async ({ idPartido, idAmonestacion, amonestacionData }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const incidencias = previousData.incidencias || [];
                const incidenciaIndex = incidencias.findIndex(inc => inc.id === idAmonestacion && inc.tipo === 'amarilla');
                
                if (incidenciaIndex !== -1) {
                    const incidenciaAnterior = incidencias[incidenciaIndex];
                    const equipoKey = amonestacionData.id_equipo === previousData.partido.equipoLocal?.id_equipo 
                        ? 'plantel_local' 
                        : 'plantel_visita';
                    const plantel = previousData[equipoKey] || [];
                    const jugador = plantel.find(j => j.id_jugador === amonestacionData.id_jugador);

                    if (jugador) {
                        const incidenciasActualizadas = [...incidencias];
                        incidenciasActualizadas[incidenciaIndex] = {
                            ...incidenciaAnterior,
                            id_jugador: amonestacionData.id_jugador,
                            id_equipo: amonestacionData.id_equipo,
                            minuto: amonestacionData.minuto,
                            nombre: jugador.nombre,
                            apellido: jugador.apellido
                        };

                        queryClient.setQueryData<DatosCompletosPlanillero>(
                            ['planillero', 'datos-completos', idPartido],
                            {
                                ...previousData,
                                incidencias: incidenciasActualizadas
                            }
                        );
                    }
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
            // Invalidar todos los planteles porque puede cambiar de equipo y estadísticas
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useEliminarAmonestacion.ts
interface EliminarAmonestacionData {
    idAmonestacion: number;
    idPartido: number;
}

export const useEliminarAmonestacion = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idAmonestacion, idPartido }: EliminarAmonestacionData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.eliminarAmonestacion(idAmonestacion, idPartido);
        },
        onMutate: async ({ idPartido, idAmonestacion }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const incidencias = previousData.incidencias || [];
                const incidenciasActualizadas = incidencias.filter(
                    inc => !(inc.id === idAmonestacion && inc.tipo === 'amarilla')
                );

                queryClient.setQueryData<DatosCompletosPlanillero>(
                    ['planillero', 'datos-completos', idPartido],
                    {
                        ...previousData,
                        incidencias: incidenciasActualizadas
                    }
                );
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
            // Invalidar todos los planteles porque puede revertir sanción y cambiar estadísticas
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useEditarExpulsion.ts
interface EditarExpulsionData {
    idExpulsion: number;
    idPartido: number;
    expulsionData: {
        id_categoria_edicion: number;
        id_equipo: number;
        id_jugador: number;
        minuto: number;
        motivo: string;
    };
}

export const useEditarExpulsion = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idExpulsion, idPartido, expulsionData }: EditarExpulsionData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.editarExpulsion(idExpulsion, idPartido, expulsionData);
        },
        onMutate: async ({ idPartido, idExpulsion, expulsionData }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const incidencias = previousData.incidencias || [];
                const incidenciaIndex = incidencias.findIndex(
                    inc => (inc.id === idExpulsion && (inc.tipo === 'roja' || inc.tipo === 'doble_amarilla'))
                );
                
                if (incidenciaIndex !== -1) {
                    const incidenciaAnterior = incidencias[incidenciaIndex];
                    const equipoKey = expulsionData.id_equipo === previousData.partido.equipoLocal?.id_equipo 
                        ? 'plantel_local' 
                        : 'plantel_visita';
                    const plantel = previousData[equipoKey] || [];
                    const jugador = plantel.find(j => j.id_jugador === expulsionData.id_jugador);

                    if (jugador) {
                        const incidenciasActualizadas = [...incidencias];
                        incidenciasActualizadas[incidenciaIndex] = {
                            ...incidenciaAnterior,
                            id_jugador: expulsionData.id_jugador,
                            id_equipo: expulsionData.id_equipo,
                            minuto: expulsionData.minuto,
                            nombre: jugador.nombre,
                            apellido: jugador.apellido,
                            observaciones: expulsionData.motivo
                        };

                        queryClient.setQueryData<DatosCompletosPlanillero>(
                            ['planillero', 'datos-completos', idPartido],
                            {
                                ...previousData,
                                incidencias: incidenciasActualizadas
                            }
                        );
                    }
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
            // Invalidar todos los planteles porque puede revertir sanción y cambiar estadísticas
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'plantel', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(variables.idPartido)
            });
        }
    });
};

// useEliminarExpulsion.ts
interface EliminarExpulsionData {
    idExpulsion: number;
    idPartido: number;
}

export const useEliminarExpulsion = () => {
    const queryClient = useQueryClient();
    const usuario = useAuthStore((state) => state.usuario);

    return useMutation({
        mutationFn: async ({ idExpulsion, idPartido }: EliminarExpulsionData) => {
            if (!usuario?.uid) {
                throw new Error('Usuario no autenticado');
            }
            return await planilleroService.eliminarExpulsion(idExpulsion, idPartido);
        },
        onMutate: async ({ idPartido, idExpulsion }) => {
            await queryClient.cancelQueries({ 
                queryKey: ['planillero', 'datos-completos', idPartido] 
            });

            const previousData = queryClient.getQueryData<DatosCompletosPlanillero>(
                ['planillero', 'datos-completos', idPartido]
            );

            if (previousData) {
                const incidencias = previousData.incidencias || [];
                const incidenciasActualizadas = incidencias.filter(
                    inc => !(inc.id === idExpulsion && (inc.tipo === 'roja' || inc.tipo === 'doble_amarilla'))
                );

                queryClient.setQueryData<DatosCompletosPlanillero>(
                    ['planillero', 'datos-completos', idPartido],
                    {
                        ...previousData,
                        incidencias: incidenciasActualizadas
                    }
                );
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
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
        }
    });
};