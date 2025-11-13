import { PartidoZona } from "@/app/types/partido";
import EquipoCard from "./EquipoCard";

interface PartidoLlaveProps {
    partido: PartidoZona;
}

const PartidoLlave = ({ partido }: PartidoLlaveProps) => {
    const hasResult = partido.estado === 'F' || partido.estado === 'T';
    const golesLocal = partido.goles_local ?? 0;
    const golesVisita = partido.goles_visita ?? 0;

    const localWins = hasResult && (
        golesLocal > golesVisita ||
        (golesLocal === golesVisita && (partido.pen_local ?? 0) > (partido.pen_visita ?? 0))
    );

    const visitaWins = hasResult && (
        golesVisita > golesLocal ||
        (golesLocal === golesVisita && (partido.pen_visita ?? 0) > (partido.pen_local ?? 0))
    );

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-2 min-w-[280px]">
            <div className="space-y-2">
                <EquipoCard
                    equipo={partido.equipoLocal}
                    infoVacante={partido.info_vacante_local}
                    goles={hasResult ? partido.goles_local : undefined}
                    penales={hasResult && partido.pen_local !== undefined ? partido.pen_local : undefined}
                    isWinner={localWins}
                    isPending={!partido.equipoLocal}
                />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--gray-300)]"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[var(--gray-400)] px-2 text-[var(--gray-200)] text-[10px] uppercase">
                            vs
                        </span>
                    </div>
                </div>

                <EquipoCard
                    equipo={partido.equipoVisita}
                    infoVacante={partido.info_vacante_visita}
                    goles={hasResult ? partido.goles_visita : undefined}
                    penales={hasResult && partido.pen_visita !== undefined ? partido.pen_visita : undefined}
                    isWinner={visitaWins}
                    isPending={!partido.equipoVisita}
                />
            </div>

            {partido.dia && (
                <div className="mt-2 pt-2 border-t border-[var(--gray-300)] text-center">
                    <span className="text-[var(--gray-200)] text-xs">
                        {new Date(partido.dia).toLocaleDateString('es-AR')}
                        {partido.hora && ` - ${partido.hora}`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default PartidoLlave;