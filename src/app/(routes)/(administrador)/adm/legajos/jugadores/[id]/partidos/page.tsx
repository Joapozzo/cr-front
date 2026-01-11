'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo, useState, useEffect } from 'react';
import { useJugadorEquipos, useJugadorPartidos } from '@/app/hooks/legajos/useJugadores';
import { JugadorPartidosTab } from '@/app/components/legajos/jugadores/JugadorPartidosTab';
import { JugadorCategoriaSelector } from '@/app/components/legajos/jugadores/JugadorCategoriaSelector';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JugadorPartidosPageContent = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const idJugador = useMemo(() => {
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

    // Cargar equipos para obtener categorías
    const { data: equipos } = useJugadorEquipos(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    // Obtener categorías disponibles desde equipos
    const categoriasUnicas = useMemo(() => {
        if (!equipos) return [];
        const categoriasDisponibles = equipos.flatMap(edicion =>
            edicion.categorias.flatMap(cat =>
                cat.planteles.map(plantel => ({
                    id_categoria_edicion: plantel.categoria_edicion.id_categoria_edicion,
                    categoria: cat.categoria,
                    edicion: edicion.edicion
                }))
            )
        );
        return categoriasDisponibles.filter((cat, index, self) =>
            index === self.findIndex(c => c.id_categoria_edicion === cat.id_categoria_edicion)
        );
    }, [equipos]);

    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>(undefined);

    // Seleccionar primera categoría por defecto cuando se cargan las categorías
    useEffect(() => {
        if (categoriasUnicas.length > 0 && !selectedCategoria) {
            setSelectedCategoria(categoriasUnicas[0].id_categoria_edicion);
        }
    }, [categoriasUnicas, selectedCategoria]);

    const categoriaSeleccionada = selectedCategoria || categoriasUnicas[0]?.id_categoria_edicion;

    // Resetear página cuando cambia la categoría
    useEffect(() => {
        if (categoriaSeleccionada && page !== 1) {
            router.replace(`/adm/legajos/jugadores/${idJugador}/partidos?page=1`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriaSeleccionada]);

    const { data: partidos, isLoading: isLoadingPartidos } = useJugadorPartidos(
        idJugador ?? 0,
        {
            page,
            limit: 15,
            id_categoria_edicion: categoriaSeleccionada,
        },
        { enabled: idJugador !== null && !!categoriaSeleccionada }
    );

    const handlePageChange = (newPage: number) => {
        router.replace(`/adm/legajos/jugadores/${idJugador}/partidos?page=${newPage}`);
    };

    if (!idJugador) {
        return null;
    }

    return (
        <>
            <JugadorCategoriaSelector
                equipos={equipos}
                categoriaSeleccionada={categoriaSeleccionada}
                onCategoriaChange={setSelectedCategoria}
            />
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <JugadorPartidosTab
                    partidos={partidos}
                    isLoading={isLoadingPartidos}
                    categoriaSeleccionada={categoriaSeleccionada}
                    page={page}
                    onPageChange={handlePageChange}
                    idJugador={idJugador}
                />
            </div>
        </>
    );
};

export default function JugadorPartidosPage() {
    return (
        <Suspense
            fallback={
                <>
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4 mb-4">
                        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                            <Skeleton height={40} borderRadius={6} />
                        </SkeletonTheme>
                    </div>
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                            <div className="space-y-4">
                                <Skeleton height={200} borderRadius={6} />
                                <Skeleton height={200} borderRadius={6} />
                            </div>
                        </SkeletonTheme>
                    </div>
                </>
            }
        >
            <JugadorPartidosPageContent />
        </Suspense>
    );
}
