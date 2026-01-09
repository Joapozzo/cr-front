import { Star, Loader2 } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { JugadorDestacadoDt } from '@/app/types/jugador';

interface ModalFooterProps {
    jugadorSeleccionado: JugadorDestacadoDt | undefined;
    isPending: boolean;
    isLoading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

/**
 * Componente presentacional para el footer del modal
 */
export const ModalFooter = ({
    jugadorSeleccionado,
    isPending,
    isLoading,
    onConfirm,
    onClose,
}: ModalFooterProps) => {
    return (
        <div className="flex justify-between items-center gap-3 p-6 border-t border-[var(--gray-300)]">
            <div className="text-sm text-[var(--gray-100)]">
                {jugadorSeleccionado && (
                    <span>
                        Jugador seleccionado:{' '}
                        <span className="text-[var(--white)] font-medium">
                            {jugadorSeleccionado.nombre} {jugadorSeleccionado.apellido}
                        </span>
                    </span>
                )}
            </div>
            <div className="flex gap-3">
                <Button variant="default" onClick={onClose} disabled={isPending}>
                    Cancelar
                </Button>
                <Button
                    variant="success"
                    onClick={onConfirm}
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
                            <Star className="w-4 h-4" />
                            Agregar
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

