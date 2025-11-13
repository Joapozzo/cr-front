
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PartidoItemSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="flex flex-col gap-4 bg-[#171717] rounded-lg border border-[#262626] p-4">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton width={80} height={24} borderRadius={6} />
                        <Skeleton width={70} height={24} borderRadius={6} />
                    </div>
                    <Skeleton width={16} height={16} borderRadius={4} />
                </div>

                {/* Información del partido skeleton */}
                <div className="">
                    <Skeleton width="70%" height={14} borderRadius={4} className="mb-1" />
                    <div className="flex items-center gap-1 mb-1">
                        <Skeleton width={20} height={20} borderRadius={4} />
                        <Skeleton width={80} height={14} borderRadius={4} />
                    </div>
                </div>

                {/* Equipos y resultado skeleton */}
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-col">
                        {/* Equipo Local skeleton */}
                        <div className="flex items-center gap-3 flex-1">
                            <Skeleton width={16} height={16} borderRadius="50%" />
                            <Skeleton width={120} height={16} borderRadius={4} />
                        </div>

                        {/* Equipo Visita skeleton */}
                        <div className="flex items-center gap-3 flex-1 justify-end">
                            <Skeleton width={16} height={16} borderRadius="50%" />
                            <Skeleton width={120} height={16} borderRadius={4} />
                        </div>
                    </div>

                    {/* Resultado o Estado skeleton */}
                    <div className="flex items-center gap-4 px-4">
                        <div className="flex items-center gap-2">
                            <Skeleton width={16} height={16} borderRadius={4} />
                            <Skeleton width={40} height={16} borderRadius={4} />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default PartidoItemSkeleton;