import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ProximoPartidoSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="space-y-2">
        {/* Label skeleton */}
        {/* <Skeleton width={120} height={18} borderRadius={6} className="px-1" /> */}
        <h3 className="text-white font-semibold text-sm px-1">Próximo partido</h3>
        
        {/* Card skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-3">
            <Skeleton width={80} height={12} borderRadius={4} />
            <Skeleton width={60} height={12} borderRadius={4} />
          </div>
          
          {/* Equipos skeleton */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
              <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10" />
              <Skeleton width={80} height={14} borderRadius={4} className="sm:w-24" />
            </div>
            <Skeleton width={40} height={18} borderRadius={4} className="sm:w-12" />
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
              <Skeleton width={80} height={14} borderRadius={4} className="sm:w-24" />
              <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10" />
            </div>
          </div>
          
          {/* Footer skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton width={90} height={12} borderRadius={4} />
            <Skeleton width={70} height={12} borderRadius={4} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
