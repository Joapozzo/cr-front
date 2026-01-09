import { Button } from '@/app/components/ui/Button';
import { Plus, Calendar, RefreshCcw } from 'lucide-react';

interface FixtureActionsProps {
    onCrearPartido: () => void;
    onGenerarFixture: () => void;
    onRefresh: () => void;
    categoriaSeleccionada: boolean;
}

/**
 * Componente para las acciones del fixture (crear, automatizar, actualizar)
 */
export const FixtureActions = ({
    onCrearPartido,
    onGenerarFixture,
    onRefresh,
    categoriaSeleccionada,
}: FixtureActionsProps) => {
    return (
        <div className="flex items-center gap-3">
            <Button
                variant="success"
                onClick={onCrearPartido}
                className="flex items-center gap-2"
                disabled={!categoriaSeleccionada}
            >
                <Plus className="w-4 h-4" />
                Crear partido
            </Button>
            <Button
                variant="import"
                onClick={onGenerarFixture}
                className="flex items-center gap-2"
                disabled={!categoriaSeleccionada}
            >
                <Calendar className="w-4 h-4" />
                Automatizar fixture
            </Button>
            <Button
                variant="default"
                onClick={onRefresh}
                className="flex items-center gap-2"
            >
                <RefreshCcw className="w-4 h-4" />
                Actualizar
            </Button>
        </div>
    );
};

