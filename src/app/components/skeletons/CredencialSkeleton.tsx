import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const CredencialSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--card-background)] rounded-lg p-4 sm:p-6 border border-[var(--gray-300)]">
                {/* Header info skeleton */}
                <div className="mb-4 pb-4 border-b border-[var(--gray-300)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                            <Skeleton height={20} width={150} borderRadius={6} className="mb-2" />
                            <Skeleton height={14} width={200} borderRadius={6} />
                        </div>
                        <div className="space-y-1">
                            <Skeleton height={14} width={120} borderRadius={6} />
                            <Skeleton height={14} width={120} borderRadius={6} />
                        </div>
                    </div>
                </div>

                {/* Tarjeta skeleton */}
                <div className="relative w-full max-w-md mx-auto">
                    {/* Contenedor de la tarjeta con aspecto de credencial */}
                    <div 
                        className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a1c20] via-[#24262b] to-[#121315]"
                        style={{ perspective: '1000px' }}
                    >
                        <div className="p-5 h-full flex flex-col justify-between">
                            {/* Header skeleton */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Skeleton circle width={32} height={32} />
                                    <div>
                                        <Skeleton height={10} width={80} borderRadius={4} className="mb-1" />
                                        <Skeleton height={10} width={100} borderRadius={4} />
                                    </div>
                                </div>
                                <Skeleton height={24} width={80} borderRadius={12} />
                            </div>

                            {/* Main content skeleton */}
                            <div className="flex items-center gap-5 mt-2">
                                {/* Avatar skeleton */}
                                <div className="relative shrink-0">
                                    <Skeleton circle width={96} height={96} />
                                    <Skeleton circle width={20} height={20} className="absolute bottom-1 right-1" />
                                </div>

                                {/* Nombre y datos skeleton */}
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div>
                                        <Skeleton height={24} width={120} borderRadius={6} className="mb-2" />
                                        <Skeleton height={20} width={100} borderRadius={6} />
                                    </div>
                                    <Skeleton height={32} width={100} borderRadius={6} />
                                </div>
                            </div>

                            {/* Footer skeleton */}
                            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-white/5">
                                <div>
                                    <Skeleton height={10} width={60} borderRadius={4} className="mb-1" />
                                    <div className="flex items-center gap-1.5">
                                        <Skeleton circle width={16} height={16} />
                                        <Skeleton height={14} width={80} borderRadius={4} />
                                    </div>
                                </div>
                                <div className="items-end">
                                    <Skeleton height={10} width={70} borderRadius={4} className="mb-1 ml-auto" />
                                    <Skeleton height={14} width={90} borderRadius={4} className="ml-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones skeleton */}
                <div className="flex items-center gap-3 w-full justify-center mt-6">
                    <Skeleton circle width={48} height={48} />
                    <Skeleton height={48} width={120} borderRadius={24} />
                    <Skeleton circle width={48} height={48} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

/**
 * Skeleton para lista de credenciales
 */
export const CredencialesListSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => {
    return (
        <div className="space-y-8">
            {[...Array(count)].map((_, index) => (
                <CredencialSkeleton key={index} />
            ))}
        </div>
    );
};


