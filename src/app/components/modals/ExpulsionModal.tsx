import { useState, useEffect } from "react";
import BaseModal from "./ModalPlanillero";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import Select from "../ui/Select";

interface ExpulsionModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: { id: number; nombre: string; apellido: string; dorsal: number | null };
    onSubmit: (motivo: string) => void;
    onBack?: () => void;
}

const ExpulsionModal: React.FC<ExpulsionModalProps> = ({ 
    isOpen, 
    onClose, 
    jugador, 
    onSubmit,
    onBack
}) => {
    const [motivo, setMotivo] = useState<string>('');

    const motivosExpulsion = [
        { value: '', label: 'Seleccionar motivo...' },
        { value: 'Doble amarilla', label: 'Doble amarilla' },
        { value: 'Roja directa', label: 'Roja directa' },
        { value: 'Conducta violenta', label: 'Conducta violenta' },
        { value: 'Agresión al árbitro', label: 'Agresión al árbitro' },
        { value: 'Juego brusco grave', label: 'Juego brusco grave' },
        { value: 'Lenguaje ofensivo', label: 'Lenguaje ofensivo' }
    ];

    useEffect(() => {
        if (isOpen) {
            setMotivo('');
        }
    }, [isOpen]);

    const handleSiguiente = () => {
        if (!motivo) return;
        onSubmit(motivo);
    };

    const handleClose = () => {
        setMotivo('');
        onClose();
    };

    const handleBack = () => {
        if (onBack) {
            setMotivo('');
            onBack();
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={handleBack}
                                className="p-1.5 rounded-lg hover:bg-[#262626] transition-colors"
                            >
                                <ArrowLeft size={18} className="text-[#737373]" />
                            </button>
                        )}
                        <span>Registrar Expulsión</span>
                    </div>
                    {/* Indicador de pasos */}
                    <div className="ml-3 flex items-center gap-2 text-xs text-[#737373]">
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-white text-xs">
                                1
                            </div>
                            <span className="hidden sm:inline">Acción</span>
                        </div>
                        <div className="w-4 h-px bg-[#404040]"></div>
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black text-xs font-medium">
                                2
                            </div>
                            <span className="hidden sm:inline">Motivo</span>
                        </div>
                        <div className="w-4 h-px bg-[#404040]"></div>
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#404040] flex items-center justify-center text-[#737373] text-xs">
                                3
                            </div>
                            <span className="hidden sm:inline">Minuto</span>
                        </div>
                    </div>
                </div>
            }
            actions={
                <div className="flex gap-3">
                    <Button
                        onClick={handleClose}
                        variant="default"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSiguiente}
                        disabled={!motivo}
                        variant="success"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        <Save size={16} />
                        Siguiente
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Información del jugador */}
                <div className="bg-[#171717] border border-[#262626] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">
                                {jugador.apellido.toUpperCase()}, {jugador.nombre}
                            </h3>
                            <p className="text-sm text-[#737373]">
                                Dorsal #{jugador.dorsal}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#737373] mb-3">
                            Motivo de la expulsión:
                        </label>
                        <Select
                            value={motivo}
                            onChange={(val) => setMotivo(typeof val === 'string' ? val : String(val))}
                            options={motivosExpulsion}
                            placeholder="Selecciona el motivo de la expulsión"
                        />
                    </div>

                    {/* Información adicional */}
                    <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-white mb-2">Información importante:</h4>
                        <ul className="text-xs text-[#737373] space-y-1">
                            <li>• La expulsión será registrada en el minuto actual del partido</li>
                            <li>• El jugador no podrá continuar participando en este partido</li>
                            <li>• Se aplicarán las sanciones según el reglamento vigente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default ExpulsionModal;