interface DreamTeamStatsProps {
    jugadoresCount: number;
    totalSlots: number;
}

/**
 * Componente presentacional para mostrar estadísticas rápidas
 */
export const DreamTeamStats = ({ jugadoresCount, totalSlots }: DreamTeamStatsProps) => {
    return (
        <div className="absolute top-4 right-4 bg-[var(--gray-400)] border border-[var(--gray-300)] text-[var(--white)] px-3 py-2 rounded-lg text-sm shadow-lg">
            <div className="flex items-center gap-2">
                <span className="text-[var(--color-primary)] text-lg">●</span>
                <span>
                    {jugadoresCount}/{totalSlots}
                </span>
            </div>
        </div>
    );
};

