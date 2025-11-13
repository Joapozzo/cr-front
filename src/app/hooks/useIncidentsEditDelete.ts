// useEditarGol.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';

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

    return useMutation({
        mutationFn: async ({ idGol, idPartido, golData }: EditarGolData) => {
            return await planilleroService.editarGol(idGol, idPartido, golData);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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

    return useMutation({
        mutationFn: async ({ idGol, idPartido }: EliminarGolData) => {
            return await planilleroService.eliminarGol(idGol, idPartido);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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

    return useMutation({
        mutationFn: async ({ idAmonestacion, idPartido, amonestacionData }: EditarAmonestacionData) => {
            return await planilleroService.editarAmonestacion(idAmonestacion, idPartido, amonestacionData);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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

    return useMutation({
        mutationFn: async ({ idAmonestacion, idPartido }: EliminarAmonestacionData) => {
            return await planilleroService.eliminarAmonestacion(idAmonestacion, idPartido);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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

    return useMutation({
        mutationFn: async ({ idExpulsion, idPartido, expulsionData }: EditarExpulsionData) => {
            return await planilleroService.editarExpulsion(idExpulsion, idPartido, expulsionData);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
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

    return useMutation({
        mutationFn: async ({ idExpulsion, idPartido }: EliminarExpulsionData) => {
            return await planilleroService.eliminarExpulsion(idExpulsion, idPartido);
        },
        onSuccess: (data, variables) => {
            queryClient.refetchQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
            queryClient.invalidateQueries({
                queryKey: ['planillero', 'datos-completos', variables.idPartido]
            });
        }
    });
};