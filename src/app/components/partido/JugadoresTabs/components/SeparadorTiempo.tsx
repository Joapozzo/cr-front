import React from 'react';
import { EstadoPartido } from '@/app/types/partido';

interface SeparadorTiempoProps {
    tiempo?: '1T' | '2T' | 'ET' | 'PEN';
    esTerminado?: boolean;
    estadoPartido?: EstadoPartido;
    index: number;
}

export const SeparadorTiempo: React.FC<SeparadorTiempoProps> = ({
    tiempo,
    esTerminado,
    estadoPartido,
    index
}) => {
    const getTiempoTexto = () => {
        if (!tiempo && esTerminado) {
            return 'PARTIDO TERMINADO';
        }
        
        if (!tiempo) return '';
        
        if (tiempo === '1T') {
            if (esTerminado) {
                return 'PT TERMINADO';
            }
            return 'PT';
        } else if (tiempo === '2T') {
            if (esTerminado) {
                return 'ST TERMINADO';
            }
            return 'ST';
        } else if (tiempo === 'ET') {
            return 'ET';
        } else if (tiempo === 'PEN') {
            return 'PENALES';
        }
        return '';
    };

    const texto = getTiempoTexto();
    if (!texto) return null;

    return (
        <div key={`separador-${tiempo || 'final'}-${index}`} className="flex items-center gap-3 py-2 mt-3">
            <div className="flex-1 h-px bg-[#262626]"></div>
            <span className="text-xs font-medium text-[#737373] uppercase tracking-wider">
                {texto}
            </span>
            <div className="flex-1 h-px bg-[#262626]"></div>
        </div>
    );
};

