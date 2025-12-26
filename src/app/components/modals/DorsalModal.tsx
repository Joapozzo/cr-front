import { AlertCircle, Save, Loader2, User } from "lucide-react";
import BaseModal from "./ModalPlanillero";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { JugadorPlantel } from "@/app/types/partido";
import { useAsignarDorsal } from "@/app/hooks/useAsignarDorsal";
import { jugadoresLegajosService } from "@/app/services/legajos/jugadores.service";
import toast from "react-hot-toast";

interface DorsalModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: JugadorPlantel;
    idPartido: number;
    idCategoriaEdicion: number;
    onLoadingChange?: (isLoading: boolean, jugadorId: number) => void;
}

const DorsalModal: React.FC<DorsalModalProps> = ({
    isOpen,
    onClose,
    jugador,
    idPartido,
    idCategoriaEdicion,
    onLoadingChange
}) => {
    const [newDorsal, setNewDorsal] = useState<string>(jugador.dorsal ? String(jugador.dorsal) : '');
    const [error, setError] = useState('');
    const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
    const [isLoadingSelfie, setIsLoadingSelfie] = useState(false);
    const [imageError, setImageError] = useState(false);

    const { mutateAsync: asignarDorsal, isPending } = useAsignarDorsal();

    // Cargar selfie privada cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setNewDorsal(jugador.dorsal ? String(jugador.dorsal) : '');
            setError('');
            setSelfieUrl(null);
            setImageError(false);
            
            // Cargar imagen privada
            const loadSelfie = async () => {
                setIsLoadingSelfie(true);
                try {
                    const url = await jugadoresLegajosService.obtenerSelfiePrivada(jugador.id_jugador);
                    setSelfieUrl(url);
                } catch (error) {
                    console.error('Error al cargar selfie privada:', error);
                    setImageError(true);
                    // No mostrar error al usuario, simplemente no mostrar la imagen
                } finally {
                    setIsLoadingSelfie(false);
                }
            };
            
            loadSelfie();
        }
    }, [isOpen, jugador.dorsal, jugador.id_jugador]);

    useEffect(() => {
        if (onLoadingChange) {
            onLoadingChange(isPending, jugador.id_jugador);
        }
    }, [isPending, jugador.id_jugador, onLoadingChange]);

    // Validar que el dorsal sea un número válido
    const isValidDorsal = () => {
        if (!newDorsal.trim()) return false;
        const dorsalNumber = parseInt(newDorsal.trim());
        return !isNaN(dorsalNumber) && dorsalNumber >= 1 && dorsalNumber <= 99;
    };

    const handleSave = async () => {
        // Validaciones locales - debe tener al menos un dígito y ser número válido
        if (!newDorsal.trim()) {
            setError('El dorsal no puede estar vacío');
            return;
        }

        const dorsalNumber = parseInt(newDorsal.trim());
        if (isNaN(dorsalNumber) || dorsalNumber < 1 || dorsalNumber > 99) {
            setError('El dorsal debe ser un número entre 1 y 99');
            return;
        }

        try {
            const response = await asignarDorsal({
                idPartido: idPartido,
                idCategoriaEdicion: idCategoriaEdicion,
                idEquipo: jugador.id_equipo,
                idJugador: jugador.id_jugador,
                dorsal: dorsalNumber
            });

            // Mensaje de éxito del backend
            const message = (response as { message?: string })?.message || 'Dorsal asignado correctamente';
            toast.success(message);
            handleClose();

        } catch (error: unknown) {
            // Mostrar error del backend en el modal
            const errorMessage = 
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (error as { message?: string })?.message ||
                'Error desconocido';
            setError(errorMessage);
        }
    };

    const handleClose = () => {
        if (isPending) return; // No cerrar si está cargando
        setNewDorsal(jugador.dorsal ? String(jugador.dorsal) : '');
        setError('');
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Cambiar dorsal"
            actions={
                <div className="flex gap-3">
                    <Button
                        onClick={handleClose}
                        variant="default"
                        className="flex items-center gap-2 w-full justify-center"
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="success"
                        className="flex items-center gap-2 w-full justify-center"
                        disabled={isPending || !isValidDorsal()}
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Asignando...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Guardar
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Foto del jugador y DNI */}
                <div className="flex flex-col items-center gap-3 pb-4 border-b border-[#262626]">
                    {/* Foto del jugador */}
                    <div className="relative">
                        {isLoadingSelfie ? (
                            <div className="w-28 h-28 bg-[#171717] rounded-lg flex items-center justify-center border border-[#262626]">
                                <Loader2 size={24} className="animate-spin text-[#737373]" />
                            </div>
                        ) : selfieUrl && !imageError ? (
                            <img
                                src={selfieUrl}
                                alt={`${jugador.nombre} ${jugador.apellido}`}
                                className="w-28 h-28 object-cover rounded-lg border-2 border-[#262626] shadow-lg"
                                onError={() => {
                                    setImageError(true);
                                }}
                            />
                        ) : (
                            <div className="w-28 h-28 bg-[#171717] rounded-lg flex items-center justify-center border border-[#262626]">
                                <User size={32} className="text-[#737373]" />
                            </div>
                        )}
                    </div>
                    
                    {/* DNI debajo de la foto */}
                    {jugador.dni && (
                        <div className="text-center">
                            <span className="text-xs text-[#737373]">DNI: </span>
                            <span className="text-sm text-white font-medium">{jugador.dni}</span>
                        </div>
                    )}
                </div>

                {/* Información del jugador */}
                <div>
                    <label className="block text-sm font-medium text-white mb-3">
                        Jugador: {jugador.apellido.toUpperCase()}, {jugador.nombre}
                    </label>
                    
                    <label className="block text-sm font-medium text-[#737373] mb-2">
                        Nuevo dorsal:
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={newDorsal}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Validación manual: solo permitir números (0-9) o vacío
                            if (value === '' || /^\d+$/.test(value)) {
                                setNewDorsal(value);
                            }
                            setError(''); // Limpiar error al cambiar
                        }}
                        className="w-full px-3 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-[var(--green)] transition-colors"
                        autoFocus
                        disabled={isPending}
                        placeholder="Ingrese el dorsal"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                            <AlertCircle size={14} />
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};

export default DorsalModal;