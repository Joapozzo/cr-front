'use client';

import { memo } from 'react';
import { Trophy } from 'lucide-react';
import { EscudoEquipo } from './common/EscudoEquipo';
import { Equipo } from '../types/equipo';

interface CampeonProps {
    equipo: Equipo;
    nombreEdicion?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Campeon = memo(({ 
    equipo, 
    nombreEdicion,
    className = '',
    size = 'md'
}: CampeonProps) => {
    const sizeConfig = {
        sm: {
            escudo: 32,
            trophy: 16,
            text: 'text-xs',
            gap: 'gap-2',
        },
        md: {
            escudo: 48,
            trophy: 20,
            text: 'text-sm',
            gap: 'gap-3',
        },
        lg: {
            escudo: 64,
            trophy: 24,
            text: 'text-base',
            gap: 'gap-4',
        },
    };

    const config = sizeConfig[size];

    return (
        <div className={`flex items-center ${config.gap} ${className}`}>
            {/* Escudo del equipo */}
            <EscudoEquipo
                src={equipo.img}
                alt={equipo.nombre}
                size={config.escudo}
                className="flex-shrink-0"
            />

            {/* Información del campeón */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Nombre del equipo con ícono de trofeo */}
                <div className="flex items-center gap-2">
                    <Trophy 
                        className={`w-${config.trophy} h-${config.trophy} text-[var(--yellow)] flex-shrink-0`}
                        style={{ width: config.trophy, height: config.trophy }}
                    />
                    <span className={`${config.text} font-semibold text-[var(--white)] truncate`}>
                        {equipo.nombre}
                    </span>
                </div>

                {/* Nombre de la edición (opcional) */}
                {nombreEdicion && (
                    <span className={`${config.text} text-[var(--gray-100)] truncate mt-0.5`}>
                        {nombreEdicion}
                    </span>
                )}
            </div>
        </div>
    );
});

Campeon.displayName = 'Campeon';

export default Campeon;

