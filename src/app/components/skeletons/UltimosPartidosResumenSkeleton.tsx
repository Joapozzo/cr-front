import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const UltimosPartidosResumenSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
      <div className="space-y-2">
        {/* Label skeleton */}
        {/* <Skeleton width={140} height={18} borderRadius={6} className="px-1" /> */}
        <h3 className="text-white font-semibold text-sm px-1">Últimos partidos</h3>
        
        {/* Partidos skeleton */}
        <div className="w-full grid grid-cols-5 gap-2 sm:gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {/* Resultado skeleton */}
              <Skeleton width="40px" height={20} borderRadius={4} />
              {/* Escudo skeleton */}
              <Skeleton circle width={40} height={40} className="sm:w-12 sm:h-12" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};
