import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EstadisticasRapidasSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div
                        key={index}
                        className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]"
                    >
                        <div className="flex items-center gap-3">
                            {/* Ícono skeleton */}
                            <div className="p-2 rounded-lg">
                                <Skeleton width={20} height={20} borderRadius={6} />
                            </div>
                            
                            {/* Contenido skeleton */}
                            <div className="flex-1">
                                <Skeleton width={120} height={14} borderRadius={6} className="mb-2" />
                                <Skeleton width={40} height={24} borderRadius={6} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    );
};

export default EstadisticasRapidasSkeleton;