import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton completo para el resumen de categoría.
 * Reemplaza todo el contenido (estadísticas + partidos) mientras carga.
 * Mantiene el layout similar al componente real.
 */
export const CategoriaResumenSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="space-y-6">
                {/* Estadísticas Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Vacantes Skeleton */}
                    <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton width={100} height={24} borderRadius={6} />
                            <Skeleton circle width={12} height={12} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton width={48} height={32} borderRadius={6} />
                                <Skeleton width={64} height={16} borderRadius={6} />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton width={40} height={24} borderRadius={6} />
                                <Skeleton width={80} height={16} borderRadius={6} />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton width={40} height={24} borderRadius={6} />
                                <Skeleton width={80} height={16} borderRadius={6} />
                            </div>
                            <div className="mt-4 pt-4 border-t border-[var(--gray-300)]">
                                <div className="flex items-center justify-between mb-2">
                                    <Skeleton width={80} height={16} borderRadius={6} />
                                    <Skeleton width={48} height={20} borderRadius={6} />
                                </div>
                                <Skeleton height={8} borderRadius={4} />
                            </div>
                        </div>
                    </div>

                    {/* Equipos Skeleton */}
                    <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton width={100} height={24} borderRadius={6} />
                            <Skeleton circle width={12} height={12} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton width={48} height={32} borderRadius={6} />
                                <Skeleton width={64} height={16} borderRadius={6} />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton width={40} height={24} borderRadius={6} />
                                <Skeleton width={80} height={16} borderRadius={6} />
                            </div>
                            <div className="mt-4">
                                <Skeleton width={96} height={16} borderRadius={6} />
                            </div>
                        </div>
                    </div>

                    {/* Jugadores Skeleton */}
                    <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton width={120} height={24} borderRadius={6} />
                            <Skeleton circle width={12} height={12} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton width={48} height={32} borderRadius={6} />
                                <Skeleton width={64} height={16} borderRadius={6} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partidos Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Próximos Partidos Skeleton */}
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                        <div className="p-6 border-b border-[var(--gray-300)]">
                            <Skeleton width={160} height={24} borderRadius={6} />
                        </div>
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="pb-4 border-b border-[var(--gray-300)] last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <Skeleton width="75%" height={20} borderRadius={6} />
                                            <Skeleton width="50%" height={14} borderRadius={6} />
                                        </div>
                                        <div className="space-y-2 ml-4 text-right">
                                            <Skeleton width={80} height={14} borderRadius={6} />
                                            <Skeleton width={64} height={14} borderRadius={6} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Últimos Resultados Skeleton */}
                    <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                        <div className="p-6 border-b border-[var(--gray-300)]">
                            <Skeleton width={160} height={24} borderRadius={6} />
                        </div>
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="pb-4 border-b border-[var(--gray-300)] last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <Skeleton width="85%" height={18} borderRadius={6} />
                                            <Skeleton width="45%" height={14} borderRadius={6} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

