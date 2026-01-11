'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useEquipoCategorias, useEquipoTabla } from '@/app/hooks/legajos/useEquipos';
import { EquipoTablaTab } from '@/app/components/legajos/equipos/EquipoTablaTab';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EquipoTablaPageContent = () => {
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

    const { data: tabla, isLoading: isLoadingTabla } = useEquipoTabla(
        idEquipo ?? 0,
        categoriaSeleccionada ?? 0,
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    if (!idEquipo) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <EquipoTablaTab
                tabla={tabla}
                isLoading={isLoadingTabla}
                categoriaSeleccionada={categoriaSeleccionada}
                idEquipo={idEquipo}
            />
        </div>
    );
};

export default function EquipoTablaPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="space-y-4">
                            <Skeleton height={200} borderRadius={6} />
                            <Skeleton height={200} borderRadius={6} />
                        </div>
                    </SkeletonTheme>
                </div>
            }
        >
            <EquipoTablaPageContent />
        </Suspense>
    );
}
