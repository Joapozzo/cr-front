import { Partido } from "@/app/types/partido";
import Link from "next/link";
import { EscudoEquipo } from "../common/EscudoEquipo";
import { estaEnVivo } from "@/app/utils/tiempoPartido.helper";
import { EnVivoBadge } from "../common/EnVivoBadge";
import { TiempoPartido } from "../common/TiempoPartido";
import { getEstadoConfig } from "@/app/utils/partido.helper";
import { GiSoccerField } from "react-icons/gi";

interface PartidoListFixtureProps {
    partido: Partido;
}

const PartidoListFixture = ({ partido }: PartidoListFixtureProps) => {
    const estadoConfig = getEstadoConfig(partido.estado);

    return (
        <Link
            key={partido.id_partido}
            href={`/partidos/${partido.id_partido}`}
            className="block hover:bg-[var(--black-800)] transition-colors"
        >
            <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    {/* Equipo Local */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <EscudoEquipo
                            src={partido.equipoLocal.img}
                            alt={partido.equipoLocal.nombre}
                            size={24}
                            className="flex-shrink-0"
                        />
                        <span className="text-white text-xs font-medium truncate">
                            {partido.equipoLocal.nombre}
                        </span>
                    </div>

                    {/* Centro: Marcador, Hora, Cancha o En Vivo */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        {estaEnVivo(partido.estado) && (
                            <div className="flex items-center gap-1">
                                <EnVivoBadge size="sm" />
                                {/* <TiempoPartido
                                    estado={partido.estado}
                                    partidoId={partido.id_partido}
                                    showCronometro={false}
                                    size="sm"
                                /> */}
                            </div>
                        )}

                        {estadoConfig.showScore ? (
                            <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-bold">{partido.goles_local ?? 0}</span>
                                <span className="text-[#737373] text-xs">-</span>
                                <span className="text-white text-sm font-bold">{partido.goles_visita ?? 0}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 flex-col justify-center">
                                <span className="text-[#737373] text-xs font-medium">{partido.hora}</span>
                                {estadoConfig.showCancha && (
                                    <div className="flex items-center gap-1">
                                        <GiSoccerField />
                                        <span className="text-[#737373] text-[10px]">
                                            {typeof partido.cancha === 'object' && partido.cancha !== null
                                                ? (partido.cancha as any).nombre
                                                : partido.cancha}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Equipo Visita */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="text-white text-xs font-medium truncate text-right">
                            {partido.equipoVisita.nombre}
                        </span>
                        <EscudoEquipo
                            src={partido.equipoVisita.img}
                            alt={partido.equipoVisita.nombre}
                            size={24}
                            className="flex-shrink-0"
                        />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PartidoListFixture;