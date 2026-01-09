import { useState, useCallback } from 'react';
import { useAgregarJugadorDreamteam, useEliminarJugadorDreamteam } from './useDreamteam';
import { usePosiciones } from './usePosicionesJugador';
import { useCategoriaStore } from '../stores/categoriaStore';
import { JugadorDestacadoDt } from '../types/jugador';
import { JugadorDreamTeam } from '../types/dreamteam';
import { MAPEO_POSICIONES_CODIGOS } from '../utils/formacionesDT';
import toast from 'react-hot-toast';

interface UseDreamTeamControllerProps {
    jornada: number;
    formacionNombre: string;
    refetchDreamteam: () => void;
}

interface ModalJugadorState {
    isOpen: boolean;
    posicionIndex: string;
    posicionesIds: number[];
    posicionNombre: string;
}

interface ModalEliminarState {
    isOpen: boolean;
    jugador: {
        id_jugador: number;
        id_partido: number;
        nombre: string;
        apellido: string;
        equipo?: string;
    } | null;
}

/**
 * Hook que centraliza toda la lógica de control del DreamTeam
 * Maneja agregar/eliminar jugadores, modales, y efectos secundarios
 */
export const useDreamTeamController = ({
    jornada,
    formacionNombre,
    refetchDreamteam,
}: UseDreamTeamControllerProps) => {
    const { categoriaSeleccionada } = useCategoriaStore();
    const { data: posiciones = [] } = usePosiciones();

    const [modalJugador, setModalJugador] = useState<ModalJugadorState>({
        isOpen: false,
        posicionIndex: '',
        posicionesIds: [],
        posicionNombre: '',
    });

    const [modalEliminar, setModalEliminar] = useState<ModalEliminarState>({
        isOpen: false,
        jugador: null,
    });

    const { mutateAsync: agregarJugador, isPending: isAgregando } = useAgregarJugadorDreamteam({
        onSuccess: () => {
            toast.success('Jugador agregado al DreamTeam');
            refetchDreamteam();
            closeModalJugador();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutateAsync: eliminarJugador, isPending: isEliminando, error: errorEliminar } =
        useEliminarJugadorDreamteam({
            onSuccess: () => {
                toast.success('Jugador eliminado del DreamTeam');
                refetchDreamteam();
                closeModalEliminar();
            },
            onError: (error) => {
                toast.error(error.message || 'Error al eliminar el jugador');
            },
        });

    const openModalJugador = useCallback(
        (posicionIndex: string) => {
            const mapeo = MAPEO_POSICIONES_CODIGOS[formacionNombre];
            const posicionInfo = mapeo[posicionIndex];

            console.log('=== OPEN MODAL JUGADOR ===');
            console.log('Formación:', formacionNombre);
            console.log('Posición Index:', posicionIndex);
            console.log('Posición Info:', posicionInfo);
            console.log('Códigos buscados:', posicionInfo?.codigos);
            console.log('Posiciones disponibles:', posiciones.map(p => ({ id: p.id_posicion, codigo: p.codigo, nombre: p.nombre })));

            if (posicionInfo && posiciones.length > 0) {
                // Mapeo de nombres de posición del frontend a códigos de la BD
                // En la BD: 1=ARQ, 2=DEF, 3=MED, 4=DEL
                // En el frontend: ARQ, DEF (con variantes LD/LI), MED (con variantes MC/MI/MD), DEL
                const mapeoCodigosBD: Record<string, string[]> = {
                    'ARQ': ['ARQ'], // Arquero
                    'DEF': ['DEF', 'LD', 'LI'], // Defensor (puede venir como DEF, LD o LI)
                    'MED': ['MED', 'MC', 'MI', 'MD'], // Mediocampista (en BD es MED, pero en frontend puede ser MC/MI/MD)
                    'DEL': ['DEL'], // Delantero
                };

                // Obtener los códigos equivalentes para la posición según su nombre
                const codigosEquivalentes = mapeoCodigosBD[posicionInfo.nombre] || posicionInfo.codigos;
                
                console.log('Nombre posición:', posicionInfo.nombre);
                console.log('Códigos equivalentes (BD):', codigosEquivalentes);

                const posicionesIds = posiciones
                    .filter((pos) => codigosEquivalentes.includes(pos.codigo))
                    .map((pos) => pos.id_posicion);

                console.log('IDs encontrados:', posicionesIds);
                console.log('========================');

                if (posicionesIds.length === 0) {
                    console.warn('⚠️ No se encontraron posiciones. Verificar mapeo de códigos.');
                }

                setModalJugador({
                    isOpen: true,
                    posicionIndex,
                    posicionesIds,
                    posicionNombre: posicionInfo.nombre,
                });
            } else {
                console.log('ERROR: No se encontró posicionInfo o no hay posiciones disponibles');
                console.log('========================');
            }
        },
        [formacionNombre, posiciones]
    );

    const closeModalJugador = useCallback(() => {
        setModalJugador({
            isOpen: false,
            posicionIndex: '',
            posicionesIds: [],
            posicionNombre: '',
        });
    }, []);

    const openModalEliminar = useCallback((jugador: JugadorDreamTeam) => {
        setModalEliminar({
            isOpen: true,
            jugador: {
                id_jugador: jugador.id_jugador,
                id_partido: jugador.id_partido,
                nombre: jugador.nombre,
                apellido: jugador.apellido,
                equipo: jugador.equipo?.nombre,
            },
        });
    }, []);

    const closeModalEliminar = useCallback(() => {
        setModalEliminar({ isOpen: false, jugador: null });
    }, []);

    const handleSeleccionarJugador = useCallback(
        async (jugador: JugadorDestacadoDt) => {
            if (!categoriaSeleccionada) return;

            try {
                const mapeo = MAPEO_POSICIONES_CODIGOS[formacionNombre];
                const posicionInfo = mapeo[modalJugador.posicionIndex];

                await agregarJugador({
                    id_categoria_edicion: categoriaSeleccionada.id_categoria_edicion,
                    jornada,
                    id_partido: jugador.id_partido,
                    id_jugador: jugador.id_jugador,
                    id_equipo: jugador.id_equipo,
                    formacion: formacionNombre,
                    posicionIndex: parseInt(modalJugador.posicionIndex),
                    posicionCodigo: posicionInfo?.codigos[0],
                });
            } catch (error) {
                console.error('Error al agregar jugador:', error);
                throw error;
            }
        },
        [categoriaSeleccionada, jornada, formacionNombre, modalJugador, agregarJugador]
    );

    const handleConfirmarEliminar = useCallback(
        async (id_dreamteam: number, id_partido: number, id_jugador: number) => {
            try {
                await eliminarJugador({
                    id_dreamteam,
                    id_partido,
                    id_jugador,
                });
            } catch (error) {
                console.error('Error al eliminar jugador:', error);
                throw error;
            }
        },
        [eliminarJugador]
    );

    return {
        // Modales
        modalJugador,
        modalEliminar,
        openModalJugador,
        closeModalJugador,
        openModalEliminar,
        closeModalEliminar,

        // Handlers
        handleSeleccionarJugador,
        handleConfirmarEliminar,

        // Estados de carga
        isAgregando,
        isEliminando,
        errorEliminar,
    };
};

