import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Skeleton para TabNavigationTeams
const TabNavigationTeamsSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
            <div className="flex items-center justify-center mb-6 w-full">
                <div className="p-2 rounded-lg flex gap-2 justify-center w-full">
                    {/* Botón Local skeleton */}
                    <div className="px-4 py-2 rounded-md flex items-center gap-2">
                        <Skeleton circle width={22} height={22} />
                        <Skeleton width={80} height={16} borderRadius={6} />
                        <Skeleton width={20} height={20} borderRadius={10} />
                    </div>
                    
                    {/* Botón Visitante skeleton */}
                    <div className="px-4 py-2 rounded-md flex items-center gap-2">
                        <Skeleton circle width={22} height={22} />
                        <Skeleton width={80} height={16} borderRadius={6} />
                        <Skeleton width={20} height={20} borderRadius={10} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default TabNavigationTeamsSkeleton;