import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const UltimoPartidoSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="space-y-2 w-full">
        {/* Label skeleton */}
        <h3 className="text-white font-semibold text-sm px-1">Último partido</h3>
        {/* Card skeleton */}
        <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-3 sm:p-4 w-full overflow-hidden">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-3 gap-2">
            <Skeleton width={80} height={12} borderRadius={4} className="max-w-[80px]" />
            <Skeleton width={60} height={12} borderRadius={4} className="max-w-[60px] flex-shrink-0" />
          </div>
          
          {/* Equipos skeleton */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 w-full min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
              <Skeleton width={80} height={14} borderRadius={4} className="sm:w-24 max-w-[80px] sm:max-w-[96px]" />
            </div>
            <Skeleton width={40} height={18} borderRadius={4} className="sm:w-12 max-w-[40px] sm:max-w-[48px] flex-shrink-0" />
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 justify-end">
              <Skeleton width={80} height={14} borderRadius={4} className="sm:w-24 max-w-[80px] sm:max-w-[96px]" />
              <Skeleton circle width={32} height={32} className="sm:w-10 sm:h-10 flex-shrink-0" />
            </div>
          </div>
          
          {/* Footer skeleton */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton width={90} height={12} borderRadius={4} className="max-w-[90px]" />
            <Skeleton width={70} height={12} borderRadius={4} className="max-w-[70px] flex-shrink-0" />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
