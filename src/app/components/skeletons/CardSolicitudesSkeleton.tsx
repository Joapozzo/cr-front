import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SolicitudesSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--background)] rounded-lg border border-[var(--gray-300)] p-3 sm:p-4 w-full overflow-hidden">
                <div className="flex items-start gap-2 sm:gap-3 w-full min-w-0">
                    {/* Avatar skeleton */}
                    <Skeleton circle width={48} height={48} className="flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        {/* Nombre del jugador skeleton */}
                        <Skeleton width={150} height={20} borderRadius={6} className="mb-2 max-w-[150px] sm:max-w-[200px]" />

                        {/* Categoría skeleton */}
                        <Skeleton width={200} height={14} borderRadius={6} className="mb-3 max-w-[200px] sm:max-w-[250px]" />

                        {/* Mensaje skeleton */}
                        <div className="bg-[var(--black-800)] rounded-lg p-2 sm:p-3 mb-3 border border-[var(--gray-300)] w-full overflow-hidden">
                            <Skeleton width={60} height={12} borderRadius={6} className="mb-2 max-w-[60px]" />
                            <Skeleton width="100%" height={14} borderRadius={6} />
                            <Skeleton width="80%" height={14} borderRadius={6} className="mt-1" />
                        </div>

                        {/* Fecha skeleton */}
                        <Skeleton width={120} height={12} borderRadius={6} className="mb-3 max-w-[120px]" />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default SolicitudesSkeleton;