import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { StatsResumenCardSkeleton } from './StatsResumenCardSkeleton';

export const StatsResumenSliderSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="space-y-3">
        {/* Label skeleton */}
        <Skeleton width={160} height={18} borderRadius={6} />
        
        {/* Slider skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <StatsResumenCardSkeleton key={i} />
          ))}
        </div>
        
        {/* Dots skeleton */}
        <div className="flex items-center justify-center gap-1.5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width={6} height={6} borderRadius="full" />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

