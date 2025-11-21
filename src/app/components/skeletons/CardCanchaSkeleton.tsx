import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardCanchaSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--gray-400)] border-2 border-[var(--gray-300)] rounded-xl overflow-hidden">
                {/* Header de la cancha */}
                <div className="p-4 border-b border-[var(--gray-300)] bg-[var(--gray-300)]/10">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Skeleton width={120} height={18} borderRadius={6} />
                                <Skeleton width={70} height={16} borderRadius={16} />
                            </div>
                            <Skeleton width={100} height={14} borderRadius={6} />
                        </div>
                        <Skeleton circle width={32} height={32} />
                    </div>
                </div>

                {/* SVG de cancha skeleton */}
                <div className="relative h-48 overflow-hidden bg-transparent">
                    <Skeleton width="100%" height="100%" />
                    
                    {/* Indicadores skeleton */}
                    <div className="absolute top-2 right-2">
                        <Skeleton width={60} height={20} borderRadius={16} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default CardCanchaSkeleton;

