"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// Components
import JugadoresTabsUnified from "@/app/components/partido/JugadoresTabsUnified";
import MVPComponent from "@/app/components/MvpCard";
import BackButton from "@/app/components/ui/BackButton";
import PartidoModals from "@/app/components/PartidoModals";
import JugadorEventualModal from "@/app/components/modals/CrearJugadorEventualModal";

// Hooks
import { useDatosCompletosPlanillero } from "@/app/hooks/usePartidoPlanillero";
import { usePartidoModals } from "@/app/hooks/usePartidoModals";
import { useJugadorActions } from "@/app/hooks/useJugadorActions";
import { usePartidoTimesActions } from "@/app/hooks/usePartidoTimesActions";
import { useIncidenciasActions } from "@/app/hooks/useIncidenciasActions";
import { useEliminarDorsal } from "@/app/hooks/useEliminarDorsal";
import { useGestionarJugadorDestacado } from "@/app/hooks/useJugadoresDestacados";
import { useCronometroPartido } from "@/app/hooks/useCronometroPartido";

// Store y tipos
import usePartidoStore from "@/app/stores/partidoStore";
import { EstadoPartido, IncidenciaGol, PartidoCompleto } from "@/app/types/partido";
import PartidoHeaderSticky from "@/app/components/partido/CardPartidoHeader";
import ObservacionesPlanillero from "@/app/components/ObservacionesPlanillero";

