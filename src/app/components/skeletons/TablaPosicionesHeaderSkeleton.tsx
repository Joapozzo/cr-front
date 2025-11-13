import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TablaPosicionesHeaderSkeletonProps {
    className?: string;
}

const TablaPosicionesHeaderSkeleton: React.FC<TablaPosicionesHeaderSkeletonProps> = ({
    className = '',
}) => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333">
            <div className={`bg-[var(--black-900)] rounded-2xl overflow-hidden ${className}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)] w-full">
                    <div className="flex items-center gap-4 flex-col justify-center w-full">
                        <Skeleton width={180} height={24} borderRadius={8} />
                        <Skeleton width={200} height={32} borderRadius={12} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default TablaPosicionesHeaderSkeleton;