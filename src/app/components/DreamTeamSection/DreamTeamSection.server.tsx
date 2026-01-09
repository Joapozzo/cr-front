'use client';

import { Suspense } from 'react';
import { DreamTeamSectionClient } from './DreamTeamSection.client';
import { useDreamteamCategoriaJornada } from '@/app/hooks/useDreamteam';
import DreamTeamSkeleton from '../skeletons/DreamTeamSkeleton';

interface DreamTeamSectionServerProps {
    idCategoriaEdicion: number;
    jornada: number;
    categoriaNombre?: string;
}

/**
 * Componente que maneja el fetch de datos
 * Usa Suspense para manejar estados de carga
 */
export const DreamTeamSectionServer = ({
    idCategoriaEdicion,
    jornada,
    categoriaNombre,
}: DreamTeamSectionServerProps) => {
    return (
        <Suspense fallback={<DreamTeamSkeleton />}>
            <DreamTeamSectionServerContent
                idCategoriaEdicion={idCategoriaEdicion}
                jornada={jornada}
                categoriaNombre={categoriaNombre}
            />
        </Suspense>
    );
};

/**
 * Componente interno que usa el hook
 */
const DreamTeamSectionServerContent = ({
    idCategoriaEdicion,
    jornada,
    categoriaNombre,
}: DreamTeamSectionServerProps) => {
    const { data: dreamteam, isLoading, refetch: refetchDreamteam } = useDreamteamCategoriaJornada(
        idCategoriaEdicion,
        jornada,
        {
            enabled: !!idCategoriaEdicion && !!jornada,
        }
    );

    if (isLoading) {
        return <DreamTeamSkeleton />;
    }

    return (
        <DreamTeamSectionClient
            dreamteam={dreamteam || null}
            categoriaNombre={categoriaNombre}
            jornada={jornada}
            refetchDreamteam={refetchDreamteam}
        />
    );
};

