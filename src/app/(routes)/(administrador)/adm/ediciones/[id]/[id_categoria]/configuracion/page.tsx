import { Suspense } from 'react';
import ConfiguracionCategoriaContent from './ConfiguracionCategoriaContent';

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
