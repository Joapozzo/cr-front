/**
 * Botones de acción del formulario
 * Componente presentacional sin lógica de negocio
 */
import { Button } from '@/app/components/ui/Button';

interface FormActionsProps {
    onSubmit: () => void;
    onCancel?: () => void;
    hasChanges: boolean;
    isLoading?: boolean;
}

export default function FormActions({
    onSubmit,
    onCancel,
    hasChanges,
    isLoading = false,
}: FormActionsProps) {
    return (
        <div className="mt-8 flex justify-end gap-4">
            {onCancel && (
                <Button
                    variant="more"
                    onClick={onCancel}
                    disabled={isLoading || !hasChanges}
                    className="px-6"
                >
                    Cancelar
                </Button>
            )}
            <Button
                onClick={onSubmit}
                disabled={!hasChanges || isLoading}
                className={`px-8 transition-colors ${
                    hasChanges
                        ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white"
                        : "bg-[var(--gray-300)] text-[var(--gray-100)] cursor-not-allowed"
                }`}
            >
                {isLoading ? "Actualizando..." : "Actualizar categoría"}
            </Button>
        </div>
    );
}

