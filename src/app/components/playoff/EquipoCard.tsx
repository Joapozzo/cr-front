import { Equipo } from "@/app/types/equipo";
import { InfoVacante } from "@/app/types/temporada";
// import { Shield } from "lucide-react";
import { EscudoEquipo } from "../common/EscudoEquipo";

interface EquipoCardProps {
    equipo?: Equipo;
    infoVacante?: InfoVacante;
    goles?: number;
    penales?: number;
    isWinner?: boolean;
    isPending?: boolean;
}

const EquipoCard = ({ equipo, infoVacante, goles, penales, isWinner, isPending }: EquipoCardProps) => {
    return (
        <div className={`
            flex items-center justify-between p-2 md:p-3 rounded-lg border
            ${isWinner ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]' : 'bg-[var(--gray-400)] border-[var(--gray-300)]'}
            ${isPending ? 'opacity-50' : ''}
            transition-all duration-200
        `}>
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                {equipo ? (
                    <>
                        <EscudoEquipo src={equipo.img} alt={equipo.nombre} size={28} className="md:w-8 md:h-8 flex-shrink-0" />
                        <span className="text-[var(--white)] font-medium text-xs md:text-sm truncate">
                            {equipo.nombre}
                        </span>
                    </>
                ) : infoVacante ? (
                    <div className="flex flex-col min-w-0">
                        <span className="text-[var(--gray-100)] text-[10px] md:text-xs italic truncate">
                            {infoVacante.label}
                        </span>
                        {infoVacante.detalles && (
                            <span className="text-[var(--gray-200)] text-[9px] md:text-[10px] truncate">
                                {infoVacante.detalles}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-[var(--gray-200)] text-[10px] md:text-xs italic">
                        Por definir
                    </span>
                )}
            </div>

            {(goles !== undefined || penales !== undefined) && (
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <span className={`
                        font-bold text-base md:text-lg
                        ${isWinner ? 'text-[var(--color-primary)]' : 'text-[var(--white)]'}
                    `}>
                        {goles ?? 0}
                    </span>
                    {penales && penales !== undefined && (
                        <span className="text-[var(--gray-100)] text-[10px] md:text-xs">
                            ({penales})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EquipoCard;