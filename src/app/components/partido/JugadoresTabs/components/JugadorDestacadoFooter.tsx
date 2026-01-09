import React from 'react';
import { Star } from 'lucide-react';
import { JugadorDestacado, EstadoPartido } from '@/app/types/partido';

interface JugadorDestacadoFooterProps {
    jugadorDestacado: JugadorDestacado | null;
    estadoPartido?: EstadoPartido;
}

export const JugadorDestacadoFooter: React.FC<JugadorDestacadoFooterProps> = ({
    jugadorDestacado,
    estadoPartido
}) => {
    // Mostrar solo si el partido está terminado (T) o finalizado (F) y hay un jugador destacado con nombre y apellido
    if (!['T', 'F'].includes(estadoPartido || '') || !jugadorDestacado?.nombre || !jugadorDestacado?.apellido) {
        return null;
    }

    return (
        <div className="mt-2 pt-2 border-t border-[#262626]">
            <div className="flex items-center justify-center py-2">
                <div className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                        <span className="text-sm font-medium text-white">
                            {jugadorDestacado.nombre?.charAt(0) || ''}. {jugadorDestacado.apellido?.toUpperCase() || ''}
                        </span>
                        <Star className="text-yellow-500 fill-current" size={15} />
                    </div>
                    <div className="text-xs text-[#737373] mt-0.5">Mejor Jugador</div>
                </div>
            </div>
        </div>
    );
};

