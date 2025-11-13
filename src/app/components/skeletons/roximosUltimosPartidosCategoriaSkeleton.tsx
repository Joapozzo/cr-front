// ProximosUltimosPartidosCategoriaSkeleton.tsx
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProximosUltimosPartidosCategoriaSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Próximos Partidos Skeleton */}
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                    <div className="p-6 border-b border-[var(--gray-300)]">
                        <Skeleton width={160} height={24} borderRadius={6} />
                    </div>
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="border-l-4 border-[var(--gray-300)] pl-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton width="75%" height={20} borderRadius={6} />
                                        <Skeleton width="50%" height={16} borderRadius={6} />
                                    </div>
                                    <div className="space-y-2 ml-4 text-right">
                                        <Skeleton width={80} height={16} borderRadius={6} />
                                        <Skeleton width={64} height={16} borderRadius={6} />
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
                            <div key={index} className="border-l-4 border-[var(--gray-300)] pl-4">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton width="75%" height={18} borderRadius={6} />
                                        <Skeleton width="35%" height={14} borderRadius={6} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    )
}

export default ProximosUltimosPartidosCategoriaSkeleton;