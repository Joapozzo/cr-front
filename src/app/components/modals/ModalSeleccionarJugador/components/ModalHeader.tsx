import { X, Star } from 'lucide-react';

interface ModalHeaderProps {
    posicion: string;
    jornada: number;
    categoriaNombre?: string;
    onClose: () => void;
    isPending: boolean;
}

/**
 * Componente presentacional para el header del modal
 */
export const ModalHeader = ({
    posicion,
    jornada,
    categoriaNombre,
    onClose,
    isPending,
}: ModalHeaderProps) => {
    return (
        <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-[var(--white)]">
                        Seleccionar {posicion} - Jornada {jornada}
                    </h2>
                    <p className="text-[var(--gray-100)] text-sm">
                        {categoriaNombre || 'Jugadores destacados de esta jornada'}
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
    );
};

