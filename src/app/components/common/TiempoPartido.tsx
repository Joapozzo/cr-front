import React from 'react';
import { EstadoPartido } from '@/app/types/partido';
import { getTiempoTexto } from '@/app/utils/tiempoPartido.helper';

interface TiempoPartidoProps {
    estado: EstadoPartido;
    partidoId?: number; // Opcional: para futuras mejoras
    showCronometro?: boolean; // Deprecated: ya no se usa, pero se mantiene para compatibilidad
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const TiempoPartido: React.FC<TiempoPartidoProps> = ({
    estado,
    partidoId: _partidoId,
    showCronometro: _showCronometro = false,
    size = 'md',
    className = ''
}) => {
    const estaEnVivo = ['C1', 'E', 'C2'].includes(estado);

    const sizeClasses = {
        sm: 'text-[9px]',
        md: 'text-xs',
        lg: 'text-sm'
    };

    // Si no está en vivo, no mostrar nada
    if (!estaEnVivo) {
        return null;
    }

    const tiempoTexto = getTiempoTexto(estado);

    // Solo mostrar el texto del tiempo (PT, ST, ET) sin cronómetro
    return (
        <div className={`text-white font-medium ${sizeClasses[size]} ${className}`}>
            {tiempoTexto}
        </div>
    );
};

