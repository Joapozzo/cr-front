import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const UltimosPartidosResumenSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="space-y-2 w-full">
        {/* Label skeleton */}
        <h3 className="text-white font-semibold text-sm px-1">Últimos partidos</h3>
        
        {/* Partidos skeleton */}
        <div className="w-full grid grid-cols-5 gap-2 sm:gap-3 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-0 w-full">
              {/* Resultado skeleton */}
              <Skeleton width="100%" height={20} borderRadius={4} className="max-w-[40px] w-full" />
              {/* Escudo skeleton */}
              <Skeleton circle width={40} height={40} className="sm:w-12 sm:h-12 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};
