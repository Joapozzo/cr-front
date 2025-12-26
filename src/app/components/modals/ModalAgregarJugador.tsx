'use client';

import { useState } from 'react';
import { Search, User, Plus, Loader2, X, UserPlus, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useBuscarJugadores, useAgregarJugadorAlPlantel } from '@/app/hooks/useEquipos';
import { toast } from 'react-hot-toast';

interface Jugador {
    id_jugador: number;
    nombre: string;
    apellido: string;
    dni: string;
    fecha_nacimiento: string | null;
}

interface AgregarJugadorModalProps {
    isOpen: boolean;
    onClose: () => void;
    idEquipo: number;
    idCategoriaEdicion: number;
    equipoNombre: string;
}

export default function AgregarJugadorModal({
    isOpen,
    onClose,
    idEquipo,
    idCategoriaEdicion,
    equipoNombre
}: AgregarJugadorModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJugador, setSelectedJugador] = useState<Jugador | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Hooks
    const {
        data: searchResults,
        isLoading: isSearching,
        error: searchError
    } = useBuscarJugadores(searchQuery, 10);

    const agregarJugadorMutation = useAgregarJugadorAlPlantel();

    const handleAgregarJugador = async () => {
        if (!selectedJugador) return;

        setErrorMessage(''); // Limpiar errores previos

        const toastId = toast.loading('Agregando jugador al plantel...');

        try {
            const response = await agregarJugadorMutation.mutateAsync({
                id_equipo: idEquipo,
                id_categoria_edicion: idCategoriaEdicion,
                id_jugador: selectedJugador.id_jugador
            });

            // Usar el mensaje del backend si está disponible
            const successMessage = response?.data?.message || 
                `${selectedJugador.nombre} ${selectedJugador.apellido} agregado al plantel`;
            
            toast.success(successMessage, { id: toastId });
            handleClose();
        } catch (error: unknown) {
            console.error('Error al agregar jugador:', error);
            
            // Extraer mensaje de error del backend
            let errorMsg = 'Error al agregar el jugador al plantel';
            
            if (error instanceof Error) {
                errorMsg = error.message;
            }
            
            setErrorMessage(errorMsg);
            toast.error(errorMsg, { id: toastId });
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedJugador(null);
        setErrorMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--gray-400)] rounded-xl border-2 border-[var(--blue)] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--blue)]/20 rounded-lg">
                            <UserPlus className="w-5 h-5 text-[var(--blue)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--white)]">
                                Agregar jugador al plantel
                            </h2>
                            <p className="text-sm text-[var(--gray-100)]">
                                {equipoNombre}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-[var(--red)] flex-shrink-0" />
                                <div>
                                    <h4 className="text-[var(--red)] font-medium text-sm">
                                        Error al agregar jugador
                                    </h4>
                                    <p className="text-[var(--red)]/80 text-sm mt-1">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Búsqueda */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--white)]">
                            Buscar jugador por DNI
                        </label>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Ingresa el DNI del jugador..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                                autoFocus
                                icon={<Search/>}
                            />
                        </div>
                        <p className="text-sm text-[var(--gray-100)]">
                            Ingresa al menos 2 caracteres para buscar
                        </p>
                    </div>

                    {/* Resultados de búsqueda */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-[var(--white)]">
                            Resultados de búsqueda
                        </h3>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {/* Loading state */}
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-[var(--blue)]" />
                                    <span className="ml-2 text-[var(--gray-100)]">Buscando jugadores...</span>
                                </div>
                            )}

                            {/* Error state */}
                            {searchError && (
                                <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4 text-center">
                                    <p className="text-[var(--red)] text-sm">
                                        Error al buscar jugadores. Intenta nuevamente.
                                    </p>
                                </div>
                            )}

                            {/* No results */}
                            {searchResults?.jugadores.length === 0 && searchQuery.length >= 2 && !isSearching && (
                                <div className="bg-[var(--gray-300)] border-2 border-dashed border-[var(--gray-200)] rounded-lg p-8 text-center">
                                    <User className="w-8 h-8 text-[var(--gray-200)] mx-auto mb-2" />
                                    <p className="text-[var(--gray-100)] text-sm">
                                        No se encontraron jugadores con ese DNI
                                    </p>
                                    <p className="text-[var(--gray-200)] text-xs mt-1">
                                        Verifica que el DNI esté registrado en el sistema
                                    </p>
                                </div>
                            )}

                            {/* Results list */}
                            {searchResults?.jugadores.map((jugador) => (
                                <div
                                    key={jugador.id_jugador}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedJugador?.id_jugador === jugador.id_jugador
                                            ? 'border-[var(--green)] bg-[var(--green)]/10'
                                            : 'border-[var(--gray-300)] bg-[var(--gray-300)] hover:border-[var(--gray-200)]'
                                        }`}
                                    onClick={() => setSelectedJugador(jugador)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[var(--white)] font-medium">
                                                {jugador.nombre} {jugador.apellido}
                                            </h4>
                                            <div className="space-y-1">
                                                <p className="text-[var(--gray-100)] text-sm">
                                                    DNI: {jugador.dni}
                                                </p>
                                                {jugador.fecha_nacimiento && (
                                                    <p className="text-[var(--gray-100)] text-sm">
                                                        Nacimiento: {new Date(jugador.fecha_nacimiento).toLocaleDateString('es-ES')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {selectedJugador?.id_jugador === jugador.id_jugador && (
                                            <div className="w-5 h-5 bg-[var(--green)] rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Initial state */}
                            {searchQuery.length > 0 && searchQuery.length < 2 && (
                                <div className="bg-[var(--gray-300)] border-2 border-dashed border-[var(--gray-200)] rounded-lg p-8 text-center">
                                    <Search className="w-8 h-8 text-[var(--gray-200)] mx-auto mb-2" />
                                    <p className="text-[var(--gray-100)] text-sm">
                                        Ingresa al menos 2 caracteres para buscar
                                    </p>
                                </div>
                            )}

                            {/* Empty state */}
                            {searchQuery.length === 0 && (
                                <div className="bg-[var(--gray-300)] border-2 border-dashed border-[var(--gray-200)] rounded-lg p-8 text-center">
                                    <UserPlus className="w-8 h-8 text-[var(--gray-200)] mx-auto mb-2" />
                                    <p className="text-[var(--gray-100)] text-sm">
                                        Busca un jugador para agregar al plantel
                                    </p>
                                    <p className="text-[var(--gray-200)] text-xs mt-1">
                                        Utiliza el DNI para encontrar al jugador
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Jugador seleccionado */}
                    {selectedJugador && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-[var(--white)]">
                                Jugador seleccionado
                            </h3>
                            <div className="bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[var(--green)]/20 rounded-lg">
                                        <User className="w-5 h-5 text-[var(--green)]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--white)] font-medium">
                                            {selectedJugador.nombre} {selectedJugador.apellido}
                                        </h4>
                                        <p className="text-[var(--gray-100)] text-sm">
                                            DNI: {selectedJugador.dni}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 pt-4 border-t border-[var(--gray-300)]">
                    <Button 
                        onClick={handleClose}
                        disabled={agregarJugadorMutation.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAgregarJugador}
                        disabled={!selectedJugador || agregarJugadorMutation.isPending}
                        variant="success"
                        className="flex items-center gap-2"
                    >
                        {agregarJugadorMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Agregando...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Agregar al plantel
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}