"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// Components
import CardPartidoResult from "@/app/components/CardPartidoResult";
import FormacionesCard from "@/app/components/FormacionesCard";
import Incidents from "@/app/components/Incidents";
import MVPComponent from "@/app/components/MvpCard";
import PartidoControl from "@/app/components/ButtonContainer";
import BackButton from "@/app/components/ui/BackButton";
import PartidoModals from "@/app/components/PartidoModals";

// Hooks
import { useDatosCompletosPlanillero } from "@/app/hooks/usePartidoPlanillero";
import { usePartidoModals } from "@/app/hooks/usePartidoModals";
import { useJugadorActions } from "@/app/hooks/useJugadorActions";
import { usePartidoTimesActions } from "@/app/hooks/usePartidoTimesActions";
import { useIncidenciasActions } from "@/app/hooks/useIncidenciasActions";
import { useEliminarDorsal } from "@/app/hooks/useEliminarDorsal";

// Store y tipos
import usePartidoStore from "@/app/stores/partidoStore";
import { EstadoPartido } from "@/app/types/partido";

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
    const incidenciasActions = useIncidenciasActions(id_partido, [
        ...(datosPartido?.plantel_local || []),
        ...(datosPartido?.plantel_visita || [])
    ]);

    // Estados locales
    const [mvpSeleccionado, setMvpSeleccionado] = useState<number | undefined>(1);
    const [jugadorCargando, setJugadorCargando] = useState<number | null>(null);

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

    const goles = datosPartido?.incidencias.filter(action => action.tipo === 'gol');

    return (
        <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
            <BackButton />
            
            <CardPartidoResult
                partido={datosPartido?.partido}
                incidencias={datosPartido?.incidencias}
                goles_partido={goles}
                loading={isLoading}
            />

            <FormacionesCard
                equipoLocal={datosPartido?.partido.equipoLocal}
                equipoVisitante={datosPartido?.partido.equipoVisita}
                jugadoresLocal={datosPartido?.plantel_local}
                jugadoresVisitante={datosPartido?.plantel_visita}
                estadoPartido={datosPartido?.partido.estado}
                destacados={datosPartido?.jugadores_destacados}
                onJugadorAction={jugadorActions.handleJugadorAction}
                onJugadorClick={jugadorActions.handleJugadorClick}
                loading={isLoading}
                jugadorCargando={jugadorCargando}
                onDeleteDorsal={jugadorActions.handleDeleteDorsal}
                idCategoriaEdicion={datosPartido?.partido.id_categoria_edicion}
            />

            <Incidents
                incidencias={datosPartido?.incidencias}
                partido={datosPartido?.partido}
                showActions={true}
                onEditAction={(action) => incidenciasActions.handleEditAction(action, modals.openAccionModal)}
                onDeleteAction={incidenciasActions.handleDeleteAction}
                isLoadingDelete={incidenciasActions.isEliminandoIncidencia}
            />

            <MVPComponent
                jugadores={datosPartido?.jugadores_destacados}
                partido={datosPartido?.partido}
                mvpActualId={datosPartido?.partido.jugador_destacado?.id_jugador}
                onMVPChange={handleMVPChange}
                permitirEdicion={permitirAcciones}
                loading={isLoading}
            />

            <PartidoControl
                estadoPartido={estadoPartido}
                onEmpezarPartido={partidoTimesActions.handlers.handleEmpezarPartido}
                onTerminarPrimerTiempo={partidoTimesActions.handlers.handleTerminarPrimerTiempo}
                onEmpezarSegundoTiempo={partidoTimesActions.handlers.handleComenzarSegundoTiempo}
                onTerminarPartido={partidoTimesActions.handlers.handleTerminarPartido}
                onFinalizarPartido={partidoTimesActions.handlers.handleFinalizarPartido}
                onSuspenderPartido={partidoTimesActions.handlers.handleSuspenderPartido}
                isLoading={partidoTimesActions.isLoading}
            />

            <PartidoModals
                modals={modals}
                datosPartido={datosPartido}
                onLoadingChange={handleLoadingChange}
                onConfirmDelete={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default PartidoPagePlanillero;