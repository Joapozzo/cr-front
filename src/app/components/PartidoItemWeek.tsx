import { useRouter } from "next/navigation";
import { EstadoPartido, PartidoCompleto } from "../types/partido";
import { deberMostrarResultado, getEstadoInfo } from "../utils/partido.helper";
import { formatearFecha, formatearHora } from "../utils/formated";
import {
    Clock,
    FileText,
    Pause,
    Calendar,
} from "lucide-react";
import { EscudoEquipo } from "./common/EscudoEquipo";

interface PartidoItemWeekProps {
    partidos: PartidoCompleto[];
}

const PartidoItemWeek = ({ partidos }: PartidoItemWeekProps) => {
    const router = useRouter();
    return (
        <div className="px-6 py-4">
            {partidos.length > 0 ? (
                <div className="space-y-3">
                    {partidos.map((partido) => {
                        const estado = partido.estado as EstadoPartido;
                        const debeMostrarResultado = deberMostrarResultado(estado);
                        const estadoInfo = getEstadoInfo(estado);
                        const nombreLocal = partido.equipoLocal?.nombre || `Equipo ${partido.equipoLocal?.id_equipo || 'Local'}`;
                        const nombreVisita = partido.equipoVisita?.nombre || `Equipo ${partido.equipoVisita?.id_equipo || 'Visita'}`;

                        return (
                            <div
                                key={partido.id_partido}
                                className="bg-[#171717] rounded-lg border border-[#262626] p-4 cursor-pointer hover:border-[#404040] hover:bg-[#1f1f1f] transition-all duration-200"
                                onClick={() => router.push(`/planillero/partidos/${partido.id_partido}`)}
                            >
                                {/* Header con estado */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${estadoInfo.bg} ${estadoInfo.color}`}>
                                        {estadoInfo.text}
                                    </span>
                                    <span className="text-[#525252] text-xs">
                                        {partido.dia ? formatearFecha(partido.dia) : ''}
                                    </span>
                                </div>

                                {/* Equipos y resultado/hora */}
                                <div className="flex items-center justify-between">
                                    {/* Equipo Local */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <EscudoEquipo src={partido.equipoLocal?.img} alt={nombreVisita} width={20} height={20} />
                                        <span className="text-white text-sm font-medium truncate">
                                            {nombreLocal}
                                        </span>
                                    </div>

                                    {/* Resultado o Hora */}
                                    <div className="flex items-center gap-4 px-4">
                                        {debeMostrarResultado ? (
                                            <div className="flex items-center gap-2">
                                                {partido.pen_local !== null && partido.pen_local !== undefined && (
                                                    <span className="text-[#737373] text-xs">({partido.pen_local})</span>
                                                )}
                                                <span className="text-white font-bold text-lg">
                                                    {partido.goles_local ?? 0}
                                                </span>
                                                <span className="text-[#525252] text-sm">-</span>
                                                <span className="text-white font-bold text-lg">
                                                    {partido.goles_visita ?? 0}
                                                </span>
                                                {partido.pen_visita !== null && partido.pen_visita !== undefined && (
                                                    <span className="text-[#737373] text-xs">({partido.pen_visita})</span>
                                                )}
                                            </div>
                                        ) : estado === 'S' ? (
                                            <div className="flex items-center gap-2">
                                                <Pause className="text-red-400" size={16} />
                                                <span className="text-red-400 text-sm font-medium">SUSP.</span>
                                            </div>
                                        ) : estado === 'A' ? (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-orange-400" size={16} />
                                                <span className="text-orange-400 text-sm font-medium">APLAZ.</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-gray-400" size={14} />
                                                <span className="text-gray-400 text-sm font-medium">
                                                    {partido.hora ? formatearHora(partido.hora) : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Equipo Visita */}
                                    <div className="flex items-center gap-3 flex-1 justify-end">
                                        <span className="text-white text-sm font-medium truncate text-right">
                                            {nombreVisita}
                                        </span>
                                        <EscudoEquipo src={partido.equipoVisita?.img} alt={nombreVisita} width={20} height={20} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-4">
                    <FileText className="text-[#525252] mx-auto mb-2" size={32} />
                    <p className="text-[#525252] text-sm">No hay partidos esta semana</p>
                </div>
            )}
        </div>
    )
}

export default PartidoItemWeek;