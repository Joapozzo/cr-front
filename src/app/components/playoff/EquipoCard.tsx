import { Equipo } from "@/app/types/equipo";
import { InfoVacante } from "@/app/types/temporada";
import { Shield } from "lucide-react";
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
            flex items-center justify-between p-3 rounded-lg border
            ${isWinner ? 'bg-[var(--green)]/10 border-[var(--green)]' : 'bg-[var(--gray-400)] border-[var(--gray-300)]'}
            ${isPending ? 'opacity-50' : ''}
            transition-all duration-200
        `}>
            <div className="flex items-center gap-3 flex-1">
                {equipo ? (
                    <>
                        <EscudoEquipo src={equipo.img} alt={equipo.nombre} size={32} />
                        <span className="text-[var(--white)] font-medium text-sm">
                            {equipo.nombre}
                        </span>
                    </>
                ) : infoVacante ? (
                    <div className="flex flex-col">
                        <span className="text-[var(--gray-100)] text-xs italic">
                            {infoVacante.label}
                        </span>
                        {infoVacante.detalles && (
                            <span className="text-[var(--gray-200)] text-[10px]">
                                {infoVacante.detalles}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-[var(--gray-200)] text-xs italic">
                        Por definir
                    </span>
                )}
            </div>

            {(goles !== undefined || penales !== undefined) && (
                <div className="flex items-center gap-2">
                    <span className={`
                        font-bold text-lg
                        ${isWinner ? 'text-[var(--green)]' : 'text-[var(--white)]'}
                    `}>
                        {goles ?? 0}
                    </span>
                    {penales && penales !== undefined && (
                        <span className="text-[var(--gray-100)] text-xs">
                            ({penales})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EquipoCard;