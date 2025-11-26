'use client';

import { useState, useMemo, useEffect } from 'react';
import { useEdicionesConCategorias } from '@/app/hooks/useEdiciones';
import { useJugadoresBusqueda } from '@/app/hooks/legajos/useLegajosBusqueda';
import { SearchBar } from '@/app/components/legajos/shared/SearchBar';
import { FilterSelect } from '@/app/components/legajos/shared/FilterSelect';
import { JugadorGrid } from '@/app/components/legajos/jugadores/JugadorGrid';
import { TabNavigation } from '@/app/components/legajos/shared/TabNavigation';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { Button } from '@/app/components/ui/Button';
import { EstadoJugador } from '@/app/types/legajos';

const JugadoresPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>();
    const [selectedEstado, setSelectedEstado] = useState<EstadoJugador | undefined>();
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

    // Búsqueda siempre habilitada - trae todos los jugadores si no hay query ni filtros
    // Enviar q como string vacío si no hay query para que el backend traiga todos
    const { data, isLoading, error } = useJugadoresBusqueda({
        q: searchQuery || '',
        id_categoria_edicion: selectedCategoria,
        estado: selectedEstado,
        page,
        limit,
    });

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategoria, selectedEstado]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategoria(undefined);
        setSelectedEstado(undefined);
        setPage(1);
    };

    const hasFilters = searchQuery || selectedCategoria !== undefined || selectedEstado !== undefined;

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
                            placeholder="Buscar por nombre, apellido o DNI..."
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

                            <FilterSelect
                                label="Estado"
                                value={selectedEstado}
                                onChange={(val) => {
                                    setSelectedEstado(val as EstadoJugador | undefined);
                                    setPage(1);
                                }}
                                options={[
                                    { value: 'A', label: 'Activo' },
                                    { value: 'I', label: 'Inactivo' },
                                ]}
                                placeholder="Todos los estados"
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

                {/* Grid de jugadores */}
                {error ? (
                    <div className="text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                        <p className="text-[var(--red)]">
                            Error al cargar los jugadores. Por favor, intenta nuevamente.
                        </p>
                    </div>
                ) : (
                    <JugadorGrid
                        jugadores={data?.data}
                        pagination={data?.pagination}
                        isLoading={isLoading}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
};

export default JugadoresPage;

