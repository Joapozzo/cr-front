'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const EquipoHeaderSkeleton = () => {
    return (
        <div className="space-y-6">
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <Skeleton height={40} width={200} borderRadius={6} />
                <Skeleton height={150} borderRadius={6} />
            </SkeletonTheme>
        </div>
    );
};
