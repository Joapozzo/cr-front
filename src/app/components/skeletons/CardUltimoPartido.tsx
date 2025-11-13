import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardUltimoPartidoSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333">
            <div className="bg-[var(--black-900)] rounded-t-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-2 bg-[var(--gray-300)]">
                    <div className="flex items-center gap-2 text-sm">
                        <Skeleton circle width={30} height={30} />
                        <Skeleton width={120} height={16} />
                        <span className="text-white">|</span>
                        <Skeleton width={100} height={16} />
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="flex w-full items-start gap-4 mb-6">
                        <Skeleton width={80} height={64} />

                        <div className="flex flex-col flex-1">
                            <Skeleton width={150} height={12} className="mb-1" />
                            <Skeleton width={200} height={12} className="mb-3" />

                            <div className="mt-3 flex flex-col gap-1">
                                <Skeleton width={180} height={24} />
                                <Skeleton width={200} height={32} />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="text-center bg-[var(--black-800)] px-5 py-2">
                                <Skeleton width={60} height={24} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 w-full flex items-center">
                        <Skeleton width="100%" height={40} className="rounded-lg" />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default CardUltimoPartidoSkeleton;