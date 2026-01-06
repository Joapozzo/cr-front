import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Loader2, Save, User } from 'lucide-react';
import BaseModal from './ModalPlanillero';
import { useAsignarDorsal } from '@/app/hooks/useAsignarDorsal';
import { jugadoresLegajosService } from '@/app/services/legajos/jugadores.service';
import toast from 'react-hot-toast';

interface DorsalModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: {
        id_jugador: number;
        nombre: string;
        apellido: string;
        dorsal: number | null;
        id_equipo: number;
    };
    idPartido: number;
    idCategoriaEdicion: number;
    onLoadingChange?: (loading: boolean, idJugador: number) => void;
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
            // También mostrar toast de error
            toast.error(errorMessage);
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
                            <Image
                                src={selfieUrl}
                                alt={`${jugador.nombre} ${jugador.apellido}`}
                                width={112}
                                height={112}
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

                    <div className="text-center">
                        <h3 className="text-white font-bold text-lg">
                            {jugador.nombre} {jugador.apellido}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            {jugador.dorsal ? (
                                <span className="text-[var(--color-primary)] font-mono text-sm bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">
                                    Dorsal actual: #{jugador.dorsal}
                                </span>
                            ) : (
                                <span className="text-yellow-500 font-mono text-sm bg-yellow-500/10 px-2 py-0.5 rounded">
                                    Sin dorsal asignado
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Input de dorsal */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[#737373] uppercase tracking-wider">
                        Nuevo Dorsal
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={newDorsal}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 99)) {
                                    setNewDorsal(val);
                                    setError('');
                                }
                            }}
                            className={`
                                w-full bg-[#171717] border rounded-lg px-4 py-3 text-center text-3xl font-bold text-white
                                focus:outline-none focus:ring-2 transition-all
                                ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-[#262626] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'}
                            `}
                            placeholder="#"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-center animate-in fade-in slide-in-from-top-1">
                            {error}
                        </p>
                    )}

                    <p className="text-[#737373] text-xs text-center">
                        Ingrese un número del 1 al 99
                    </p>
                </div>
            </div>
        </BaseModal>
    );
};

export default DorsalModal;