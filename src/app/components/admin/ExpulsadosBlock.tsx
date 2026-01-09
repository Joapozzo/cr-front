'use client';

import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useExpulsadosCategoria } from '@/app/hooks/useCategoriaDashboard';
import TablaExpulsados from '@/app/components/stats/TableExpulsados';
import TablaGoleadoresSkeleton from '@/app/components/skeletons/TablaGoleadoresSkeleton';

interface ExpulsadosBlockProps {
    enabled: boolean;
}

export default function ExpulsadosBlock({ enabled }: ExpulsadosBlockProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion) || 0;

    const { data: expulsados, isLoading } = useExpulsadosCategoria(idCategoriaEdicion, 1, 5, { 
        enabled: enabled && !!idCategoriaEdicion 
    });

    if (isLoading) {
        return <TablaGoleadoresSkeleton />;
    }

    if (!expulsados?.expulsados || expulsados.expulsados.length === 0) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                <div className="p-4 border-b border-[var(--gray-300)]">
                    <h3 className="text-[var(--white)] font-semibold text-lg">
                        Jugadores sancionados
                    </h3>
                </div>
                <div className="p-8 text-center">
                    <p className="text-[var(--gray-200)] text-sm">
                        No hay jugadores sancionados
                    </p>
                </div>
            </div>
        );
    }

    return <TablaExpulsados expulsados={expulsados.expulsados} />;
}

