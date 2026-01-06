'use client';

import { useState, useMemo, useEffect } from 'react';
import { useEdicionesConCategorias } from '@/app/hooks/useEdiciones';
import { useEquiposBusqueda } from '@/app/hooks/legajos/useLegajosBusqueda';
import { SearchBar } from '@/app/components/legajos/shared/SearchBar';
import { FilterSelect } from '@/app/components/legajos/shared/FilterSelect';
import { EquipoGrid } from '@/app/components/legajos/equipos/EquipoGrid';
import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { Button } from '@/app/components/ui/Button';

const EquiposPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>();
    const [page, setPage] = useState(1);
    const limit = 15;

    // Obtener categorías-ediciones para el filtro
    const { data: categoriasEdiciones } = useEdicionesConCategorias();

    // Preparar opciones de categorías
    const categoriaOptions = useMemo(() => {
        if (!categoriasEdiciones) return [];
        
        return categoriasEdiciones.flatMap(edicion =>
            edicion.categorias.map(cat => ({
                value: cat.id_categoria_edicion,
                label: `${cat.nombre || 'Categoría'} - ${edicion.nombre || edicion.temporada}`,
            }))
        );
    }, [categoriasEdiciones]);

    // Búsqueda siempre habilitada - trae todos los equipos si no hay query ni filtros
    // Enviar q como string vacío si no hay query para que el backend traiga todos
    const { data, isLoading, error } = useEquiposBusqueda({
        q: searchQuery || '',
        id_categoria_edicion: selectedCategoria,
        page,
        limit,
    });

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategoria]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategoria(undefined);
        setPage(1);
    };

    const hasFilters = searchQuery || selectedCategoria !== undefined;

    const tabs = [
        { label: 'Jugadores', href: '/adm/legajos/jugadores' },
        { label: 'Equipos', href: '/adm/legajos/equipos' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Legajos"
                description="Consulta la información histórica y estadísticas de jugadores y equipos"
            />

            <TabNavigation tabs={tabs} />

            <div className="space-y-6">
                {/* Barra de búsqueda y filtros */}
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                    <div className="space-y-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Buscar por nombre de equipo..."
                            onClear={() => {
                                setSearchQuery('');
                                setPage(1);
                            }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FilterSelect
                                label="Categoría-Edición"
                                value={selectedCategoria}
                                onChange={(val) => {
                                    setSelectedCategoria(val as number | undefined);
                                    setPage(1);
                                }}
                                options={categoriaOptions}
                                placeholder="Todas las categorías"
                            />
                        </div>

                        {hasFilters && (
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleClearFilters}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid de equipos */}
                {error ? (
                    <div className="text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                        <p className="text-[var(--color-secondary)]">
                            Error al cargar los equipos. Por favor, intenta nuevamente.
                        </p>
                    </div>
                ) : (
                    <EquipoGrid
                        equipos={data?.data}
                        pagination={data?.pagination}
                        isLoading={isLoading}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default EquiposPage;

