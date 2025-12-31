import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// import TabNavigationTeamsSkeleton from './TabNavigationTeamsSkeleton';

const FormacionesCardSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-xl border border-[#262626] w-full overflow-hidden">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-[var(--black-800)] rounded-t-xl">
                    <Skeleton width={100} height={20} borderRadius={6} className="sm:w-[120px]" />
                </div>

                {/* Tabs skeleton */}
                <div className="flex border-b border-[#262626]">
                    <Skeleton width="33.33%" height={48} borderRadius={0} />
                    <Skeleton width="33.33%" height={48} borderRadius={0} />
                    <Skeleton width="33.33%" height={48} borderRadius={0} />
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                    {/* Lista de jugadores skeleton (5 items) */}
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-[#262626]">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    {/* Dorsal skeleton */}
                                    <Skeleton width={28} height={36} borderRadius={4} className="sm:w-8 sm:h-10 flex-shrink-0" />
                                    
                                    {/* Info jugador skeleton */}
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <Skeleton width="100%" maxWidth={150} height={14} borderRadius={6} className="sm:max-w-[180px]" />
                                    </div>
                                </div>

                                {/* Botón acción skeleton */}
                                <Skeleton width={28} height={28} borderRadius={8} className="sm:w-8 sm:h-8 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default FormacionesCardSkeleton;