import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { useEquiposPorCategoriaEdicion, useBuscarEquiposDisponibles, useCrearEquipo } from '../hooks/useEquipos';
import { useOcuparVacante } from '../hooks/useTemporadas';
import { Button } from './ui/Button';
import Select, { SelectOption } from './ui/Select';
import { Input } from './ui/Input';
import { useDebounce } from '../hooks/useDebounce';
import { EquipoResponse } from '../types/equipo';
import toast from 'react-hot-toast';

interface TabSeleccionManualProps {
    idEdicion: number;
    idZona: number;
    idCategoriaEdicion: number;
    vacante: number;
    isOcupada: boolean;
    esEliminacionDirecta?: boolean;
    onClose: () => void;
}

const TabSeleccionManual = ({
    idEdicion,
    idZona,
    idCategoriaEdicion,
    vacante,
    isOcupada,
    esEliminacionDirecta = false,
    onClose
}: TabSeleccionManualProps) => {
    const [selectedEquipo, setSelectedEquipo] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [newEquipoName, setNewEquipoName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [equipoBeingProcessed, setEquipoBeingProcessed] = useState<number | null>(null);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Hook para lista completa de equipos (usado cuando esEliminacionDirecta es true)
    const { data: equipos, isLoading: isLoadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);

    // Hook para búsqueda de equipos (usado cuando esEliminacionDirecta es false)
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
    const { mutate: ocuparVacante, isPending } = useOcuparVacante();

    // Resetear estados cuando se cierra el modal
    useEffect(() => {
        if (!onClose) return; // Si onClose está disponible, es que el componente está montado
        return () => {
            setSearchQuery('');
            setNewEquipoName('');
            setSelectedEquipo(null);
            setIsCreating(false);
            setEquipoBeingProcessed(null);
        };
    }, [onClose]);

    // Equipos para el Select (cuando esEliminacionDirecta es true)
    const equiposOptions: SelectOption[] = equipos?.equipos.map(equipo => ({
        value: equipo.id_equipo,
        label: equipo.nombre,
        image: equipo.img || undefined
    })) || [];

    // Equipos encontrados en la búsqueda (cuando esEliminacionDirecta es false)
    const equiposEncontrados = searchResults?.equipos || [];

    // Mostrar opción de crear equipo si:
    // - No es eliminación directa
    // - Hay una búsqueda activa (mínimo 2 caracteres)
    // - No se encontraron equipos
    // - No está buscando
    const showCreateOption = !esEliminacionDirecta &&
        debouncedSearchQuery.trim().length >= 2 &&
        equiposEncontrados.length === 0 &&
        !isSearching &&
        !searchError;

    const handleSelectEquipo = async (equipoId: number) => {
        setEquipoBeingProcessed(equipoId);

        ocuparVacante({
            id_zona: idZona,
            id_categoria_edicion: idCategoriaEdicion,
            data: {
                id_equipo: equipoId,
                vacante: vacante
            }
        }, {
            onSuccess: () => {
                toast.success('Equipo asignado exitosamente');
                setEquipoBeingProcessed(null);
                onClose();
            },
            onError: (error) => {
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
            const response = await new Promise<EquipoResponse>((resolve, reject) => {
                crearEquipo({
                    nombre: newEquipoName.trim(),
                    id_categoria_edicion: idCategoriaEdicion
                }, {
                    onSuccess: resolve,
                    onError: reject
                });
            });

            // Si se creó exitosamente, asignarlo
            if (response?.equipo?.id_equipo) {
                await handleSelectEquipo(response.equipo.id_equipo);
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear el equipo';
            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSubmit = () => {
        if (!selectedEquipo) {
            toast.error('Debe seleccionar un equipo');
            return;
        }
        handleSelectEquipo(selectedEquipo);
    };

    const isLoading = isLoadingEquipos || isSearching || isCreating || equipoBeingProcessed !== null || isPending;

    if (isLoadingEquipos && esEliminacionDirecta) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[var(--gray-100)]">Cargando equipos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!esEliminacionDirecta ? (
                <>
                    {/* Buscador de equipos (solo cuando NO es eliminación directa) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--white)]">
                            Buscar equipos disponibles
                        </label>
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setNewEquipoName(e.target.value);
                            }}
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Buscar por nombre de equipo (mínimo 2 caracteres)..."
                            disabled={isLoading}
                        />
                    </div>

                    {/* Resultados de búsqueda */}
                    {debouncedSearchQuery.trim().length >= 2 && (
                        <div className="space-y-3">
                            {isSearching ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-[var(--green)]" />
                                        <span className="text-[var(--gray-100)]">Buscando equipos...</span>
                                    </div>
                                </div>
                            ) : searchError ? (
                                <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg">
                                    <p className="text-[var(--red)] text-sm flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Error al buscar equipos: {searchError instanceof Error ? searchError.message : 'Error desconocido'}
                                    </p>
                                </div>
                            ) : equiposEncontrados.length > 0 ? (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {equiposEncontrados.map((equipo) => {
                                        const isApto = equipo.apto !== false; // Si no viene el campo, asumir apto
                                        const isDisabled = !isApto || isLoading || equipoBeingProcessed !== null;
                                        
                                        return (
                                            <div
                                                key={equipo.id_equipo}
                                                onClick={() => {
                                                    if (!isDisabled) {
                                                        handleSelectEquipo(equipo.id_equipo);
                                                    }
                                                }}
                                                className={`p-3 rounded-lg border transition-colors ${
                                                    isDisabled
                                                        ? 'border-[var(--gray-400)] bg-[var(--gray-400)]/10 opacity-50 cursor-not-allowed'
                                                        : equipoBeingProcessed === equipo.id_equipo
                                                        ? 'border-[var(--green)] bg-[var(--green)]/10 cursor-pointer'
                                                        : 'border-[var(--gray-300)] hover:border-[var(--green)] hover:bg-[var(--green)]/5 cursor-pointer'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {equipo.img ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={equipo.img}
                                                            alt={equipo.nombre}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-[var(--gray-200)] rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Shield className="w-5 h-5 text-[var(--gray-100)]" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${isApto ? 'text-[var(--white)]' : 'text-[var(--gray-100)]'}`}>
                                                            {equipo.nombre}
                                                        </p>
                                                        {!isApto && (
                                                            <p className="text-xs text-[var(--red)] mt-1">
                                                                No disponible (ya está asignado o expulsado)
                                                            </p>
                                                        )}
                                                    </div>
                                                    {equipoBeingProcessed === equipo.id_equipo ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-[var(--green)]" />
                                                    ) : !isApto && (
                                                        <AlertTriangle className="w-4 h-4 text-[var(--red)]" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}

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
                                            ¿Quieres crear un nuevo equipo llamado &quot;{debouncedSearchQuery}&quot;?
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
                                                className='flex items-center gap-1 text-sm justify-center min-w-[150px]'
                                            >
                                                {isCreating ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Creando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        Crear
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Select de equipos (cuando es eliminación directa) */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--white)] mb-2">
                            Seleccionar equipo
                        </label>
                        <Select
                            options={equiposOptions}
                            value={selectedEquipo || ''}
                            onChange={(value) => setSelectedEquipo(Number(value))}
                            placeholder="Selecciona un equipo..."
                            showImages={true}
                            bgColor='bg-[var(--gray-300)]'
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="more"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleSubmit}
                            disabled={!selectedEquipo || isLoading}
                        >
                            {isPending ? 'Asignando...' : isOcupada ? 'Reemplazar' : 'Asignar'}
                        </Button>
                    </div>
                </>
            )}

            {/* Botón cancelar (solo cuando NO es eliminación directa y hay búsqueda activa) */}
            {!esEliminacionDirecta && debouncedSearchQuery.trim().length >= 2 && (
                <div className="flex justify-end pt-4 border-t border-[var(--gray-300)]">
                    <Button
                        variant="more"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TabSeleccionManual;