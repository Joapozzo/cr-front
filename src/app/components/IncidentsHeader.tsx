import React from 'react';
import { Shield } from 'lucide-react';
import { Partido } from '../types/partido';

interface IncidentsHeaderProps {
    partido: Partido;
}

const IncidentsHeader: React.FC<IncidentsHeaderProps> = ({ partido }) => {
    return (
        <div className="flex items-center justify-between mb-6 text-sm text-[#737373]">
            <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">{partido.equipoLocal.nombre}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-medium">{partido.equipoVisita.nombre}</span>
                <Shield className="w-4 h-4" />
            </div>
        </div>
    );
};

export default IncidentsHeader;