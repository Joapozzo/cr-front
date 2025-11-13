import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardPartidoCategoriaSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                    <div className="flex items-center gap-2 text-sm">
                        <Skeleton width={150} height={20} borderRadius={6} />
                        <Skeleton width={80} height={20} borderRadius={6} />
                    </div>
                </div>

                {/* Lista de partidos skeleton (3 items) */}
                <div className="flex flex-col divide-y divide-[var(--black-800)]">
                    {[1, 2].map((i) => (
                        <div key={i} className="px-6 py-4 flex flex-col gap-2">
                            {/* Simulo algo parecido a la info del partido: */}
                            <Skeleton width="60%" height={18} borderRadius={6} />
                            <Skeleton width="40%" height={14} borderRadius={6} />
                            <Skeleton width="30%" height={14} borderRadius={6} />
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default CardPartidoCategoriaSkeleton;
