'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useCategoriaDatos } from './hooks/useCategoriaDatos';
import { useCategoriaForm } from './hooks/useCategoriaForm';
import { useCategoriaActions } from './hooks/useCategoriaActions';
import CategoriaHeader from './components/CategoriaHeader';
import CategoriaFormulario from './components/CategoriaFormulario';
import FormActions from './components/FormActions';

/**
 * Componente principal de contenido
 * Orquesta los hooks y componentes sin lógica de negocio compleja
 */
function ConfiguracionCategoriaContent() {
    const params = useParams();
    const idCategoriaFromParams = params?.id_categoria as string | undefined;

    // Hook personalizado para datos - decide fuente de verdad y sincroniza store
    const { 
        categoria, 
        configuracion: configuracionInicial, 
        isLoading: loadingDatos, 
        error,
        nombreCompleto,
        isPublicada 
    } = useCategoriaDatos(idCategoriaFromParams);

    // Hook personalizado para el formulario - maneja estado y detección de cambios
    const { 
        config, 
        hasChanges, 
        changedFields, 
        updateField, 
        resetForm 
    } = useCategoriaForm(configuracionInicial);

    // Hook personalizado para acciones - lógica de negocio y llamadas a API
    const { 
        actualizarConfig, 
        togglePublicada, 
        isLoading: loadingAcciones 
    } = useCategoriaActions(
        categoria?.id_categoria_edicion || 0
    );

    // Handler para submit del formulario
    const handleSubmit = async () => {
        if (!hasChanges || !configuracionInicial) return;
        
        try {
            await actualizarConfig(
                changedFields,
                config,
                configuracionInicial
            );
            // El hook ya maneja la actualización del store y muestra el toast
        } catch (error) {
            // El error ya se maneja en el hook
            console.error('Error al actualizar:', error);
        }
    };

    // Estados de carga y error
    if (loadingDatos) {
        return <ConfiguracionSkeleton />;
    }

    if (error || !categoria) {
        return (
            <div className="space-y-6">
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <h2 className="text-xl font-bold text-[var(--white)] mb-2">
                        Error al cargar la categoría
                    </h2>
                    <p className="text-[var(--gray-100)]">
                        {error?.message || 'No se pudo cargar la información de la categoría'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <CategoriaHeader
                titulo={nombreCompleto}
                isPublicada={isPublicada}
                onTogglePublicada={togglePublicada}
                isLoading={loadingAcciones}
            />

            <CategoriaFormulario
                config={config}
                onChange={updateField}
                isLoading={loadingAcciones}
            />

            <FormActions
                onSubmit={handleSubmit}
                onCancel={resetForm}
                hasChanges={hasChanges}
                isLoading={loadingAcciones}
            />
        </div>
    );
}

/**
 * Skeleton de carga
 */
function ConfiguracionSkeleton() {
    return (
        <div className="space-y-6">
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-[var(--gray-300)] rounded w-1/3" />
                    <div className="h-4 bg-[var(--gray-300)] rounded w-1/2" />
                </div>
            </div>
            <div className="rounded-lg w-[70%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-20 bg-[var(--gray-300)] rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Componente principal que envuelve en Suspense
 */
export default function ConfiguracionCategoriaPage() {
    return (
        <Suspense fallback={<ConfiguracionSkeleton />}>
            <ConfiguracionCategoriaContent />
        </Suspense>
    );
}
