"use client";
import { useParams } from "next/navigation";

// Components
import BackButton from "@/app/components/ui/BackButton";
import MVPComponent from "@/app/components/MvpCard";
import ObservacionesPlanillero from "@/app/components/ObservacionesPlanillero";
import { PartidoHeaderSection } from "@/app/components/partido/planillero/PartidoHeaderSection";
import { JugadoresSection } from "@/app/components/partido/planillero/JugadoresSection";
import { ModalsSection } from "@/app/components/partido/planillero/ModalsSection";

// Hooks
import { useDatosCompletosPlanillero } from "@/app/hooks/usePartidoPlanillero";
import { usePartidoTimesActions } from "@/app/hooks/usePartidoTimesActions";
import { useIncidenciasActions } from "@/app/hooks/useIncidenciasActions";
import { useCronometroPartido } from "@/app/hooks/useCronometroPartido";
import { usePartidoPlanilleroSync } from "@/app/hooks/usePartidoPlanilleroSync";
import { usePartidoPlanilleroHandlers } from "@/app/hooks/usePartidoPlanilleroHandlers";

// Store y tipos
import usePartidoStore from "@/app/stores/partidoStore";
import { EstadoPartido, IncidenciaGol } from "@/app/types/partido";

const PartidoPagePlanillero = () => {
    const idPartido = useParams().id_partido;
    const id_partido = Number(idPartido);

    // Data fetching
    const { data: datosPartido, isLoading } = useDatosCompletosPlanillero(id_partido);

    // Store
    const { estadoPartido } = usePartidoStore();

    // Custom hooks
    const partidoTimesActions = usePartidoTimesActions(id_partido);
    const cronometro = useCronometroPartido();
    const incidenciasActions = useIncidenciasActions(id_partido, [
        ...(datosPartido?.plantel_local || []),
        ...(datosPartido?.plantel_visita || [])
    ]);

    // Handlers hook
    const handlers = usePartidoPlanilleroHandlers({
        idPartido: id_partido,
        datosPartido,
        todosLosJugadores: [
            ...(datosPartido?.plantel_local || []),
            ...(datosPartido?.plantel_visita || [])
        ],
        estadoPartido
    });

    // Sync hook
    usePartidoPlanilleroSync({
        datosPartido,
        estadoPartido,
        isLoadingMutation: partidoTimesActions.isLoading
    });

    // Derivados
    const permitirAcciones = ['C1', 'E', 'C2', 'T'].includes(estadoPartido);
    const goles = datosPartido?.incidencias.filter(action => action.tipo === 'gol') as IncidenciaGol[];

    return (
        <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
            <BackButton />

            <PartidoHeaderSection
                partido={datosPartido?.partido}
                goles={goles}
                isLoading={isLoading}
                isLoadingButton={partidoTimesActions.isLoading}
                actionInProgress={partidoTimesActions.actionInProgress}
                cronometro={cronometro}
                onEmpezarPartido={partidoTimesActions.handlers.handleEmpezarPartido}
                onTerminarPrimerTiempo={partidoTimesActions.handlers.handleTerminarPrimerTiempo}
                onEmpezarSegundoTiempo={partidoTimesActions.handlers.handleComenzarSegundoTiempo}
                onTerminarPartido={partidoTimesActions.handlers.handleTerminarPartido}
                onFinalizarPartido={partidoTimesActions.handlers.handleFinalizarPartido}
                onSuspenderPartido={partidoTimesActions.handlers.handleSuspenderPartido}
            />

            <JugadoresSection
                datosPartido={datosPartido}
                estadoPartido={estadoPartido}
                isLoading={isLoading}
                jugadorCargando={handlers.jugadorCargando}
                estrellasRotando={handlers.estrellasRotando}
                idPartido={id_partido}
                onJugadorClick={handlers.jugadorActions.handleJugadorClick}
                onJugadorAction={handlers.jugadorActions.handleJugadorAction}
                onDeleteDorsal={handlers.jugadorActions.handleDeleteDorsal}
                onEditIncidencia={(inc) => incidenciasActions.handleEditAction(inc, handlers.modals.openAccionModal)}
                onDeleteIncidencia={incidenciasActions.handleDeleteAction}
                onToggleDestacado={handlers.handleToggleDestacado}
                onAgregarEventual={handlers.handleAgregarEventual}
            />
            {
                permitirAcciones && (
                    <MVPComponent
                        jugadores={datosPartido?.jugadores_destacados || []}
                        partido={datosPartido?.partido}
                        mvpActualId={datosPartido?.partido.jugador_destacado?.id_jugador}
                        onMVPChange={handlers.handleMVPChange}
                        permitirEdicion={permitirAcciones}
                        loading={isLoading || !datosPartido?.partido}
                    />
                )
            }

            <ModalsSection
                datosPartido={datosPartido}
                idPartido={id_partido}
                showEventualModal={handlers.showEventualModal}
                equipoEventual={handlers.equipoEventual}
                isDeleting={handlers.isDeleting}
                onLoadingChange={handlers.handleLoadingChange}
                onConfirmDelete={handlers.handleConfirmDelete}
                onCloseEventualModal={() => handlers.setShowEventualModal(false)}
                modals={handlers.modals}
            />

            <ObservacionesPlanillero idPartido={id_partido} />
        </div>
    );
};

export default PartidoPagePlanillero;