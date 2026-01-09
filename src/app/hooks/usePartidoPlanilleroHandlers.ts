import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useEliminarDorsal } from './useEliminarDorsal';
import { useGestionarJugadorDestacado } from './useJugadoresDestacados';
import { DatosCompletosPlanillero, JugadorPlantel, EstadoPartido } from '@/app/types/partido';
import { usePartidoModals } from './usePartidoModals';
import { useJugadorActions } from './useJugadorActions';

interface UsePartidoPlanilleroHandlersProps {
    idPartido: number;
    datosPartido?: DatosCompletosPlanillero;
    todosLosJugadores: JugadorPlantel[];
    estadoPartido: EstadoPartido;
}

/**
 * Hook para manejar todos los handlers de la página del planillero
 */
export const usePartidoPlanilleroHandlers = ({
    idPartido,
    datosPartido,
    todosLosJugadores,
    estadoPartido
}: UsePartidoPlanilleroHandlersProps) => {
    const { mutateAsync: eliminarDorsal, isPending: isDeleting } = useEliminarDorsal();
    const { marcar, isLoading: isLoadingDestacado } = useGestionarJugadorDestacado();
    const modals = usePartidoModals();

    // Estados locales
    const [jugadorCargando, setJugadorCargando] = useState<number | null>(null);
    const [showEventualModal, setShowEventualModal] = useState(false);
    const [equipoEventual, setEquipoEventual] = useState<'local' | 'visita'>('local');
    const [estrellasRotando, setEstrellasRotando] = useState<Set<number>>(new Set());

    // Handler para cambios de loading de jugador
    const handleLoadingChange = useCallback(async (isLoading: boolean, jugadorId: number) => {
        if (isLoading) {
            setJugadorCargando(jugadorId);
        } else {
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    const jugadorActualizado = todosLosJugadores.find(j => j.id_jugador === jugadorId);
                    if (jugadorActualizado) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(interval);
                    resolve(true);
                }, 3000);
            });
            setJugadorCargando(null);
        }
    }, [todosLosJugadores]);

    // Handler para confirmar eliminación de dorsal
    const handleConfirmDelete = useCallback(async (jugadorId: number) => {
        try {
            const response = await eliminarDorsal({
                idPartido: Number(datosPartido?.partido.id_partido),
                idCategoriaEdicion: Number(datosPartido?.partido.id_categoria_edicion),
                idJugador: jugadorId,
                idEquipo: modals.selectedJugador?.id_equipo || 0
            });
            const message = (response as { message?: string })?.message || 'Dorsal eliminado correctamente';
            toast.success(message);
            modals.closeAllModals();
        } catch (error: unknown) {
            const errorMessage = 
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (error as { message?: string })?.message ||
                'Error desconocido';
            toast.error(errorMessage);
        }
    }, [datosPartido, eliminarDorsal, modals]);

    // Handler para cambio de MVP
    const handleMVPChange = useCallback((jugadorId: number) => {
        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);
        if (jugador) {
            toast.success(`${jugador.apellido}, ${jugador.nombre} seleccionado como MVP`);
        }
    }, [todosLosJugadores]);

    // Handler para toggle de jugador destacado
    const handleToggleDestacado = useCallback(async (jugadorId: number, equipoId: number) => {
        if (isLoadingDestacado) return;

        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);
        if (!jugador) {
            return toast.error('Jugador no encontrado');
        }
        
        if (jugador.sancionado === 'S') {
            return toast.error('No se puede realizar esta acción');
        }

        // Usar el id_equipo del jugador, no el que viene del parámetro
        const idEquipoCorrecto = jugador.id_equipo;

        // Agregar animación INMEDIATAMENTE
        setEstrellasRotando(prev => new Set(prev).add(jugadorId));

        try {
            const idCategoriaEdicion = datosPartido?.partido.id_categoria_edicion;
            if (!idCategoriaEdicion) {
                toast.error('No se pudo obtener la categoría de edición');
                return;
            }

            const jugadorData = {
                id_categoria_edicion: idCategoriaEdicion,
                id_equipo: idEquipoCorrecto,
                id_jugador: jugadorId
            };

            // El backend ahora hace toggle automáticamente, siempre llamamos a marcar
            await marcar({ idPartido, jugadorData });
            
            // Determinar el mensaje según el estado actual
            const estaDestacado = jugador.destacado === true || datosPartido?.jugadores_destacados?.some(
                d => d.id_jugador === jugadorId
            ) || false;
            
            if (estaDestacado) {
                toast.success('Jugador destacado eliminado');
            } else {
                toast.success('Jugador destacado agregado');
            }

            // Mantener la animación por 600ms DESPUÉS de que termine la operación
            setTimeout(() => {
                setEstrellasRotando(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(jugadorId);
                    return newSet;
                });
            }, 600);

        } catch (error) {
            console.error('Error al cambiar estado de jugador destacado:', error);
            // Si falla, remover la animación inmediatamente
            setEstrellasRotando(prev => {
                const newSet = new Set(prev);
                newSet.delete(jugadorId);
                return newSet;
            });
        }
    }, [idPartido, datosPartido, todosLosJugadores, marcar, isLoadingDestacado]);

    // Wrapper para toggle destacado con equipo
    const handleToggleDestacadoWrapper = useCallback((jugadorId: number, equipo: 'local' | 'visita') => {
        const equipoId = equipo === 'local' 
            ? (datosPartido?.partido.equipoLocal?.id_equipo || 0)
            : (datosPartido?.partido.equipoVisita?.id_equipo || 0);
        handleToggleDestacado(jugadorId, equipoId);
    }, [datosPartido, handleToggleDestacado]);

    // Handler para agregar jugador eventual
    const handleAgregarEventual = useCallback((equipo: 'local' | 'visita') => {
        setEquipoEventual(equipo);
        setShowEventualModal(true);
    }, []);

    // Jugador actions hook
    const permitirAcciones = ['C1', 'E', 'C2', 'T'].includes(estadoPartido);
    const permitirCambioDorsal = ['P', 'C1', 'E', 'C2', 'T'].includes(estadoPartido);
    
    const jugadorActions = useJugadorActions({
        todosLosJugadores,
        permitirCambioDorsal,
        permitirAcciones,
        onOpenDorsalModal: modals.openDorsalModal,
        onOpenAccionModal: modals.openAccionModal,
        onOpenDeleteModal: modals.openDeleteModal
    });

    // Wrappers para convertir equipo ('local' | 'visita') a equipoId (number)
    const handleJugadorClickWrapper = useCallback((jugadorId: number, equipo: 'local' | 'visita') => {
        const equipoId = equipo === 'local' 
            ? (datosPartido?.partido.equipoLocal?.id_equipo || 0)
            : (datosPartido?.partido.equipoVisita?.id_equipo || 0);
        jugadorActions.handleJugadorClick(jugadorId, equipoId);
    }, [datosPartido, jugadorActions]);

    const handleJugadorActionWrapper = useCallback((jugadorId: number, equipo: 'local' | 'visita') => {
        const equipoId = equipo === 'local' 
            ? (datosPartido?.partido.equipoLocal?.id_equipo || 0)
            : (datosPartido?.partido.equipoVisita?.id_equipo || 0);
        jugadorActions.handleJugadorAction(jugadorId, equipoId);
    }, [datosPartido, jugadorActions]);

    const handleDeleteDorsalWrapper = useCallback((jugadorId: number) => {
        jugadorActions.handleDeleteDorsal(jugadorId);
    }, [jugadorActions]);

    return {
        // Estados
        jugadorCargando,
        showEventualModal,
        equipoEventual,
        estrellasRotando,
        isDeleting,
        modals,
        
        // Setters
        setShowEventualModal,
        
        // Handlers
        handleLoadingChange,
        handleConfirmDelete,
        handleMVPChange,
        handleToggleDestacado: handleToggleDestacadoWrapper,
        handleAgregarEventual,
        
        // Jugador actions (wrapped para compatibilidad con la interfaz)
        jugadorActions: {
            handleJugadorClick: handleJugadorClickWrapper,
            handleJugadorAction: handleJugadorActionWrapper,
            handleDeleteDorsal: handleDeleteDorsalWrapper
        }
    };
};

