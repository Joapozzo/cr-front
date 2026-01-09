import { DreamTeamFormation } from './DreamTeamFormation';
import { DreamTeamFormationSelector } from './DreamTeamFormationSelector';
import { DreamTeamStats } from './DreamTeamStats';
import { JugadorDreamTeam } from '@/app/types/dreamteam';

interface DreamTeamFieldLayoutProps {
    formacionActual: number[];
    formacionNombre: string;
    jugadores: JugadorDreamTeam[];
    isPublished: boolean;
    onSlotClick: (posicionIndex: number) => void;
    onFormationChange: (formacion: string) => void;
}

/**
 * Componente presentacional que estructura el layout del campo
 */
export const DreamTeamFieldLayout = ({
    formacionActual,
    formacionNombre,
    jugadores,
    isPublished,
    onSlotClick,
    onFormationChange,
}: DreamTeamFieldLayoutProps) => {
    const totalSlots = formacionActual.reduce((a, b) => a + b, 0);

    return (
        <div className="relative w-full max-w-full">
            <div className="relative">
                <DreamTeamFormation
                    formacionActual={formacionActual}
                    formacionNombre={formacionNombre}
                    jugadores={jugadores}
                    isPublished={isPublished}
                    onSlotClick={onSlotClick}
                />

                {/* Indicador de formación */}
                <div className="absolute top-4 left-4 bg-[var(--gray-400)] border border-[var(--gray-300)] text-[var(--white)] px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                    {formacionActual.join('-')}
                </div>

                <DreamTeamStats jugadoresCount={jugadores.length} totalSlots={totalSlots} />
            </div>

            <DreamTeamFormationSelector
                formacionActual={formacionNombre}
                isPublished={isPublished}
                onFormationChange={onFormationChange}
            />
        </div>
    );
};

