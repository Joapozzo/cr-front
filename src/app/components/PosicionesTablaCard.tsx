import { TrendingUp } from "lucide-react";
import StatsCardTemplate from "./TemplateCardStats";
import { EscudoEquipo } from "./common/EscudoEquipo";

interface PosicionTablaCardProps {
    position?: number;
    teamName?: string;
    points?: number;
    matchesPlayed?: number;
    teamImage?: string;
    showSurroundingTeams?: boolean;
}

export const PosicionTablaCard: React.FC<PosicionTablaCardProps> = ({
    position = 3,
    teamName = 'Mi equipo',
    points = 24,
    matchesPlayed = 10,
    teamImage
}) => {
    // Datos estáticos de equipos cercanos (esto después vendrá de la API)
    const tablaMock = [
        // { pos: position - 1, nombre: 'Equipo Superior', pts: points + 3, pj: matchesPlayed, img: null },
        { pos: position, nombre: teamName, pts: points, pj: matchesPlayed, img: teamImage, isMyTeam: true },
        // { pos: position + 1, nombre: 'Equipo Inferior', pts: points - 2, pj: matchesPlayed, img: null },
    ];

    return (
        <StatsCardTemplate
            title="Posición en Tabla"
            icon={<TrendingUp className="w-4 h-4" />}
            accentColor="var(--color-primary)"
        >
            <div className="w-full space-y-2">
                {tablaMock.map((equipo) => (
                    <div
                        key={equipo.pos}
                        className={`
                            flex items-center justify-between p-2 rounded
                            ${equipo.isMyTeam
                                ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30'
                                : 'bg-[var(--gray-300)]/30'
                            }
                        `}
                    >
                        {/* Posición y equipo */}
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <span className={`
                                text-sm font-bold w-6 text-center flex-shrink-0
                                ${equipo.isMyTeam ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}
                            `}>
                                {equipo.pos}°
                            </span>

                            <EscudoEquipo
                                src={equipo.img}
                                alt={equipo.nombre}
                                size={24}
                                className="flex-shrink-0"
                            />

                            <span className={`
                                text-xs md:text-sm truncate
                                ${equipo.isMyTeam ? 'text-[var(--white)] font-semibold' : 'text-[var(--gray-100)]'}
                            `}>
                                {equipo.nombre}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                            <div className="text-center">
                                <p className={`
                                    text-xs font-bold
                                    ${equipo.isMyTeam ? 'text-[var(--color-primary)]' : 'text-[var(--white)]'}
                                `}>
                                    {equipo.pts}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-[var(--gray-100)]">PTS</p>
                            </div>
                            <div className="text-center">
                                <p className={`
                                    text-xs font-bold
                                    ${equipo.isMyTeam ? 'text-[var(--color-primary)]' : 'text-[var(--white)]'}
                                `}>
                                    {equipo.pj}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-[var(--gray-100)]">PJ</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </StatsCardTemplate>
    );
};

export default PosicionTablaCard;