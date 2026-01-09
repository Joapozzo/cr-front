'use client';

import { useCallback } from 'react';
import { DreamTeamView } from './DreamTeamView';
import { useDreamTeamController } from '@/app/hooks/useDreamTeamController';
import { useFormationController } from '@/app/hooks/useFormationController';
import { usePublicarDreamteam, useVaciarFormacionDreamteam } from '@/app/hooks/useDreamteam';
import { DreamTeam } from '@/app/types/dreamteam';
import toast from 'react-hot-toast';

interface DreamTeamSectionClientProps {
    dreamteam: DreamTeam | null | undefined;
    categoriaNombre?: string;
    jornada: number;
    refetchDreamteam: () => void;
}

/**
 * Container component que maneja toda la lógica y estado
 * NO renderiza directamente, delega a DreamTeamView
 */
export const DreamTeamSectionClient = ({
    dreamteam,
    categoriaNombre,
    jornada,
    refetchDreamteam,
}: DreamTeamSectionClientProps) => {
    // Controlador de formación
    const { formacionNombre, formacionActual, cambiarFormacion } = useFormationController({
        initialFormation: dreamteam?.formacion || '1-2-3-1',
        onFormationChange: (formacion) => {
            // El cambio de formación se maneja localmente
        },
    });

    // Controlador de DreamTeam (agregar/eliminar jugadores)
    const {
        modalJugador,
        modalEliminar,
        openModalJugador,
        closeModalJugador,
        openModalEliminar,
        closeModalEliminar,
        handleSeleccionarJugador,
        handleConfirmarEliminar,
        isAgregando,
        isEliminando,
        errorEliminar,
    } = useDreamTeamController({
        jornada,
        formacionNombre,
        refetchDreamteam,
    });

    // Mutaciones para publicar y vaciar
    const { mutateAsync: publicarDreamteam, isPending: isPublicando } = usePublicarDreamteam({
        onSuccess: () => {
            refetchDreamteam();
            toast.success('Dreamteam publicado exitosamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al publicar dreamteam');
        },
    });

    const { mutateAsync: vaciarFormacion, isPending: isVaciando } = useVaciarFormacionDreamteam({
        onSuccess: () => {
            refetchDreamteam();
            toast.success('Formación vaciada exitosamente');
        },
        onError: (error) => {
            toast.error(error.message || 'Error al vaciar la formación');
        },
    });

    // Handlers
    const handleSlotClick = useCallback(
        (posicionIndex: number) => {
            if (dreamteam?.publicado) return;

            const jugador = dreamteam?.jugadores.find((j) => j.posicion_index === posicionIndex);
            if (jugador) {
                openModalEliminar(jugador);
            } else {
                openModalJugador(String(posicionIndex));
            }
        },
        [dreamteam, openModalEliminar, openModalJugador]
    );

    const handlePublicar = useCallback(async () => {
        if (!dreamteam?.id_dreamteam) return;
        await publicarDreamteam({ id_dreamteam: dreamteam.id_dreamteam, formacion: formacionNombre });
    }, [dreamteam, formacionNombre, publicarDreamteam]);

    const handleVaciar = useCallback(async () => {
        if (!dreamteam?.id_dreamteam) return;
        await vaciarFormacion(dreamteam.id_dreamteam);
    }, [dreamteam, vaciarFormacion]);

    const handleConfirmarEliminarWrapper = useCallback(
        async (idDreamteam: number, idPartido: number, idJugador: number) => {
            await handleConfirmarEliminar(idDreamteam, idPartido, idJugador);
        },
        [handleConfirmarEliminar]
    );

    return (
        <DreamTeamView
            dreamteam={dreamteam}
            formacionActual={formacionActual}
            formacionNombre={formacionNombre}
            categoriaNombre={categoriaNombre}
            jornada={jornada}
            isPublished={!!dreamteam?.publicado}
            onSlotClick={handleSlotClick}
            onFormationChange={cambiarFormacion}
            onPublicar={handlePublicar}
            onVaciar={handleVaciar}
            onSeleccionarJugador={handleSeleccionarJugador}
            onConfirmarEliminar={handleConfirmarEliminarWrapper}
            modalJugador={modalJugador}
            modalEliminar={modalEliminar}
            onCloseModalJugador={closeModalJugador}
            onCloseModalEliminar={closeModalEliminar}
            isPublicando={isPublicando}
            isVaciando={isVaciando}
            isAgregando={isAgregando}
            isEliminando={isEliminando}
            errorEliminar={errorEliminar}
        />
    );
};

