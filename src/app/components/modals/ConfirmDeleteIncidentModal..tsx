import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { GiSoccerKick } from "react-icons/gi";
import { PiSoccerBallFill } from "react-icons/pi";
import BaseModal from "./ModalPlanillero";

interface ConfirmDeleteIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    incidencia: any; // Tu tipo IncidenciaPartido
    onConfirm: (incidencia: any) => void;
    isLoading?: boolean;
}

const Button = ({ 
    children, 
    onClick, 
    variant = "default", 
    disabled = false, 
    className = "" 
}: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "default" | "danger";
    disabled?: boolean;
    className?: string;
}) => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        default: "bg-[#262626] hover:bg-[#404040] text-white border border-[#404040]",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

const ConfirmDeleteIncidentModal: React.FC<ConfirmDeleteIncidentModalProps> = ({
    isOpen,
    onClose,
    incidencia,
    onConfirm,
    isLoading = false
}) => {
    const handleClose = () => {
        if (isLoading) return;
        onClose();
    };

    const handleConfirm = async () => {
        await onConfirm(incidencia);
    };

    if (!incidencia) return null;

    const getIncidentIcon = () => {
        switch (incidencia.tipo) {
            case 'gol':
                return <PiSoccerBallFill className="w-5 h-5 text-[var(--color-primary)]" />;
            case 'amarilla':
                return <TbRectangleVerticalFilled className="w-5 h-5 text-yellow-500" />;
            case 'roja':
                return <TbRectangleVerticalFilled className="w-5 h-5 text-red-500" />;
            case 'doble_amarilla':
                return (
                    <div className="flex gap-0.5">
                        <TbRectangleVerticalFilled className="w-4 h-4 text-yellow-500" />
                        <TbRectangleVerticalFilled className="w-4 h-4 text-yellow-500" />
                    </div>
                );
            case 'asistencia':
                return <GiSoccerKick className="w-5 h-5 text-blue-400" />;
            default:
                return <AlertTriangle className="w-5 h-5 text-orange-400" />;
        }
    };

    const getIncidentTypeText = () => {
        switch (incidencia.tipo) {
            case 'gol':
                return 'Gol';
            case 'amarilla':
                return 'Tarjeta Amarilla';
            case 'roja':
                return 'Tarjeta Roja';
            case 'doble_amarilla':
                return 'Doble Amarilla';
            case 'asistencia':
                return 'Asistencia';
            default:
                return 'Incidencia';
        }
    };

    const getIncidentDetails = () => {
        const details: string[] = [];
        
        if (incidencia.tipo === 'gol') {
            if (incidencia.penal === 'S') details.push('(Penal)');
            if (incidencia.en_contra === 'S') details.push('(En contra)');
        }
        
        return details.join(' ');
    };

    // Título del modal con icono
    const title = (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span>Eliminar Incidencia</span>
        </div>
    );

    // Contenido del modal
    const content = (
        <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
            </div>

            <div>
                <p className="text-white font-medium text-base mb-3">
                    ¿Estás seguro que quieres eliminar esta incidencia?
                </p>
                
                <div className="bg-[#171717] border border-[#262626] rounded-lg p-4 space-y-3">
                    {/* Tipo de incidencia */}
                    <div className="flex items-center gap-3">
                        {getIncidentIcon()}
                        <span className="text-white font-medium">
                            {getIncidentTypeText()} {getIncidentDetails()}
                        </span>
                    </div>
                    
                    {/* Información del jugador */}
                    <div className="border-t border-[#262626] pt-3">
                        <p className="text-[#737373] text-sm mb-1">Jugador:</p>
                        <p className="text-white font-medium">
                            {incidencia.apellido?.toUpperCase()}, {incidencia.nombre}
                        </p>
                    </div>
                    
                    {/* Minuto */}
                    <div className="flex justify-between items-center pt-2 border-t border-[#262626]">
                        <span className="text-[#737373] text-sm">Minuto:</span>
                        <span className="text-[var(--color-primary)] font-bold">
                            {incidencia.minuto}&apos;
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-[#737373] text-sm">
                Esta acción no se puede deshacer. La incidencia será eliminada permanentemente.
            </p>
        </div>
    );

    // Botones de acción
    const actions = (
        <div className="flex gap-3">
            <Button
                onClick={handleClose}
                variant="default"
                className="flex items-center gap-2 w-full justify-center"
                disabled={isLoading}
            >
                Cancelar
            </Button>
            <Button
                onClick={handleConfirm}
                variant="danger"
                className="flex items-center gap-2 w-full justify-center"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Eliminando...
                    </>
                ) : (
                    <>
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                    </>
                )}
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            actions={actions}
        >
            {content}
        </BaseModal>
    );
};

export default ConfirmDeleteIncidentModal;