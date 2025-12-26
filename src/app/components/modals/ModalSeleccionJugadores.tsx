'use client';

import { useState } from 'react';
import { Search, User, Plus, Crown, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useBuscarJugadores } from '@/app/hooks/useEquipos';
import { ImagenPublica } from '../common/ImagenPublica';
import { BaseModal } from './ModalAdmin';
import { JugadorBusqueda } from '@/app/types/plantel';
import { URI_IMG } from '@/app/components/ui/utils';

// Usar directamente JugadorBusqueda que ahora incluye dni y fecha_nacimiento
type JugadorBusquedaModal = JugadorBusqueda;

interface JugadorSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    actionText: string;
    onSelectJugador: (jugador: JugadorBusquedaModal) => Promise<void>;
    isLoading?: boolean;
}

export default function JugadorSelectionModal({
    isOpen,
    onClose,
    title,
    actionText,
    onSelectJugador,
    isLoading = false
}: JugadorSelectionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJugador, setSelectedJugador] = useState<JugadorBusquedaModal | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Hook para buscar jugadores
    const {
        data: searchResults,
        isLoading: isSearching,
        error: searchError
    } = useBuscarJugadores(searchQuery, 10);

    const handleSubmit = async () => {
        if (!selectedJugador) return;

        setErrorMessage(''); // Limpiar errores previos

        try {
            await onSelectJugador(selectedJugador);
            handleClose();
        } catch (error: unknown) {
            console.error('Error en operación:', error);
            
            // Usar el mensaje que viene del error
            const errorMsg = error instanceof Error ? error.message : 'Error al realizar la operación';
            setErrorMessage(errorMsg);
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedJugador(null);
        setErrorMessage('');
        onClose();
    };

    // Construir URL de imagen pública
    const getImageUrl = (img: string | null | undefined): string | undefined => {
        if (!img) return undefined;
        // Si ya es una URL completa, retornarla tal cual
        if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        // Si es una ruta relativa, agregar URI_IMG
        return `${URI_IMG}${img}`;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            type="create"
            maxWidth="max-w-2xl"
        >

            <div className="space-y-4">
                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-[var(--red)] flex-shrink-0" />
                                <div>
                                    <h4 className="text-[var(--red)] font-medium text-sm">
                                        Error en la operación
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
                            Buscar por DNI
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--gray-100)]" />
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
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-[var(--blue)]" />
                                    <span className="ml-2 text-[var(--gray-100)]">Buscando...</span>
                                </div>
                            )}

                            {searchError && (
                                <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-4 text-center">
                                    <p className="text-[var(--red)] text-sm">
                                        Error al buscar jugadores. Intenta nuevamente.
                                    </p>
                                </div>
                            )}

                            {searchResults?.jugadores.length === 0 && searchQuery.length >= 2 && !isSearching && (
                                <div className="bg-[var(--gray-300)] border-2 border-dashed border-[var(--gray-200)] rounded-lg p-8 text-center">
                                    <User className="w-8 h-8 text-[var(--gray-200)] mx-auto mb-2" />
                                    <p className="text-[var(--gray-100)] text-sm">
                                        No se encontraron jugadores con ese DNI
                                    </p>
                                </div>
                            )}

                            {searchResults?.jugadores.map((jugador: JugadorBusquedaModal) => (
                                <div
                                    key={jugador.id_jugador}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedJugador?.id_jugador === jugador.id_jugador
                                            ? 'border-[var(--green)] bg-[var(--green)]/10'
                                            : 'border-[var(--gray-300)] bg-[var(--gray-300)] hover:border-[var(--gray-200)]'
                                    }`}
                                    onClick={() => setSelectedJugador(jugador)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                <ImagenPublica
                                                    src={getImageUrl(jugador.img)}
                                                    alt={`${jugador.nombre} ${jugador.apellido}`}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 object-cover"
                                                    fallbackIcon={<User className="w-5 h-5 text-[var(--gray-100)]" />}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-[var(--white)] font-medium">
                                                    {jugador.nombre} {jugador.apellido}
                                                </h4>
                                                <div className="space-y-1">
                                                    {jugador.dni && (
                                                        <p className="text-[var(--gray-100)] text-sm">
                                                            DNI: {jugador.dni}
                                                        </p>
                                                    )}
                                                    {jugador.fecha_nacimiento && (
                                                        <p className="text-[var(--gray-100)] text-sm">
                                                            Nacimiento: {new Date(jugador.fecha_nacimiento).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
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
                                    <Search className="w-8 h-8 text-[var(--gray-200)] mx-auto mb-2" />
                                    <p className="text-[var(--gray-100)] text-sm">
                                        Busca un jugador para continuar
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
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <ImagenPublica
                                            src={getImageUrl(selectedJugador.img)}
                                            alt={`${selectedJugador.nombre} ${selectedJugador.apellido}`}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 object-cover"
                                            fallbackIcon={<User className="w-5 h-5 text-[var(--green)]" />}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--white)] font-medium">
                                            {selectedJugador.nombre} {selectedJugador.apellido}
                                        </h4>
                                        {selectedJugador.dni && (
                                            <p className="text-[var(--gray-100)] text-sm">
                                                DNI: {selectedJugador.dni}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <Button 
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!selectedJugador || isLoading}
                    variant="success"
                    className="flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            {actionText === 'Agregar primer capitán' ? (
                                <Crown className="w-4 h-4" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {actionText}
                        </>
                    )}
                </Button>
            </div>
        </BaseModal>
    );
}