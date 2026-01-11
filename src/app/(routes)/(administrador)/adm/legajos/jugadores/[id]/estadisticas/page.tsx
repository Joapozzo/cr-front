'use client';

import { useParams } from 'next/navigation';
import { Suspense, useMemo, useState, useEffect } from 'react';
import {
    useJugadorEquipos,
    useJugadorEstadisticasGenerales,
    useJugadorEstadisticasPorCategoria,
} from '@/app/hooks/legajos/useJugadores';
import { JugadorEstadisticasTab } from '@/app/components/legajos/jugadores/JugadorEstadisticasTab';
import { JugadorCategoriaSelector } from '@/app/components/legajos/jugadores/JugadorCategoriaSelector';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JugadorEstadisticasPageContent = () => {
    const params = useParams();
    
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

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

    const { data: estadisticasGenerales, isLoading: isLoadingEstadisticasGenerales } = useJugadorEstadisticasGenerales(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    const { data: estadisticasPorCategoria, isLoading: isLoadingEstadisticasPorCategoria } = useJugadorEstadisticasPorCategoria(
        idJugador ?? 0,
        categoriaSeleccionada ?? 0,
        { enabled: idJugador !== null && !!categoriaSeleccionada }
    );

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
                <JugadorEstadisticasTab
                    estadisticasGenerales={estadisticasGenerales}
                    estadisticasPorCategoria={estadisticasPorCategoria}
                    isLoading={isLoadingEstadisticasGenerales || isLoadingEstadisticasPorCategoria}
                    categoriaSeleccionada={categoriaSeleccionada}
                />
            </div>
        </>
    );
};

export default function JugadorEstadisticasPage() {
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
            <JugadorEstadisticasPageContent />
        </Suspense>
    );
}
