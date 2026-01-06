import {
    Clock,
    Calendar,
    MapPin,
    Play,
    Shield,
    User
} from "lucide-react";
import { BaseCard, CardHeader } from "./BaseCard";
import { Button } from "./ui/Button";

interface ProximoPartidoProps {
    partido?: {
        equipoLocal: string;
        equipoVisita: string;
        fecha: string;
        hora: string;
        cancha: string;
        categoria: string;
        jornada?: number;
        arbitro?: string;
    };
}

const CardProximoPartido: React.FC<ProximoPartidoProps> = ({ partido }) => {
    // Función para calcular el tiempo restante
    const _calcularTiempoRestante = (fecha: string, hora: string) => {
        const fechaPartido = new Date(`${fecha} ${hora}`);
        const ahora = new Date();
        const diferencia = fechaPartido.getTime() - ahora.getTime();

        if (diferencia <= 0) {
            return "¡Es hora del partido!";
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

        if (dias > 0) {
            return `${dias}d ${horas}h ${minutos}m`;
        } else if (horas > 0) {
            return `${horas}h ${minutos}m`;
        } else {
            return `${minutos}m`;
        }
    };

    if (!partido) {
        return (
            <BaseCard>
                <CardHeader
                    icon={<Calendar className="text-green-400" size={16} />}
                    title="Próximo Partido"
                />
                <div className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-[#262626] rounded-lg flex items-center justify-center">
                            <Calendar className="text-[#525252]" size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-[#d4d4d4] font-medium mb-1">
                                No tienes partidos asignados
                            </p>
                            <p className="text-[#525252] text-sm">
                                Consulta con el administrador
                            </p>
                        </div>
                    </div>
                </div>
            </BaseCard>
        );
    }

    return (
        <BaseCard>
            <CardHeader
                icon={<Calendar className="text-[var(--color-primary)]" size={16} />}
                title="Próximo Partido"
                subtitle={partido.fecha}
            />
            <div className="px-6 py-4">
                <div className="text-center space-y-3 px-5">
                    {/* Fecha y Jornada */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <span className="px-2 py-0.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-medium rounded border border-[var(--color-primary)]/30">
                                Fecha {partido.jornada || 1}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-10">
                            {/* <p className="text-[#737373] text-sm">{partido.fecha}</p> */}
                            <p className="text-[#525252] text-sm">{partido.categoria}</p>
                        </div>
                    </div>

                    {/* Equipos */}
                    <div className="flex items-center justify-between gap-6 w-full">
                        {/* Equipo Local */}
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg flex items-center justify-center">
                                <Shield className="text-[#737373]" size={35} />
                            </div>
                            <span className="text-white font-medium text-sm text-center leading-tight">
                                {partido.equipoLocal}
                            </span>
                        </div>

                        {/* VS */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 bg-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                                <Play className="text-[var(--color-primary)]" size={16} />
                            </div>
                            {/* <span className="text-[#737373] text-xs font-medium">VS</span> */}
                        </div>

                        {/* Equipo Visita */}
                        <div className="flex items-center gap-2">
                            <span className="text-white font-medium text-sm text-center leading-tight">
                                {partido.equipoVisita}
                            </span>
                            <div className="rounded-lg flex items-center justify-center">
                                <Shield className="text-[#737373]" size={35} />
                            </div>
                        </div>
                    </div>

                    {/* Cancha y Árbitro */}
                    <div className="flex w-full items-center justify-center gap-10">
                        <div className="flex items-center justify-center gap-2 text-[#737373] text-sm">
                            <MapPin size={14} />
                            <span>{partido.cancha}</span>
                        </div>
                        {partido.arbitro && (
                            <div className="flex items-center justify-center gap-2 text-[#737373] text-sm">
                                <User size={14} />
                                <span>{partido.arbitro}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2 text-[#737373] text-sm">
                            <Clock size={14} />
                            <span>{partido.hora}</span>
                        </div>
                    </div>

                    {/* Botón */}
                    <Button className="w-full" variant="success">
                        Planillar Ahora
                    </Button>
                </div>
            </div>
        </BaseCard>
    );
};

export default CardProximoPartido;