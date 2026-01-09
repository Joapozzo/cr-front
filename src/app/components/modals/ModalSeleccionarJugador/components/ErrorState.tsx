import { Star, Users } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface ErrorStateProps {
    errorMessage?: string;
    posicion: string;
    onBuscarManual: () => void;
}

/**
 * Componente presentacional para el estado de error
 */
export const ErrorState = ({ errorMessage, posicion, onBuscarManual }: ErrorStateProps) => {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-danger)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[var(--color-danger)]" />
            </div>
            <p className="text-[var(--color-danger)] mb-2 font-medium text-lg">
                Error al cargar los jugadores destacados
            </p>
            <p className="text-[var(--gray-100)] text-sm mb-6 max-w-md mx-auto">
                {errorMessage || 'No se pudieron cargar los jugadores. Intenta buscar manualmente.'}
            </p>
            <Button
                variant="success"
                onClick={onBuscarManual}
                className="flex items-center gap-2 mx-auto"
            >
                <Users className="w-4 h-4" />
                Buscar jugador manualmente
            </Button>
        </div>
    );
};

