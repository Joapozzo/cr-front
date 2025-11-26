'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const JugadorHeaderSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="space-y-6">
                <Skeleton height={40} width={120} borderRadius={6} />
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-start gap-6">
                        <Skeleton height={96} width={96} borderRadius={8} />
                        <div className="flex-1 space-y-3">
                            <Skeleton height={32} width="60%" borderRadius={6} />
                            <Skeleton height={20} width="40%" borderRadius={6} />
                            <Skeleton height={20} width="30%" borderRadius={6} />
                            <div className="flex gap-4 mt-4">
                                <Skeleton height={24} width={100} borderRadius={6} />
                                <Skeleton height={24} width={120} borderRadius={6} />
                                <Skeleton height={24} width={100} borderRadius={6} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

