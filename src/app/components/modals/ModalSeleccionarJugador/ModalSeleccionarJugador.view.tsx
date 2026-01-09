import { JugadorDestacadoDt } from '@/app/types/jugador';
import { ModalHeader } from './components/ModalHeader';
import { ModalFilters } from './components/ModalFilters';
import { JugadoresGrid } from './components/JugadoresGrid';
import { ModalFooter } from './components/ModalFooter';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';

interface ModalSeleccionarJugadorViewProps {
    isOpen: boolean;
    isAnimating: boolean;
    posicion: string;
    jornada: number;
    categoriaNombre?: string;

    // Filtros y búsqueda
    searchTerm: string;
    filtroOrden: 'goles' | 'asistencias' | 'nombre';
    onSearchChange: (value: string) => void;
    onOrdenChange: (value: 'goles' | 'asistencias' | 'nombre') => void;

    // Jugadores
    jugadores: JugadorDestacadoDt[];
    jugadorSeleccionado: JugadorDestacadoDt | undefined;
    onSelectJugador: (id: number) => void;

    // Estados
    loading: boolean;
    error?: string;
    totalJugadores: number;

    // Handlers
    onConfirm: () => void;
    onClose: () => void;
    onBuscarManual: () => void;
    isPending: boolean;
}

/**
 * Componente presentacional puro
 * NO contiene hooks, NO contiene lógica de negocio
 * Solo renderiza JSX basado en props
 */
export const ModalSeleccionarJugadorView = ({
    isOpen,
    isAnimating,
    posicion,
    jornada,
    categoriaNombre,
    searchTerm,
    filtroOrden,
    onSearchChange,
    onOrdenChange,
    jugadores,
    jugadorSeleccionado,
    onSelectJugador,
    loading,
    error,
    totalJugadores,
    onConfirm,
    onClose,
    onBuscarManual,
    isPending,
}: ModalSeleccionarJugadorViewProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-300 ${
                    isAnimating ? 'opacity-50' : 'opacity-0'
                }`}
                onClick={onClose}
            />
            <div
                className={`relative bg-[var(--gray-400)] rounded-xl border-2 border-[var(--color-primary)] shadow-2xl w-full max-w-5xl transform transition-all duration-300 ${
                    isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                }`}
                style={{ maxHeight: '100vh' }}
            >
                <ModalHeader
                    posicion={posicion}
                    jornada={jornada}
                    categoriaNombre={categoriaNombre}
                    onClose={onClose}
                    isPending={isPending}
                />

                <ModalFilters
                    searchTerm={searchTerm}
                    filtroOrden={filtroOrden}
                    totalJugadores={totalJugadores}
                    isLoading={loading}
                    onSearchChange={onSearchChange}
                    onOrdenChange={onOrdenChange}
                />

                {/* Content - Grid de jugadores */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    {loading && jugadores.length === 0 && <LoadingState />}

                    {error && (
                        <ErrorState
                            errorMessage={error}
                            posicion={posicion}
                            onBuscarManual={onBuscarManual}
                        />
                    )}

                    {!error && jugadores.length > 0 && (
                        <JugadoresGrid
                            jugadores={jugadores}
                            jugadorSeleccionado={jugadorSeleccionado?.id_jugador || null}
                            onSelectJugador={onSelectJugador}
                        />
                    )}

                    {!error && jugadores.length === 0 && !loading && (
                        <EmptyState posicion={posicion} onBuscarManual={onBuscarManual} />
                    )}
                </div>

                <ModalFooter
                    jugadorSeleccionado={jugadorSeleccionado}
                    isPending={isPending}
                    isLoading={loading}
                    onConfirm={onConfirm}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

