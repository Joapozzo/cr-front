'use client';

import { Plus, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import FaseSection from '@/app/components/fase/FaseSection';
import { useCategoriaFormato } from '@/app/hooks/useCategoriaFormato';
import { CategoriaFormatoHeader } from '@/app/components/formato/CategoriaFormatoHeader';
import { CategoriaFormatoInfoPanel } from '@/app/components/formato/CategoriaFormatoInfoPanel';
import { CategoriaFormatoEmpty } from '@/app/components/formato/CategoriaFormatoEmpty';
import { CategoriaFormatoError } from '@/app/components/formato/CategoriaFormatoError';
import { CategoriaFormatoSkeleton } from '@/app/components/skeletons/CategoriaFormatoSkeleton';

export default function CategoriaFormatoPageContent() {
    const params = useParams();
    
    // Memoizar y validar el ID de categoría - Leer directamente de la URL (prioridad sobre el store)
    const idCategoriaEdicionFromParams = useMemo(() => {
        if (params?.id_categoria) {
            const id = Number(params.id_categoria);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id_categoria]);
    
    const {
        categoriaSeleccionada,
        fases,
        totalFases,
        isEmpty,
        isLoading,
        isFetching,
        isCreating,
        isError,
        error,
        handleCrearFase,
        handleRefetch,
    } = useCategoriaFormato(idCategoriaEdicionFromParams ?? 0);

    // Early return si no hay ID válido DESPUÉS de todos los hooks
    if (!idCategoriaEdicionFromParams) {
        return <CategoriaFormatoSkeleton />;
    }

    if (isLoading) {
        return <CategoriaFormatoSkeleton />;
    }

    if (isError) {
        return (
            <CategoriaFormatoError
                categoriaSeleccionada={categoriaSeleccionada}
                error={error}
                isFetching={isFetching}
                onRetry={handleRefetch}
            />
        );
    }

    return (
        <div className="space-y-6">
            <CategoriaFormatoHeader
                categoriaSeleccionada={categoriaSeleccionada}
                totalFases={totalFases}
                isFetching={isFetching}
                onRefresh={handleRefetch}
            />

            <div className="space-y-8">
                {isEmpty ? (
                    <CategoriaFormatoEmpty
                        onCrearFase={handleCrearFase}
                        isCreating={isCreating}
                        totalFases={totalFases}
                    />
                ) : (
                    <>
                        {fases?.map(fase => (
                            <FaseSection
                                key={fase.numero_fase}
                                fase={fase}
                                idCatEdicion={idCategoriaEdicionFromParams || Number(categoriaSeleccionada?.id_categoria_edicion) || 0}
                            />
                        ))}

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
                    </>
                )}
            </div>

            <CategoriaFormatoInfoPanel />
        </div>
    );
}

