"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

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
import { usePartidoLive } from "@/app/hooks/usePartidoLive";
import { usePrecargarSelfiesPartido } from "@/app/hooks/usePrecargarSelfiesPartido";

// Store y tipos
import usePartidoStore from "@/app/stores/partidoStore";
import { EstadoPartido, IncidenciaGol } from "@/app/types/partido";

export default function PartidoPagePlanilleroContent() {
    const params = useParams();
    
    // Memoizar y validar el ID de partido
    const id_partido = useMemo(() => {
        if (params?.id_partido) {
            const id = Number(params.id_partido);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id_partido]);

    // Data fetching - TODOS los hooks deben llamarse antes de cualquier early return
    const { data: datosPartido, isLoading } = useDatosCompletosPlanillero(id_partido ?? 0, {
        enabled: id_partido !== null
    });

    // Store
    const { estadoPartido } = usePartidoStore();

    // Custom hooks
    const partidoTimesActions = usePartidoTimesActions(id_partido ?? 0);
    const cronometro = useCronometroPartido();
    const incidenciasActions = useIncidenciasActions(id_partido ?? 0, [
        ...(datosPartido?.plantel_local || []),
        ...(datosPartido?.plantel_visita || [])
    ]);

    // Handlers hook
    const handlers = usePartidoPlanilleroHandlers({
        idPartido: id_partido ?? 0,
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

    // WebSocket hook para actualizaciones en tiempo real
    usePartidoLive(id_partido);

    // ✅ Precargar selfies privadas cuando se cargan los datos del partido
    usePrecargarSelfiesPartido(datosPartido, !isLoading && !!datosPartido);

    // Early return si no hay ID válido DESPUÉS de todos los hooks
    if (!id_partido) {
        return (
            <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
                <BackButton />
                <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-[#262626] rounded w-3/4 mx-auto" />
                        <div className="h-4 bg-[#262626] rounded w-1/2 mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

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
}

