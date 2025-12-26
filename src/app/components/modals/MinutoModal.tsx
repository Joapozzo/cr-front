import { useState, useEffect } from "react";
import BaseModal from "./ModalPlanillero";
import { Save, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

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
    const [minuto, setMinuto] = useState<string>(String(minutoPartido));
    const [error, setError] = useState<string>('');

    const accionLabels = {
        gol: 'Gol',
        amarilla: 'Tarjeta amarilla',
        roja: 'Expulsión'
    };

    useEffect(() => {
        if (isOpen) {
            setMinuto(String(minutoPartido));
            setError('');
        }
    }, [isOpen, minutoPartido]);

    // Validar que el minuto sea un número válido
    const isValidMinuto = () => {
        if (!minuto.trim()) return false;
        const minutoNumber = parseInt(minuto.trim());
        return !isNaN(minutoNumber) && minutoNumber >= 1 && minutoNumber <= 120;
    };

    const handleSave = () => {
        // Validaciones locales - debe tener al menos un dígito y ser número válido
        if (!minuto.trim()) {
            setError('El minuto no puede estar vacío');
            return;
        }

        const minutoNumber = parseInt(minuto.trim());
        if (isNaN(minutoNumber) || minutoNumber < 1 || minutoNumber > 120) {
            setError('El minuto debe ser un número entre 1 y 120');
            return;
        }

        onSubmit(minutoNumber);
    };

    const handleClose = () => {
        if (isLoading) return;
        setMinuto(String(minutoPartido));
        setError('');
        onClose();
    };

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
                        disabled={isLoading || !isValidMinuto()}
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
                            Minuto actual del partido: {minutoPartido}&apos;
                        </div>
                    )}
                    {isEditing && (
                        <div className="text-xs text-[#737373] mb-4">
                            Minuto original: {minutoPartido}&apos;
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#737373] mb-2">
                        Minuto del incidente:
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={minuto}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Validación manual: solo permitir números (0-9) o vacío
                            if (value === '' || /^\d+$/.test(value)) {
                                setMinuto(value);
                            }
                            setError(''); // Limpiar error al cambiar
                        }}
                        className="w-full px-3 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-[var(--green)] transition-colors"
                        autoFocus
                        disabled={isLoading}
                        placeholder="Ingrese el minuto"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                            <AlertCircle size={14} />
                            {error}
                        </p>
                    )}
                </div>

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