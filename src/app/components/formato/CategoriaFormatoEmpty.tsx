import { Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface CategoriaFormatoEmptyProps {
    onCrearFase: () => void;
    isCreating: boolean;
    totalFases: number;
}

export const CategoriaFormatoEmpty = ({
    onCrearFase,
    isCreating,
    totalFases,
}: CategoriaFormatoEmptyProps) => {
    return (
        <div className="text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-[var(--gray-100)]" />
                </div>
                <div>
                    <h3 className="text-[var(--white)] font-medium mb-2">
                        No hay fases configuradas
                    </h3>
                    <p className="text-[var(--gray-100)] text-sm max-w-md">
                        Comienza creando la primera fase para estructurar el formato del torneo
                    </p>
                </div>
                <Button
                    variant="success"
                    onClick={onCrearFase}
                    disabled={isCreating}
                    className="flex items-center gap-2 mt-4"
                >
                    <Plus className="w-4 h-4" />
                    Agregar fase {totalFases + 1}
                </Button>
            </div>
        </div>
    );
};

