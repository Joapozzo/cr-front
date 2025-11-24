/**
 * Página de búsqueda de equipos
 */
'use client';

import { useState, useMemo } from 'react';
import { useEdicionesConCategorias } from '@/app/hooks/useEdiciones';
import { useEquiposBusqueda } from '@/app/hooks/legajos/useLegajosBusqueda';
import { SearchBar } from '@/app/components/legajos/shared/SearchBar';
import { FilterSelect } from '@/app/components/legajos/shared/FilterSelect';
import { EquipoGrid } from '@/app/components/legajos/equipos/EquipoGrid';
import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { Button } from '@/app/components/ui/Button';

const EquiposPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>();
    const [page, setPage] = useState(1);
    const limit = 20;

    // Obtener categorías-ediciones para el filtro
    const { data: categoriasEdiciones } = useEdicionesConCategorias();

    // Preparar opciones de categorías
    const categoriaOptions = useMemo(() => {
        if (!categoriasEdiciones) return [];
        
        return categoriasEdiciones.flatMap(edicion =>
            edicion.categorias.map(cat => ({
                value: cat.id_categoria_edicion,
                label: `${cat.nombre_categoria || 'Categoría'} - ${edicion.nombre || edicion.temporada}`,
            }))
        );
    }, [categoriasEdiciones]);

    // Búsqueda solo si hay query o filtros
    const { data, isLoading, error } = useEquiposBusqueda({
        q: searchQuery || undefined,
        id_categoria_edicion: selectedCategoria,
        page,
        limit,
    }, {
        enabled: !!searchQuery || selectedCategoria !== undefined,
    });

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategoria(undefined);
        setPage(1);
    };

    const hasFilters = searchQuery || selectedCategoria !== undefined;

    const tabs = [
        { label: 'Jugadores', href: '/admin/legajos/jugadores' },
        { label: 'Equipos', href: '/admin/legajos/equipos' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Legajos
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Consulta la información histórica y estadísticas de jugadores y equipos
                    </p>
                </div>

                <TabNavigation tabs={tabs} />

                <div className="mt-8 space-y-6">
                    {/* Barra de búsqueda y filtros */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
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
                        <div className="text-center py-12">
                            <p className="text-red-600 dark:text-red-400">
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
        </div>
    );
};

export default EquiposPage;

