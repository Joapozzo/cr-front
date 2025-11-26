'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const EquipoPlantelTabSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="space-y-4">
                <Skeleton height={40} borderRadius={6} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} height={120} borderRadius={6} />
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};

