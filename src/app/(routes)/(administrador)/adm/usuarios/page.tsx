'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUsuariosAdmin } from '@/app/hooks/useUsuariosAdmin';
import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { RefreshCcw, Users, X } from 'lucide-react';
import { getUsuariosColumns } from '@/app/components/columns/UsuariosColumns';
import { Pagination } from '@/app/components/legajos/shared/Pagination';
import { SearchBar } from '@/app/components/legajos/shared/SearchBar';
import Select, { SelectOption } from '@/app/components/ui/Select';
import { usuariosService } from '@/app/services/usuarios.services';

const UsuariosPage = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [busqueda, setBusqueda] = useState('');
    const [idRol, setIdRol] = useState<number | undefined>(undefined);
    const busquedaRef = useRef(busqueda);
    
    // Sincronizar ref con estado
    useEffect(() => {
        busquedaRef.current = busqueda;
    }, [busqueda]);
    
    const { data, isLoading, error, refetch, isFetching } = useUsuariosAdmin(page, limit, busqueda || undefined, idRol);

    // Obtener roles disponibles para el filtro
    const { data: roles } = useQuery({
        queryKey: ['usuarios-roles'],
        queryFn: usuariosService.obtenerRolesDisponibles,
        staleTime: 10 * 60 * 1000, // 10 minutos
    });

    const handleRefresh = () => {
        refetch();
    };

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        // Scroll to top cuando cambia la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleBusquedaChange = useCallback((value: string) => {
        // Solo resetear página si el valor de búsqueda realmente cambió
        if (value !== busquedaRef.current) {
            busquedaRef.current = value;
            setBusqueda(value);
            setPage(1); // Resetear a primera página al buscar
        }
    }, []);

    const handleRolChange = useCallback((value: string | number) => {
        // Si el valor es una cadena vacía, significa que se seleccionó "Todos los roles"
        const newRol = value === '' ? undefined : (value as number);
        if (newRol !== idRol) {
            setIdRol(newRol);
            setPage(1); // Resetear a primera página al filtrar
        }
    }, [idRol]);

    const handleClearFilters = () => {
        setBusqueda('');
        setIdRol(undefined);
        setPage(1);
    };

    const hasFilters = busqueda || idRol !== undefined;

    // Preparar opciones de roles para el filtro
    const rolesOptions: SelectOption[] = roles?.map(rol => ({
        value: rol.id_rol,
        label: rol.nombre.toUpperCase()
    })) || [];

    const columns = getUsuariosColumns();
    const usuarios = data?.data || [];
    const pagination = data?.pagination;
    const isRefreshing = isLoading || isFetching;

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-[var(--red)] mb-4">Error al cargar los usuarios</p>
                    <Button onClick={handleRefresh}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="Usuarios"
                description={pagination ? `Total: ${pagination.total} usuarios` : 'Gestiona todos los usuarios del sistema'}
                actions={
                    <Button
                        onClick={handleRefresh}
                        variant='more'
                        className='flex items-center'
                        disabled={isRefreshing}
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refrescar
                    </Button>
                }
            />

            {/* Filtros */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                <div className="space-y-4">
                    <SearchBar
                        value={busqueda}
                        onChange={handleBusquedaChange}
                        placeholder="Buscar por nombre, apellido o email..."
                        onClear={() => {
                            setBusqueda('');
                            setPage(1);
                        }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Rol"
                            value={idRol ?? ''}
                            onChange={handleRolChange}
                            options={rolesOptions}
                            placeholder="Todos los roles"
                        />
                    </div>

                    {hasFilters && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleClearFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Contenido */}
            {isRefreshing ? (
                <TableSkeleton columns={7} rows={8} />
            ) : (
                <div className="space-y-4">
                    {usuarios && usuarios.length > 0 ? (
                        <>
                            <DataTable
                                data={usuarios}
                                columns={columns}
                                emptyMessage="No hay usuarios disponibles"
                            />
                            
                            {/* Paginación */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex justify-center pt-4">
                                    <Pagination
                                        currentPage={page}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--gray-300)] rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--gray-100)]" />
                            </div>
                            <p className="text-[var(--gray-100)] text-lg font-medium mb-2">
                                No hay usuarios disponibles
                            </p>
                            <p className="text-[var(--gray-200)] text-sm">
                                {hasFilters 
                                    ? 'No se encontraron usuarios con los filtros aplicados'
                                    : 'No se encontraron usuarios en el sistema'}
                            </p>
                            {hasFilters && (
                                <Button
                                    onClick={handleClearFilters}
                                    variant="default"
                                    className="mt-4"
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UsuariosPage;

