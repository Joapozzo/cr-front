import { AlertCircle, Save, Loader2 } from "lucide-react";
import BaseModal from "./ModalPlanillero";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { JugadorPlantel } from "@/app/types/partido";
import { useAsignarDorsal } from "@/app/hooks/useAsignarDorsal";
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
    const [newDorsal, setNewDorsal] = useState<number>(jugador.dorsal || 1);
    const [error, setError] = useState('');

    const { mutateAsync: asignarDorsal, isPending } = useAsignarDorsal();

    useEffect(() => {
        if (isOpen) {
            setNewDorsal(jugador.dorsal || 1);
            setError('');
        }
    }, [isOpen, jugador.dorsal]);

    useEffect(() => {
        if (onLoadingChange) {
            onLoadingChange(isPending, jugador.id_jugador);
        }
    }, [isPending, jugador.id_jugador, onLoadingChange]);

    const handleSave = async () => {
        // Validaciones locales
        if (!newDorsal || newDorsal < 1 || newDorsal > 99) {
            setError('El dorsal debe ser entre 1 y 99');
            return;
        }

        try {
            const response = await asignarDorsal({
                idPartido: idPartido,
                idCategoriaEdicion: idCategoriaEdicion,
                idEquipo: jugador.id_equipo,
                idJugador: jugador.id_jugador,
                dorsal: newDorsal
            });

            // Mensaje de éxito del backend
            toast.success(response.message);
            handleClose();

        } catch (error: any) {
            // Mostrar error del backend en el modal
            const errorMessage = error?.response?.data?.error || error?.message || 'Error desconocido';
            setError(errorMessage);
        }
    };

    const handleClose = () => {
        if (isPending) return; // No cerrar si está cargando
        setNewDorsal(jugador.dorsal || 1);
        setError('');
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Cambiar Dorsal"
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
                        disabled={isPending}
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
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Jugador: {jugador.apellido.toUpperCase()}, {jugador.nombre}
                    </label>
                    <label className="block text-sm font-medium text-[#737373] mb-2">
                        Nuevo dorsal:
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="99"
                        value={newDorsal || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                setNewDorsal(1);
                            } else {
                                const parsedValue = parseInt(value);
                                if (!isNaN(parsedValue)) {
                                    setNewDorsal(parsedValue);
                                }
                            }
                            setError(''); // Limpiar error al cambiar
                        }}
                        className="w-full px-3 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-[var(--green)] transition-colors"
                        autoFocus
                        disabled={isPending}
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