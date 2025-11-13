import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SolicitudesSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--background)] rounded-lg border border-[var(--gray-300)] p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar skeleton */}
                    <Skeleton circle width={48} height={48} />

                    <div className="flex-1">
                        {/* Nombre del jugador skeleton */}
                        <Skeleton width={150} height={20} borderRadius={6} className="mb-2" />

                        {/* Categoría skeleton */}
                        <Skeleton width={200} height={14} borderRadius={6} className="mb-3" />

                        {/* Mensaje skeleton */}
                        <div className="bg-[var(--black-800)] rounded-lg p-3 mb-3 border border-[var(--gray-300)]">
                            <Skeleton width={60} height={12} borderRadius={6} className="mb-2" />
                            <Skeleton width="100%" height={14} borderRadius={6} />
                            <Skeleton width="80%" height={14} borderRadius={6} className="mt-1" />
                        </div>

                        {/* Fecha skeleton */}
                        <Skeleton width={120} height={12} borderRadius={6} className="mb-3" />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default SolicitudesSkeleton;