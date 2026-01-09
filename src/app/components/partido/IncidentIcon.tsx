import React from 'react';
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { GiSoccerKick } from "react-icons/gi";
import { PiSoccerBallFill } from "react-icons/pi";

interface IncidentIconProps {
    tipo: string;
    cantidad?: number;
}

/**
 * Componente para mostrar el icono de una incidencia con su cantidad
 */
const IncidentIcon: React.FC<IncidentIconProps> = ({ tipo, cantidad = 1 }) => {
    const renderIcono = () => {
        switch (tipo) {
            case 'gol':
                return <PiSoccerBallFill className="w-4 h-4 text-[var(--color-primary)] fill-current" />;
            case 'amarilla':
                return <TbRectangleVerticalFilled className="w-4 h-4 text-yellow-500" />;
            case 'roja':
                return <TbRectangleVerticalFilled className="w-4 h-4 text-red-500" />;
            case 'doble_amarilla':
                return (
                    <div className="flex gap-0.5">
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

    return (
        <div className="flex items-center gap-1">
            {renderIcono()}
            {cantidad > 1 && (
                <span className="text-xs font-bold text-white">x{cantidad}</span>
            )}
        </div>
    );
};

export default IncidentIcon;

