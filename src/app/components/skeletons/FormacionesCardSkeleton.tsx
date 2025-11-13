import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import TabNavigationTeamsSkeleton from './TabNavigationTeamsSkeleton';

const FormacionesCardSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="bg-[var(--black-900)] rounded-2xl border border-[#262626] max-w-2xl mx-auto w-full">
                {/* Header skeleton */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)] rounded-t-2xl">
                    <Skeleton width={120} height={24} borderRadius={6} />
                </div>

                <div className="p-6">
                    {/* TabNavigation skeleton */}
                    {/* <TabNavigationTeamsSkeleton /> */}

                    {/* Lista de jugadores skeleton (5 items) */}
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[#262626]">
                                <div className="flex items-center gap-3 flex-1">
                                    {/* Dorsal skeleton */}
                                    <Skeleton width={32} height={40} borderRadius={4} />
                                    
                                    {/* Info jugador skeleton */}
                                    <div className="flex flex-col gap-1">
                                        <Skeleton width={180} height={16} borderRadius={6} />
                                    </div>
                                </div>

                                {/* Botón acción skeleton */}
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default FormacionesCardSkeleton;