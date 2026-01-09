import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

interface PartidoHeaderMetaProps {
    jornada: number;
    fecha: string;
    cancha: string;
}

export const PartidoHeaderMeta: React.FC<PartidoHeaderMetaProps> = ({
    jornada,
    fecha,
    cancha,
}) => {
    return (
        <div className="bg-[var(--black-800)] px-6 py-3 border-b border-[#262626] rounded-t-xl">
            <div className="flex items-center justify-center gap-6 text-xs text-[#737373]">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <Calendar size={12} />
                    <span>Jornada {jornada}</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Calendar size={12} />
                    <span>{fecha}</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <MapPin size={12} />
                    <span>{cancha}</span>
                </div>
            </div>
        </div>
    );
};

