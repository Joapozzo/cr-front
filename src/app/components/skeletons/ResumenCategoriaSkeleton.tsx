import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ResumenCategoriaSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vacantes Skeleton */}
                <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton width={100} height={24} borderRadius={6} />
                        <Skeleton circle width={12} height={12} />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Skeleton width={32} height={32} borderRadius={6} className="mr-2" />
                            <Skeleton width={180} height={16} borderRadius={6} />
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
        </SkeletonTheme>
    )
}

export default ResumenCategoriaSkeleton;