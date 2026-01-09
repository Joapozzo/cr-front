import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const CardPartidoHeaderSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] border-b border-t border-[#262626] overflow-hidden rounded-xl">
                {/* Header - Categoría Skeleton */}
                <div className="bg-[var(--black-800)] px-6 py-3 border-b border-[#262626] rounded-t-xl">
                    <div className="flex items-center justify-center gap-6">
                        <Skeleton width={80} height={16} borderRadius={6} />
                        <Skeleton width={60} height={16} borderRadius={6} />
                        <Skeleton width={100} height={16} borderRadius={6} />
                    </div>
                </div>

                {/* Info del partido Skeleton */}
                <div className="px-6 py-4 space-y-4">
                    {/* Línea 1: Estado/Tiempo Skeleton */}
                    <div className="flex justify-center">
                        <Skeleton width={100} height={28} borderRadius={6} />
                    </div>

                    {/* Línea 2: Equipos y Resultado Skeleton */}
                    <div className="flex items-center justify-between gap-2 sm:gap-6">
                        {/* Equipo Local Skeleton */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                            <Skeleton width={120} height={20} borderRadius={6} />
                            <Skeleton circle width={30} height={30} />
                        </div>

                        {/* Resultado Skeleton */}
                        <div className="flex items-center justify-center min-w-[80px] sm:min-w-[120px] flex-shrink-0">
                            <Skeleton width={60} height={32} borderRadius={6} />
                        </div>

                        {/* Equipo Visita Skeleton */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <Skeleton circle width={30} height={30} />
                            <Skeleton width={120} height={20} borderRadius={6} />
                        </div>
                    </div>

                    {/* Línea 3: Goleadores Skeleton (opcional) */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                        <div className="flex flex-wrap gap-2 justify-end flex-1">
                            <Skeleton width={80} height={16} borderRadius={4} />
                            <Skeleton width={90} height={16} borderRadius={4} />
                        </div>
                        <Skeleton circle width={16} height={16} />
                        <div className="flex flex-wrap gap-2 flex-1">
                            <Skeleton width={80} height={16} borderRadius={4} />
                        </div>
                    </div>
                </div>

                {/* Botonera Skeleton */}
                <div className="sticky bottom-0 z-50 border-t border-[#262626] px-6 py-4 bg-[var(--black-900)]">
                    <Skeleton width="100%" height={44} borderRadius={8} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default CardPartidoHeaderSkeleton;

