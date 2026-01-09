import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { CategoriaSeleccionada } from '@/app/types/categoria';

interface CategoriaFormatoErrorProps {
    categoriaSeleccionada: CategoriaSeleccionada | null;
    error: unknown;
    isFetching: boolean;
    onRetry: () => void;
}

export const CategoriaFormatoError = ({
    categoriaSeleccionada,
    error,
    isFetching,
    onRetry,
}: CategoriaFormatoErrorProps) => {
    const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ||
                        (error as { message?: string })?.message ||
                        'Ocurrió un error inesperado';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Formato - {categoriaSeleccionada?.nombre_completo || 'Error'}
                </h1>
                <p className="text-[var(--gray-100)]">
                    Configura las fases, zonas y distribución de equipos para la categoría
                </p>
            </div>

            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="flex items-center gap-3 text-[var(--red)]">
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-lg font-medium">Error al cargar las fases</span>
                </div>
                <p className="text-[var(--gray-100)] text-center max-w-md">
                    {errorMessage}
                </p>
                <Button
                    onClick={onRetry}
                    variant="more"
                    disabled={isFetching}
                    className="flex items-center gap-2"
                >
                    <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    {isFetching ? 'Reintentando...' : 'Reintentar'}
                </Button>
            </div>
        </div>
    );
};

