'use client';

import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useGoleadoresCategoria } from '@/app/hooks/useCategoriaDashboard';
import TablaGoleadores from '@/app/components/stats/TableGoleadores';
import TablaGoleadoresSkeleton from '@/app/components/skeletons/TablaGoleadoresSkeleton';

interface GoleadoresBlockProps {
    enabled: boolean;
}

export default function GoleadoresBlock({ enabled }: GoleadoresBlockProps) {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion) || 0;

    const { data: goleadores, isLoading } = useGoleadoresCategoria(idCategoriaEdicion, 1, 5, { 
        enabled: enabled && !!idCategoriaEdicion 
    });

    if (isLoading) {
        return <TablaGoleadoresSkeleton />;
    }

    if (!goleadores?.goleadores || goleadores.goleadores.length === 0) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
                <div className="p-4 border-b border-[var(--gray-300)]">
                    <h3 className="text-[var(--white)] font-semibold text-lg">
                        Tabla de goleadores
                    </h3>
                </div>
                <div className="p-8 text-center">
                    <p className="text-[var(--gray-200)] text-sm">
                        No hay goleadores registrados
                    </p>
                </div>
            </div>
        );
    }

    return <TablaGoleadores goleadores={goleadores.goleadores} />;
}

