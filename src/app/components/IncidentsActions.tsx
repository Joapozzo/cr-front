import React from 'react';
import { Edit, X } from 'lucide-react';
import { IncidenciaPartido } from '../types/partido';

interface IncidentActionsProps {
    incidencia: IncidenciaPartido;
    onEdit: (incidencia: IncidenciaPartido) => void;
    onDelete: (incidencia: IncidenciaPartido) => void;
    isLocal: boolean;
}

const IncidentActions: React.FC<IncidentActionsProps> = ({
    incidencia,
    onEdit,
    onDelete,
    isLocal
}) => {
    const containerClasses = `flex items-center gap-1 ${isLocal ? 'ml-auto' : 'mr-auto'}`;

    return (
        <div className={containerClasses}>
            <button
                onClick={() => onEdit(incidencia)}
                className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                title="Editar"
            >
                <Edit className="w-4 h-4 text-[#737373] hover:text-white" />
            </button>
            <button
                onClick={() => onDelete(incidencia)}
                className="p-1.5 hover:bg-[#262626] rounded transition-colors"
                title="Eliminar"
            >
                <X className="w-4 h-4 text-red-500 hover:text-red-400" />
            </button>
        </div>
    );
};

export default IncidentActions;