import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const JugadorPlantelCardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        {/* Foto skeleton */}
        <Skeleton circle width={48} height={48} className="sm:w-14 sm:h-14 flex-shrink-0" />
        
        {/* Información skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton width={150} height={16} borderRadius={4} className="sm:w-48" />
          <Skeleton width={100} height={12} borderRadius={4} className="sm:w-32" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

