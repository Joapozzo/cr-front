'use client';

import { useEffect, useState } from 'react';
import { X, Search, Filter, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import JugadorModalDreamTeam from '../JugadorModalDreamTeam';
import { useSearchJugadoresJornada } from '@/app/hooks/useSearchJugadoresJornada';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { JugadorDestacado } from '@/app/types/partido';
import { JugadorDestacadoDt } from '@/app/types/jugador';

interface ModalBuscarJugadorDisponibleProps {
    isOpen: boolean;
    onClose: () => void;
    posicion: string;
    posicionesIds: number[];
    onSeleccionar: (jugador: JugadorDestacadoDt) => void;
    jornada: number;
    isPending: boolean;
}

const ModalBuscarJugadorDisponible = ({
    isOpen,
    onClose,
    posicion,
    posicionesIds,
    onSeleccionar,
    jornada,
    isPending
}: ModalBuscarJugadorDisponibleProps) => {
    const { categoriaSeleccionada } = useCategoriaStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filtroOrden, setFiltroOrden] = useState<'goles' | 'asistencias' | 'nombre'>('nombre');
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Efecto para controlar la visibilidad del modal
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setSearchTerm('');
                setDebouncedSearchTerm('');
                setJugadorSeleccionado(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Efecto para implementar el debounce en la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms de debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Solo buscar si el usuario ha escrito al menos 2 caracteres (después del debounce)
    const debeRealizarBusqueda = debouncedSearchTerm.length >= 2;

    const {
        data,
        isLoading,
        isError,
        error,
        refetch: refetchJugadores
    } = useSearchJugadoresJornada({
        id_categoria_edicion: categoriaSeleccionada?.id_categoria_edicion || 0,
        jornada: jornada,
        query: debouncedSearchTerm,
        enabled: isOpen && !!categoriaSeleccionada && posicionesIds.length > 0 && debeRealizarBusqueda,
    });

    const jugadores = data?.data || [];

    // Ordenar jugadores
    const jugadoresOrdenados = [...jugadores].sort((a, b) => {
        if (filtroOrden === 'goles') {
            return b.estadisticas.goles - a.estadisticas.goles;
        } else if (filtroOrden === 'asistencias') {
            return b.estadisticas.asistencias - a.estadisticas.asistencias;
        } else {
            return a.apellido.localeCompare(b.apellido);
        }
    });

    const handleSeleccionarJugador = (jugador: JugadorDestacado) => {
        setJugadorSeleccionado(jugador.id_jugador);
    };

    const handleConfirmar = async () => {
        const jugador = jugadoresOrdenados.find(j => j.id_jugador === jugadorSeleccionado);
        if (jugador && categoriaSeleccionada) {
            await onSeleccionar(jugador);
            setJugadorSeleccionado(null);
            setSearchTerm('');
            setDebouncedSearchTerm('');
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />
            <div 
                className={`relative bg-[var(--gray-400)] rounded-xl border-2 border-[var(--color-primary)] shadow-2xl w-full max-w-5xl transform transition-all duration-300 ${isAnimating
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4'
                }`}
                style={{ maxHeight: '110vh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--white)]">
                                Buscar {posicion} - Jornada {jornada}
                            </h2>
                            <p className="text-[var(--gray-100)] text-sm">
                                {categoriaSeleccionada?.nombre_completo || 'Buscar jugadores disponibles'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                        disabled={isPending}
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Info Alert */}
                {/* <div className="p-4 mx-6 mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-blue-400 text-sm font-medium mb-1">
                                No hay jugadores destacados disponibles
                            </p>
                            <p className="text-[var(--gray-100)] text-sm">
                                Puedes buscar manualmente cualquier jugador disponible de la categoría para agregarlo al Dream Team.
                                La búsqueda se realiza automáticamente mientras escribes (mínimo 2 caracteres).
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Search Section */}
                <div className="p-6 border-b border-[var(--gray-300)] space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--gray-100)]" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, apellido o equipo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                icon={<Search />}
                            />
                        </div>

                        {/* Ordenar */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-[var(--gray-100)]" />
                            <select
                                value={filtroOrden}
                                onChange={(e) => setFiltroOrden(e.target.value as any)}
                                className="px-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            >
                                <option value="nombre">Nombre A-Z</option>
                                <option value="goles">Más goles</option>
                                <option value="asistencias">Más asistencias</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats summary */}
                    {debeRealizarBusqueda && (
                        <div className="flex items-center gap-4 text-sm text-[var(--gray-100)]">
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {jugadoresOrdenados.length} jugadores encontrados
                            </span>
                            {debouncedSearchTerm && (
                                <span className="text-[var(--white)]">
                                    Búsqueda: &ldquo;{debouncedSearchTerm}&rdquo;
                                </span>
                            )}
                            {isLoading && (
                                <span className="flex items-center gap-2 text-[var(--color-primary)]">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Buscando...
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    {/* Initial State - No search yet */}
                    {!debeRealizarBusqueda && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-[var(--gray-100)]" />
                            </div>
                            <p className="text-[var(--white)] mb-2 font-medium">
                                Escribe para buscar jugadores
                            </p>
                            <p className="text-[var(--gray-100)] text-sm max-w-md mx-auto">
                                Ingresa el nombre del jugador, apellido o equipo que deseas buscar.
                                La búsqueda se realizará automáticamente mientras escribes (mínimo 2 caracteres).
                            </p>
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading && debeRealizarBusqueda && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
                            <p className="text-[var(--gray-100)]">Buscando jugadores disponibles...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {isError && debeRealizarBusqueda && (
                        <div className="bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 rounded-lg p-4 text-center">
                            <p className="text-[var(--color-secondary)] mb-2">
                                {error?.message || 'Error al buscar los jugadores'}
                            </p>
                            <button
                                onClick={() => refetchJugadores()}
                                className="text-sm text-[var(--color-primary)] hover:underline"
                            >
                                Intentar nuevamente
                            </button>
                        </div>
                    )}

                    {/* Grid de jugadores */}
                    {!isLoading && !isError && debeRealizarBusqueda && jugadoresOrdenados.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jugadoresOrdenados.map((jugador) => (
                                <JugadorModalDreamTeam
                                    key={jugador.id_jugador}
                                    jugador={jugador}
                                    jugadorSeleccionado={jugadorSeleccionado}
                                    handleSeleccionarJugador={handleSeleccionarJugador as any}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty state - No results */}
                    {!isLoading && !isError && debeRealizarBusqueda && jugadoresOrdenados.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-[var(--gray-100)]" />
                            </div>
                            <p className="text-[var(--white)] mb-2 font-medium">
                                No se encontraron jugadores
                            </p>
                            <p className="text-[var(--gray-100)] text-sm max-w-md mx-auto mb-4">
                                No hay jugadores disponibles que coincidan con tu búsqueda &ldquo;{debouncedSearchTerm}&rdquo;.
                                Intenta con otro término de búsqueda.
                            </p>
                            <Button
                                variant="default"
                                onClick={() => {
                                    setSearchTerm('');
                                    setDebouncedSearchTerm('');
                                    setJugadorSeleccionado(null);
                                }}
                                className="mx-auto"
                            >
                                Limpiar búsqueda
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center gap-3 p-6 border-t border-[var(--gray-300)]">
                    <div className="text-sm text-[var(--gray-100)]">
                        {jugadorSeleccionado ? (
                            <span>
                                Jugador seleccionado: <span className="text-[var(--white)] font-medium">
                                    {jugadoresOrdenados.find(j => j.id_jugador === jugadorSeleccionado)?.nombre} {jugadoresOrdenados.find(j => j.id_jugador === jugadorSeleccionado)?.apellido}
                                </span>
                            </span>
                        ) : (
                            <span className="text-[var(--gray-100)]">
                                Selecciona un jugador para agregarlo
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="default" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleConfirmar}
                            disabled={!jugadorSeleccionado || isLoading || isPending}
                            className="flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <Users className="w-4 h-4" />
                                    Agregar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalBuscarJugadorDisponible;