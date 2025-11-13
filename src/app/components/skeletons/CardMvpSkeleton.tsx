import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MVPComponentSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-center px-6 py-4 bg-[var(--black-800)] rounded-t-2xl w-full">
                    <div className="flex items-center gap-2 w-full justify-center">
                        <Skeleton circle width={20} height={20} />
                        <Skeleton width={150} height={24} borderRadius={6} />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Label del select */}
                    <div>
                        <Skeleton width={200} height={14} borderRadius={6} className="mb-3" />
                        
                        {/* Select skeleton */}
                        <div className="bg-[#171717] rounded-[20px] px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton circle width={20} height={20} />
                                    <Skeleton width={180} height={16} borderRadius={6} />
                                </div>
                                <Skeleton width={16} height={16} borderRadius={4} />
                            </div>
                        </div>
                    </div>

                    {/* Información del MVP skeleton */}
                    <div className="flex items-start gap-4 p-4 bg-[#171717] rounded-lg border border-[#262626]">
                        {/* Foto del jugador skeleton */}
                        <div className="flex-shrink-0">
                            <Skeleton circle width={64} height={64} />
                        </div>

                        {/* Información del jugador skeleton */}
                        <div className="flex-1 min-w-0">
                            {/* Nombre skeleton */}
                            <div className="flex items-center gap-2 mb-1">
                                <Skeleton circle width={16} height={16} />
                                <Skeleton width={200} height={20} borderRadius={6} />
                            </div>

                            {/* Equipo skeleton */}
                            <div className="space-y-1">
                                <Skeleton width={120} height={16} borderRadius={6} />
                                <Skeleton width={80} height={14} borderRadius={6} />
                            </div>
                        </div>

                        {/* Estrellas decorativas skeleton */}
                        <div className="flex flex-col gap-1">
                            <Skeleton circle width={12} height={12} />
                            <Skeleton circle width={16} height={16} />
                            <Skeleton circle width={12} height={12} />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default MVPComponentSkeleton;