import { DreamTeamSectionServer } from '@/app/components/DreamTeamSection';

interface DreamTeamSectionProps {
    categoriaNombre?: string;
    jornada: number;
    idCategoriaEdicion: number;
}

/**
 * Componente para la sección de DreamTeam
 * Wrapper que delega a la nueva arquitectura refactorizada
 */
export const DreamTeamSection = ({
    categoriaNombre,
    jornada,
    idCategoriaEdicion,
}: DreamTeamSectionProps) => {
    return (
        <DreamTeamSectionServer
            idCategoriaEdicion={idCategoriaEdicion}
            jornada={jornada}
            categoriaNombre={categoriaNombre}
        />
    );
};

