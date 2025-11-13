import React from 'react';
import { JugadorPlantelCardSkeleton } from './JugadorPlantelCardSkeleton';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const PlantelTabSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="py-4 space-y-4 sm:space-y-6">
        {/* Lista de jugadores skeleton */}
        <div className="space-y-2 sm:space-y-3">
          {[...Array(5)].map((_, i) => (
            <JugadorPlantelCardSkeleton key={i} />
          ))}
        </div>

        {/* Acciones skeleton */}
        <div className="pt-4 border-t border-[#262626] space-y-4">
          <Skeleton width={120} height={18} borderRadius={4} />
          <Skeleton width="100%" height={40} borderRadius={8} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

