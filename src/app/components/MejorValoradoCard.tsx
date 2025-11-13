import Image from "next/image";
import StatsCardTemplate from "./TemplateCardStats";
import { Star } from "lucide-react";

interface MejorValoradoCardProps {
    playerName?: string;
    playerLastName?: string;
    rating?: number;
    playerImage?: string;
}

export const MejorValoradoCard: React.FC<MejorValoradoCardProps> = ({
    playerName = 'Carlos',
    playerLastName = 'González',
    rating = 8.5,
    playerImage
}) => {
    return (
        <StatsCardTemplate
            title="Mejor Valorado"
            icon={<Star className="w-4 h-4" />}
            accentColor="#FFD700"
        >
            {/* Imagen del jugador */}
            <div className="flex items-center space-x-3 flex-1">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-[var(--gray-300)] border-2 border-[#FFD700] flex-shrink-0">
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
                        Mediocampista
                    </p>
                </div>
            </div>

            {/* Rating */}
            <div className="text-right flex-shrink-0 ml-4">
                <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 md:w-6 md:h-6 fill-[#FFD700] text-[#FFD700]" />
                    <p className="text-3xl md:text-4xl font-bold text-[#FFD700]">
                        {rating.toFixed(1)}
                    </p>
                </div>
                <p className="text-xs text-[var(--gray-100)]">
                    valoración
                </p>
            </div>
        </StatsCardTemplate>
    );
};

export default MejorValoradoCard;