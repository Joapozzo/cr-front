'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { BaseModal } from './ModalAdmin';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useBuscarEquiposDisponibles, useCrearEquipo } from '../../hooks/useEquipos';
import { useDebounce } from '@/app/hooks/useDebounce';
import toast from 'react-hot-toast';
import { useActualizarVacante } from '@/app/hooks/useTemporadas';

interface ModalSeleccionarEquipoProps {
    isOpen: boolean;
    onClose: () => void;
    idEdicion: number;
    idZona: number;
    idCategoriaEdicion: number;
    vacante: number;
    isOcupada?: boolean;
}

const ModalSeleccionarEquipo = ({
    isOpen,
    onClose,
    idEdicion,
    idZona,
    idCategoriaEdicion,
    vacante,
    isOcupada = false
}: ModalSeleccionarEquipoProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newEquipoName, setNewEquipoName] = useState('');
    const [equipoBeingProcessed, setEquipoBeingProcessed] = useState<number | null>(null);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const {
        data: searchResults,
        isLoading: isSearching,
        error: searchError
    } = useBuscarEquiposDisponibles(
        debouncedSearchQuery,
        idEdicion,
        10
    );

    const { mutate: crearEquipo } = useCrearEquipo();
    const {
        mutate: actualizarVacante,
        error: updateError
    } = useActualizarVacante();

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setIsCreating(false);
            setNewEquipoName('');
            setEquipoBeingProcessed(null);
        }
    }, [isOpen]);

    const equiposEncontrados = searchResults?.equipos || [];
    const showCreateOption = debouncedSearchQuery.length >= 2 &&
        equiposEncontrados.length === 0 &&
        !isSearching;

    const handleSelectEquipo = async (equipoId: number) => {
        setEquipoBeingProcessed(equipoId);

        actualizarVacante({
            id_zona: idZona,
            id_categoria_edicion: idCategoriaEdicion,
            data: {
                vacante: vacante,
                id_equipo: equipoId
            }
        }, {
            onSuccess: () => {
                toast.success(`Equipo asignado a la vacante ${vacante}`);
                setEquipoBeingProcessed(null);
                onClose();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Error al asignar equipo');
                setEquipoBeingProcessed(null);
            }
        });
    };

    const handleCrearYAsignarEquipo = async () => {
        if (!newEquipoName.trim()) {
            toast.error('Ingresa un nombre para el equipo');
            return;
        }

        setIsCreating(true);

        try {
            // Crear el equipo
            const response = await new Promise<any>((resolve, reject) => {
                crearEquipo({
                    nombre: newEquipoName.trim(),
                    id_categoria_edicion: idCategoriaEdicion
                }, {
                    onSuccess: resolve,
                    onError: reject
                });
            });

            // Si se creó exitosamente, asignarlo
            handleSelectEquipo(response.data.equipo.id_equipo);

        } catch (error: any) {
            toast.error(error.message || 'Error al crear el equipo');
        } finally {
            setIsCreating(false);
        }
    };

    const modalTitle = isOcupada
        ? `Reemplazar equipo en vacante ${vacante}`
        : `Asignar equipo a vacante ${vacante}`;

    const isLoading = isCreating || equipoBeingProcessed !== null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            type="create"
            maxWidth="max-w-2xl"
        >
            <div className="space-y-6">
                {/* Buscador */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--white)]">
                        Buscar equipos disponibles
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-200)] z-10" />
                        <Input
                            type="text"
                            placeholder="Escribe el nombre del equipo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                            disabled={isLoading}
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="w-4 h-4 animate-spin text-[var(--gray-100)]" />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-[var(--gray-100)]">
                        Escribe al menos 2 caracteres para buscar equipos
                    </p>
                </div>

                {/* Resultados de búsqueda */}
                {debouncedSearchQuery.length >= 2 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-[var(--white)]">
                            Resultados de búsqueda ({equiposEncontrados.length})
                        </h3>

                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {equiposEncontrados.map((equipo) => (
                                <div
                                    key={equipo.id_equipo}
                                    className="flex items-center justify-between p-3 border border-[var(--gray-300)] rounded-lg hover:border-[var(--green)] hover:bg-[var(--green)]/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-[var(--gray-100)]" />
                                        </div>
                                        <span className="text-[var(--white)] font-medium">
                                            {equipo.nombre}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => handleSelectEquipo(equipo.id_equipo)}
                                        disabled={isLoading}
                                        variant="success"
                                        className="flex items-center gap-1 text-sm justify-center min-w-[90px]"
                                    >
                                        {equipoBeingProcessed === equipo.id_equipo ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                                Asignando...
                                            </>
                                        ) : (
                                            'Asignar'
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Opción para crear equipo nuevo */}
                        {showCreateOption && (
                            <div className="border-t border-[var(--gray-300)] pt-4">
                                <div className="p-4 bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="w-4 h-4 text-[var(--blue)]" />
                                        <p className="text-[var(--blue)] font-medium text-sm">
                                            No se encontraron equipos con ese nombre
                                        </p>
                                    </div>

                                    <p className="text-[var(--gray-100)] text-sm mb-3">
                                        ¿Quieres crear un nuevo equipo llamado &ldquo;{debouncedSearchQuery}&rdquo;?
                                    </p>

                                    <div className="flex gap-3">
                                        <Input
                                            type="text"
                                            placeholder="Confirmar nombre del equipo"
                                            value={newEquipoName}
                                            onChange={(e) => setNewEquipoName(e.target.value)}
                                            className="flex-1"
                                            disabled={isLoading}
                                        />
                                        <Button
                                            onClick={handleCrearYAsignarEquipo}
                                            disabled={isLoading || !newEquipoName.trim()}
                                            variant="success"
                                            className='flex items-center gap-1 text-sm justify-center min-w-[130px]'
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                                    Creando...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Crear y Asignar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Error en búsqueda */}
                {searchError && (
                    <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg">
                        <p className="text-[var(--red)] text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Error al buscar equipos: {searchError.message}
                        </p>
                    </div>
                )}

                {/* Error en actualización */}
                {updateError && (
                    <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg">
                        <p className="text-[var(--red)] text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Error al asignar equipo: {updateError.message}
                        </p>
                    </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                        <div className="bg-[var(--gray-400)] p-4 rounded-lg flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-[var(--green)]" />
                            <span className="text-[var(--white)]">
                                {equipoBeingProcessed ? 'Asignando equipo...' : 'Creando equipo...'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
            </div>
        </BaseModal>
    );
};

export default ModalSeleccionarEquipo;