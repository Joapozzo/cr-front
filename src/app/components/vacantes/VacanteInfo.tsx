import { Equipo } from "../../types/equipo";
import { InfoVacante } from "../../types/temporada";
import { EscudoEquipo } from "../common/EscudoEquipo";

interface VacanteInfoProps {
    vacanteInfo: InfoVacante | {
        isOcupada: boolean;
        label: string;
        tipo: 'equipo_directo' | 'vacia' | 'automatizacion_posicion' | 'automatizacion_partido';
        detalles: null;
    };
    nomenclatura?: string;
    vacante: number;
    equipoAsignado: Equipo | null;
}

export const VacanteInfo = ({
    vacanteInfo,
    nomenclatura,
    vacante,
    equipoAsignado,
}: VacanteInfoProps) => {
    if (vacanteInfo.isOcupada) {
        return (
            <>
                <div className={`text-xs font-medium mb-1 ${vacanteInfo.tipo === 'equipo_directo'
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--yellow)]'
                    }`}>
                    {nomenclatura
                        ? (vacanteInfo.tipo === 'automatizacion_posicion'
                            ? `POSICIÓN ${nomenclatura}`
                            : `VACANTE ${nomenclatura}`)
                        : (vacanteInfo.tipo === 'automatizacion_posicion'
                            ? `POSICIÓN ${vacante}`
                            : `VACANTE ${vacante}`)
                    }
                </div>

                <div className="flex items-center gap-2">
                    {vacanteInfo.tipo === 'equipo_directo' && (
                        <EscudoEquipo
                            src={equipoAsignado?.img}
                            alt={equipoAsignado?.nombre || 'Equipo'}
                            size={24}
                        />
                    )}
                    <span className={`text-sm text-[var(--white)] font-medium ${vacanteInfo.tipo === 'equipo_directo'
                        ? 'text-[var(--gray-100)]'
                        : 'text-[var(--yellow)]'
                        }`}>
                        {vacanteInfo.label}
                    </span>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="text-xs text-[var(--gray-100)] mb-1">
                {nomenclatura ? `${nomenclatura}` : `Vacante ${vacante}`}
            </div>
            <div className="text-sm text-[var(--blue)] hover:text-[var(--blue)]/80">
                {vacanteInfo.label}
            </div>
        </>
    );
};

