// useCrearGol.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planilleroService } from '../services/planillero.services';
import { useAuthStore } from '../stores/authStore';

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