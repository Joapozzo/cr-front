import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MatchCardSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-transparent rounded-lg p-4 space-y-3">
                {/* Header: Jornada y Hora/Estado skeleton */}
                <div className="flex items-center justify-between text-xs">
                    <Skeleton width={80} height={12} borderRadius={6} />
                    <div className="flex items-center gap-1.5">
                        <Skeleton circle width={12} height={12} />
                        <Skeleton width={60} height={12} borderRadius={6} />
                    </div>
                </div>

                {/* Partido: Equipos y Resultado skeleton */}
                <div className="flex items-center justify-between gap-4">
                    {/* Equipo Local skeleton */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={60} height={14} borderRadius={6} />
                    </div>

                    {/* Resultado o VS skeleton */}
                    <div className="flex items-center justify-center min-w-[60px]">
                        <Skeleton width={60} height={24} borderRadius={6} />
                    </div>

                    {/* Equipo Visita skeleton */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <Skeleton width={60} height={14} borderRadius={6} />
                        <Skeleton circle width={40} height={40} />
                    </div>
                </div>

                {/* Footer: Cancha y Fecha skeleton */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                        <Skeleton circle width={12} height={12} />
                        <Skeleton width={100} height={12} borderRadius={6} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Skeleton circle width={12} height={12} />
                        <Skeleton width={80} height={12} borderRadius={6} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default MatchCardSkeleton;