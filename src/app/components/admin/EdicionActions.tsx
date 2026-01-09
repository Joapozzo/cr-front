'use client';

import { Button } from '@/app/components/ui/Button';

interface EdicionActionsProps {
    isTerminada: boolean;
    hasChanges: boolean;
    isLoading: boolean;
    onSubmit: () => void;
}

export const EdicionActions = ({
    isTerminada,
    hasChanges,
    isLoading,
    onSubmit,
}: EdicionActionsProps) => {
    return (
        <div className="mt-8 flex justify-end">
            <Button
                onClick={onSubmit}
                disabled={!hasChanges || isLoading || isTerminada}
                className={`px-8 transition-colors ${hasChanges && !isTerminada
                    ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white"
                    : "bg-[var(--gray-300)] text-[var(--gray-100)] cursor-not-allowed"
                    }`}
            >
                {isTerminada
                    ? "Edición terminada"
                    : isLoading
                        ? "Actualizando..."
                        : "Actualizar edición"}
            </Button>
        </div>
    );
};

