'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo, useEffect } from 'react';
import {
    useEquipoCategorias,
    useEquipoPartidos,
    useEquipoFixtures,
    useEquipoDetalle,
} from '@/app/hooks/legajos/useEquipos';
import { EquipoPartidosTab } from '@/app/components/legajos/equipos/EquipoPartidosTab';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EquipoPartidosPageContent = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const idEquipo = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    const page = useMemo(() => {
        const pageParam = searchParams?.get('page');
        return pageParam ? Number(pageParam) : 1;
    }, [searchParams]);

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

    // Obtener información del equipo para el tab
    const { data: equipoInfo } = useEquipoDetalle(
        idEquipo ?? 0,
        { enabled: idEquipo !== null }
    );

    const { data: partidos, isLoading: isLoadingPartidos } = useEquipoPartidos(
        idEquipo ?? 0,
        {
            page,
            limit: 15,
            id_categoria_edicion: categoriaSeleccionada,
        },
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    const { data: fixturesProximos, isLoading: isLoadingFixturesProximos } = useEquipoFixtures(
        idEquipo ?? 0,
        categoriaSeleccionada ?? 0,
        'proximos',
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    const { data: fixturesRecientes, isLoading: isLoadingFixturesRecientes } = useEquipoFixtures(
        idEquipo ?? 0,
        categoriaSeleccionada ?? 0,
        'recientes',
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    // Resetear página cuando cambia la categoría
    useEffect(() => {
        if (categoriaSeleccionada && page !== 1) {
            const pathname = window.location.pathname;
            const categoriaParam = categoriaSeleccionada ? `?categoria=${categoriaSeleccionada}` : '';
            router.replace(`${pathname}${categoriaParam}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriaSeleccionada]);

    const handlePageChange = (newPage: number) => {
        const pathname = window.location.pathname;
        const categoriaParam = categoriaSeleccionada ? `?categoria=${categoriaSeleccionada}&page=${newPage}` : `?page=${newPage}`;
        router.replace(`${pathname}${categoriaParam}`);
    };

    if (!idEquipo) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <EquipoPartidosTab
                partidos={partidos}
                fixturesProximos={fixturesProximos}
                fixturesRecientes={fixturesRecientes}
                isLoading={isLoadingPartidos}
                isLoadingProximos={isLoadingFixturesProximos}
                isLoadingRecientes={isLoadingFixturesRecientes}
                categoriaSeleccionada={categoriaSeleccionada}
                page={page}
                onPageChange={handlePageChange}
                idEquipo={idEquipo}
                equipoInfo={equipoInfo}
            />
        </div>
    );
};

export default function EquipoPartidosPage() {
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
            <EquipoPartidosPageContent />
        </Suspense>
    );
}