const PartidoPagePlanillero = () => {
    const idPartido = useParams().id_partido;
    const id_partido = Number(idPartido);

    // Data fetching
    const { data: datosPartido, isLoading } = useDatosCompletosPlanillero(id_partido);
    const { mutateAsync: eliminarDorsal, isPending: isDeleting } = useEliminarDorsal();

    // Store
    const {
        estadoPartido,
        setEstadoPartido,
        setHoraInicio,
        setHoraInicioSegundoTiempo,
        setMinutosPorTiempo,
        setMinutosEntretiempo
    } = usePartidoStore();

    // Estados locales (declarar antes de usar en hooks)
    const [jugadorCargando, setJugadorCargando] = useState<number | null>(null);
    const [showEventualModal, setShowEventualModal] = useState(false);
    const [equipoEventual, setEquipoEventual] = useState<'local' | 'visita'>('local');
    const [estrellasRotando, setEstrellasRotando] = useState<Set<number>>(new Set());

    // Custom hooks
    const modals = usePartidoModals();
    const partidoTimesActions = usePartidoTimesActions(id_partido);
    const { marcar, desmarcar, isLoading: isLoadingDestacado } = useGestionarJugadorDestacado();
    const cronometro = useCronometroPartido();
    const incidenciasActions = useIncidenciasActions(id_partido, [
        ...(datosPartido?.plantel_local || []),
        ...(datosPartido?.plantel_visita || [])
    ]);

    // Derivados
    const permitirAcciones = ['C1', 'E', 'C2', 'T'].includes(estadoPartido);
    const permitirCambioDorsal = ['P', 'C1', 'E', 'C2', 'T'].includes(estadoPartido);
    const todosLosJugadores = [
        ...(datosPartido?.plantel_local || []),
        ...(datosPartido?.plantel_visita || [])
    ];

    // Jugador actions hook
    const jugadorActions = useJugadorActions({
        todosLosJugadores,
        permitirCambioDorsal,
        permitirAcciones,
        onOpenDorsalModal: modals.openDorsalModal,
        onOpenAccionModal: modals.openAccionModal,
        onOpenDeleteModal: modals.openDeleteModal
    });

    // Handlers
    const handleLoadingChange = async (isLoading: boolean, jugadorId: number) => {
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
    };

    const handleConfirmDelete = async (jugadorId: number) => {
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
    };

    const handleMVPChange = (jugadorId: number) => {
        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);
        if (jugador) {
            toast.success(`${jugador.apellido}, ${jugador.nombre} seleccionado como MVP`);
        }
    };

    const handleToggleDestacadoWrapper = (jugadorId: number, equipo: 'local' | 'visita') => {
        const equipoId = equipo === 'local' 
            ? (datosPartido?.partido.equipoLocal?.id_equipo || 0)
            : (datosPartido?.partido.equipoVisita?.id_equipo || 0);
        handleToggleDestacado(jugadorId, equipoId);
    };

    const handleToggleDestacado = async (jugadorId: number, equipoId: number) => {
        if (isLoadingDestacado) return;

        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);
        if (jugador?.sancionado === 'S') {
            return toast.error('No se puede realizar esta acción');
        }

        const estaDestacado = datosPartido?.jugadores_destacados?.some(
            d => d.id_jugador === jugadorId && d.id_equipo === equipoId
        );

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
                id_equipo: equipoId,
                id_jugador: jugadorId
            };

            if (estaDestacado) {
                await desmarcar({ idPartido: id_partido, jugadorData });
                toast.success('Jugador destacado eliminado');
            } else {
                await marcar({ idPartido: id_partido, jugadorData });
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
    };

    const handleAgregarEventual = (equipo: 'local' | 'visita') => {
        setEquipoEventual(equipo);
        setShowEventualModal(true);
    };

    // Effects
    useEffect(() => {
        if (datosPartido?.partido) {
            const partidoBackend = datosPartido.partido;
            if (partidoBackend.estado && partidoBackend.estado !== estadoPartido) {
                setEstadoPartido(partidoBackend.estado as EstadoPartido);
            }
            if (partidoBackend.categoriaEdicion?.duracion_tiempo) {
                setMinutosPorTiempo(partidoBackend.categoriaEdicion.duracion_tiempo);
            }
            if (partidoBackend.categoriaEdicion?.duracion_entretiempo) {
                setMinutosEntretiempo(partidoBackend.categoriaEdicion.duracion_entretiempo);
            }
            if (['C1', 'C2', 'T'].includes(partidoBackend.estado) && partidoBackend.hora_inicio) {
                setHoraInicio(new Date(partidoBackend.hora_inicio));
            }
            if (['C2', 'T'].includes(partidoBackend.estado) && partidoBackend.hora_inicio_segundo_tiempo) {
                setHoraInicioSegundoTiempo(new Date(partidoBackend.hora_inicio_segundo_tiempo));
            }
        }
    }, [datosPartido, estadoPartido, setEstadoPartido, setHoraInicio, setHoraInicioSegundoTiempo, setMinutosPorTiempo, setMinutosEntretiempo]);

    const goles = datosPartido?.incidencias.filter(action => action.tipo === 'gol') as IncidenciaGol[];

    return (
        <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
            <BackButton/>

            <PartidoHeaderSticky
                partido={datosPartido?.partido as PartidoCompleto}
                goles={goles}
                esPlanillero={true}
                onEmpezarPartido={partidoTimesActions.handlers.handleEmpezarPartido}
                onTerminarPrimerTiempo={partidoTimesActions.handlers.handleTerminarPrimerTiempo}
                onEmpezarSegundoTiempo={partidoTimesActions.handlers.handleComenzarSegundoTiempo}
                onTerminarPartido={partidoTimesActions.handlers.handleTerminarPartido}
                onFinalizarPartido={partidoTimesActions.handlers.handleFinalizarPartido}
                onSuspenderPartido={partidoTimesActions.handlers.handleSuspenderPartido}
                isLoading={isLoading}
                cronometro={cronometro}
                isLoadingButton={partidoTimesActions.isLoading}
            />

            <JugadoresTabsUnified
                mode="planillero"
                estadoPartido={estadoPartido}
                equipoLocal={{
                    id_equipo: datosPartido?.partido.equipoLocal?.id_equipo || 0,
                    nombre: datosPartido?.partido.equipoLocal?.nombre || '',
                    jugadores: datosPartido?.plantel_local || []
                }}
                equipoVisita={{
                    id_equipo: datosPartido?.partido.equipoVisita?.id_equipo || 0,
                    nombre: datosPartido?.partido.equipoVisita?.nombre || '',
                    jugadores: datosPartido?.plantel_visita || []
                }}
                incidencias={datosPartido?.incidencias || []}
                destacados={datosPartido?.jugadores_destacados || []}
                onJugadorClick={jugadorActions.handleJugadorClick as unknown as (jugadorId: number, equipo: 'local' | 'visita') => void}
                onJugadorAction={jugadorActions.handleJugadorAction}
                onDeleteDorsal={jugadorActions.handleDeleteDorsal}
                onEditIncidencia={(inc) => incidenciasActions.handleEditAction(inc, modals.openAccionModal)}
                onDeleteIncidencia={incidenciasActions.handleDeleteAction}
                onToggleDestacado={handleToggleDestacadoWrapper as unknown as (jugadorId: number, equipoId: number) => void}
                onAgregarEventual={handleAgregarEventual}
                loading={isLoading || !datosPartido?.partido.equipoLocal?.id_equipo || !datosPartido?.partido.equipoVisita?.id_equipo}
                jugadorCargando={jugadorCargando}
                estrellasRotando={estrellasRotando}
                idCategoriaEdicion={datosPartido?.partido.id_categoria_edicion}
                idPartido={id_partido}
                jugadorDestacado={datosPartido?.partido.jugador_destacado || null}
                tipoFutbol={datosPartido?.partido.canchaData?.tipo_futbol || 11}
            />

            <MVPComponent
                jugadores={datosPartido?.jugadores_destacados || []}
                partido={datosPartido?.partido as PartidoCompleto}
                mvpActualId={datosPartido?.partido.jugador_destacado?.id_jugador}
                onMVPChange={handleMVPChange}
                permitirEdicion={permitirAcciones}
                loading={isLoading || !datosPartido?.partido}
            />

            <PartidoModals
                modals={modals}
                datosPartido={datosPartido}
                onLoadingChange={handleLoadingChange}
                onConfirmDelete={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            {datosPartido?.partido.id_categoria_edicion && datosPartido?.partido.equipoLocal?.id_equipo && datosPartido?.partido.equipoVisita?.id_equipo && (
                <JugadorEventualModal
                    isOpen={showEventualModal}
                    onClose={() => setShowEventualModal(false)}
                    idPartido={id_partido}
                    idCategoriaEdicion={datosPartido.partido.id_categoria_edicion}
                    idEquipo={equipoEventual === 'local'
                        ? datosPartido.partido.equipoLocal.id_equipo
                        : datosPartido.partido.equipoVisita.id_equipo
                    }
                />
            )}
            {/* Observaciones de partido */}
            <ObservacionesPlanillero idPartido={id_partido} />
        </div>
    );
};

export default PartidoPagePlanillero;