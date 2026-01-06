import { IncidenciaPartido, Partido } from '../types/partido';
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { GiSoccerKick } from "react-icons/gi";
import { PiSoccerBallFill } from "react-icons/pi";
import { RefreshCw } from 'lucide-react';

export const canShowActions = (showActions: boolean, partido?: Partido): boolean => {
    if (!showActions || !partido) return false;
    return ['P', 'C', 'T', 'C1', 'E', 'C2', 'F'].includes(partido.estado);
};

export const isLocalTeam = (equipoId: number | null, partido: Partido): boolean => {
    return equipoId === partido.equipoLocal.id_equipo;
};

export const getIcono = (incidencia: IncidenciaPartido) => {
    switch (incidencia.tipo) {
        case 'gol':
            return <PiSoccerBallFill className="w-4 h-4 text-[var(--color-primary)] fill-current" />;
        case 'amarilla':
            return <TbRectangleVerticalFilled className="w-4 h-4 text-yellow-500" />;
        case 'roja':
            return <TbRectangleVerticalFilled className="w-4 h-4 text-red-500" />;
        case 'cambio':
            return <RefreshCw className="w-4 h-4 text-gray-500" />;
        case 'doble_amarilla':
            return (
                <div className= "flex gap-0.5" >
                <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                    <TbRectangleVerticalFilled className="w-3 h-3 text-yellow-500" />
                        </div>
                );
            case 'asistencia':
return <GiSoccerKick className="w-4 h-4 text-[var(--color-primary)]" />;
            default:
return null;
        }
};