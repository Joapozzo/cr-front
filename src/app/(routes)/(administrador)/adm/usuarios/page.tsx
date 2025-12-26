'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUsuariosAdmin } from '@/app/hooks/useUsuariosAdmin';
import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { DataTable } from '@/app/components/ui/DataTable';
import { TableSkeleton } from '@/app/components/skeletons/TableSkeleton';
import { RefreshCcw, Users, X, Plus, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUsuariosColumns } from '@/app/components/columns/UsuariosColumns';
import { Pagination } from '@/app/components/legajos/shared/Pagination';
import { SearchBar } from '@/app/components/legajos/shared/SearchBar';
import Select, { SelectOption } from '@/app/components/ui/Select';
import { usuariosService } from '@/app/services/usuarios.services';
import ModalCrearUsuarioAdministrativo from '@/app/components/modals/ModalCrearUsuarioAdministrativo';
import { FormModal } from '@/app/components/modals/ModalAdmin';
import ConfirmActionModal from '@/app/components/modals/ConfirmActionModal';
import { useResetPasswordAdministrativo, useCambiarEstadoUsuarioAdministrativo } from '@/app/hooks/useUsuariosAdmin';
import { UsuarioAdmin } from '@/app/types/user';

const UsuariosPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isCambiarEstadoModalOpen, setIsCambiarEstadoModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<UsuarioAdmin | null>(null);
    const [nuevaPassword, setNuevaPassword] = useState<string | null>(null);
    const [passwordCopied, setPasswordCopied] = useState(false);
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

    // Hook para resetear contraseña
    const resetPassword = useResetPasswordAdministrativo({
        onSuccess: (data, variables) => {
            // Buscar el usuario por uid en la lista actual para asegurar que tenemos los datos completos
            const usuarioCompleto = usuarios.find(u => u.uid === variables.uid);
            if (usuarioCompleto) {
                setSelectedUsuario(usuarioCompleto);
                setNuevaPassword(data.password);
                setIsResetPasswordModalOpen(true);
                toast.success('Contraseña regenerada correctamente');
            } else {
                // Si no encontramos el usuario en la lista, usar el que se pasó
                setNuevaPassword(data.password);
                setIsResetPasswordModalOpen(true);
                toast.success('Contraseña regenerada correctamente');
            }
        },
        onError: (error: Error | { message?: string }) => {
            toast.error(error?.message || 'Error al regenerar contraseña');
            setSelectedUsuario(null);
        },
    });

    const handleResetPassword = (usuario: UsuarioAdmin) => {
        // Establecer el usuario primero
        setSelectedUsuario(usuario);
        // Ejecutar la mutación inmediatamente
        resetPassword.mutate({ uid: usuario.uid });
    };

    const handleCopyPassword = () => {
        if (nuevaPassword) {
            navigator.clipboard.writeText(nuevaPassword);
            setPasswordCopied(true);
            toast.success('Contraseña copiada al portapapeles');
            setTimeout(() => setPasswordCopied(false), 2000);
        }
    };

    const handleCloseResetPasswordModal = () => {
        setIsResetPasswordModalOpen(false);
        setSelectedUsuario(null);
        setNuevaPassword(null);
        setPasswordCopied(false);
    };

    // Hook para cambiar estado
    const cambiarEstado = useCambiarEstadoUsuarioAdministrativo({
        onSuccess: (data) => {
            toast.success(data?.message || 'Estado actualizado correctamente');
            setIsCambiarEstadoModalOpen(false);
            setSelectedUsuario(null);
            refetch();
        },
        onError: (error: Error | { message?: string }) => {
            toast.error(error?.message || 'Error al cambiar el estado del usuario');
        },
    });

    const handleCambiarEstado = (usuario: UsuarioAdmin) => {
        setSelectedUsuario(usuario);
        setIsCambiarEstadoModalOpen(true);
    };

    const handleConfirmCambiarEstado = () => {
        if (!selectedUsuario) return;
        
        const nuevoEstado = selectedUsuario.estado === 'A' ? 'I' : 'A';
        cambiarEstado.mutate({ 
            uid: selectedUsuario.uid, 
            estado: nuevoEstado 
        });
    };

    const columns = getUsuariosColumns(handleResetPassword, handleCambiarEstado);
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
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            variant='default'
                            className='flex items-center'
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear usuario
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            variant='more'
                            className='flex items-center'
                            disabled={isRefreshing}
                        >
                            <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refrescar
                        </Button>
                    </div>
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
                <TableSkeleton columns={8} rows={8} />
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

            {/* Modal Crear Usuario */}
            <ModalCrearUsuarioAdministrativo
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    refetch();
                }}
            />

            {/* Modal Reset Password */}
            <FormModal
                isOpen={isResetPasswordModalOpen}
                onClose={handleCloseResetPasswordModal}
                title="Contraseña Regenerada"
                type="create"
                autoClose={false}
            >
                {selectedUsuario && nuevaPassword ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-[var(--gray-200)]">
                                Se ha generado una nueva contraseña para:
                            </p>
                            <p className="text-base font-medium text-white">
                                {selectedUsuario.nombre} {selectedUsuario.apellido}
                            </p>
                            <p className="text-sm text-[var(--gray-200)]">
                                {selectedUsuario.email}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-lg">
                                <p className="text-sm text-[var(--green)] font-medium mb-2">
                                    Nueva Contraseña:
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-base text-[var(--white)] font-mono break-all flex-1">
                                        {nuevaPassword}
                                    </p>
                                    <button
                                        onClick={handleCopyPassword}
                                        className="p-2 hover:bg-[var(--gray-300)] rounded transition-colors flex-shrink-0"
                                        title="Copiar contraseña"
                                    >
                                        {passwordCopied ? (
                                            <Check className="w-5 h-5 text-[var(--green)]" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-[var(--gray-200)]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[var(--yellow)]/10 border border-[var(--yellow)]/30 rounded-lg p-3">
                                <p className="text-xs text-[var(--yellow)]">
                                    ⚠️ Importante: Copia esta contraseña y compártela de forma segura con el usuario. 
                                    No podrás verla nuevamente.
                                </p>
                            </div>
                        </div>

                        {/* Botón de cerrar personalizado */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                            <Button
                                onClick={handleCloseResetPasswordModal}
                                variant="default"
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-[var(--gray-200)]">Cargando...</p>
                    </div>
                )}
            </FormModal>

            {/* Modal Cambiar Estado */}
            <ConfirmActionModal
                isOpen={isCambiarEstadoModalOpen}
                onClose={() => {
                    setIsCambiarEstadoModalOpen(false);
                    setSelectedUsuario(null);
                }}
                onConfirm={handleConfirmCambiarEstado}
                title={selectedUsuario?.estado === 'A' ? 'Dar de baja usuario' : 'Activar usuario'}
                message={
                    selectedUsuario?.estado === 'A'
                        ? `¿Estás seguro de que deseas dar de baja a ${selectedUsuario?.nombre} ${selectedUsuario?.apellido}?`
                        : `¿Estás seguro de que deseas activar a ${selectedUsuario?.nombre} ${selectedUsuario?.apellido}?`
                }
                confirmText={selectedUsuario?.estado === 'A' ? 'Dar de Baja' : 'Activar'}
                cancelText="Cancelar"
                variant={selectedUsuario?.estado === 'A' ? 'danger' : 'success'}
                isLoading={cambiarEstado.isPending}
                details={
                    selectedUsuario && (
                        <div className="text-left space-y-1 text-sm">
                            <p className="text-[var(--gray-200)]">
                                <span className="font-medium text-[var(--white)]">Usuario:</span> {selectedUsuario.nombre} {selectedUsuario.apellido}
                            </p>
                            <p className="text-[var(--gray-200)]">
                                <span className="font-medium text-[var(--white)]">Email:</span> {selectedUsuario.email}
                            </p>
                            <p className="text-[var(--gray-200)]">
                                <span className="font-medium text-[var(--white)]">Rol:</span> {selectedUsuario.rol.nombre.toUpperCase()}
                            </p>
                            {selectedUsuario.estado === 'A' && (
                                <p className="text-[var(--yellow)] text-xs mt-2">
                                    ⚠️ El usuario no podrá iniciar sesión hasta que sea reactivado.
                                </p>
                            )}
                        </div>
                    )
                }
            />
        </div>
    );
};

export default UsuariosPage;

