"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// Components
import CardPartidoResult from "@/app/components/CardPartidoResult";
import JugadoresTabsUnified from "@/app/components/partido/JugadoresTabsUnified";
import IncidentsUnified from "@/app/components/partido/Incidents";
import MVPComponent from "@/app/components/MvpCard";
import PartidoControl from "@/app/components/ButtonContainer";
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

// Store y tipos
import usePartidoStore from "@/app/stores/partidoStore";
import { EstadoPartido, IncidenciaGol, PartidoCompleto } from "@/app/types/partido";
import PartidoHeaderSticky from "@/app/components/partido/CardPartidoHeader";

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

    // Custom hooks
    const modals = usePartidoModals();
    const partidoTimesActions = usePartidoTimesActions(id_partido);
    const { marcar, desmarcar, isLoading: isLoadingDestacado } = useGestionarJugadorDestacado();
    const incidenciasActions = useIncidenciasActions(id_partido, [
        ...(datosPartido?.plantel_local || []),
        ...(datosPartido?.plantel_visita || [])
    ]);

    // Estados locales
    const [mvpSeleccionado, setMvpSeleccionado] = useState<number | undefined>(1);
    const [jugadorCargando, setJugadorCargando] = useState<number | null>(null);
    const [showEventualModal, setShowEventualModal] = useState(false);
    const [equipoEventual, setEquipoEventual] = useState<'local' | 'visita'>('local');
    const [estrellasRotando, setEstrellasRotando] = useState<Set<number>>(new Set());

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
            toast.success(response.message);
            modals.closeAllModals();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error desconocido';
            toast.error(errorMessage);
        }
    };

    const handleMVPChange = (jugadorId: number) => {
        setMvpSeleccionado(jugadorId);
        const jugador = todosLosJugadores.find(j => j.id_jugador === jugadorId);
        if (jugador) {
            toast.success(`${jugador.apellido}, ${jugador.nombre} seleccionado como MVP`);
        }
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
            const jugadorData = {
                id_categoria_edicion: datosPartido?.partido.id_categoria_edicion!,
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
            if (['C1', 'C2'].includes(partidoBackend.estado) && partidoBackend.hora_inicio) {
                setHoraInicio(new Date(partidoBackend.hora_inicio));
            }
            if (partidoBackend.estado === 'C2' && partidoBackend.hora_inicio_segundo_tiempo) {
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
                isLoadingButton={partidoTimesActions.isLoading}
            />

            <JugadoresTabsUnified
                mode="planillero"
                estadoPartido={estadoPartido}
                equipoLocal={{
                    id_equipo: datosPartido?.partido.equipoLocal?.id_equipo!,
                    nombre: datosPartido?.partido.equipoLocal?.nombre!,
                    jugadores: datosPartido?.plantel_local || []
                }}
                equipoVisita={{
                    id_equipo: datosPartido?.partido.equipoVisita?.id_equipo!,
                    nombre: datosPartido?.partido.equipoVisita?.nombre!,
                    jugadores: datosPartido?.plantel_visita || []
                }}
                incidencias={datosPartido?.incidencias || []}
                destacados={datosPartido?.jugadores_destacados}
                onJugadorClick={jugadorActions.handleJugadorClick}
                onJugadorAction={jugadorActions.handleJugadorAction}
                onDeleteDorsal={jugadorActions.handleDeleteDorsal}
                onEditIncidencia={(inc) => incidenciasActions.handleEditAction(inc, modals.openAccionModal)}
                onDeleteIncidencia={incidenciasActions.handleDeleteAction}
                onToggleDestacado={handleToggleDestacado}
                onAgregarEventual={handleAgregarEventual}
                loading={isLoading}
                jugadorCargando={jugadorCargando}
                estrellasRotando={estrellasRotando}
                idCategoriaEdicion={datosPartido?.partido.id_categoria_edicion}
                idPartido={id_partido}
                jugadorDestacado={datosPartido?.partido.jugador_destacado}
            />

            <MVPComponent
                jugadores={datosPartido?.jugadores_destacados}
                partido={datosPartido?.partido}
                mvpActualId={datosPartido?.partido.jugador_destacado?.id_jugador}
                onMVPChange={handleMVPChange}
                permitirEdicion={permitirAcciones}
                loading={isLoading}
            />

            <PartidoModals
                modals={modals}
                datosPartido={datosPartido}
                onLoadingChange={handleLoadingChange}
                onConfirmDelete={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <JugadorEventualModal
                isOpen={showEventualModal}
                onClose={() => setShowEventualModal(false)}
                idPartido={id_partido}
                idCategoriaEdicion={datosPartido?.partido.id_categoria_edicion!}
                idEquipo={equipoEventual === 'local'
                    ? datosPartido?.partido.equipoLocal?.id_equipo!
                    : datosPartido?.partido.equipoVisita?.id_equipo!
                }
            />
        </div>
    );
};

export default PartidoPagePlanillero;