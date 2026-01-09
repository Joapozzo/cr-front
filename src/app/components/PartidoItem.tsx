import { Calendar, ChevronRight, Clock, Pause, Calendar1 } from "lucide-react";
import { Partido } from "../types/partido";
import { TbSoccerField } from "react-icons/tb";
// import { useCronometroSimple } from "../hooks/useCronometroSimple";
import { deberMostrarResultado, getEstadoInfo } from "../utils/partido.helper";
import { formatearFecha, formatearHora } from "../utils/formated";
import { EscudoEquipo } from "./common/EscudoEquipo";

interface PartidoItemProps {
    partido: Partido;
    isPendiente?: boolean;
    onClick?: (partidoId: number) => void;
}

const PartidoItem: React.FC<PartidoItemProps> = ({ partido, isPendiente = false, onClick }) => {

    // const cronometro = useCronometroSimple(partido.id_partido, partido.estado);
    const mostrarResultado = deberMostrarResultado(partido.estado);
    const nombreLocal = partido.equipoLocal?.nombre || `Equipo ${partido.id_equipolocal || 'Local'}`;
    const nombreVisita = partido.equipoVisita?.nombre || `Equipo ${partido.id_equipovisita || 'Visita'}`;
    const estadoInfo = getEstadoInfo(partido.estado);
    return (
        <div
            className={`flex flex-col gap-4 bg-[#171717] rounded-lg border border-[#262626] p-4 transition-all duration-200 ${onClick
                ? "hover:border-[#404040] cursor-pointer hover:bg-[#1f1f1f]"
                : ""
                }`}
            onClick={() => onClick?.(partido.id_partido)}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${estadoInfo.bg} ${estadoInfo.color}`}
                    >
                        {estadoInfo.text}
                    </span>
                    {isPendiente && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                            PENDIENTE
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {onClick && <ChevronRight className="text-[#525252]" size={16} />}
                </div>
            </div>

            {/* Información del partido */}
            <div className="">
                <p className="text-[#a3a3a3] text-xs mb-1">
                    {partido.nombre_categoria_completo} - Jornada {partido.jornada}
                </p>
                <div className="flex items-center gap-2">
                    {partido.dia && (
                        <div className="flex items-center gap-1 mb-1">
                            <Calendar1 color="#737373" size={20} />
                            <p className="text-[#737373] text-xs">{formatearFecha(partido.dia)}</p>
                        </div>
                    )}
                    {partido.cancha_ref && (
                        <div className="flex items-center gap-1 mb-1">
                            <TbSoccerField color="#737373" size={20} />
                            <p className="text-[#737373] text-xs">{partido.cancha_ref.nombre}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Equipos y resultado */}
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3 flex-col">
                    {/* Equipo Local */}
                    <div className="flex items-center gap-3 flex-1">
                        <EscudoEquipo src={partido.equipoLocal.img} alt={nombreLocal} width={20} height={20} />
                        <span className="text-white text-sm font-medium truncate">
                            {nombreLocal}
                        </span>
                    </div>

                    {/* Equipo Visita */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <EscudoEquipo src={partido.equipoVisita.img} alt={nombreVisita} width={20} height={20} />
                        <span className="text-white text-sm font-medium truncate text-right">
                            {nombreVisita}
                        </span>
                    </div>
                </div>

                {/* Resultado o Estado */}
                <div className="flex items-center gap-4 px-4">
                    {mostrarResultado ? (
                        <div className="flex items-center gap-4">
                            {/* Cronómetro (solo si está en vivo) */}
                            {/* {cronometro.enVivo && (
                                <div className="flex flex-col items-center">
                                    <span className="text-[var(--color-primary)] text-xs font-medium">
                                        {cronometro.fase}
                                    </span>
                                    <span className="text-white text-sm font-mono">
                                        {cronometro.tiempoFormateado}
                                    </span>
                                </div>
                            )} */}

                            {/* Resultado */}
                            <div className="flex items-center gap-2">
                                {partido.pen_local !== null && partido.pen_local !== undefined && (
                                    <span className="text-[#737373] text-xs">({partido.pen_local})</span>
                                )}
                                <span className="text-white font-bold text-lg">
                                    {partido.goles_local ?? 0}
                                </span>
                                <span className="text-[#525252]">-</span>
                                <span className="text-white font-bold text-lg">
                                    {partido.goles_visita ?? 0}
                                </span>
                                {partido.pen_visita !== null && partido.pen_visita !== undefined && (
                                    <span className="text-[#737373] text-xs">({partido.pen_visita})</span>
                                )}
                            </div>
                        </div>
                    ) : partido.estado === "S" ? (
                        <div className="flex items-center gap-2">
                            <Pause className="text-red-400" size={16} />
                            <span className="text-red-400 text-sm font-medium">SUSP.</span>
                        </div>
                    ) : partido.estado === "A" ? (
                        <div className="flex items-center gap-2">
                            <Calendar className="text-orange-400" size={16} />
                            <span className="text-orange-400 text-sm font-medium">
                                APLAZ.
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Clock className="text-gray-400" size={14} />
                            <span className="text-gray-400 text-sm font-medium">
                                {formatearHora(partido.hora)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartidoItem;