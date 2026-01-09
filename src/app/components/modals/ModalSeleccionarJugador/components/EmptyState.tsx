import { Star, Users } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface EmptyStateProps {
    posicion: string;
    onBuscarManual: () => void;
}

/**
 * Componente presentacional para el estado vacío
 */
export const EmptyState = ({ posicion, onBuscarManual }: EmptyStateProps) => {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[var(--gray-100)]" />
            </div>
            <p className="text-[var(--gray-100)] mb-2 font-medium text-lg">
                No hay jugadores destacados disponibles
            </p>
            <p className="text-[var(--gray-100)] text-sm mb-6 max-w-md mx-auto">
                {`No hay ${posicion}s destacados en esta jornada o ya han sido agregados al Dream Team.`}
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

