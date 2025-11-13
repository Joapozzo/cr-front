'use client';

import { Plus, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import FaseSection from '@/app/components/FaseSection';
import { useFases } from '@/app/hooks/useFases';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import toast from 'react-hot-toast';

export default function CategoriaFormatoPage() {
    const { categoriaSeleccionada } = useCategoriaStore();
    const idCatEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    const {
        crearFase, 
        fases, 
        isLoading,
        isCreating, 
        isEmpty, 
        totalFases, 
        refetch,
        isError,
        error
    } = useFases(idCatEdicion);

    const handleCrearFase = async () => {
        try {
            await crearFase();
            toast.success(`Fase ${totalFases + 1} creada exitosamente`);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Error al crear la fase';
            toast.error(errorMessage);
        }
    };

    const handleRefresh = async () => {
        try {
            await refetch();
            toast.success('Datos actualizados');
        } catch (error) {
            toast.error('Error al actualizar los datos');
        }
    };

    // Estados de carga
    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Formato - {categoriaSeleccionada?.nombre_completo || 'Cargando...'}
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Configura las fases, zonas y distribución de equipos para la categoría
                    </p>
                </div>

                {/* Loading state */}
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--green)]" />
                        <span className="text-[var(--white)]">Cargando fases...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Estado de error
    if (isError) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Formato - {categoriaSeleccionada?.nombre_completo || 'Error'}
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Configura las fases, zonas y distribución de equipos para la categoría
                    </p>
                </div>

                {/* Error state */}
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="flex items-center gap-3 text-[var(--red)]">
                        <AlertCircle className="w-6 h-6" />
                        <span className="text-lg font-medium">Error al cargar las fases</span>
                    </div>
                    <p className="text-[var(--gray-100)] text-center max-w-md">
                        {error?.response?.data?.error || error?.message || 'Ocurrió un error inesperado'}
                    </p>
                    <Button
                        onClick={handleRefresh}
                        variant="more"
                        className="flex items-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                        Formato - {categoriaSeleccionada?.nombre_completo || 'Categoría'}
                    </h1>
                    <p className="text-[var(--gray-100)]">
                        Configura las fases, zonas y distribución de equipos para la categoría
                    </p>
                </div>
                
                {/* Indicador de total de fases */}
                <div className="flex items-center gap-4">
                    <div className="bg-[var(--gray-300)] px-3 py-1 rounded-full">
                        <span className="text-[var(--white)] text-sm font-medium">
                            {totalFases} {totalFases === 1 ? 'fase' : 'fases'}
                        </span>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <RefreshCcw className="w-3 h-3" />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Fases */}
            <div className="space-y-8">
                {isEmpty ? (
                    // Estado vacío
                    <div className="text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-[var(--gray-300)] rounded-full flex items-center justify-center">
                                <Plus className="w-8 h-8 text-[var(--gray-100)]" />
                            </div>
                            <div>
                                <h3 className="text-[var(--white)] font-medium mb-2">
                                    No hay fases configuradas
                                </h3>
                                <p className="text-[var(--gray-100)] text-sm max-w-md">
                                    Comienza creando la primera fase para estructurar el formato del torneo
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Lista de fases
                    fases?.map(fase => (
                        <FaseSection key={fase.numero_fase} fase={fase} idCatEdicion={idCatEdicion} />
                    ))
                )}

                {/* Botón para agregar nueva fase */}
                <div className="flex justify-center pt-6">
                    <Button
                        variant="success"
                        onClick={handleCrearFase}
                        disabled={isCreating}
                        className="flex items-center gap-2"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creando fase...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Agregar fase {totalFases + 1}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Panel de información */}
            <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/20 rounded-lg p-4 mt-8">
                <h3 className="text-[var(--blue)] font-medium mb-2">Información del formato</h3>
                <ul className="text-sm text-[var(--gray-100)] space-y-1">
                    <li>• <strong>Todos contra todos:</strong> Cada equipo juega contra todos los demás en la zona</li>
                    <li>• <strong>Eliminación directa:</strong> Sistemas de eliminación por partidos únicos</li>
                    <li>• Puedes configurar múltiples fases para crear un torneo complejo</li>
                    <li>• Las vacantes pueden ser ocupadas por equipos directos o por clasificados de otras zonas</li>
                </ul>
            </div>
        </div>
    );
}