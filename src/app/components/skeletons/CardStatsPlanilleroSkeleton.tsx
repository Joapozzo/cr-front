import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardEstadisticasSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)] rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={120} height={20} borderRadius={6} />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="px-6 py-4">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Pendientes skeleton */}
                        <div className="text-center">
                            <div className="mb-1">
                                <Skeleton width={40} height={32} borderRadius={6} />
                            </div>
                            <div className="mb-2">
                                <Skeleton width={70} height={12} borderRadius={6} />
                            </div>
                            <div className="w-full h-1 bg-[#262626] rounded-full mt-2">
                                <Skeleton height={4} borderRadius={2} />
                            </div>
                        </div>

                        {/* Completados skeleton */}
                        <div className="text-center">
                            <div className="mb-1">
                                <Skeleton width={40} height={32} borderRadius={6} />
                            </div>
                            <div className="mb-2">
                                <Skeleton width={80} height={12} borderRadius={6} />
                            </div>
                            <div className="w-full h-1 bg-[#262626] rounded-full mt-2">
                                <Skeleton height={4} borderRadius={2} />
                            </div>
                        </div>

                        {/* Este mes skeleton */}
                        <div className="text-center">
                            <div className="mb-1">
                                <Skeleton width={40} height={32} borderRadius={6} />
                            </div>
                            <div className="mb-2">
                                <Skeleton width={60} height={12} borderRadius={6} />
                            </div>
                            <div className="w-full h-1 bg-[#262626] rounded-full mt-2">
                                <Skeleton height={4} borderRadius={2} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default CardEstadisticasSkeleton;