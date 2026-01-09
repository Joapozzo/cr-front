import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface FaseHeaderProps {
    numeroFase: number;
    onAgregarZona: () => void;
    loadingDatos: boolean;
}

export const FaseHeader = ({ numeroFase, onAgregarZona, loadingDatos }: FaseHeaderProps) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[var(--white)]">
                Fase {numeroFase}
            </h2>
            <Button
                variant="success"
                size="sm"
                onClick={onAgregarZona}
                disabled={loadingDatos}
                className="flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                {loadingDatos ? 'Cargando...' : 'Agregar zona'}
            </Button>
        </div>
    );
};

