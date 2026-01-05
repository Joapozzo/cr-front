import { useState, useCallback } from 'react';
import { EstadoPartido } from '@/app/types/partido';
import { useEditarCambioJugador, useEliminarCambioJugador } from '@/app/hooks/useCambiosJugador';
import { useFormaciones } from '@/app/hooks/useFormaciones';
import toast from 'react-hot-toast';
import { EquipoData } from '../types';

interface UseJugadorActionsParams {
    idPartido?: number;
    idCategoriaEdicion?: number;
    equipoLocal: EquipoData;
    equipoVisita: EquipoData;
    tipoFutbol: number;
    jugadoresEnCanchaLocal: number;
    jugadoresEnCanchaVisita: number;
}

export const useJugadorActions = ({
    idPartido,
    idCategoriaEdicion,
    equipoLocal,
    equipoVisita,
    tipoFutbol,
    jugadoresEnCanchaLocal,
    jugadoresEnCanchaVisita
}: UseJugadorActionsParams) => {
    const { mutateAsync: editarCambioAsync, isPending: isEditandoCambio } = useEditarCambioJugador();
    const { mutateAsync: eliminarCambioAsync } = useEliminarCambioJugador();
    const { marcarEnCanchaAsync, desmarcarEnCanchaAsync } = useFormaciones();

    // Estado de loading por jugador
    const [jugadoresCargando, setJugadoresCargando] = useState<Set<number>>(new Set());

    // Handler para toggle en cancha
    const handleToggleEnCancha = useCallback(async (jugadorId: number, equipoId: number) => {
        if (!idPartido || !idCategoriaEdicion) {
            toast.error('Faltan datos del partido');
            return;
        }

        const jugador = [...equipoLocal.jugadores, ...equipoVisita.jugadores].find(j => j.id_jugador === jugadorId);
        if (!jugador) return;

        const enCancha = jugador.en_cancha ?? false;
        const jugadoresEnCancha = equipoId === equipoLocal.id_equipo 
            ? jugadoresEnCanchaLocal 
            : jugadoresEnCanchaVisita;

        // Marcar como cargando solo este jugador
        setJugadoresCargando(prev => new Set(prev).add(jugadorId));

        try {
            if (!enCancha) {
                // Validar límite
                if (jugadoresEnCancha >= tipoFutbol) {
                    toast.error(`Máximo ${tipoFutbol} jugadores en cancha`);
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }
                    return;
                }

                // Validar que tenga dorsal
                if (!jugador.dorsal) {
                    toast.error('El jugador debe tener dorsal asignado');
                    return;
                }

                await marcarEnCanchaAsync({
                    idPartido,
                    enCanchaData: {
                        id_categoria_edicion: idCategoriaEdicion,
                        id_equipo: equipoId,
                        id_jugador: jugadorId
                    }
                });
                toast.success('Jugador marcado en cancha');
            } else {
                await desmarcarEnCanchaAsync({
                    idPartido,
                    idJugador: jugadorId,
                    desmarcarData: {
                        id_categoria_edicion: idCategoriaEdicion,
                        id_equipo: equipoId
                    }
                });
                toast.success('Jugador desmarcado de cancha');
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al cambiar estado';
            toast.error(errorMessage);
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        } finally {
            // Quitar de loading
            setJugadoresCargando(prev => {
                const nuevo = new Set(prev);
                nuevo.delete(jugadorId);
                return nuevo;
            });
        }
    }, [idPartido, idCategoriaEdicion, equipoLocal, equipoVisita, 
        jugadoresEnCanchaLocal, jugadoresEnCanchaVisita, tipoFutbol, 
        marcarEnCanchaAsync, desmarcarEnCanchaAsync]);

    // Handler para editar cambio
    const handleEditarCambio = useCallback(async (
        cambioId: number,
        jugadorSaleId: number,
        minuto: number
    ) => {
        if (!idPartido) return;

        try {
            await editarCambioAsync({
                idCambio: cambioId,
                idPartido,
                cambioData: {
                    minuto
                }
            });

            toast.success('Cambio actualizado correctamente');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al actualizar cambio';
            toast.error(errorMessage);
            throw error;
        }
    }, [idPartido, editarCambioAsync]);

    // Handler para eliminar cambio
    const handleEliminarCambio = useCallback(async (cambioId: number) => {
        if (!idPartido) return;

        try {
            await eliminarCambioAsync({
                idCambio: cambioId,
                idPartido
            });

            toast.success('Cambio eliminado correctamente');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error 
                || (error as { message?: string })?.message 
                || 'Error al eliminar cambio';
            toast.error(errorMessage);
            throw error;
        }
    }, [idPartido, eliminarCambioAsync]);

    return {
        handleToggleEnCancha,
        handleEditarCambio,
        handleEliminarCambio,
        jugadoresCargando,
        isEditandoCambio
    };
};

