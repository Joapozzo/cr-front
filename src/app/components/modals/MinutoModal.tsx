import { useState, useEffect } from "react";
import BaseModal from "./ModalPlanillero";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface MinutoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    jugador: { id: number; nombre: string; apellido: string; dorsal: number | null };
    tipoAccion: 'gol' | 'amarilla' | 'roja';
    onSubmit: (minuto: number) => void;
    minutoPartido: number;
    isLoading?: boolean;
    isEditing?: boolean;
}

const MinutoModal: React.FC<MinutoModalProps> = ({
    isOpen,
    onClose,
    jugador,
    tipoAccion,
    onSubmit,
    minutoPartido,
    onBack,
    isLoading = false,
    isEditing = false
}) => {
    const [minuto, setMinuto] = useState<number>(minutoPartido);
    const [error, setError] = useState<string>('');

    const accionLabels = {
        gol: 'Gol',
        amarilla: 'Tarjeta Amarilla',
        roja: 'Expulsión'
    };

    useEffect(() => {
        if (isOpen) {
            setMinuto(minutoPartido);
            setError('');
        }
    }, [isOpen, minutoPartido]);

    const validateMinuto = (value: number): boolean => {
        if (!value || value < 1) {
            setError('El minuto debe ser mayor a 0');
            return false;
        }
        if (value > 120) {
            setError('El minuto no puede ser mayor a 120');
            return false;
        }
        setError('');
        return true;
    };

    const handleMinutoChange = (value: string) => {
        const numValue = parseInt(value) || minutoPartido;
        setMinuto(numValue);
        validateMinuto(numValue);
    };

    const handleSave = () => {
        if (!validateMinuto(minuto)) return;
        onSubmit(minuto);
    };

    const handleClose = () => {
        if (isLoading) return;
        setMinuto(minutoPartido);
        setError('');
        onClose();
    };

    const canSave = minuto && !error && !isLoading;

    const renderStepIndicators = () => {
        // Si estamos editando, no mostrar indicadores de pasos
        if (isEditing) {
            return null;
        }

        if (tipoAccion === 'amarilla') {
            // Para amarilla: Acción (1) -> Minuto (2)
            return (
                <div className="ml-3 flex items-center gap-2 text-xs text-[#737373]">
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-white text-xs">
                            1
                        </div>
                        <span className="hidden sm:inline">Acción</span>
                    </div>
                    <div className="w-4 h-px bg-[#404040]"></div>
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-[var(--green)] flex items-center justify-center text-black text-xs font-medium">
                            2
                        </div>
                        <span className="hidden sm:inline">Minuto</span>
                    </div>
                </div>
            );
        } else {
            // Para gol y roja: Acción (1) -> Tipo/Motivo (2) -> Minuto (3)
            return (
                <div className="ml-3 flex items-center gap-2 text-xs text-[#737373]">
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-white text-xs">
                            1
                        </div>
                        <span className="hidden sm:inline">Acción</span>
                    </div>
                    <div className="w-4 h-px bg-[#404040]"></div>
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-white text-xs">
                            2
                        </div>
                        <span className="hidden sm:inline">{tipoAccion === 'gol' ? 'Tipo' : 'Motivo'}</span>
                    </div>
                    <div className="w-4 h-px bg-[#404040]"></div>
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-[var(--green)] flex items-center justify-center text-black text-xs font-medium">
                            3
                        </div>
                        <span className="hidden sm:inline">Minuto</span>
                    </div>
                </div>
            );
        }
    };

    const getTitle = () => {
        if (isEditing) {
            return `Editar ${accionLabels[tipoAccion]}`;
        }
        return `Confirmar ${accionLabels[tipoAccion]}`;
    };

    const getButtonText = () => {
        if (isLoading) {
            return isEditing ? 'Actualizando...' : 'Guardando...';
        }
        return isEditing ? 'Actualizar' : 'Confirmar';
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-1.5 rounded-lg hover:bg-[#262626] transition-colors"
                            disabled={isLoading}
                        >
                            <ArrowLeft size={18} className="text-[#737373]" />
                        </button>
                        <span>{getTitle()}</span>
                    </div>
                    {/* Indicadores de pasos dinámicos - solo para creación */}
                    {renderStepIndicators()}
                </div>
            }
            actions={
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
                        onClick={handleSave}
                        disabled={!canSave}
                        variant="success"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {getButtonText()}
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {getButtonText()}
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Jugador: {jugador.apellido.toUpperCase()}, {jugador.nombre} 
                        {jugador.dorsal && ` (#${jugador.dorsal})`}
                    </label>
                    <label className="block text-sm font-medium text-white mb-2">
                        Acción: {accionLabels[tipoAccion]}
                    </label>
                    {!isEditing && (
                        <div className="text-xs text-[#737373] mb-4">
                            Minuto actual del partido: {minutoPartido}'
                        </div>
                    )}
                    {isEditing && (
                        <div className="text-xs text-[#737373] mb-4">
                            Minuto original: {minutoPartido}'
                        </div>
                    )}
                </div>

                <Input
                    label="Minuto del incidente"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="45"
                    value={minuto}
                    onChange={(e) => handleMinutoChange(e.target.value)}
                    error={error}
                    disabled={isLoading}
                />

                {isEditing && (
                    <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-white mb-2">Editando acción:</h4>
                        <p className="text-xs text-[#737373]">
                            Los cambios se aplicarán inmediatamente y se reflejarán en el registro del partido.
                        </p>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default MinutoModal;