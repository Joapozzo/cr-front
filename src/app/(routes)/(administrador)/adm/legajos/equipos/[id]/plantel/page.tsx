'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useEquipoCategorias, useEquipoPlantel } from '@/app/hooks/legajos/useEquipos';
import { EquipoPlantelTab } from '@/app/components/legajos/equipos/EquipoPlantelTab';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EquipoPlantelPageContent = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    
    const idEquipo = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    // Obtener categoría de la URL o usar la primera disponible
    const categoriaFromUrl = searchParams?.get('categoria');
    
    // Cargar categorías para obtener la primera si no hay en URL
    const { data: categorias } = useEquipoCategorias(
        idEquipo ?? 0,
        { enabled: idEquipo !== null }
    );

    const categoriaSeleccionada = useMemo(() => {
        if (categoriaFromUrl) {
            const categoriaId = Number(categoriaFromUrl);
            if (!isNaN(categoriaId)) return categoriaId;
        }
        return categorias?.[0]?.categoria_edicion.id_categoria_edicion;
    }, [categoriaFromUrl, categorias]);

    const { data: plantel, isLoading: isLoadingPlantel } = useEquipoPlantel(
        idEquipo ?? 0,
        categoriaSeleccionada ?? 0,
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    if (!idEquipo) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <EquipoPlantelTab
                plantel={plantel}
                isLoading={isLoadingPlantel}
                categoriaSeleccionada={categoriaSeleccionada}
            />
        </div>
    );
};

export default function EquipoPlantelPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="space-y-4">
                            <Skeleton height={40} borderRadius={6} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} height={100} borderRadius={6} />
                                ))}
                            </div>
                        </div>
                    </SkeletonTheme>
                </div>
            }
        >
            <EquipoPlantelPageContent />
        </Suspense>
    );
}
