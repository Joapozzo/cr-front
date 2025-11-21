import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PredioAccordionSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg overflow-hidden">
                {/* Header del accordion */}
                <div className="p-4 border-b border-[var(--gray-300)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton circle width={40} height={40} />
                            <div className="flex-1">
                                <Skeleton width={200} height={20} borderRadius={6} className="mb-2" />
                                <Skeleton width={150} height={14} borderRadius={6} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton width={80} height={32} borderRadius={6} />
                            <Skeleton width={80} height={32} borderRadius={6} />
                            <Skeleton circle width={32} height={32} />
                        </div>
                    </div>
                </div>

                {/* Contenido expandido (simulado) */}
                <div className="p-4 space-y-4">
                    {/* Info del predio */}
                    <div className="space-y-2">
                        <Skeleton width={100} height={14} borderRadius={6} />
                        <Skeleton width="80%" height={14} borderRadius={6} />
                    </div>

                    {/* Lista de canchas */}
                    <div className="space-y-3">
                        <Skeleton width={120} height={16} borderRadius={6} className="mb-2" />
                        {/* Canchas skeleton */}
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-[var(--black-800)] border border-[var(--gray-300)] rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <Skeleton circle width={32} height={32} />
                                        <div className="flex-1">
                                            <Skeleton width={150} height={16} borderRadius={6} className="mb-2" />
                                            <Skeleton width={100} height={12} borderRadius={6} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton width={70} height={28} borderRadius={6} />
                                        <Skeleton width={70} height={28} borderRadius={6} />
                                        <Skeleton circle width={28} height={28} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default PredioAccordionSkeleton;

