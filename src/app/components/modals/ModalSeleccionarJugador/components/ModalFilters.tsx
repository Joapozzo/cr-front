import { Search, Filter, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '../../../ui/Input';

interface ModalFiltersProps {
    searchTerm: string;
    filtroOrden: 'goles' | 'asistencias' | 'nombre';
    totalJugadores: number;
    isLoading: boolean;
    onSearchChange: (value: string) => void;
    onOrdenChange: (value: 'goles' | 'asistencias' | 'nombre') => void;
}

/**
 * Componente presentacional para los filtros del modal
 * NO filtra, solo emite eventos
 */
export const ModalFilters = ({
    searchTerm,
    filtroOrden,
    totalJugadores,
    isLoading,
    onSearchChange,
    onOrdenChange,
}: ModalFiltersProps) => {
    return (
        <div className="p-6 border-b border-[var(--gray-300)] space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--gray-100)]" />
                    <Input
                        type="text"
                        placeholder="Buscar por jugador o equipo..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                        icon={<Search />}
                    />
                </div>

                {/* Ordenar */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--gray-100)]" />
                    <select
                        value={filtroOrden}
                        onChange={(e) => onOrdenChange(e.target.value as 'goles' | 'asistencias' | 'nombre')}
                        className="px-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    >
                        <option value="goles">Más goles</option>
                        <option value="asistencias">Más asistencias</option>
                        <option value="nombre">Nombre A-Z</option>
                    </select>
                </div>
            </div>

            {/* Stats summary */}
            <div className="flex items-center gap-4 text-sm text-[var(--gray-100)]">
                <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {totalJugadores} jugadores disponibles
                </span>
                {isLoading && (
                    <span className="flex items-center gap-2 text-[var(--color-primary)]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Actualizando...
                    </span>
                )}
            </div>
        </div>
    );
};

