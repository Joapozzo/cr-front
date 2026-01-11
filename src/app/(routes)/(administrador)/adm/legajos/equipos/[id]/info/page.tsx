'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import {
    useEquipoDetalle,
    useEquipoCategorias,
    useEquipoEstadisticas,
} from '@/app/hooks/legajos/useEquipos';
import { EquipoInfoTab } from '@/app/components/legajos/equipos/EquipoInfoTab';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EquipoInfoPageContent = () => {
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
    const { data: categorias, isLoading: isLoadingCategorias } = useEquipoCategorias(
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

    const { data: equipoInfo, isLoading: isLoadingInfo } = useEquipoDetalle(
        idEquipo ?? 0,
        { enabled: idEquipo !== null }
    );

    const { data: estadisticas, isLoading: isLoadingEstadisticas } = useEquipoEstadisticas(
        idEquipo ?? 0,
        categoriaSeleccionada ?? 0,
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    const isLoading = isLoadingInfo || isLoadingEstadisticas || isLoadingCategorias;

    if (!idEquipo) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                    <div className="space-y-6">
                        <Skeleton height={150} borderRadius={6} />
                        <Skeleton height={200} borderRadius={6} />
                        <Skeleton height={250} borderRadius={6} />
                    </div>
                </SkeletonTheme>
            </div>
        );
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <EquipoInfoTab
                equipoInfo={equipoInfo}
                estadisticas={estadisticas}
                isLoading={isLoadingInfo}
                isLoadingEstadisticas={isLoadingEstadisticas}
            />
        </div>
    );
};

export default function EquipoInfoPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="space-y-6">
                            <Skeleton height={150} borderRadius={6} />
                            <Skeleton height={200} borderRadius={6} />
                            <Skeleton height={250} borderRadius={6} />
                        </div>
                    </SkeletonTheme>
                </div>
            }
        >
            <EquipoInfoPageContent />
        </Suspense>
    );
}
