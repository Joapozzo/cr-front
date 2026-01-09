import { RefreshCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { CategoriaSeleccionada } from '@/app/types/categoria';

interface CategoriaFormatoHeaderProps {
    categoriaSeleccionada: CategoriaSeleccionada | null;
    totalFases: number;
    isFetching: boolean;
    onRefresh: () => void;
}

export const CategoriaFormatoHeader = ({
    categoriaSeleccionada,
    totalFases,
    isFetching,
    onRefresh,
}: CategoriaFormatoHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Formato - {categoriaSeleccionada?.nombre_completo || 'Categoría'}
                </h1>
                <p className="text-[var(--gray-100)]">
                    Configura las fases, zonas y distribución de equipos para la categoría
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-[var(--gray-300)] px-3 py-1 rounded-full">
                    <span className="text-[var(--white)] text-sm font-medium">
                        {totalFases} {totalFases === 1 ? 'fase' : 'fases'}
                    </span>
                </div>
                <Button
                    onClick={onRefresh}
                    variant="ghost"
                    size="sm"
                    disabled={isFetching}
                    className="flex items-center gap-1"
                >
                    <RefreshCcw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                    {isFetching ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </div>
        </div>
    );
};

