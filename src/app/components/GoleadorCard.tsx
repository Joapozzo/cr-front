import Image from "next/image";
import StatsCardTemplate from "./TemplateCardStats";
import { Trophy, Volleyball } from "lucide-react";

interface GoleadorCardProps {
    playerName?: string;
    playerLastName?: string;
    goals?: number;
    playerImage?: string;
}

export const GoleadorCard: React.FC<GoleadorCardProps> = ({
    playerName = 'Juan',
    playerLastName = 'Pérez',
    goals = 12,
    playerImage
}) => {
    return (
        <StatsCardTemplate
            title="Goleador del Equipo"
            icon={<Trophy className="w-4 h-4" />}
            accentColor="var(--color-primary)"
        >
            {/* Imagen del jugador */}
            <div className="flex items-center space-x-3 flex-1">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-[var(--gray-300)] border-2 border-[var(--color-primary)] flex-shrink-0">
                    {playerImage ? (
                        <Image
                            src={playerImage}
                            alt={`${playerName} ${playerLastName}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--gray-100)] font-bold text-lg">
                            {playerName.charAt(0)}{playerLastName.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Info del jugador */}
                <div className="flex-1 min-w-0">
                    <p className="text-[var(--white)] font-semibold truncate text-sm md:text-base">
                        {playerName} {playerLastName}
                    </p>
                    <p className="text-[var(--gray-100)] text-xs">
                        Delantero
                    </p>
                </div>
            </div>

            {/* Goles */}
            <div className="text-right flex-shrink-0 ml-4">
                <div className="flex items-center space-x-1">
                    <Volleyball className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
                    <p className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
                        {goals}
                    </p>
                </div>
                <p className="text-xs text-[var(--gray-100)]">
                    {goals === 1 ? 'gol' : 'goles'}
                </p>
            </div>
        </StatsCardTemplate>
    );
};

export default GoleadorCard;