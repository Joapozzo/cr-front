import { Loader2 } from 'lucide-react';

/**
 * Componente presentacional para el estado de carga
 */
export const LoadingState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
            <p className="text-[var(--gray-100)]">Cargando jugadores destacados...</p>
        </div>
    );
};

