'use client';

import { useState } from 'react';
import { Crown, Plus, UserMinus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { DeleteModal } from './modals/ModalAdmin'; 
import { useAgregarJugadorYAsignarCapitan, useAsignarCapitan, useDesactivarCapitan } from '@/app/hooks/useEquipos';
import { toast } from 'react-hot-toast';
import JugadorSelectionModal from './modals/ModalSeleccionJugadores';
import { JugadorPlantel } from '@/app/types/jugador';
import { JugadorBusqueda as JugadorBusquedaModal } from '@/app/types/plantel';

interface CapitanesManagerProps {
    plantel: JugadorPlantel[];
    idEquipo: number;
    idCategoriaEdicion: number;
    equipoNombre: string;
}

export default function CapitanesManager({
    plantel,
    idEquipo,
    idCategoriaEdicion,
    equipoNombre
}: CapitanesManagerProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [capitanAEliminar, setCapitanAEliminar] = useState<JugadorPlantel | null>(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [modalType, setModalType] = useState<'primer_capitan' | 'asignar_capitan'>('primer_capitan');

    // Hooks de mutación
    const agregarCapitanMutation = useAgregarJugadorYAsignarCapitan();
    const asignarCapitanMutation = useAsignarCapitan();
    const desactivarCapitanMutation = useDesactivarCapitan();

    // Filtrar capitanes del plantel
    const capitanes = plantel.filter(jugador => jugador.capitan);

    const hayJugadores = plantel.length > 0;
    const hayCapitanes = capitanes.length > 0;
    const puedeAgregarCapitan = capitanes.length < 2;

    const handleAgregarPrimerCapitan = () => {
        setModalType('primer_capitan');
        setShowSelectionModal(true);
    };

    const handleAsignarCapitan = () => {
        setModalType('asignar_capitan');
        setShowSelectionModal(true);
    };

    const handleSelectJugador = async (jugador: JugadorBusquedaModal) => {
        const toastId = toast.loading(
            modalType === 'primer_capitan' 
                ? "Agregando primer capitán..." 
                : "Asignando capitán..."
        );

        try {
            if (modalType === 'primer_capitan') {
                // Agregar jugador y asignar como capitán
                await agregarCapitanMutation.mutateAsync({
                    id_equipo: idEquipo,
                    id_categoria_edicion: idCategoriaEdicion,
                    id_jugador: jugador.id_jugador
                });
                toast.success(
                    `${jugador.nombre} ${jugador.apellido} agregado como primer capitán`, 
                    { id: toastId }
                );
            } else {
                // Solo asignar como capitán (jugador ya está en el plantel)
                await asignarCapitanMutation.mutateAsync({
                    id_equipo: idEquipo,
                    id_categoria_edicion: idCategoriaEdicion,
                    id_jugador: jugador.id_jugador
                });
                toast.success(
                    `${jugador.nombre} ${jugador.apellido} asignado como capitán`, 
                    { id: toastId }
                );
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error al procesar la solicitud";
            toast.error(errorMessage, { id: toastId });
            throw error; // Re-lanzar para que el modal maneje el error
        }
    };

    const handleDesactivarCapitan = (capitan: JugadorPlantel) => {
        setCapitanAEliminar(capitan);
        setShowDeleteModal(true);
    };

    const confirmarDesactivarCapitan = async () => {
        if (!capitanAEliminar) return;

        const toastId = toast.loading("Desactivando capitán...");

        try {
            await desactivarCapitanMutation.mutateAsync({
                id_equipo: idEquipo,
                id_categoria_edicion: idCategoriaEdicion,
                id_jugador: capitanAEliminar.id_jugador
            });

            toast.success(`${capitanAEliminar.nombre} ya no es capitán`, { id: toastId });
            setShowDeleteModal(false);
            setCapitanAEliminar(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error al desactivar capitán";
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className="space-y-4">
            {/* Header de Capitanes */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--yellow)]/20 rounded-lg">
                        <Crown className="w-5 h-5 text-[var(--yellow)]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--white)]">
                            Capitanes del equipo
                        </h3>
                        <p className="text-[var(--gray-100)] text-sm">
                            {capitanes.length}/2 capitanes activos
                        </p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-2">
                    {!hayJugadores && !hayCapitanes && (
                        <Button
                            variant="success"
                            onClick={handleAgregarPrimerCapitan}
                            disabled={agregarCapitanMutation.isPending}
                            className="flex items-center gap-2"
                        >
                            {agregarCapitanMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            Agregar primer capitán
                        </Button>
                    )}

                    {hayJugadores && puedeAgregarCapitan && (
                        <Button
                            variant="success"
                            onClick={handleAsignarCapitan}
                            disabled={asignarCapitanMutation.isPending}
                            className="flex items-center gap-2"
                        >
                            {asignarCapitanMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Crown className="w-4 h-4" />
                            )}
                            Asignar capitán
                        </Button>
                    )}
                </div>
            </div>

            {/* Contenido Principal */}
            {!hayCapitanes ? (
                // Estado sin capitanes
                <div className="bg-[var(--gray-400)] border-2 border-dashed border-[var(--gray-300)] rounded-lg p-8 text-center">
                    <Crown className="w-12 h-12 text-[var(--gray-200)] mx-auto mb-4" />
                    <h4 className="text-[var(--white)] font-medium mb-2">
                        {equipoNombre} no tiene capitanes
                    </h4>
                    <p className="text-[var(--gray-100)] text-sm mb-4">
                        {!hayJugadores
                            ? "Agrega el primer jugador y asígnalo como capitán"
                            : "Asigna un capitán de los jugadores actuales"
                        }
                    </p>
                </div>
            ) : (
                // Lista de capitanes
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {capitanes.map((capitan) => (
                        <div
                            key={capitan.id_jugador}
                            className="bg-[var(--gray-400)] border border-[var(--yellow)]/30 rounded-lg p-4 relative"
                        >
                            {/* Badge de capitán */}
                            <div className="absolute -top-2 -right-2">
                                <div className="bg-[var(--yellow)] text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    CAPITÁN
                                </div>
                            </div>

                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h5 className="text-[var(--white)] font-medium mb-1">
                                        {capitan.nombre}
                                    </h5>
                                    <p className="text-[var(--gray-100)] text-sm">
                                        DNI: {capitan.dni}
                                    </p>
                                </div>

                                {/* Botón para dar de baja */}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDesactivarCapitan(capitan)}
                                    disabled={desactivarCapitanMutation.isPending}
                                    className="flex items-center gap-1 ml-3"
                                >
                                    {desactivarCapitanMutation.isPending ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <UserMinus className="w-3 h-3" />
                                    )}
                                    Dar de baja
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de selección de jugador */}
            <JugadorSelectionModal
                isOpen={showSelectionModal}
                onClose={() => setShowSelectionModal(false)}
                title={modalType === 'primer_capitan' ? 'Agregar Primer Capitán' : 'Asignar capitán'}
                actionText={modalType === 'primer_capitan' ? 'Agregar primer capitán' : 'Asignar capitán'}
                onSelectJugador={handleSelectJugador}
                isLoading={agregarCapitanMutation.isPending || asignarCapitanMutation.isPending}
            />

            {/* Modal de confirmación */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setCapitanAEliminar(null);
                }}
                title="Dar de baja capitán"
                message="¿Estás seguro de que quieres dar de baja a este capitán?"
                itemName={capitanAEliminar?.nombre}
                onConfirm={confirmarDesactivarCapitan}
                error={null}
            />
        </div>
    );
}