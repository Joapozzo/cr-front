import React, { useState, useMemo, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { JugadorPlantel, EstadoPartido } from '@/app/types/partido';
import { FormModal } from '../modals/ModalAdmin';
import { Input } from '../ui/Input';
import { useCronometroPartido } from '@/app/hooks/useCronometroPartido';
import toast from 'react-hot-toast';

interface CambioJugadorModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugadorSale?: JugadorPlantel; // Opcional para modo edición
    jugadoresSuplentes: JugadorPlantel[];
    equipoId: number;
    equipoNombre: string;
    partidoId: number;
    estadoPartido?: EstadoPartido;
    onConfirmarCambio: (
        jugadorEntraId: number,
        minuto: number
    ) => Promise<void>;
    isLoading?: boolean;
    // Props para modo edición
    modoEdicion?: boolean;
    cambioId?: number;
    minutoActual?: number;
    jugadorSaleId?: number; // ID del jugador que sale (para edición)
    onEditarCambio?: (
        cambioId: number,
        jugadorSaleId: number,
        minuto: number
    ) => Promise<void>;
}

const CambioJugadorModal: React.FC<CambioJugadorModalProps> = ({
    isOpen,
    onClose,
    jugadorSale,
    jugadoresSuplentes,
    estadoPartido,
    onConfirmarCambio,
    isLoading = false,
    modoEdicion = false,
    cambioId,
    minutoActual,
    jugadorSaleId,
    onEditarCambio
}) => {
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
    const [minuto, setMinuto] = useState<number>(0);
    const cronometro = useCronometroPartido();

    // Obtener minuto actual del cronómetro o del cambio (si es edición)
    useEffect(() => {
        if (modoEdicion && minutoActual !== undefined) {
            setMinuto(minutoActual);
        } else if (cronometro?.minuto !== undefined) {
            setMinuto(cronometro.minuto);
        }
    }, [cronometro?.minuto, modoEdicion, minutoActual]);

    // En modo edición, establecer el jugador que sale
    useEffect(() => {
        if (modoEdicion && jugadorSaleId) {
            setJugadorSeleccionado(jugadorSaleId);
        }
    }, [modoEdicion, jugadorSaleId]);

    // Validar que el partido esté en un estado válido para cambios
    const estadoValido = useMemo(() => {
        return ['C1', 'E', 'C2', 'T'].includes(estadoPartido || '');
    }, [estadoPartido]);

    // Filtrar suplentes disponibles (con dorsal y no en cancha)
    // En modo edición, incluir también el jugador que sale actualmente
    const suplentesDisponibles = useMemo(() => {
        if (modoEdicion) {
            // En edición, mostrar todos los jugadores con dorsal (incluido el que sale)
            return jugadoresSuplentes.filter(j => j.dorsal);
        }
        return jugadoresSuplentes.filter(
            j => j.dorsal && !j.en_cancha && j.id_jugador !== jugadorSale?.id_jugador
        );
    }, [jugadoresSuplentes, jugadorSale?.id_jugador, modoEdicion]);

    const handleSubmit = async () => {
        if (modoEdicion) {
            // Modo edición: solo actualizar minuto y jugador que sale
            if (!jugadorSeleccionado || !cambioId || !onEditarCambio) {
                toast.error('Faltan datos para editar el cambio');
                return;
            }
            try {
                await onEditarCambio(cambioId, jugadorSeleccionado, minuto);
                setJugadorSeleccionado(null);
                onClose();
            } catch (error) {
                console.error('Error al editar cambio:', error);
            }
        } else {
            // Modo creación
            if (!jugadorSeleccionado || !estadoValido) {
                if (!jugadorSeleccionado) {
                    toast.error('Debe seleccionar un jugador');
                }
                return;
            }
            try {
                await onConfirmarCambio(jugadorSeleccionado, minuto);
                setJugadorSeleccionado(null);
                onClose();
            } catch (error) {
                console.error('Error al confirmar cambio:', error);
            }
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setJugadorSeleccionado(null);
            onClose();
        }
    };

    // Si el estado no permite cambios, no mostrar modal, solo cerrar
    useEffect(() => {
        if (isOpen && !estadoValido) {
            toast.error('Solo se pueden realizar cambios durante el partido (primer o segundo tiempo)');
            onClose();
        }
    }, [isOpen, estadoValido, onClose]);

    if (!estadoValido) {
        return null;
    }

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modoEdicion ? "Editar cambio" : "Realizar cambio"}
            type="edit"
            onSubmit={handleSubmit}
            submitText={modoEdicion ? "Guardar Cambios" : "Confirmar Cambio"}
            isLoading={isLoading}
            maxWidth="max-w-sm"
            submitDisabled={!jugadorSeleccionado || (!modoEdicion && !estadoValido)}
        >
            {!modoEdicion && jugadorSale && (
                /* Jugador que sale - Solo en modo creación */
                <div className="mb-4">
                    <p className="text-xs text-[#737373] mb-1 flex items-center gap-1">
                        <ArrowDown className="text-red-500" size={10} />
                        Sale:
                    </p>
                    <p className="text-sm text-white">
                        {jugadorSale.dorsal} - {jugadorSale.apellido.toUpperCase()}, {jugadorSale.nombre}
                    </p>
                </div>
            )}

            {/* Selección de jugador que sale (en edición) o que entra (en creación) */}
            <div className="mb-4">
                <label className="block text-sm font-light text-[var(--white)] mb-2">
                    {modoEdicion ? 'Jugador que sale' : 'Jugador que entra'} <span className="text-[var(--color-secondary)]">*</span>
                </label>
                <select
                    value={jugadorSeleccionado || ''}
                    onChange={(e) => setJugadorSeleccionado(e.target.value ? Number(e.target.value) : null)}
                    disabled={isLoading || suplentesDisponibles.length === 0}
                    className="w-full px-3 py-2 bg-[#171717] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">Seleccione un jugador</option>
                    {suplentesDisponibles.map(suplente => (
                        <option key={suplente.id_jugador} value={suplente.id_jugador}>
                            {suplente.dorsal} - {suplente.apellido.toUpperCase()}, {suplente.nombre}
                        </option>
                    ))}
                </select>
                {suplentesDisponibles.length === 0 && (
                    <p className="text-xs text-[#737373] mt-1">No hay jugadores disponibles</p>
                )}
            </div>

            {/* Input minuto */}
            <div className="mb-4">
                <label className="block text-sm font-light text-[var(--white)] mb-2">
                    Minuto <span className="text-[var(--color-secondary)]">*</span>
                </label>
                <Input
                    type="number"
                    min={0}
                    max={200}
                    value={minuto.toString()}
                    onChange={(e) => setMinuto(Math.max(0, parseInt(e.target.value) || 0))}
                    disabled={isLoading}
                    placeholder={`Minuto actual: ${cronometro?.minuto || 0}'`}
                />
                {cronometro?.minuto !== undefined && (
                    <p className="text-xs text-[#737373] mt-1">
                        Minuto actual: {cronometro.minuto}&apos;
                    </p>
                )}
            </div>
        </FormModal>
    );
};

export default CambioJugadorModal;

